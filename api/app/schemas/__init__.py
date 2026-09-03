"""
Pydantic schemas for request/response validation.
Organized by domain entity.
"""

from app.schemas.state import StateBase, StateCreate, StateRead
from app.schemas.client import ClientBase, ClientCreate, ClientRead
from app.schemas.category import CategoryBase, CategoryCreate, CategoryRead
from app.schemas.product import (
    ProductBase,
    ProductCreate,
    ProductUpdate,
    ProductRead,
)
from app.schemas.cart import (
    CartItemAdd,
    CartItemUpdate,
    CartItemRead,
    CartRead,
)
from app.schemas.order import (
    OrderCreate,
    OrderRead,
    OrderProductRead,
    OrderStatusUpdate,
    OrderStateHistoryRead,
)
from app.schemas.custom_order import (
    CustomOrderCreate,
    CustomOrderQuote,
    CustomOrderRead,
)
from app.schemas.payment import PaymentCreate, PaymentUpdate, PaymentRead

__all__ = [
    "StateBase",
    "StateCreate",
    "StateRead",
    "ClientBase",
    "ClientCreate",
    "ClientRead",
    "CategoryBase",
    "CategoryCreate",
    "CategoryRead",
    "ProductBase",
    "ProductCreate",
    "ProductUpdate",
    "ProductRead",
    "CartItemAdd",
    "CartItemUpdate",
    "CartItemRead",
    "CartRead",
    "OrderCreate",
    "OrderRead",
    "OrderProductRead",
    "OrderStatusUpdate",
    "OrderStateHistoryRead",
    "CustomOrderCreate",
    "CustomOrderQuote",
    "CustomOrderRead",
    "PaymentCreate",
    "PaymentUpdate",
    "PaymentRead",
]
