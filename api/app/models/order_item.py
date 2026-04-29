"""
OrderItem model — products within an order, with price snapshot.
"""

from sqlalchemy import String, SmallInteger, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, generate_uuid


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=generate_uuid
    )
    order_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False
    )
    product_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("products.id"), nullable=False
    )
    quantity: Mapped[int] = mapped_column(SmallInteger, nullable=False, default=1)
    unit_price: Mapped[int] = mapped_column(Integer, nullable=False)
    special_instructions: Mapped[str] = mapped_column(
        Text, nullable=False, default=""
    )

    # Relationships
    order: Mapped["Order"] = relationship(
        "Order", back_populates="items"
    )
    product: Mapped["Product"] = relationship(
        "Product", back_populates="order_items", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<OrderItem {self.product_id} x{self.quantity}>"
