"""
Product endpoints — public reads for the storefront, guarded writes for the shop.

The public routes only ever return active products: is_active is how a product
is retired without deleting rows that historic orders still reference.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Category, Product
from app.routers.common import AdminOnly
from app.schemas import ProductCreate, ProductRead, ProductUpdate

router = APIRouter(prefix="/products", tags=["products"])


def _escape_like(term: str) -> str:
    """Neutralize LIKE wildcards so a search for '100%' is not a match-all."""
    return term.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


async def _get_product_or_404(db: AsyncSession, id_product: uuid.UUID) -> Product:
    """Admin lookup — unlike the public routes, retired products are visible."""
    product = await db.get(Product, id_product)
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado.")
    return product


async def _reload(db: AsyncSession, id_product: uuid.UUID) -> Product:
    """Re-read so the response carries the category and any server defaults."""
    result = await db.execute(
        select(Product)
        .where(Product.id_product == id_product)
        .execution_options(populate_existing=True)
    )
    return result.scalar_one()


# --------------------------------------------------------------------------- #
# Public
# --------------------------------------------------------------------------- #

@router.get("", response_model=list[ProductRead])
async def list_products(
    category: str | None = Query(
        default=None,
        description="Slug de la categoria, p. ej. 'clasicos'",
        examples=["clasicos"],
    ),
    featured: bool | None = Query(
        default=None, description="Solo destacados (portada del landing)"
    ),
    search: str | None = Query(
        default=None, min_length=1, max_length=100, description="Busca en el nombre"
    ),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """
    Return the active catalog, optionally filtered.

    Filtering by category takes the slug rather than the name: the storefront's
    URLs already speak in slugs, and a rename then does not break links.
    """
    stmt = select(Product).where(Product.is_active.is_(True))

    if category is not None:
        stmt = stmt.join(Product.category).where(
            Category.slug == category, Category.is_active.is_(True)
        )
    if featured is not None:
        stmt = stmt.where(Product.is_featured.is_(featured))
    if search is not None:
        stmt = stmt.where(
            Product.name.ilike(f"%{_escape_like(search)}%", escape="\\")
        )

    stmt = stmt.order_by(Product.is_featured.desc(), Product.name).limit(limit).offset(
        offset
    )
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{slug}", response_model=ProductRead)
async def get_product(slug: str, db: AsyncSession = Depends(get_db)):
    """Return one active product by slug — the /catalog/products/[slug] route."""
    result = await db.execute(
        select(Product).where(Product.slug == slug, Product.is_active.is_(True))
    )
    product = result.scalar_one_or_none()
    if product is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Producto no encontrado.")
    return product


# --------------------------------------------------------------------------- #
# Admin
# --------------------------------------------------------------------------- #

@router.post(
    "",
    response_model=ProductRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[AdminOnly],
)
async def create_product(payload: ProductCreate, db: AsyncSession = Depends(get_db)):
    """Add a product to the catalog."""
    if await db.get(Category, payload.id_category) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoria no encontrada.")

    product = Product(**payload.model_dump())
    db.add(product)
    try:
        await db.flush()
    except IntegrityError as exc:
        raise HTTPException(
            status.HTTP_409_CONFLICT, f"Ya existe un producto con el slug '{payload.slug}'."
        ) from exc

    return await _reload(db, product.id_product)


@router.patch(
    "/{id_product}", response_model=ProductRead, dependencies=[AdminOnly]
)
async def update_product(
    id_product: uuid.UUID,
    payload: ProductUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Partially update a product.

    Repricing here never rewrites an order: order_product keeps its own
    unit_price snapshot taken at checkout.
    """
    product = await _get_product_or_404(db, id_product)
    changes = payload.model_dump(exclude_unset=True)

    if "id_category" in changes and await db.get(Category, changes["id_category"]) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Categoria no encontrada.")

    for field, value in changes.items():
        setattr(product, field, value)

    try:
        await db.flush()
    except IntegrityError as exc:
        raise HTTPException(
            status.HTTP_409_CONFLICT, "Ya existe otro producto con ese slug."
        ) from exc

    return await _reload(db, product.id_product)


@router.delete(
    "/{id_product}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[AdminOnly],
)
async def retire_product(id_product: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """
    Retire a product — a soft delete.

    order_product references products with ON DELETE RESTRICT on purpose, so a
    real DELETE would either fail or take order history with it. Flipping
    is_active hides it from the catalog and leaves past orders readable.
    """
    product = await _get_product_or_404(db, id_product)
    product.is_active = False
    await db.flush()
