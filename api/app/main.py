"""
Dolce Amore Mio — FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings

settings = get_settings()

app = FastAPI(
    title="Dolce Amore Mio API",
    description="Backend API for Dolce AmoreMio pastry shop — catalog, orders, and custom requests.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Dolce Amore Mio API is running! 🍰"}


@app.get("/health")
def health():
    return {"status": "OK", "environment": settings.APP_ENV}
