"""
Models package — import all models here so Alembic can discover them.

Import order matters only for readability; SQLAlchemy resolves the string-based
relationships once every class is registered on Base.
"""

from app.models.base import Base, TimestampMixin
from app.models.session import Session
from app.models.state import State
from app.models.client import Client
from app.models.category import Category
from app.models.product import Product, PriceType
from app.models.cart import Cart, CartStatus
from app.models.product_cart import ProductCart
from app.models.order import Order
from app.models.order_product import OrderProduct
from app.models.payment import Payment, PaymentStatus
from app.models.order_state_history import OrderStateHistory

__all__ = [
    "Base",
    "TimestampMixin",
    "Session",
    "State",
    "Client",
    "Category",
    "Product",
    "PriceType",
    "Cart",
    "CartStatus",
    "ProductCart",
    "Order",
    "OrderProduct",
    "Payment",
    "PaymentStatus",
    "OrderStateHistory",
]
