"""
Client schemas for API request/response validation.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class ClientBase(BaseModel):
    """Shared fields for client operations."""
    name: str = Field(..., min_length=1, max_length=150, examples=["Ana García"])
    email: EmailStr = Field(..., examples=["ana@ejemplo.com"])
    phone1: str = Field(..., min_length=1, max_length=20, examples=["+57 300 000 0000"])
    phone2: str | None = Field(default=None, max_length=20)
    address: str | None = Field(default=None, max_length=255)
    document_identification: str | None = Field(default=None, max_length=30)


class ClientCreate(ClientBase):
    """Schema for creating (or finding) a client."""
    pass


class ClientRead(ClientBase):
    """Schema for reading a client."""
    id_client: uuid.UUID
    created_at: datetime

    model_config = {"from_attributes": True}
