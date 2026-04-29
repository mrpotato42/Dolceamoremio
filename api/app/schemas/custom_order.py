"""
CustomOrder schemas for API request/response validation.
"""

from pydantic import BaseModel, Field


class CustomOrderCreate(BaseModel):
    """
    Schema for creating a custom order request.
    Customer info is included inline (find-or-create).
    """
    # Customer info
    full_name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=5)

    # Order details
    event_date: str | None = None
    occasion: str = Field(default="", max_length=100, examples=["Boda", "Cumpleaños"])
    guest_count: str = Field(default="", max_length=20, examples=["10 – 20", "50 – 100"])
    description: str = Field(default="", examples=["Torta de 3 pisos con temática botánica..."])
    reference_image_url: str | None = None


class CustomOrderUpdate(BaseModel):
    """Schema for updating a custom order (admin use)."""
    status: str | None = Field(default=None, examples=["quoted", "accepted", "in_progress"])
    quoted_price: int | None = None
    admin_notes: str | None = None


class CustomOrderRead(BaseModel):
    """Schema for reading a custom order."""
    id: str
    request_number: str
    customer_id: str
    status: str
    event_date: str | None = None
    occasion: str = ""
    guest_count: str = ""
    description: str = ""
    reference_image_url: str | None = None
    quoted_price: int | None = None
    admin_notes: str = ""
    created_at: str | None = None
    updated_at: str | None = None

    model_config = {"from_attributes": True}
