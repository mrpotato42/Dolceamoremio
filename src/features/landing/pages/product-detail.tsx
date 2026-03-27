'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { SIGNATURE_COLLECTION } from '@/constants/Products';
import { FadeIn } from '@/components/animations/fade-in';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams() as { id: string };
    const product = SIGNATURE_COLLECTION.find(p => p.id === id);

    if (!product) {
        return (
            <MainLayout className='items-center justify-center p-20'>
                <h1 className='text-2xl font-body text-brand-choco mb-4'>Producto no encontrado</h1>
                <Link href='/' className='text-brand-pink underline'>Volver al inicio</Link>
            </MainLayout>
        );
    }

    return (
        <MainLayout className='p-0!'>
            <div className='pt-24 pb-12 px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center'>
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
                    <Link href='/' className='flex items-center gap-2 text-brand-choco/60 hover:text-brand-choco transition-colors'>
                        <ArrowLeft size={16} />
                        <span className='text-sm font-body uppercase tracking-widest'>Colección</span>
                    </Link>

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
        </MainLayout>
    );
}
