"""
Session model — anonymous browsing session that owns a cart.

A visitor gets a session before they have an account, which is what lets the
cart live server-side instead of only in the browser's localStorage.
"""

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, String, text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, uuid_pk

if TYPE_CHECKING:
    from app.models.cart import Cart


class Session(Base):
    __tablename__ = "sessions"

    id_session: Mapped[uuid.UUID] = uuid_pk()
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    creation_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    last_activity_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )

    # Relationships — a session has at most one cart (0:1)
    cart: Mapped["Cart | None"] = relationship(
        "Cart",
        back_populates="session",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Session {self.id_session} ({self.ip_address})>"
