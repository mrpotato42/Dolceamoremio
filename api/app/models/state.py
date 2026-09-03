"""
State model — normalized catalog of order lifecycle states.

Keeping states in a table (rather than a code-level enum) means the shop can
add or rename a state without a migration, and every state change is
referenced by FK from order_state_history.
"""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, uuid_pk

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.order_state_history import OrderStateHistory


class State(Base):
    __tablename__ = "states"

    id_state: Mapped[uuid.UUID] = uuid_pk()
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    orders: Mapped[list["Order"]] = relationship(
        "Order", back_populates="state", lazy="noload"
    )
    history_entries: Mapped[list["OrderStateHistory"]] = relationship(
        "OrderStateHistory", back_populates="state", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<State {self.name}>"
