"""enable row level security

Supabase publica por PostgREST toda tabla del esquema `public`, y la anon key
viaja en el frontend. Sin RLS, cualquiera con esa key lee y escribe `clients`,
`orders` y `payments`.

Se activa RLS sin definir ninguna policy, que es justo lo que hace falta:

  - PostgREST entra como `anon` o `authenticated`, que no son dueños de las
    tablas, así que sin policies no ven ni una fila.
  - Esta API entra como el rol que creó las tablas, y el dueño de una tabla
    saltea RLS mientras no se use FORCE ROW LEVEL SECURITY. No cambia nada
    para nosotros.

Si algún día la API deja de conectarse con el rol dueño, esto se vuelve
invisible y silencioso: las queries no fallan, devuelven cero filas. Ese es el
momento de escribir policies, no antes.

En un PostgreSQL local sin roles de Supabase la sentencia es válida igual y no
tiene efecto práctico, así que la migración corre en los dos entornos.

Revision ID: c9d4e7f21b08
Revises: b3f1c2d40a91
Create Date: 2026-09-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'c9d4e7f21b08'
down_revision: Union[str, Sequence[str], None] = 'b3f1c2d40a91'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


TABLES = (
    "sessions",
    "states",
    "clients",
    "categories",
    "products",
    "carts",
    "product_cart",
    "orders",
    "order_product",
    "payments",
    "order_state_history",
)


def upgrade() -> None:
    """Upgrade schema."""
    for table in TABLES:
        op.execute(f'ALTER TABLE public."{table}" ENABLE ROW LEVEL SECURITY')


def downgrade() -> None:
    """Downgrade schema."""
    for table in TABLES:
        op.execute(f'ALTER TABLE public."{table}" DISABLE ROW LEVEL SECURITY')
