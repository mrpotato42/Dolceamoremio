"""
Order schemas for API request/response validation.

Covers catalog checkouts. Custom quote requests share the orders table but have
their own schemas in app.schemas.custom_order.
"""

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field

from app.schemas.client import ClientRead
from app.schemas.product import ProductRead
from app.schemas.state import StateRead


class OrderProductRead(BaseModel):
    """Schema for reading an order line item (price snapshot)."""
    id_product: uuid.UUID
    quantity: int
    unit_price: Decimal
    item_subtotal: Decimal
    special_instructions: str | None = None
    product: ProductRead | None = None

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    """
    Schema for converting a cart into an order at checkout.

    Client details are sent inline — the API finds an existing client by email
    or creates one, so shoppers never need an account.
    """
    id_cart: uuid.UUID

    # Client info (find-or-create by email)
    name: str = Field(..., min_length=1, max_length=150, examples=["Ana García"])
    email: EmailStr = Field(..., examples=["ana@ejemplo.com"])
    phone1: str = Field(..., min_length=1, max_length=20, examples=["+57 300 000 0000"])

    # Delivery info
    delivery_address: str = Field(..., min_length=5, max_length=255)
    delivery_date: datetime | None = None
    description_order: str | None = Field(
        default=None, examples=["Dejar en portería, cuidado con alergias"]
    )


class OrderStatusUpdate(BaseModel):
    """Schema for moving an order to a new state (admin use)."""
    id_state: uuid.UUID
    notes: str | None = Field(
        default=None, examples=["Confirmado por WhatsApp con la clienta"]
    )


class OrderStateHistoryRead(BaseModel):
    """Schema for reading one entry of an order's state history."""
    id_order_state_history: uuid.UUID
    changed_at: datetime
    notes: str | None = None
    state: StateRead | None = None

    model_config = {"from_attributes": True}


class OrderRead(BaseModel):
    """Schema for reading a full order."""
    id_order: uuid.UUID
    id_cart: uuid.UUID | None = None
    id_client: uuid.UUID
    id_state: uuid.UUID
    is_custom: bool = False

    delivery_address: str | None = None
    delivery_date: datetime | None = None
    description_order: str | None = None

    # Custom-order fields, null on a catalog checkout
    event_type: str | None = None
    guest_count: int | None = None
    reference_image: str | None = None
    quoted_price: Decimal | None = None

    shipping_cost: Decimal
    subtotal: Decimal
    total: Decimal
    created_at: datetime

    client: ClientRead | None = None
    state: StateRead | None = None
    items: list[OrderProductRead] = []

    model_config = {"from_attributes": True}
