"""
Application configuration loaded from environment variables.
"""

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

    # App
    APP_ENV: str = "development"
    APP_DEBUG: bool = True

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

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
