import type { Decimal, Product } from '@/services/types';

const COP = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

/** Money from the API arrives as a Decimal string ("85000.00"). */
export const toNumber = (amount: Decimal | number): number =>
    typeof amount === 'number' ? amount : Number(amount);

export const formatPrice = (amount: Decimal | number): string => COP.format(toNumber(amount));

/** "Desde $450.000" for products whose price is only a starting point. */
export const formatProductPrice = (product: Pick<Product, 'price' | 'price_type'>): string =>
    product.price_type === 'starting_from'
        ? `Desde ${formatPrice(product.price)}`
        : formatPrice(product.price);

/** image_url is nullable in the API; the logo stands in until a photo is set. */
export const productImage = (product: Pick<Product, 'image_url'> | null | undefined): string =>
    product?.image_url || '/logo.webp';
