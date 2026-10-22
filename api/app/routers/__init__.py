"""
Routers package — one module per resource, plus `common` for what they share.
"""

from app.routers import (
    carts,
    categories,
    custom_orders,
    orders,
    payments,
    products,
    states,
)

__all__ = [
    "carts",
    "categories",
    "custom_orders",
    "orders",
    "payments",
    "products",
    "states",
]
