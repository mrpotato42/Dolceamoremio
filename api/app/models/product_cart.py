"""
ProductCart — association table between Cart and Product (N:M).

Composite primary key (id_cart, id_product) means a product appears at most once
per cart; adding it again bumps the quantity. special_instructions is not in the
SQL schema but the storefront cart already collects a note per line item.
"""

import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.cart import Cart
    from app.models.product import Product


class ProductCart(Base):
    __tablename__ = "product_cart"
    __table_args__ = (
        CheckConstraint("quantity > 0", name="ck_product_cart_quantity_positive"),
        CheckConstraint("unit_price >= 0", name="ck_product_cart_unit_price_non_negative"),
        CheckConstraint(
            "item_subtotal >= 0", name="ck_product_cart_item_subtotal_non_negative"
        ),
    )

    id_cart: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("carts.id_cart", ondelete="CASCADE"),
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
    cart: Mapped["Cart"] = relationship("Cart", back_populates="items")
    product: Mapped["Product"] = relationship(
        "Product", back_populates="cart_items", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<ProductCart {self.id_product} x{self.quantity}>"
