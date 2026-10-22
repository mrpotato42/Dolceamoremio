"""
Cart endpoints — the server-side cart the storefront's zustand store mirrors.

A cart is 1:1 with an anonymous session, so POST /carts opens both at once and
hands back the cart id. The client keeps that id (localStorage, same place the
current store lives) and every later call addresses the cart directly; there is
no cookie and no login involved.

Every mutation answers with the whole cart rather than the touched line, so the
drawer can re-render from one response instead of reconciling a patch.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Cart, ProductCart, Session
from app.routers.common import (
    MAX_LINE_QUANTITY,
    get_active_cart_or_409,
    get_active_product_or_404,
    get_cart_or_404,
    line_subtotal,
    touch_session,
)
from app.schemas import CartItemAdd, CartItemUpdate, CartRead

router = APIRouter(prefix="/carts", tags=["carts"])


def _find_line(cart: Cart, id_product: uuid.UUID) -> ProductCart | None:
    return next((item for item in cart.items if item.id_product == id_product), None)


def _require_line(cart: Cart, id_product: uuid.UUID) -> ProductCart:
    line = _find_line(cart, id_product)
    if line is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "El producto no esta en el carrito."
        )
    return line


@router.post("", response_model=CartRead, status_code=status.HTTP_201_CREATED)
async def create_cart(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Open a browsing session and its cart.

    The IP is whatever the socket reports; behind a proxy that is the proxy's
    address, which is fine for the only thing it is used for — telling apart
    abandoned carts when cleaning up.
    """
    session = Session(ip_address=request.client.host if request.client else "0.0.0.0")
    cart = Cart(session=session)
    db.add(cart)
    await db.flush()
    return await get_cart_or_404(db, cart.id_cart)


@router.get("/{id_cart}", response_model=CartRead)
async def get_cart(id_cart: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return a cart with its lines and each line's product."""
    return await get_cart_or_404(db, id_cart)


@router.post(
    "/{id_cart}/items", response_model=CartRead, status_code=status.HTTP_201_CREATED
)
async def add_item(
    id_cart: uuid.UUID,
    payload: CartItemAdd,
    db: AsyncSession = Depends(get_db),
):
    """
    Add a product, or bump the quantity if it is already in the cart.

    unit_price is copied from the catalog on every add, so a cart left open
    across a price change is re-quoted rather than honouring a stale figure.
    The order freezes its own copy later, at checkout.
    """
    cart = await get_active_cart_or_409(db, id_cart)
    product = await get_active_product_or_404(db, payload.id_product)

    line = _find_line(cart, product.id_product)
    if line is None:
        line = ProductCart(
            id_cart=cart.id_cart,
            id_product=product.id_product,
            quantity=payload.quantity,
            unit_price=product.price,
            item_subtotal=line_subtotal(product.price, payload.quantity),
            special_instructions=payload.special_instructions,
        )
        db.add(line)
    else:
        line.quantity = min(line.quantity + payload.quantity, MAX_LINE_QUANTITY)
        line.unit_price = product.price
        line.item_subtotal = line_subtotal(line.unit_price, line.quantity)
        if payload.special_instructions is not None:
            line.special_instructions = payload.special_instructions

    await touch_session(db, cart.id_session)
    await db.flush()
    return await get_cart_or_404(db, id_cart)


@router.patch("/{id_cart}/items/{id_product}", response_model=CartRead)
async def update_item(
    id_cart: uuid.UUID,
    id_product: uuid.UUID,
    payload: CartItemUpdate,
    db: AsyncSession = Depends(get_db),
):
    """Set a line's quantity and/or its note. Absent fields are left alone."""
    cart = await get_active_cart_or_409(db, id_cart)
    line = _require_line(cart, id_product)
    changes = payload.model_dump(exclude_unset=True)

    if changes.get("quantity") is not None:
        line.quantity = changes["quantity"]
        line.item_subtotal = line_subtotal(line.unit_price, line.quantity)
    if "special_instructions" in changes:
        line.special_instructions = changes["special_instructions"]

    await touch_session(db, cart.id_session)
    await db.flush()
    return await get_cart_or_404(db, id_cart)


@router.delete("/{id_cart}/items/{id_product}", response_model=CartRead)
async def remove_item(
    id_cart: uuid.UUID,
    id_product: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Drop one line from the cart."""
    cart = await get_active_cart_or_409(db, id_cart)
    line = _require_line(cart, id_product)

    await db.delete(line)
    await touch_session(db, cart.id_session)
    await db.flush()
    return await get_cart_or_404(db, id_cart)


@router.delete("/{id_cart}/items", response_model=CartRead)
async def clear_cart(id_cart: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Empty the cart, keeping the cart and its session."""
    cart = await get_active_cart_or_409(db, id_cart)

    await db.execute(delete(ProductCart).where(ProductCart.id_cart == cart.id_cart))
    await touch_session(db, cart.id_session)
    await db.flush()
    return await get_cart_or_404(db, id_cart)
