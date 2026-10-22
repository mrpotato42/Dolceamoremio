import { apiFetch } from './api';
import type { Cart } from './types';

/**
 * Server-side cart. Every mutation answers with the whole cart, so the store
 * replaces its copy with each response instead of patching it by hand.
 */

export const createCart = async (): Promise<Cart> =>
    apiFetch<Cart>('/carts', { method: 'POST' });

export const getCart = async (cartId: string): Promise<Cart> =>
    apiFetch<Cart>(`/carts/${cartId}`);

export const addCartItem = async (
    cartId: string,
    productId: string,
    quantity: number,
    specialInstructions?: string,
): Promise<Cart> =>
    apiFetch<Cart>(`/carts/${cartId}/items`, {
        method: 'POST',
        body: JSON.stringify({
            id_product: productId,
            quantity,
            special_instructions: specialInstructions || null,
        }),
    });

export const updateCartItem = async (
    cartId: string,
    productId: string,
    quantity: number,
): Promise<Cart> =>
    apiFetch<Cart>(`/carts/${cartId}/items/${productId}`, {
        method: 'PATCH',
        body: JSON.stringify({ quantity }),
    });

export const removeCartItem = async (cartId: string, productId: string): Promise<Cart> =>
    apiFetch<Cart>(`/carts/${cartId}/items/${productId}`, { method: 'DELETE' });
