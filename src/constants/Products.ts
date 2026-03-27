export interface Product {
    id: string;
    name: string;
    price: string | number;
    description: string;
    notes: string[];
    image: string;
    category?: string;
}

export const SIGNATURE_COLLECTION: Product[] = [
    {
        id: '01',
        name: 'clat de Rose',
        price: '$85.000',
        description: 'Nuestra obra cumbre. Un bizcocho etéreo infusionado con agua de rosas, envuelto en una sedosa mousse de lichi y centro de frambuesa silvestre.',
        notes: ['Rosas de Grasse', 'Frambuesa', 'Pistacho Crocante'],
        image: '/landing1.JPG'
    },
    {
        id: '02',
        name: 'Noir Absolu',
        price: '$92.000',
        description: 'Para los puristas. Capas de bizcocho denso intercaladas con ganache de cacao al 70% de origen único y un glaseado espejo impecable.',
        notes: ['Cacao 70%', 'Vainilla Bourbon', 'Sal en Escamas'],
        image: '/landing3.JPG'
    },
    {
        id: '03',
        name: 'Citron & Basil',
        price: '$78.000',
        description: 'La frescura redefinida. Curd de limón Meyer vibrante, merengue suizo tostado y un toque inesperado de albahaca dulce.',
        notes: ['Limón Meyer', 'Albahaca Dulce', 'Merengue Suizo'],
        image: '/landing2.JPG'
    }
];