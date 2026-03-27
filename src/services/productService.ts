import { SIGNATURE_COLLECTION, type Product } from '@/constants/Products';

/**
 * En el futuro, este servicio realizará llamadas a una API real (Express, Next.js API Routes, etc.)
 * Por ahora, abstrae el acceso a las constantes para que el componente no dependa de la implementación.
 */
export const getProducts = async (): Promise<Product[]> => {
    // Simulamos una latencia de red si quieres, o simplemente retornamos los datos
    return SIGNATURE_COLLECTION;
};

export const getProductById = async (id: string): Promise<Product | null> => {
    const product = SIGNATURE_COLLECTION.find(p => p.id === id);
    return product || null;
};
