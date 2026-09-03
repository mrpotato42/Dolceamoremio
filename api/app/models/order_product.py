"""
OrderProduct — association table between Order and Product (N:M).

Deliberately duplicates the cart line: unit_price and item_subtotal are a price
snapshot taken at checkout, so a later catalog price change never rewrites the
history of an order that was already placed.
"""

import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.order import Order
    from app.models.product import Product


class OrderProduct(Base):
    __tablename__ = "order_product"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_order_product_quantity_positive"),
        CheckConstraint(
            "unit_price >= 0", name="ck_order_product_unit_price_non_negative"
        ),
        CheckConstraint(
            "item_subtotal >= 0", name="ck_order_product_item_subtotal_non_negative"
        ),
    )

    id_order: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("orders.id_order", ondelete="CASCADE"),
        primary_key=True,
    )
    id_product: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("products.id_product", ondelete="RESTRICT"),
        primary_key=True,
    )
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    item_subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    special_instructions: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    product: Mapped["Product"] = relationship(
        "Product", back_populates="order_items", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<OrderProduct {self.id_product} x{self.quantity}>"
