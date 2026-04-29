"""
Customer schemas for API request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field


class CustomerBase(BaseModel):
    """Shared fields for customer operations."""
    full_name: str = Field(..., min_length=1, max_length=200, examples=["Ana García"])
    email: EmailStr = Field(..., examples=["ana@ejemplo.com"])
    phone: str = Field(default="", max_length=20, examples=["+57 300 000 0000"])


class CustomerCreate(CustomerBase):
    """Schema for creating or finding a customer."""
    pass


class CustomerRead(CustomerBase):
    """Schema for reading a customer."""
    id: str
    created_at: str | None = None

    model_config = {"from_attributes": True}
