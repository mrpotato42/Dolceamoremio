"""
Order endpoints — catalog checkout, plus the shop's view of an order's life.

Custom quote requests live in the same table but have their own router
(app.routers.custom_orders); the listing here can include or exclude them.
"""

import uuid
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import get_settings
from app.database import get_db
from app.models import CartStatus, Order, OrderProduct, OrderStateHistory, State
from app.routers.common import (
    STATE_PENDING,
    AdminOnly,
    get_active_cart_or_409,
    get_or_create_client,
    get_order_or_404,
    get_state_by_name,
    get_state_or_404,
    load_order,
    record_state_change,
)
from app.schemas import (
    OrderCreate,
    OrderRead,
    OrderStateHistoryRead,
    OrderStatusUpdate,
)

settings = get_settings()

router = APIRouter(prefix="/orders", tags=["orders"])


# --------------------------------------------------------------------------- #
# Public
# --------------------------------------------------------------------------- #

@router.post("", response_model=OrderRead, status_code=status.HTTP_201_CREATED)
async def create_order(payload: OrderCreate, db: AsyncSession = Depends(get_db)):
    """
    Turn a cart into an order.

    The cart's lines are copied rather than referenced: order_product keeps its
    own unit_price and item_subtotal, so a later catalog change cannot rewrite
    what somebody already agreed to pay. The cart is then marked converted,
    which is also what stops a second checkout from reusing it.
    """
    cart = await get_active_cart_or_409(db, payload.id_cart)
    if not cart.items:
        raise HTTPException(status.HTTP_409_CONFLICT, "El carrito esta vacio.")

    client = await get_or_create_client(
        db, name=payload.name, email=payload.email, phone1=payload.phone1
    )
    state = await get_state_by_name(db, STATE_PENDING)

    subtotal = sum((item.item_subtotal for item in cart.items), Decimal("0"))
    shipping_cost = settings.SHIPPING_COST

    order = Order(
        id_cart=cart.id_cart,
        id_client=client.id_client,
        id_state=state.id_state,
        delivery_address=payload.delivery_address,
        delivery_date=payload.delivery_date,
        description_order=payload.description_order,
        shipping_cost=shipping_cost,
        subtotal=subtotal,
        total=subtotal + shipping_cost,
    )
    db.add(order)
    await db.flush()  # the lines and the history entry need order.id_order

    db.add_all(
        OrderProduct(
            id_order=order.id_order,
            id_product=item.id_product,
            quantity=item.quantity,
            unit_price=item.unit_price,
            item_subtotal=item.item_subtotal,
            special_instructions=item.special_instructions,
        )
        for item in cart.items
    )
    cart.status = CartStatus.CONVERTED
    record_state_change(db, order, state, notes="Pedido creado desde el carrito")

    await db.flush()
    return await get_order_or_404(db, order.id_order)


@router.get("/{id_order}", response_model=OrderRead)
async def get_order(id_order: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return one order with its client, state and lines."""
    return await get_order_or_404(db, id_order)


@router.get("/{id_order}/history", response_model=list[OrderStateHistoryRead])
async def get_order_history(
    id_order: uuid.UUID, db: AsyncSession = Depends(get_db)
):
    """Return every state the order has passed through, oldest first."""
    if await load_order(db, id_order) is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Pedido no encontrado.")

    result = await db.execute(
        select(OrderStateHistory)
        .options(selectinload(OrderStateHistory.state))
        .where(OrderStateHistory.id_order == id_order)
        .order_by(OrderStateHistory.changed_at)
    )
    return result.scalars().all()


# --------------------------------------------------------------------------- #
# Admin
# --------------------------------------------------------------------------- #

@router.get("", response_model=list[OrderRead], dependencies=[AdminOnly])
async def list_orders(
    state: str | None = Query(
        default=None, description="Nombre del estado, p. ej. 'pendiente'"
    ),
    custom: bool | None = Query(
        default=None,
        description="true: solo cotizaciones; false: solo pedidos de catalogo",
    ),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """
    Return orders, newest first.

    Admin-only: the response carries client contact details, so this is not
    something to leave open.
    """
    stmt = select(Order)

    if state is not None:
        stmt = stmt.join(Order.state).where(State.name == state)
    if custom is not None:
        # id_cart IS NULL is what makes an order a quote request — see
        # Order.is_custom.
        stmt = stmt.where(
            Order.id_cart.is_(None) if custom else Order.id_cart.is_not(None)
        )

    stmt = stmt.order_by(Order.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch(
    "/{id_order}/status", response_model=OrderRead, dependencies=[AdminOnly]
)
async def update_order_status(
    id_order: uuid.UUID,
    payload: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Move an order to a new state and record why.

    Any state can follow any other: the shop's real workflow has exceptions
    (a cancellation after delivery, a return to preparation) and hardcoding a
    transition table here would only get in its way. The history is what makes
    an unusual jump auditable.
    """
    order = await get_order_or_404(db, id_order)
    state = await get_state_or_404(db, payload.id_state)

    record_state_change(db, order, state, notes=payload.notes)
    await db.flush()
    return await get_order_or_404(db, id_order)
