"""
Order schemas for API request/response validation.
"""

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    """Schema for an item within an order creation request."""
    product_id: str
    quantity: int = Field(..., ge=1, le=100)
    special_instructions: str = ""


class OrderItemRead(BaseModel):
    """Schema for reading an order item."""
    id: str
    product_id: str
    product_name: str | None = None
    quantity: int
    unit_price: int
    special_instructions: str = ""

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    """
    Schema for creating a new order from checkout.
    Customer info is included inline (we find-or-create the customer).
    """
    # Customer info
    full_name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=5)
    phone: str = Field(default="", max_length=20)

    # Delivery info
    delivery_address: str = Field(..., min_length=5)
    delivery_date: str | None = None
    delivery_notes: str = ""

    # Items
    items: list[OrderItemCreate] = Field(..., min_length=1)


class OrderUpdate(BaseModel):
    """Schema for updating order status (admin use)."""
    status: str = Field(..., examples=["confirmed", "preparing", "ready", "delivered", "cancelled"])


class OrderRead(BaseModel):
    """Schema for reading a full order."""
    id: str
    order_number: str
    customer_id: str
    status: str
    subtotal: int
    shipping_cost: int
    total: int
    delivery_address: str
    delivery_date: str | None = None
    delivery_notes: str = ""
    items: list[OrderItemRead] = []
    created_at: str | None = None
    updated_at: str | None = None

    model_config = {"from_attributes": True}
