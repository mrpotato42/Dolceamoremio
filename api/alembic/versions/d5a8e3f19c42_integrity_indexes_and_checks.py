"""integrity: FK indexes, case-insensitive email, gateway id, total checks

  - Indexes on FK columns PostgreSQL does not index on its own:
    products.id_category, and id_product on both line tables (it is the second
    column of their composite PK, which only serves lookups by the first).
  - clients.email: UNIQUE(email) becomes a unique index on lower(email), and
    existing emails are lowercased to match what the API now stores.
  - payments.transaction_gateway_id becomes UNIQUE, so a retried gateway
    webhook cannot record the same transaction twice.
  - CHECKs that the stored money adds up: item_subtotal = quantity * unit_price
    on both line tables, total = subtotal + shipping_cost on orders.

Fails loudly instead of guessing when existing data breaks a new rule — two
clients whose emails differ only in case have to be merged by hand (their
orders point at one id_client or the other), and a CHECK that existing rows
violate names itself in PostgreSQL's error.

Revision ID: d5a8e3f19c42
Revises: c9d4e7f21b08
Create Date: 2026-10-21 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd5a8e3f19c42'
down_revision: Union[str, Sequence[str], None] = 'c9d4e7f21b08'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # FK indexes
    op.create_index(op.f('ix_products_id_category'), 'products', ['id_category'], unique=False)
    op.create_index(op.f('ix_product_cart_id_product'), 'product_cart', ['id_product'], unique=False)
    op.create_index(op.f('ix_order_product_id_product'), 'order_product', ['id_product'], unique=False)

    # Case-insensitive email. Plain SQL rather than a Python check so it also
    # runs in offline mode (alembic upgrade --sql).
    op.execute(
        """
        DO $$
        BEGIN
            IF EXISTS (
                SELECT 1 FROM clients GROUP BY lower(email) HAVING count(*) > 1
            ) THEN
                RAISE EXCEPTION 'clients has emails that differ only in case; '
                    'merge those clients before running this migration';
            END IF;
        END $$
        """
    )
    op.execute("UPDATE clients SET email = lower(email) WHERE email <> lower(email)")
    op.drop_constraint('clients_email_key', 'clients', type_='unique')
    op.create_index(
        'uq_clients_email_lower', 'clients', [sa.text('lower(email)')], unique=True
    )

    # One payment per gateway transaction
    op.create_unique_constraint(
        'payments_transaction_gateway_id_key', 'payments', ['transaction_gateway_id']
    )

    # Money that adds up
    op.create_check_constraint(
        'ck_product_cart_item_subtotal_matches',
        'product_cart',
        'item_subtotal = quantity * unit_price',
    )
    op.create_check_constraint(
        'ck_order_product_item_subtotal_matches',
        'order_product',
        'item_subtotal = quantity * unit_price',
    )
    op.create_check_constraint(
        'ck_orders_total_matches', 'orders', 'total = subtotal + shipping_cost'
    )


def downgrade() -> None:
    """
    Downgrade schema.

    Emails stay lowercased — the original casing is gone, and lowercase ones
    satisfy the old UNIQUE(email) just as well.
    """
    op.drop_constraint('ck_orders_total_matches', 'orders', type_='check')
    op.drop_constraint('ck_order_product_item_subtotal_matches', 'order_product', type_='check')
    op.drop_constraint('ck_product_cart_item_subtotal_matches', 'product_cart', type_='check')

    op.drop_constraint('payments_transaction_gateway_id_key', 'payments', type_='unique')

    op.drop_index('uq_clients_email_lower', table_name='clients')
    op.create_unique_constraint('clients_email_key', 'clients', ['email'])

    op.drop_index(op.f('ix_order_product_id_product'), table_name='order_product')
    op.drop_index(op.f('ix_product_cart_id_product'), table_name='product_cart')
    op.drop_index(op.f('ix_products_id_category'), table_name='products')
