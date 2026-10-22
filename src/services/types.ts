/**
 * Shapes returned and accepted by the Dolce Amore Mio API (api/app/schemas).
 *
 * Field names are kept exactly as the API sends them (snake_case) so there is
 * no mapping layer to keep in sync: the backend is the source of truth.
 */

/** FastAPI serializes Python Decimal as a string, e.g. "85000.00". */
export type Decimal = string;

export interface Category {
    id_category: string;
    name: string;
    slug: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

/** 'starting_from' products show their price as "Desde $X". */
export type PriceType = 'fixed' | 'starting_from';

export interface Product {
    id_product: string;
    id_category: string;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    price: Decimal;
    price_type: PriceType;
    is_featured: boolean;
    is_active: boolean;
    category: Category | null;
}

export type CartStatus = 'active' | 'abandoned' | 'converted';

export interface CartItem {
    id_product: string;
    quantity: number;
    unit_price: Decimal;
    item_subtotal: Decimal;
    special_instructions: string | null;
    product: Product | null;
}

export interface Cart {
    id_cart: string;
    id_session: string;
    status: CartStatus;
    created_at: string;
    items: CartItem[];
}

export interface State {
    id_state: string;
    name: string;
    description: string | null;
}

export interface OrderCreate {
    id_cart: string;
    name: string;
    email: string;
    phone1: string;
    delivery_address: string;
    delivery_date?: string | null;
    description_order?: string | null;
}

export interface Order {
    id_order: string;
    id_cart: string | null;
    id_client: string;
    id_state: string;
    is_custom: boolean;
    delivery_address: string | null;
    delivery_date: string | null;
    description_order: string | null;
    shipping_cost: Decimal;
    subtotal: Decimal;
    total: Decimal;
    created_at: string;
    state: State | null;
}

export interface CustomOrderCreate {
    name: string;
    email: string;
    phone1?: string | null;
    delivery_date?: string | null;
    event_type?: string | null;
    guest_count?: number | null;
    description_order?: string | null;
    reference_image?: string | null;
}

export interface CustomOrder {
    id_order: string;
    id_client: string;
    id_state: string;
    delivery_date: string | null;
    event_type: string | null;
    guest_count: number | null;
    description_order: string | null;
    reference_image: string | null;
    quoted_price: Decimal | null;
    created_at: string;
}
