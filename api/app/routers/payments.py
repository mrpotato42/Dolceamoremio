"""
Payment endpoints — payment attempts recorded against an order.

Registering an attempt is public (the shopper's browser starts it); deciding
that one succeeded is not. Moving a payment to 'completed' is what tells the
shop it has been paid, so that route is admin-guarded — the day a real gateway
is wired in, its webhook replaces the guard with a signature check.
"""

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Payment
from app.routers.common import AdminOnly, get_order_or_404
from app.schemas import PaymentCreate, PaymentRead, PaymentUpdate

router = APIRouter(prefix="/payments", tags=["payments"])


async def _get_payment_or_404(db: AsyncSession, id_payment: uuid.UUID) -> Payment:
    payment = await db.get(Payment, id_payment)
    if payment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Pago no encontrado.")
    return payment


async def _flush_payment(db: AsyncSession, payment: Payment) -> Payment:
    """Write the payment; a gateway id already on file is a conflict, not a 500."""
    try:
        await db.flush()
    except IntegrityError as exc:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "Ya existe un pago con ese transaction_gateway_id.",
        ) from exc

    await db.refresh(payment)
    return payment


@router.post("", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
async def create_payment(payload: PaymentCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a payment attempt.

    Always created pending — the amount here is what the client says it is
    sending, never proof that it arrived. An order can accumulate several of
    these: a retry after a failure, a deposit and its balance, a refund.
    """
    await get_order_or_404(db, payload.id_order)

    payment = Payment(**payload.model_dump())
    db.add(payment)
    return await _flush_payment(db, payment)


@router.get("/{id_payment}", response_model=PaymentRead)
async def get_payment(id_payment: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Return one payment attempt."""
    return await _get_payment_or_404(db, id_payment)


# --------------------------------------------------------------------------- #
# Admin
# --------------------------------------------------------------------------- #

@router.get("", response_model=list[PaymentRead], dependencies=[AdminOnly])
async def list_payments(
    id_order: uuid.UUID | None = Query(
        default=None, description="Filtra por pedido"
    ),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Return payment attempts, newest first."""
    stmt = select(Payment)
    if id_order is not None:
        stmt = stmt.where(Payment.id_order == id_order)

    stmt = stmt.order_by(Payment.created_at.desc()).limit(limit).offset(offset)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/{id_payment}", response_model=PaymentRead, dependencies=[AdminOnly])
async def update_payment(
    id_payment: uuid.UUID,
    payload: PaymentUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Update a payment as the gateway (or the shop) reports back.

    Deliberately does not touch the order's state: confirming a payment and
    confirming an order are separate decisions, and the second one goes through
    PATCH /orders/{id}/status so it lands in the state history.
    """
    payment = await _get_payment_or_404(db, id_payment)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(payment, field, value)

    return await _flush_payment(db, payment)
