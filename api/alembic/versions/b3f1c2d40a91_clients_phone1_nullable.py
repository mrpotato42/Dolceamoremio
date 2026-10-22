"""clients.phone1 nullable

The custom-order form only collects name and email, so a quote request cannot
supply a phone number. The checkout still requires one — that rule lives in the
OrderCreate schema, not in the column.

Revision ID: b3f1c2d40a91
Revises: 57a9c8a6171c
Create Date: 2026-09-04 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b3f1c2d40a91'
down_revision: Union[str, Sequence[str], None] = '57a9c8a6171c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'clients', 'phone1',
        existing_type=sa.String(length=20),
        nullable=True,
    )


def downgrade() -> None:
    """
    Downgrade schema.

    Fails loudly if any client was saved without a phone — inventing a value to
    satisfy the constraint would be worse than refusing.
    """
    op.alter_column(
        'clients', 'phone1',
        existing_type=sa.String(length=20),
        nullable=False,
    )
