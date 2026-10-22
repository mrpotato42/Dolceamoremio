"""
Application configuration loaded from environment variables.
"""

from decimal import Decimal
from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """
    Central configuration class.
    Values are loaded from the .env file at the api/ root.
    """

    # Database — PostgreSQL via asyncpg. The schema relies on gen_random_uuid()
    # and TIMESTAMPTZ, so PostgreSQL 13+ is required.
    DATABASE_URL: str = (
        "postgresql+asyncpg://dolce:dolce@localhost:5432/dolceamoremio"
    )

    # Connection pool. Kept small on purpose: against a managed Postgres the
    # limit is per project, not per process, so every uvicorn worker multiplies
    # these. Supabase's session pooler allows far fewer connections than a local
    # docker instance would.
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 5

    # App
    APP_ENV: str = "development"
    APP_DEBUG: bool = True

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # Checkout — flat local delivery fee, matching the storefront's summary.
    # A single value while the shop only delivers in one city; the day rates
    # differ per zone this becomes a table, not a setting.
    SHIPPING_COST: Decimal = Decimal("15000")

    # Admin endpoints (catalog writes, order state changes, quoting, payment
    # updates) are gated by this shared token sent as X-Admin-Token. There is no
    # login yet, and leaving those routes open would let anyone reprice the
    # catalog or mark an order as paid. Unset => the routes answer 503.
    ADMIN_API_TOKEN: str | None = None

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — loaded once per process."""
    return Settings()
