"""
Cart schemas for API request/response validation.
"""

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.cart import CartStatus
from app.schemas.product import ProductRead


class CartItemAdd(BaseModel):
    """Schema for adding a product to the cart."""
    id_product: uuid.UUID
    quantity: int = Field(default=1, ge=1, le=100)
    special_instructions: str | None = None


class CartItemUpdate(BaseModel):
    """Schema for changing the quantity or note of a line already in the cart."""
    quantity: int | None = Field(default=None, ge=1, le=100)
    special_instructions: str | None = None


class CartItemRead(BaseModel):
    """Schema for reading a cart line item."""
    id_product: uuid.UUID
    quantity: int
    unit_price: Decimal
    item_subtotal: Decimal
    special_instructions: str | None = None
    product: ProductRead | None = None

    model_config = {"from_attributes": True}


class CartRead(BaseModel):
    """Schema for reading a full cart."""
    id_cart: uuid.UUID
    id_session: uuid.UUID
    status: CartStatus
    created_at: datetime
    items: list[CartItemRead] = []

    model_config = {"from_attributes": True}
