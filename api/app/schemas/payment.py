"""
Payment schemas for API request/response validation.
"""

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.payment import PaymentStatus


class PaymentCreate(BaseModel):
    """Schema for registering a payment attempt against an order."""
    id_order: uuid.UUID
    paid_method: str = Field(..., min_length=1, max_length=50, examples=["nequi", "tarjeta"])
    amount: Decimal = Field(..., ge=0, examples=[100000])
    transaction_gateway_id: str | None = Field(default=None, max_length=255)


class PaymentUpdate(BaseModel):
    """Schema for updating a payment as the gateway reports back."""
    status: PaymentStatus | None = None
    gateway_status: str | None = Field(default=None, max_length=50)
    transaction_gateway_id: str | None = Field(default=None, max_length=255)


class PaymentRead(BaseModel):
    """Schema for reading a payment."""
    id_payment: uuid.UUID
    id_order: uuid.UUID
    paid_method: str
    amount: Decimal
    status: PaymentStatus
    gateway_status: str | None = None
    transaction_gateway_id: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
