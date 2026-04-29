"""
Product model — the catalog core.
"""

from sqlalchemy import String, Integer, Text, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, generate_uuid
import enum


class PriceType(str, enum.Enum):
    """Whether the price is fixed or a 'starting from' indicator."""
    FIXED = "fixed"
    STARTING_FROM = "starting_from"


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=generate_uuid
    )
    category_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("categories.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    price: Mapped[int] = mapped_column(Integer, nullable=False)
    price_type: Mapped[PriceType] = mapped_column(
        SAEnum(PriceType, native_enum=False, length=20),
        default=PriceType.FIXED,
        nullable=False,
    )
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    stock: Mapped[int | None] = mapped_column(Integer, nullable=True, default=None)

    # Relationships
    category: Mapped["Category"] = relationship(
        "Category", back_populates="products", lazy="selectin"
    )
    images: Mapped[list["ProductImage"]] = relationship(
        "ProductImage",
        back_populates="product",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    order_items: Mapped[list["OrderItem"]] = relationship(
        "OrderItem", back_populates="product", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Product {self.name} (${self.price})>"
