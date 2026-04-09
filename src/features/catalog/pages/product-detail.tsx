'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/animations/fade-in';
import { ArrowLeft } from 'lucide-react';
import { getProductById } from '@/services/productService';
import type { Product } from '@/constants/Products';

/**
 * Product Detail Page
 * Modularized into the Catalog feature for store-specific business domain logic.
 */
export default function ProductDetail() {
    const router = useRouter();
    const { id } = useParams() as { id: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className='flex-1 flex flex-col items-center justify-center p-20 animate-pulse'>
                <div className='w-full max-w-md h-8 bg-brand-choco/10 rounded mb-4'></div>
                <div className='w-1/2 max-w-sm h-6 bg-brand-choco/10 rounded'></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className='flex-1 flex flex-col items-center justify-center p-20'>
                <h1 className='text-2xl font-body text-brand-choco mb-4'>Producto no encontrado</h1>
                <Link href='/' className='text-brand-pink underline'>Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className='w-full flex-1 relative'>
            <div className='absolute top-8 left-6 z-50 md:left-12'>
                <button
                    onClick={() => window.history.back()}
                    className='p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white text-brand-choco transition-all active:scale-95 shadow-xs border border-brand-choco/10'
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            <div className='pt-32 pb-12 px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center'>
                <FadeIn
                    direction='right'
                    distance={20}
                    className='w-full md:w-1/2 aspect-square rounded-3xl overflow-hidden shadow-xl'
                >
                    <img
                        src={product.image}
                        alt={product.name}
                        className='w-full h-full object-cover'
                    />
                </FadeIn>

                <FadeIn
                    direction='left'
                    distance={20}
                    delay={0.2}
                    className='w-full md:w-1/2 flex flex-col gap-6'
                >
                    <div>
                        <h1 className='text-4xl md:text-5xl font-body text-brand-choco mb-2'>{product.name}</h1>
                        <p className='text-2xl font-body text-brand-pink font-medium'>{product.price}</p>
                    </div>

                    <p className='text-brand-choco/80 font-body leading-relaxed text-lg'>
                        {product.description}
                    </p>

                    <div className='flex flex-wrap gap-2 mt-4'>
                        {product.notes.map((note) => (
                            <span key={note} className='px-4 py-2 bg-brand-pink/10 text-brand-pink rounded-full text-xs font-semibold uppercase tracking-wider'>
                                {note}
                            </span>
                        ))}
                    </div>

                    <button className='mt-8 bg-brand-choco text-white py-4 px-8 rounded-full font-body uppercase tracking-widest hover:bg-brand-choco/90 transition-transform active:scale-95'>
                        Pedir ahora
                    </button>
                </FadeIn>
            </div>
        </div>
    );
}
