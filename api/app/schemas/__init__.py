"""
Pydantic schemas for request/response validation.
Organized by domain entity.
"""

from app.schemas.category import (
    CategoryBase,
    CategoryCreate,
    CategoryRead,
)
from app.schemas.product import (
    ProductBase,
    ProductCreate,
    ProductRead,
    ProductImageRead,
)
from app.schemas.customer import (
    CustomerBase,
    CustomerCreate,
    CustomerRead,
)
from app.schemas.order import (
    OrderCreate,
    OrderRead,
    OrderItemCreate,
    OrderItemRead,
    OrderUpdate,
)
from app.schemas.custom_order import (
    CustomOrderCreate,
    CustomOrderRead,
    CustomOrderUpdate,
)

__all__ = [
    "CategoryBase",
    "CategoryCreate",
    "CategoryRead",
    "ProductBase",
    "ProductCreate",
    "ProductRead",
    "ProductImageRead",
    "CustomerBase",
    "CustomerCreate",
    "CustomerRead",
    "OrderCreate",
    "OrderRead",
    "OrderItemCreate",
    "OrderItemRead",
    "OrderUpdate",
    "CustomOrderCreate",
    "CustomOrderRead",
    "CustomOrderUpdate",
]
