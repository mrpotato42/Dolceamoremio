"""
Seed the database with reference and demo data — two tiers, kept separate.

  - seed_core(): states + categories. Required in every environment — every
    order needs an id_state, so an empty states table makes checkout
    impossible. Safe (and necessary) to run against production.

  - seed_demo_products(): the 8 placeholder products migrated from the
    storefront's mock catalog (src/lib/data/products.ts). Local/staging only —
    running this against production would show fake inventory to real
    customers.

Run with:
    python -m app.seed              # core + demo products (local dev)
    python -m app.seed --core-only  # states + categories only (production)

Idempotent — re-running either tier does not duplicate rows.
"""

import asyncio
import sys
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import AsyncSessionLocal
from app.models import Category, Product, State
from app.models.product import PriceType

# (name, description) — covers both the catalog flow and the quote flow
STATES: list[tuple[str, str]] = [
    ("pendiente", "Pedido recibido, pendiente de confirmación"),
    ("confirmado", "Pedido confirmado por la pastelería"),
    ("en_preparacion", "El pedido se está preparando"),
    ("listo", "Listo para entrega o recogida"),
    ("entregado", "Entregado al cliente"),
    ("cancelado", "Pedido cancelado"),
    ("cotizado", "Cotización enviada al cliente (pedido personalizado)"),
    ("aceptado", "Cotización aceptada por el cliente"),
    ("rechazado", "Cotización rechazada"),
]

# (name, slug, display_order)
CATEGORIES: list[tuple[str, str, int]] = [
    ("Clásicos", "clasicos", 1),
    ("Eventos Especiales", "eventos-especiales", 2),
    ("Temporada", "temporada", 3),
    ("Postres", "postres", 4),
]

# (slug, name, category_slug, price, price_type, image_url, is_featured, description)
PRODUCTS: list[tuple] = [
    (
        "torta-matilda-chocolate",
        "Matilda de Chocolate",
        "clasicos",
        Decimal("85000"),
        PriceType.FIXED,
        "/landing1.webp",
        True,
        "La clásica e irresistible torta de chocolate, húmeda, rellena y cubierta "
        "con nuestro fudge artesanal secreto.",
    ),
    (
        "red-velvet-especial",
        "Red Velvet Especial",
        "clasicos",
        Decimal("92000"),
        PriceType.FIXED,
        "/landing2.webp",
        False,
        "Bizcocho aterciopelado con ligeras notas de cacao, coronado con el más "
        "suave frosting de queso crema.",
    ),
    (
        "boda-botanica",
        "Torta Boda Botánica",
        "eventos-especiales",
        Decimal("450000"),
        PriceType.STARTING_FROM,
        "/landing3.webp",
        False,
        "Diseño elegante de tres pisos con flores naturales comestibles y sutiles "
        "detalles dorados.",
    ),
    (
        "carrot-cake-rustica",
        "Carrot Cake Rústica",
        "clasicos",
        Decimal("78000"),
        PriceType.FIXED,
        "/landing1.webp",
        False,
        "Esponjosa torta de zanahoria con nueces tostadas y nuestro glaseado rústico.",
    ),
    (
        "macarons-temporada",
        "Set Macarons de Temporada",
        "postres",
        Decimal("45000"),
        PriceType.FIXED,
        "/landing2.webp",
        False,
        "Caja de 12 macarons franceses con rellenos cítricos y florales ideales "
        "para la primavera.",
    ),
    (
        "cheesecake-frutos-rojos",
        "Cheesecake Frutos Rojos",
        "postres",
        Decimal("88000"),
        PriceType.FIXED,
        "/landing3.webp",
        False,
        "Clásico cheesecake estilo NY con una corona abundante de coulis de frutos "
        "rojos frescos.",
    ),
    (
        "torta-navidena-especiada",
        "Torta Especiada de Invierno",
        "temporada",
        Decimal("110000"),
        PriceType.FIXED,
        "/landing1.webp",
        False,
        "Edición limitada. Bizcocho de jengibre y canela, rellena de ganache de "
        "chocolate blanco.",
    ),
    (
        "mini-cake-aniversario",
        "Mini Cake Aniversario",
        "eventos-especiales",
        Decimal("35000"),
        PriceType.FIXED,
        "/landing2.webp",
        False,
        "El detalle perfecto. Torta personalizable (2 porciones) con diseño vintage.",
    ),
]


async def seed_core(db: AsyncSession) -> tuple[int, int]:
    """States + categories. Required everywhere, production included."""
    existing_states = set(
        (await db.execute(select(State.name))).scalars().all()
    )
    new_states = [
        State(name=name, description=description)
        for name, description in STATES
        if name not in existing_states
    ]
    db.add_all(new_states)

    existing_categories = set(
        (await db.execute(select(Category.slug))).scalars().all()
    )
    new_categories = [
        Category(name=name, slug=slug, display_order=order)
        for name, slug, order in CATEGORIES
        if slug not in existing_categories
    ]
    db.add_all(new_categories)
    await db.flush()  # products need real category ids, even within this call

    return len(new_states), len(new_categories)


async def seed_demo_products(db: AsyncSession) -> int:
    """Placeholder catalog for local development. Never run against production."""
    category_ids = {
        slug: id_category
        for id_category, slug in (
            await db.execute(select(Category.id_category, Category.slug))
        ).all()
    }
    existing_products = set(
        (await db.execute(select(Product.slug))).scalars().all()
    )
    new_products = [
        Product(
            slug=slug,
            name=name,
            id_category=category_ids[category_slug],
            price=price,
            price_type=price_type,
            image_url=image_url,
            is_featured=is_featured,
            description=description,
        )
        for (
            slug,
            name,
            category_slug,
            price,
            price_type,
            image_url,
            is_featured,
            description,
        ) in PRODUCTS
        if slug not in existing_products
    ]
    db.add_all(new_products)

    return len(new_products)


async def seed(include_demo_products: bool = True) -> None:
    settings = get_settings()
    if include_demo_products and settings.is_production:
        raise RuntimeError(
            "Refusing to insert demo products: APP_ENV=production. "
            "Run `python -m app.seed --core-only` instead."
        )

    async with AsyncSessionLocal() as db:
        states_count, categories_count = await seed_core(db)

        products_count = 0
        if include_demo_products:
            products_count = await seed_demo_products(db)

        await db.commit()

        print(
            f"Seed listo — "
            f"{states_count} estados, "
            f"{categories_count} categorías, "
            f"{products_count} productos insertados."
        )


if __name__ == "__main__":
    core_only = "--core-only" in sys.argv
    asyncio.run(seed(include_demo_products=not core_only))
