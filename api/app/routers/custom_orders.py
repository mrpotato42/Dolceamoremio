"""
Custom order endpoints — the "solicitar cotizacion" flow.

A custom order is a row in `orders` with no cart attached (see app.models.order).
It arrives with no price: the shop answers it later through /quote, which is
what turns a request into something payable.
"""

import uuid
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Order
from app.routers.common import (
    STATE_PENDING,
    STATE_QUOTED,
    AdminOnly,
    get_or_create_client,
    get_order_or_404,
    get_state_by_name,
    get_state_or_404,
    record_state_change,
)
from app.schemas import CustomOrderCreate, CustomOrderQuote, CustomOrderRead

router = APIRouter(prefix="/custom-orders", tags=["custom-orders"])


async def _get_custom_order_or_404(db: AsyncSession, id_order: uuid.UUID) -> Order:
    """
    Fetch an order and refuse it if it came from a cart.

    A catalog order reached through this router is not a custom order at all,
    so it is a 404 here rather than a 400 — this collection simply does not
    contain it.
    """
    order = await get_order_or_404(db, id_order)
    if not order.is_custom:
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "Cotizacion no encontrada."
        )
    return order


@router.post(
    "", response_model=CustomOrderRead, status_code=status.HTTP_201_CREATED
)
async def create_custom_order(
    payload: CustomOrderCreate, db: AsyncSession = Depends(get_db)
):
    """
    Submit a quote request.

    Everything about the cake is free text and optional — the form is a
    conversation starter, not an order form. No cart, no address and no price:
    those are settled afterwards, over WhatsApp or by the shop's quote.
    """
    client = await get_or_create_client(
        db, name=payload.name, email=payload.email, phone1=payload.phone1
    )
    state = await get_state_by_name(db, STATE_PENDING)

    order = Order(
        id_cart=None,
        id_client=client.id_client,
        id_state=state.id_state,
        delivery_date=payload.delivery_date,
        event_type=payload.event_type,
        guest_count=payload.guest_count,
        description_order=payload.description_order,
        reference_image=payload.reference_image,
    )
    db.add(order)
    await db.flush()

    record_state_change(db, order, state, notes="Solicitud de cotizacion recibida")
    await db.flush()
    return await get_order_or_404(db, order.id_order)


@router.get("/{id_order}", response_model=CustomOrderRead)
async def get_custom_order(
    id_order: uuid.UUID, db: AsyncSession = Depends(get_db)
):
    """Return one quote request — how the client checks on their answer."""
    return await _get_custom_order_or_404(db, id_order)


# --------------------------------------------------------------------------- #
# Admin
# --------------------------------------------------------------------------- #

@router.get("", response_model=list[CustomOrderRead], dependencies=[AdminOnly])
async def list_custom_orders(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Return the quote requests, newest first."""
    result = await db.execute(
        select(Order)
        .where(Order.id_cart.is_(None))
        .order_by(Order.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    return result.scalars().all()


@router.patch(
    "/{id_order}/quote", response_model=CustomOrderRead, dependencies=[AdminOnly]
)
async def quote_custom_order(
    id_order: uuid.UUID,
    payload: CustomOrderQuote,
    db: AsyncSession = Depends(get_db),
):
    """
    Answer a quote request with a price.

    subtotal and total are set from the quoted price so the order carries a real
    amount a payment can be checked against; they would otherwise sit at their
    0 default forever. There is no shipping line on a custom order — delivery,
    when there is any, is folded into the quote.

    The state moves to 'cotizado' unless the caller names another one, which is
    the escape hatch for answering and rejecting in a single step.
    """
    order = await _get_custom_order_or_404(db, id_order)

    quoted_price: Decimal = payload.quoted_price
    order.quoted_price = quoted_price
    order.subtotal = quoted_price
    order.total = quoted_price

    state = (
        await get_state_or_404(db, payload.id_state)
        if payload.id_state is not None
        else await get_state_by_name(db, STATE_QUOTED)
    )
    record_state_change(
        db, order, state, notes=payload.notes or f"Cotizacion enviada: {quoted_price}"
    )

    await db.flush()
    return await get_order_or_404(db, id_order)
