"""
CustomOrder model — personalized cake/pastry requests with quoting workflow.
"""

import enum
from sqlalchemy import String, Integer, Text, Date, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, generate_uuid


class CustomOrderStatus(str, enum.Enum):
    """Lifecycle states of a custom order request."""
    RECEIVED = "received"
    QUOTED = "quoted"
    ACCEPTED = "accepted"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    REJECTED = "rejected"


class CustomOrder(Base, TimestampMixin):
    __tablename__ = "custom_orders"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=generate_uuid
    )
    request_number: Mapped[str] = mapped_column(
        String(25), unique=True, nullable=False
    )
    customer_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("customers.id"), nullable=False
    )
    status: Mapped[CustomOrderStatus] = mapped_column(
        SAEnum(CustomOrderStatus, native_enum=False, length=20),
        default=CustomOrderStatus.RECEIVED,
        nullable=False,
    )
    event_date: Mapped[str | None] = mapped_column(Date, nullable=True)
    occasion: Mapped[str] = mapped_column(String(100), nullable=False, default="")
    guest_count: Mapped[str] = mapped_column(String(20), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    reference_image_url: Mapped[str | None] = mapped_column(
        String(500), nullable=True, default=None
    )
    quoted_price: Mapped[int | None] = mapped_column(
        Integer, nullable=True, default=None
    )
    admin_notes: Mapped[str] = mapped_column(Text, nullable=False, default="")

    # Relationships
    customer: Mapped["Customer"] = relationship(
        "Customer", back_populates="custom_orders", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<CustomOrder {self.request_number} ({self.status.value})>"
