import { PRODUCTS, type Product } from '@/lib/data/products';

/**
 * Product service to abstract data fetching logic.
 * Currenly uses local mock data but can be easily updated to hit an API.
 */
export const getProducts = async (): Promise<Product[]> => {
    return PRODUCTS;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
    const product = PRODUCTS.find(p => p.slug === slug);
    return product || null;
};
