"""
Category schemas for API request/response validation.
"""

from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    """Shared fields for category operations."""
    name: str = Field(..., min_length=1, max_length=100, examples=["Clásicos"])
    slug: str = Field(..., min_length=1, max_length=100, examples=["clasicos"])
    display_order: int = Field(default=0, ge=0)
    is_active: bool = True


class CategoryCreate(CategoryBase):
    """Schema for creating a new category."""
    pass


class CategoryRead(CategoryBase):
    """Schema for reading a category (includes ID and timestamp)."""
    id: str
    created_at: str | None = None

    model_config = {"from_attributes": True}
