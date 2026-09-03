"""
Custom order (quote request) schemas.

A custom order is a row in `orders` with no cart attached — see app.models.order.
These schemas mirror the fields the storefront's custom-order form collects.
"""

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field


class CustomOrderCreate(BaseModel):
    """
    Schema for submitting a custom order request.

    Client details are sent inline (find-or-create by email), same as checkout.
    """
    # Client info
    name: str = Field(..., min_length=1, max_length=150, examples=["Ana García"])
    email: EmailStr = Field(..., examples=["ana@ejemplo.com"])
    phone1: str | None = Field(default=None, max_length=20)

    # Request details
    delivery_date: datetime | None = Field(default=None, description="Fecha del evento")
    event_type: str | None = Field(default=None, max_length=100, examples=["Boda"])
    guest_count: int | None = Field(default=None, ge=0, examples=[50])
    description_order: str | None = Field(
        default=None, examples=["Torta de 3 pisos con temática botánica..."]
    )
    reference_image: str | None = None


class CustomOrderQuote(BaseModel):
    """Schema for the shop answering a quote request (admin use)."""
    quoted_price: Decimal = Field(..., ge=0, examples=[450000])
    id_state: uuid.UUID | None = None
    notes: str | None = None


class CustomOrderRead(BaseModel):
    """Schema for reading a custom order request."""
    id_order: uuid.UUID
    id_client: uuid.UUID
    id_state: uuid.UUID
    delivery_date: datetime | None = None
    event_type: str | None = None
    guest_count: int | None = None
    description_order: str | None = None
    reference_image: str | None = None
    quoted_price: Decimal | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
