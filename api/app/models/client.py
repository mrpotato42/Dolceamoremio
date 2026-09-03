"""
Client model — customer contact record.

Note: document_identification is nullable even though the SQL schema declared it
NOT NULL. Neither the checkout nor the custom-order form asks for a national ID,
so requiring it would block both flows. It stays UNIQUE, which in PostgreSQL
still allows many NULL rows.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, uuid_pk

if TYPE_CHECKING:
    from app.models.order import Order


class Client(Base):
    __tablename__ = "clients"

    id_client: Mapped[uuid.UUID] = uuid_pk()
    document_identification: Mapped[str | None] = mapped_column(
        String(30), unique=True, nullable=True
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone1: Mapped[str] = mapped_column(String(20), nullable=False)
    phone2: Mapped[str | None] = mapped_column(String(20), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )

    # Relationships
    orders: Mapped[list["Order"]] = relationship(
        "Order", back_populates="client", lazy="noload"
    )

    def __repr__(self) -> str:
        return f"<Client {self.name} ({self.email})>"
