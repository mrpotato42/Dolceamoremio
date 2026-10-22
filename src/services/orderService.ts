import { apiFetch } from './api';
import type { CustomOrder, CustomOrderCreate, Order, OrderCreate } from './types';

/** Checkout: turns the cart into an order. The API computes every amount. */
export const createOrder = async (payload: OrderCreate): Promise<Order> =>
    apiFetch<Order>('/orders', { method: 'POST', body: JSON.stringify(payload) });

/** Quote request from the custom-order form. */
export const createCustomOrder = async (payload: CustomOrderCreate): Promise<CustomOrder> =>
    apiFetch<CustomOrder>('/custom-orders', { method: 'POST', body: JSON.stringify(payload) });

/**
 * A date input gives "YYYY-MM-DD"; the API stores a timestamp. Noon local
 * time keeps the calendar day intact once it is converted to UTC.
 */
export const dateInputToISO = (value: string): string | null =>
    value ? new Date(`${value}T12:00:00`).toISOString() : null;
