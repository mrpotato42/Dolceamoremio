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

# 4. Datos iniciales
python -m app.seed              # dev: estados + categorías + 8 productos demo
# python -m app.seed --core-only  # producción: solo estados + categorías
# (si APP_ENV=production, python -m app.seed sin --core-only falla a propósito)

# 5. Levantar la API
uvicorn app.main:app --reload
```

Documentación interactiva en <http://localhost:8000/docs>.

### Variables de entorno

| Variable | Default | Para qué |
|---|---|---|
| `DATABASE_URL` | postgres local | Conexión asyncpg |
| `APP_ENV` / `APP_DEBUG` | development / true | Entorno y echo de SQL |
| `FRONTEND_URL` | http://localhost:3000 | Origen permitido por CORS |
| `DB_POOL_SIZE` / `DB_MAX_OVERFLOW` | 5 / 5 | Tamaño del pool (ver Supabase) |
| `SHIPPING_COST` | 15000 | Envío plano del checkout |
| `ADMIN_API_TOKEN` | — (sin valor) | Habilita los endpoints de administración |

### Supabase

Dashboard → **Connect** → copiá la URI del **Session pooler** y adaptala:
cambiá el esquema `postgresql://` por `postgresql+asyncpg://` y agregá
`?ssl=require`.

```
DATABASE_URL=postgresql+asyncpg://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres?ssl=require
```

Comprobá la conexión antes de migrar:

```bash
python -m app.dbcheck
```

Cuál de las tres cadenas que ofrece Supabase:

| Cadena | Puerto | Cuándo |
|---|---|---|
| **Session pooler** | 5432 | **Esta.** IPv4, admite prepared statements, sirve para la API y para Alembic |
| Conexión directa | 5432 | Solo IPv6 salvo que tengas el add-on de IPv4 |
| Transaction pooler | 6543 | Serverless. `app/database.py` la detecta por el puerto y desactiva el pool y las cachés de prepared statements; **no** sirve para `alembic upgrade` |

Detalles que muerden:

- Es `ssl=require`, **no** `sslmode=require`: SQLAlchemy pasa los parámetros del
  query tal cual a `asyncpg.connect()`, que no conoce `sslmode`. Sin el
  parámetro igual hay TLS (asyncpg usa `prefer`), pero acepta texto plano si el
  handshake falla — para una base remota conviene exigirlo.
- El usuario del pooler es `postgres.<ref>`, no `postgres`.
- Si la contraseña tiene `@ : / ? #` o `%`, hay que URL-encodearla.
- El límite de conexiones es por proyecto, no por proceso: `DB_POOL_SIZE` y
  `DB_MAX_OVERFLOW` se multiplican por cada worker de uvicorn.

#### RLS

La migración `c9d4e7f21b08` activa Row Level Security en las 11 tablas **sin
definir policies**. Supabase publica por PostgREST todo lo que viva en `public`,
y la anon key viaja en el frontend: sin RLS, esa key alcanza para leer y escribir
`clients`, `orders` y `payments`.

No afecta a esta API, que conecta con el rol dueño de las tablas y por lo tanto
saltea RLS. Si algún día se conecta con otro rol, las queries no van a fallar:
van a devolver cero filas. Ese es el momento de escribir policies.

### Otras instancias

Cualquier PostgreSQL 13 o superior sirve (el esquema usa `gen_random_uuid()` y
`TIMESTAMPTZ`).

---

## Imágenes de producto

`products.image_url` guarda una URL, nunca el archivo. Por ahora no hay endpoint
de upload — los productos se cargan a mano (seed o INSERT directo), así que la
imagen puede vivir en `public/` del frontend o subirse manualmente a Supabase
Storage; el backend es indiferente a cuál sea. El día que haga falta que alguien
sin acceso a la base suba fotos, ahí se construye un flujo de upload con URLs
firmadas contra Supabase Storage — no antes, para no construir infraestructura
que nadie usa todavía.

---

## Endpoints

`GET /docs` tiene el detalle completo. Resumen:

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/categories` | Categorías activas, ordenadas para el filtro |
| GET | `/products` | Catálogo activo. Filtros: `category` (slug), `featured`, `search`, `limit`, `offset` |
| GET | `/products/{slug}` | Un producto — la ruta `/catalog/products/[slug]` |
| POST | `/carts` | Abre sesión + carrito y devuelve el `id_cart` |
| GET | `/carts/{id_cart}` | Carrito con sus líneas |
| POST | `/carts/{id_cart}/items` | Agrega producto o suma cantidad |
| PATCH | `/carts/{id_cart}/items/{id_product}` | Cambia cantidad o nota de una línea |
| DELETE | `/carts/{id_cart}/items/{id_product}` | Quita una línea |
| DELETE | `/carts/{id_cart}/items` | Vacía el carrito |
| POST | `/orders` | Checkout: convierte el carrito en pedido |
| GET | `/orders/{id_order}` | Un pedido con cliente, estado y líneas |
| GET | `/orders/{id_order}/history` | Historial de estados |
| POST | `/custom-orders` | Solicitud de cotización |
| GET | `/custom-orders/{id_order}` | Consultar una cotización |
| POST | `/payments` | Registra un intento de pago (siempre `pending`) |
| GET | `/payments/{id_payment}` | Un intento de pago |
| GET | `/states` | Catálogo de estados |

Todas las mutaciones del carrito devuelven el carrito completo, no la línea
tocada: el drawer se re-renderiza con una sola respuesta.

### Endpoints de administración

Requieren la cabecera `X-Admin-Token` con el valor de `ADMIN_API_TOKEN`. Sin esa
variable configurada responden **503**; con un token equivocado, **401**.

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/products` | Alta de producto |
| PATCH | `/products/{id_product}` | Edición parcial |
| DELETE | `/products/{id_product}` | Retiro (soft delete: `is_active = false`) |
| GET | `/orders` | Pedidos. Filtros: `state`, `custom`, `limit`, `offset` |
| PATCH | `/orders/{id_order}/status` | Cambia de estado y deja registro |
| GET | `/custom-orders` | Cotizaciones pendientes de responder |
| PATCH | `/custom-orders/{id_order}/quote` | Responde con un precio |
| GET | `/payments` | Pagos. Filtro: `id_order` |
| PATCH | `/payments/{id_payment}` | Actualiza según responda la pasarela |

Es un token compartido, no un sistema de usuarios: existe para que reprecios,
cambios de estado y confirmaciones de pago no queden abiertos mientras no haya
panel ni login. Se reemplaza por autenticación real cuando llegue el panel.

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
| `clients.phone1` ahora NULL | El formulario de cotización solo pide nombre y correo; el checkout sí exige teléfono, vía `OrderCreate` |
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
├── dbcheck.py       `python -m app.dbcheck` — verifica la conexión
├── main.py          Punto de entrada FastAPI
├── models/          Modelos SQLAlchemy (tablas)
├── schemas/         Schemas Pydantic (validación de la API)
└── routers/         Endpoints
    ├── common.py    Fetchers con eager loading, find-or-create de cliente, guard de admin
    ├── categories.py
    ├── products.py
    ├── carts.py
    ├── orders.py
    ├── custom_orders.py
    ├── payments.py
    └── states.py
```
