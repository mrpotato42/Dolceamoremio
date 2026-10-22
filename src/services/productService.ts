import { apiFetch, ApiError } from './api';
import type { Category, Product } from './types';

/** The API's page ceiling — the whole catalog fits in one page for now. */
const CATALOG_LIMIT = 100;

/** Active products, featured first. */
export const getProducts = async (): Promise<Product[]> =>
    apiFetch<Product[]>(`/products?limit=${CATALOG_LIMIT}`);

/** One active product, or null when the slug does not exist or was retired. */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    try {
        return await apiFetch<Product>(`/products/${encodeURIComponent(slug)}`);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
    }
};

/** Active categories, in the order the shop wants them shown. */
export const getCategories = async (): Promise<Category[]> =>
    apiFetch<Category[]>('/categories');
