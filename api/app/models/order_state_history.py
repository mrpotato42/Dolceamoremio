"""
OrderStateHistory — audit trail of every state change on an order.

orders.id_state holds the current state; this table holds how it got there.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, uuid_pk

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.state import State


class OrderStateHistory(Base):
    __tablename__ = "order_state_history"

    id_order_state_history: Mapped[uuid.UUID] = uuid_pk()
    id_order: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id_order", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    id_state: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("states.id_state", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="state_history")
    state: Mapped["State"] = relationship(
        "State", back_populates="history_entries", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<OrderStateHistory {self.id_order} → {self.id_state}>"
