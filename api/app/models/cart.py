"""
Cart model — a server-side cart bound 1:1 to a browsing session.
"""

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, enum_column, uuid_pk

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.product_cart import ProductCart
    from app.models.session import Session


class CartStatus(str, enum.Enum):
    """Lifecycle of a cart."""
    ACTIVE = "active"
    ABANDONED = "abandoned"
    CONVERTED = "converted"


class Cart(Base):
    __tablename__ = "carts"

    id_cart: Mapped[uuid.UUID] = uuid_pk()
    id_session: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sessions.id_session", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    status: Mapped[CartStatus] = mapped_column(
        enum_column(CartStatus, "ck_carts_status"),
        nullable=False,
        server_default=CartStatus.ACTIVE.value,
    )

    # Relationships
    session: Mapped["Session"] = relationship("Session", back_populates="cart")
    items: Mapped[list["ProductCart"]] = relationship(
        "ProductCart",
        back_populates="cart",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    order: Mapped["Order | None"] = relationship(
        "Order", back_populates="cart", uselist=False, lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Cart {self.id_cart} ({self.status.value})>"
