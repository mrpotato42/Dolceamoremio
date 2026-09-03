"""
Product model — the catalog core.

Beyond the SQL schema this adds four columns the storefront already depends on:
slug (the /catalog/products/[slug] route), image_url, price_type (products
priced "Desde $X") and is_featured (the landing page's featured row).
"""

import enum
import uuid
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    ForeignKey,
    Numeric,
    String,
    Text,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, enum_column, uuid_pk

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.order_product import OrderProduct
    from app.models.product_cart import ProductCart


class PriceType(str, enum.Enum):
    """Whether the price is exact or a 'starting from' indicator."""
    FIXED = "fixed"
    STARTING_FROM = "starting_from"


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("price >= 0", name="ck_products_price_non_negative"),
    )

    id_product: Mapped[uuid.UUID] = uuid_pk()
    id_category: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id_category", ondelete="RESTRICT"),
        nullable=False,
    )
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    price_type: Mapped[PriceType] = mapped_column(
        enum_column(PriceType, "ck_products_price_type"),
        nullable=False,
        server_default=PriceType.FIXED.value,
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("false")
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=text("true")
    )

    # Relationships
    category: Mapped["Category"] = relationship(
        "Category", back_populates="products", lazy="selectin"
    )
    cart_items: Mapped[list["ProductCart"]] = relationship(
        "ProductCart", back_populates="product", lazy="noload"
    )
    order_items: Mapped[list["OrderProduct"]] = relationship(
        "OrderProduct", back_populates="product", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Product {self.name} ({self.price})>"
