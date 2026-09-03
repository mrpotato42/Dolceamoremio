"""
Category schemas for API request/response validation.
"""

import uuid
from datetime import datetime

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
    """Schema for reading a category."""
    id_category: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}
