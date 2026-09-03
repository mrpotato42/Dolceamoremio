# Dolce Amore Mio — API

Backend FastAPI del catálogo, carrito, pedidos y cotizaciones.

**Stack:** FastAPI · SQLAlchemy 2.0 (async) · Alembic · PostgreSQL 16 (asyncpg)

---

## Puesta en marcha

Desde `api/`:

```bash
# 1. Entorno virtual + dependencias
python -m venv venv
./venv/Scripts/activate          # Windows
# source venv/bin/activate       # macOS / Linux
pip install -r requirements.txt

# 2. Base de datos (necesita Docker Desktop corriendo)
docker compose up -d

# 3. Crear las tablas
alembic upgrade head

# 4. Datos iniciales (estados, categorías, productos)
python -m app.seed

# 5. Levantar la API
uvicorn app.main:app --reload
```

Documentación interactiva en <http://localhost:8000/docs>.

### Sin Docker

Cualquier PostgreSQL 13 o superior sirve (el esquema usa `gen_random_uuid()` y
`TIMESTAMPTZ`). Apuntá `DATABASE_URL` en `.env` a tu instancia — por ejemplo
Supabase:

```
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@db.PROYECTO.supabase.co:5432/postgres
```

---

## Esquema

11 tablas, derivadas del MER del proyecto (`dolce_amore_mio_schema.sql`):

| Tabla | Rol |
|---|---|
| `sessions` | Sesión anónima de navegación |
| `carts` | Carrito, 1:1 con la sesión |
| `product_cart` | Líneas del carrito (N:M carrito ↔ producto) |
| `categories` | Categorías del catálogo |
| `products` | Catálogo de productos |
| `clients` | Datos de contacto del cliente |
| `orders` | Pedidos: de catálogo **y** cotizaciones personalizadas |
| `order_product` | Líneas del pedido, con precio congelado |
| `payments` | Intentos de pago contra un pedido |
| `states` | Catálogo de estados del pedido |
| `order_state_history` | Auditoría de cada cambio de estado |

### Pedidos de catálogo vs. cotizaciones

Ambos viven en `orders`. Los distingue `id_cart`:

- `id_cart` **presente** → pedido de catálogo, nacido de un carrito.
- `id_cart` **NULL** → cotización personalizada, nacida del formulario. Usa
  `event_type`, `guest_count`, `reference_image`, `description_order` y
  `quoted_price`.

La propiedad `Order.is_custom` encapsula esa distinción.

### Diferencias respecto al SQL original

Cambios necesarios para que el esquema funcione con el frontend existente:

| Cambio | Motivo |
|---|---|
| `products.slug` (nuevo) | La ruta `/catalog/products/[slug]` |
| `products.image_url` (nuevo) | El carrito y las tarjetas muestran imagen |
| `products.price_type` (nuevo) | Productos con precio "Desde $X" |
| `products.is_featured`, `is_active` (nuevos) | Destacados del landing y ocultar sin borrar |
| `categories` (tabla nueva) | Era `VARCHAR`; normalizada evita inconsistencias |
| `orders.id_cart` ahora NULL | Una cotización no tiene carrito |
| `orders.delivery_address` ahora NULL | Una cotización aún no tiene dirección |
| `orders.quoted_price` (nuevo) | Respuesta de la pastelería a la cotización |
| `clients.document_identification` ahora NULL | El checkout no pide cédula |
| `special_instructions` en las líneas | El carrito ya recoge notas por ítem |

---

## Migraciones

```bash
alembic revision --autogenerate -m "descripcion del cambio"
alembic upgrade head
alembic downgrade -1
alembic current
```

Los modelos nuevos deben importarse en `app/models/__init__.py` o el
autogenerate no los detecta.

---

## Estructura

```
app/
├── config.py        Configuración desde .env
├── database.py      Engine async y dependencia get_db()
├── seed.py          Datos iniciales (idempotente)
├── main.py          Punto de entrada FastAPI
├── models/          Modelos SQLAlchemy (tablas)
├── schemas/         Schemas Pydantic (validación de la API)
└── routers/         Endpoints (pendiente)
```
