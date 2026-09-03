"""
Payment model — payment attempts against an order.

An order can have several payments (a retry after a failure, or a refund), so
this is 0:M from Order rather than a column on it.
"""

import enum
import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, enum_column, uuid_pk

if TYPE_CHECKING:
    from app.models.order import Order


class PaymentStatus(str, enum.Enum):
    """Lifecycle of a payment attempt."""
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = (
        CheckConstraint("amount >= 0", name="ck_payments_amount_non_negative"),
    )

    id_payment: Mapped[uuid.UUID] = uuid_pk()
    id_order: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id_order", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    transaction_gateway_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True
    )
    gateway_status: Mapped[str | None] = mapped_column(String(50), nullable=True)
    paid_method: Mapped[str] = mapped_column(String(50), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[PaymentStatus] = mapped_column(
        enum_column(PaymentStatus, "ck_payments_status"),
        nullable=False,
        server_default=PaymentStatus.PENDING.value,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="payments")

    def __repr__(self) -> str:
        return f"<Payment {self.id_payment} {self.amount} ({self.status.value})>"
