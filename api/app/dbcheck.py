"""
Connection smoke test — answers "is DATABASE_URL actually reachable?".

Run with:
    python -m app.dbcheck

Prints where it is pointed, how it decided to pool, and what the server says
about itself. Never prints the password.
"""

import asyncio
import sys

from sqlalchemy import make_url, text

from app.config import get_settings
from app.database import engine


async def main() -> int:
    settings = get_settings()
    url = make_url(settings.DATABASE_URL)

    print(f"host      {url.host}:{url.port}")
    print(f"database  {url.database}")
    print(f"usuario   {url.username}")
    print(f"pool      {type(engine.pool).__name__}")

    try:
        async with engine.connect() as conn:
            version = (await conn.execute(text("select version()"))).scalar_one()
            database, user = (
                await conn.execute(text("select current_database(), current_user"))
            ).one()
            tables = (
                await conn.execute(
                    text(
                        "select count(*) from information_schema.tables "
                        "where table_schema = 'public'"
                    )
                )
            ).scalar_one()
            has_gen_random_uuid = (
                await conn.execute(
                    text("select gen_random_uuid() is not null")
                )
            ).scalar_one()
    except Exception as exc:
        print(f"\nFALLO: {type(exc).__name__}: {exc}")
        return 1
    finally:
        await engine.dispose()

    print(f"\nconectado a {database} como {user}")
    print(f"{version.split(' on ')[0]}")
    print(f"tablas en public: {tables}")
    print(f"gen_random_uuid(): {'ok' if has_gen_random_uuid else 'NO DISPONIBLE'}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
