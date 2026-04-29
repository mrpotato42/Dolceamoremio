"""
Product schemas for API request/response validation.
"""

from pydantic import BaseModel, Field


class ProductImageRead(BaseModel):
    """Schema for reading a product image."""
    id: str
    url: str
    alt_text: str = ""
    display_order: int = 0
    is_primary: bool = False

    model_config = {"from_attributes": True}


class ProductBase(BaseModel):
    """Shared fields for product operations."""
    name: str = Field(..., min_length=1, max_length=200, examples=["Matilda de Chocolate"])
    slug: str = Field(..., min_length=1, max_length=200, examples=["torta-matilda-chocolate"])
    description: str = Field(default="", examples=["La clásica torta de chocolate..."])
    price: int = Field(..., gt=0, examples=[85000])
    price_type: str = Field(default="fixed", examples=["fixed", "starting_from"])
    is_featured: bool = False
    is_active: bool = True
    stock: int | None = None


class ProductCreate(ProductBase):
    """Schema for creating a new product."""
    category_id: str


class ProductRead(ProductBase):
    """Schema for reading a product (includes relationships)."""
    id: str
    category_id: str
    category_name: str | None = None
    images: list[ProductImageRead] = []
    created_at: str | None = None
    updated_at: str | None = None

    model_config = {"from_attributes": True}
