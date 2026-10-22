"""
Shared router pieces: eager-loading entity fetchers, the client find-or-create
used by both order flows, and the admin guard.

Every fetcher re-queries with explicit selectinload and populate_existing so a
freshly written row comes back with its relationships loaded — the alternative
is a lazy load inside the async session, which raises instead of emitting SQL.
"""

import secrets
import uuid
from decimal import Decimal
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy import func, select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.models import (
    Cart,
    CartStatus,
    Client,
    Order,
    OrderProduct,
    OrderStateHistory,
    Product,
    ProductCart,
    Session,
    State,
)

settings = get_settings()

# State names seeded by app.seed — see STATES there. Orders reference states by
# FK, so these are lookups rather than an enum: the shop can rename or add
# states without a migration, and these two are the ones the API itself assigns.
STATE_PENDING = "pendiente"
STATE_QUOTED = "cotizado"

# Ceiling for a single cart line, matching the schemas' Field(le=100) so that
# adding the same product repeatedly cannot climb past the validated maximum.
MAX_LINE_QUANTITY = 100


# --------------------------------------------------------------------------- #
# Admin guard
# --------------------------------------------------------------------------- #

async def require_admin(
    x_admin_token: Annotated[str | None, Header()] = None,
) -> None:
    """
    Gate for the endpoints only the pastry shop should reach.

    A shared token, not a user system — there is no admin panel and no login
    yet. It exists so catalog writes, order state changes, quoting and payment
    updates are not open to the internet in the meantime; replace it with real
    authentication when the panel arrives.
    """
    if not settings.ADMIN_API_TOKEN:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE,
            "Endpoints de administracion deshabilitados: falta configurar ADMIN_API_TOKEN.",
        )
    if not x_admin_token or not secrets.compare_digest(
        x_admin_token, settings.ADMIN_API_TOKEN
    ):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Token de administracion invalido o ausente.",
        )


AdminOnly = Depends(require_admin)


# --------------------------------------------------------------------------- #
# Fetchers
# --------------------------------------------------------------------------- #

async def load_cart(
    db: AsyncSession, id_cart: uuid.UUID, *, for_update: bool = False
) -> Cart | None:
    """
    A cart with its lines, each line's product, and that product's category.

    for_update locks the cart row (SELECT ... FOR UPDATE) until the transaction
    ends. Only the cart row: the lines come from separate selectin queries.
    """
    stmt = (
        select(Cart)
        .options(
            selectinload(Cart.items)
            .selectinload(ProductCart.product)
            .selectinload(Product.category)
        )
        .where(Cart.id_cart == id_cart)
        .execution_options(populate_existing=True)
    )
    if for_update:
        stmt = stmt.with_for_update(of=Cart)

    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_cart_or_404(db: AsyncSession, id_cart: uuid.UUID) -> Cart:
    cart = await load_cart(db, id_cart)
    if cart is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Carrito no encontrado.")
    return cart


async def get_active_cart_or_409(db: AsyncSession, id_cart: uuid.UUID) -> Cart:
    """
    A cart that can still be modified — a converted one is order history.

    Every caller is about to write to the cart, so the row is locked first.
    Without the lock, two checkouts of the same cart (a double click on "Pagar")
    both read it as active and race to insert the order; the loser trips the
    UNIQUE on orders.id_cart and the shopper sees a 500. With it, the second
    request waits for the first to commit, then reads 'converted' and gets the
    409 below. It also stops an item from being added to a cart mid-checkout.
    """
    cart = await load_cart(db, id_cart, for_update=True)
    if cart is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Carrito no encontrado.")
    if cart.status is not CartStatus.ACTIVE:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            f"El carrito ya no esta activo (estado: {cart.status.value}).",
        )
    return cart


async def load_order(db: AsyncSession, id_order: uuid.UUID) -> Order | None:
    """An order with its client, state and price-snapshot lines."""
    result = await db.execute(
        select(Order)
        .options(
            selectinload(Order.client),
            selectinload(Order.state),
            selectinload(Order.items)
            .selectinload(OrderProduct.product)
            .selectinload(Product.category),
        )
        .where(Order.id_order == id_order)
        .execution_options(populate_existing=True)
    )
    return result.scalar_one_or_none()


async def get_order_or_404(db: AsyncSession, id_order: uuid.UUID) -> Order:
    order = await load_order(db, id_order)
    if order is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Pedido no encontrado.")
    return order


async def get_state_or_404(db: AsyncSession, id_state: uuid.UUID) -> State:
    state = await db.get(State, id_state)
    if state is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Estado no encontrado.")
    return state


async def get_state_by_name(db: AsyncSession, name: str) -> State:
    """
    Resolve a seeded state by name.

    A missing state means the database was never seeded — a deployment error
    rather than something the caller did wrong, hence 500 and not 404.
    """
    result = await db.execute(select(State).where(State.name == name))
    state = result.scalar_one_or_none()
    if state is None:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            f"El estado '{name}' no existe. Ejecuta: python -m app.seed --core-only",
        )
    return state


async def get_active_product_or_404(
    db: AsyncSession, id_product: uuid.UUID
) -> Product:
    result = await db.execute(
        select(Product).where(
            Product.id_product == id_product, Product.is_active.is_(True)
        )
    )
    product = result.scalar_one_or_none()
    if product is None:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "Producto no encontrado o no disponible."
        )
    return product


# --------------------------------------------------------------------------- #
# Write helpers
# --------------------------------------------------------------------------- #

async def get_or_create_client(
    db: AsyncSession,
    *,
    name: str,
    email: str,
    phone1: str | None = None,
) -> Client:
    """
    Find a client by email, or create one — shoppers never register.

    Existing contact details are left alone: an order carries its own delivery
    address, so there is nothing here worth overwriting from a later form.

    The email is UNIQUE, so two checkouts racing on a brand-new address would
    make one of them fail. The insert runs inside a SAVEPOINT, which turns
    losing that race into a re-read instead of a dead transaction.

    Emails are stored lowercased and matched on lower(email), the expression
    the unique index is built on — see app.models.client.
    """
    email = email.lower()
    by_email = select(Client).where(func.lower(Client.email) == email)

    result = await db.execute(by_email)
    client = result.scalar_one_or_none()
    if client is not None:
        return client

    try:
        async with db.begin_nested():
            client = Client(name=name, email=email, phone1=phone1)
            db.add(client)
            await db.flush()
    except IntegrityError:
        result = await db.execute(by_email)
        client = result.scalar_one()

    return client


def record_state_change(
    db: AsyncSession,
    order: Order,
    state: State,
    notes: str | None = None,
) -> None:
    """
    Move an order to a state and leave a trail.

    orders.id_state is where the order is now, order_state_history is how it got
    there — so both are written together and never one without the other.
    """
    order.id_state = state.id_state
    db.add(
        OrderStateHistory(
            id_order=order.id_order,
            id_state=state.id_state,
            notes=notes,
        )
    )


async def touch_session(db: AsyncSession, id_session: uuid.UUID) -> None:
    """
    Bump the session's last activity.

    Issued as an UPDATE rather than through cart.session, which is not eagerly
    loaded — reaching for it would trigger a lazy load inside the async session.
    """
    await db.execute(
        update(Session)
        .where(Session.id_session == id_session)
        .values(last_activity_date=func.now())
    )


def line_subtotal(unit_price: Decimal, quantity: int) -> Decimal:
    """Money math in Decimal only, never float, and rounded to the column's scale."""
    return (unit_price * quantity).quantize(Decimal("0.01"))
