/**
 * Thin fetch wrapper for the Dolce Amore Mio API.
 *
 * Every service goes through apiFetch so errors arrive in one shape: an
 * ApiError carrying the HTTP status (0 when the server could not be reached)
 * and a message that is safe to show the shopper.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/** How the API's field names read to a shopper, for 422 messages. */
const FIELD_LABELS: Record<string, string> = {
    name: 'nombre',
    email: 'correo electrónico',
    phone1: 'teléfono',
    delivery_address: 'dirección de envío',
    delivery_date: 'fecha',
    description_order: 'descripción',
    event_type: 'ocasión',
    guest_count: 'invitados',
    quantity: 'cantidad',
};

/** FastAPI errors are `{ detail: string }`, or `{ detail: [...] }` for a 422. */
const errorMessage = async (res: Response): Promise<string> => {
    try {
        const body = await res.json();
        if (typeof body?.detail === 'string') return body.detail;
        if (Array.isArray(body?.detail)) {
            const fields = body.detail
                .map((err: { loc?: unknown[] }) => err.loc?.at(-1))
                .filter(Boolean)
                .map((field: string) => FIELD_LABELS[field] ?? field)
                .join(', ');
            return fields ? `Revisa estos campos: ${fields}.` : 'Revisa los datos del formulario.';
        }
    } catch {
        // Not JSON — fall through to the generic message.
    }
    return 'Algo salió mal. Intenta de nuevo en un momento.';
};

export const apiFetch = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            ...init,
            // Only send Content-Type with a body: on a GET it would force a
            // CORS preflight for nothing.
            headers: init.body
                ? { 'Content-Type': 'application/json', ...init.headers }
                : init.headers,
        });
    } catch {
        throw new ApiError(0, 'No pudimos conectar con el servidor. Intenta de nuevo en un momento.');
    }

    if (!res.ok) throw new ApiError(res.status, await errorMessage(res));
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
};

export const messageOf = (error: unknown): string =>
    error instanceof ApiError ? error.message : 'Algo salió mal. Intenta de nuevo en un momento.';
