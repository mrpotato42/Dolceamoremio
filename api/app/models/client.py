"""
Client model — customer contact record.

Two columns are nullable even though the SQL schema declared them NOT NULL, for
the same reason: the forms that create clients do not ask for them.

  - document_identification — neither the checkout nor the custom-order form
    asks for a national ID. It stays UNIQUE, which in PostgreSQL still allows
    many NULL rows.
  - phone1 — the custom-order form only collects name and email, so a quote
    request would be impossible to save otherwise. The checkout still requires
    a phone; that rule lives in OrderCreate, where it belongs.

The email is unique case-insensitively, through an index on lower(email)
rather than a plain UNIQUE: 'Ana@x.com' and 'ana@x.com' reach the same inbox,
and a returning shopper who capitalizes differently must not split their
order history across two clients. Lookups have to filter on lower(email) too,
or PostgreSQL cannot use that index.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Index, String, func, text
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
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone1: Mapped[str | None] = mapped_column(String(20), nullable=True)
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


Index("uq_clients_email_lower", func.lower(Client.email), unique=True)
