export type ProductCategory = 'Todos' | 'Clásicos' | 'Eventos Especiales' | 'Temporada' | 'Postres';

export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number | string; // Could be a range or "Desde $X"
    category: ProductCategory;
    image: string;
    isFeatured?: boolean;
}

export const CATEGORIES: ProductCategory[] = [
    'Todos',
    'Clásicos',
    'Eventos Especiales',
    'Temporada',
    'Postres',
];

export const PRODUCTS: Product[] = [
    {
        id: '1',
        slug: 'torta-matilda-chocolate',
        name: 'Matilda de Chocolate',
        description: 'La clásica e irresistible torta de chocolate, húmeda, rellena y cubierta con nuestro fudge artesanal secreto.',
        price: 85000,
        category: 'Clásicos',
        image: '/landing1.webp',
        isFeatured: true,
    },
    {
        id: '2',
        slug: 'red-velvet-especial',
        name: 'Red Velvet Especial',
        description: 'Bizcocho aterciopelado con ligeras notas de cacao, coronado con el más suave frosting de queso crema.',
        price: 92000,
        category: 'Clásicos',
        image: '/landing2.webp',
    },
    {
        id: '3',
        slug: 'boda-botanica',
        name: 'Torta Boda Botánica',
        description: 'Diseño elegante de tres pisos con flores naturales comestibles y sutiles detalles dorados.',
        price: 'Desde 450.000',
        category: 'Eventos Especiales',
        image: '/landing3.webp',
    },
    {
        id: '4',
        slug: 'carrot-cake-rustica',
        name: 'Carrot Cake Rústica',
        description: 'Esponjosa torta de zanahoria con nueces tostadas y nuestro glaseado rústico.',
        price: 78000,
        category: 'Clásicos',
        image: '/landing1.webp',
    },
    {
        id: '5',
        slug: 'macarons-temporada',
        name: 'Set Macarons de Temporada',
        description: 'Caja de 12 macarons franceses con rellenos cítricos y florales ideales para la primavera.',
        price: 45000,
        category: 'Postres',
        image: '/landing2.webp',
    },
    {
        id: '6',
        slug: 'cheesecake-frutos-rojos',
        name: 'Cheesecake Frutos Rojos',
        description: 'Clásico cheesecake estilo NY con una corona abundante de coulis de frutos rojos frescos.',
        price: 88000,
        category: 'Postres',
        image: '/landing3.webp',
    },
    {
        id: '7',
        slug: 'torta-navidena-especiada',
        name: 'Torta Especiada de Invierno',
        description: 'Edición limitada. Bizcocho de jengibre y canela, rellena de ganache de chocolate blanco.',
        price: 110000,
        category: 'Temporada',
        image: '/landing1.webp',
    },
    {
        id: '8',
        slug: 'mini-cake-aniversario',
        name: 'Mini Cake Aniversario',
        description: 'El detalle perfecto. Torta personalizable (2 porciones) con diseño vintage.',
        price: 35000,
        category: 'Eventos Especiales',
        image: '/landing2.webp',
    },
];

export const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(price);
};
