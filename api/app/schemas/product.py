"""
Product schemas for API request/response validation.
"""

import uuid
from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.product import PriceType
from app.schemas.category import CategoryRead


class ProductBase(BaseModel):
    """Shared fields for product operations."""
    name: str = Field(..., min_length=1, max_length=150, examples=["Matilda de Chocolate"])
    slug: str = Field(
        ..., min_length=1, max_length=200, examples=["torta-matilda-chocolate"]
    )
    description: str | None = Field(
        default=None, examples=["La clásica torta de chocolate, húmeda y rellena..."]
    )
    image_url: str | None = Field(default=None, max_length=500, examples=["/landing1.webp"])
    price: Decimal = Field(..., ge=0, examples=[85000])
    price_type: PriceType = PriceType.FIXED
    is_featured: bool = False
    is_active: bool = True


class ProductCreate(ProductBase):
    """Schema for creating a new product."""
    id_category: uuid.UUID


class ProductUpdate(BaseModel):
    """Schema for partially updating a product (admin use)."""
    name: str | None = Field(default=None, min_length=1, max_length=150)
    slug: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    image_url: str | None = Field(default=None, max_length=500)
    price: Decimal | None = Field(default=None, ge=0)
    price_type: PriceType | None = None
    is_featured: bool | None = None
    is_active: bool | None = None
    id_category: uuid.UUID | None = None


class ProductRead(ProductBase):
    """Schema for reading a product, with its category expanded."""
    id_product: uuid.UUID
    id_category: uuid.UUID
    category: CategoryRead | None = None

    model_config = {"from_attributes": True}
