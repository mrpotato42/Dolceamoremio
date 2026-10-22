"""
Async database engine and session management (PostgreSQL via asyncpg).

Points at whatever DATABASE_URL says — the local docker Postgres in
development, Supabase in production. The schema is identical either way; the
only thing that has to change is how connections are pooled, which is decided
in _engine_kwargs from the URL itself rather than from a separate flag nobody
remembers to flip.
"""

from collections.abc import AsyncGenerator
from typing import Any

from sqlalchemy import URL, make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.config import get_settings

settings = get_settings()

# Supabase exposes its transaction pooler (pgbouncer in transaction mode) on
# this port. There, every statement can land on a different backend connection,
# so a prepared statement cached by the driver is gone by the time it is reused
# — the symptom is `prepared statement "__asyncpg_stmt_1__" does not exist`.
# The session pooler (5432) and a direct connection do not have this problem.
TRANSACTION_POOLER_PORT = 6543


def _engine_kwargs(url: URL) -> dict[str, Any]:
    """
    Pooling and driver options for the host we are actually pointed at.

    Against the transaction pooler, pooling on this side is pointless
    (pgbouncer already does it) and both prepared-statement caches have to be
    off: asyncpg's own `statement_cache_size`, and the one SQLAlchemy layers
    on top of it.
    """
    if url.port == TRANSACTION_POOLER_PORT:
        return {
            "poolclass": NullPool,
            "connect_args": {
                "statement_cache_size": 0,
                "prepared_statement_cache_size": 0,
            },
        }

    return {
        "pool_size": settings.DB_POOL_SIZE,
        "max_overflow": settings.DB_MAX_OVERFLOW,
        # Managed Postgres and poolers drop idle connections without telling
        # anyone; recycling below any plausible server-side timeout keeps the
        # first request after a quiet spell from failing.
        "pool_recycle": 1800,
        "pool_pre_ping": True,
    }


engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.APP_DEBUG,
    **_engine_kwargs(make_url(settings.DATABASE_URL)),
)

# Session factory — each request gets its own session
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that yields a database session.
    Commits on success, rolls back on error, always closes.

    Usage:
        @router.get("/products")
        async def list_products(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
