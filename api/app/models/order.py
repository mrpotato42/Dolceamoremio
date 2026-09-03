"""
Order model — covers both storefront checkouts and custom quote requests.

Following the SQL schema, custom orders are not a separate table: they are
orders whose event_type / guest_count / description_order are filled in. Three
columns had to loosen for that to actually work, because a quote request has no
cart, no address and no price yet:

  - id_cart is nullable (still UNIQUE; PostgreSQL treats NULLs as distinct)
  - delivery_address is nullable
  - quoted_price was added for the shop's answer to a quote request

An order with id_cart IS NULL is a custom order; see `is_custom`.
"""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, uuid_pk

if TYPE_CHECKING:
    from app.models.cart import Cart
    from app.models.client import Client
    from app.models.order_product import OrderProduct
    from app.models.order_state_history import OrderStateHistory
    from app.models.payment import Payment
    from app.models.state import State


class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("guest_count >= 0", name="ck_orders_guest_count_non_negative"),
        CheckConstraint("shipping_cost >= 0", name="ck_orders_shipping_cost_non_negative"),
        CheckConstraint("subtotal >= 0", name="ck_orders_subtotal_non_negative"),
        CheckConstraint("total >= 0", name="ck_orders_total_non_negative"),
        CheckConstraint("quoted_price >= 0", name="ck_orders_quoted_price_non_negative"),
    )

    id_order: Mapped[uuid.UUID] = uuid_pk()
    id_cart: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("carts.id_cart", ondelete="RESTRICT"),
        unique=True,
        nullable=True,
    )
    id_client: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("clients.id_client", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    id_state: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("states.id_state", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Custom-order fields (null on a plain catalog checkout)
    delivery_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    reference_image: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    guest_count: Mapped[int | None] = mapped_column(Integer, nullable=True)
    description_order: Mapped[str | None] = mapped_column(Text, nullable=True)
    quoted_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    delivery_address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    shipping_cost: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, server_default=text("0")
    )
    subtotal: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, server_default=text("0")
    )
    total: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, server_default=text("0")
    )

    # Relationships
    cart: Mapped["Cart | None"] = relationship(
        "Cart", back_populates="order", lazy="noload"
    )
    client: Mapped["Client"] = relationship(
        "Client", back_populates="orders", lazy="selectin"
    )
    state: Mapped["State"] = relationship(
        "State", back_populates="orders", lazy="selectin"
    )
    items: Mapped[list["OrderProduct"]] = relationship(
        "OrderProduct",
        back_populates="order",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="order",
        lazy="noload",
        cascade="all, delete-orphan",
    )
    state_history: Mapped[list["OrderStateHistory"]] = relationship(
        "OrderStateHistory",
        back_populates="order",
        lazy="noload",
        cascade="all, delete-orphan",
        order_by="OrderStateHistory.changed_at",
    )

    @property
    def is_custom(self) -> bool:
        """A custom (quoted) order originates from the form, not from a cart."""
        return self.id_cart is None

    def __repr__(self) -> str:
        kind = "custom" if self.is_custom else "catalog"
        return f"<Order {self.id_order} ({kind})>"
