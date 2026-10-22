"""
Dolce Amore Mio — FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import (
    carts,
    categories,
    custom_orders,
    orders,
    payments,
    products,
    states,
)

settings = get_settings()

app = FastAPI(
    title="Dolce Amore Mio API",
    description="Backend API for Dolce AmoreMio",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Catalog first, then the buying flow, then what the shop does afterwards —
# the same order the /docs page lists them in.
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(carts.router)
app.include_router(orders.router)
app.include_router(custom_orders.router)
app.include_router(payments.router)
app.include_router(states.router)


@app.get("/")
def root():
    return {"message": "Dolce Amore Mio API is running! 🍰"}


@app.get("/health")
def health():
    return {"status": "OK", "environment": settings.APP_ENV}
