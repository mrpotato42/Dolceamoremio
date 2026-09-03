"""
State schemas for API request/response validation.
"""

import uuid

from pydantic import BaseModel, Field


class StateBase(BaseModel):
    """Shared fields for state operations."""
    name: str = Field(..., min_length=1, max_length=50, examples=["pendiente"])
    description: str | None = Field(default=None, examples=["Pedido recibido, sin confirmar"])


class StateCreate(StateBase):
    """Schema for creating a new state."""
    pass


class StateRead(StateBase):
    """Schema for reading a state."""
    id_state: uuid.UUID

    model_config = {"from_attributes": True}
