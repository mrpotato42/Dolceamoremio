"""
State endpoints — read-only.

States are seeded reference data (app.seed). The storefront needs to read them
to label an order; nobody creates them over HTTP.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import State
from app.schemas import StateRead

router = APIRouter(prefix="/states", tags=["states"])


@router.get("", response_model=list[StateRead])
async def list_states(db: AsyncSession = Depends(get_db)):
    """Return every order state."""
    result = await db.execute(select(State).order_by(State.name))
    return result.scalars().all()
