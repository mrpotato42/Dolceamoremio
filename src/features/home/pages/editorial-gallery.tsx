'use client';
import { FadeIn } from '@/components/animations/fade-in';
import { ShoppingBag } from 'lucide-react';
import { SIGNATURE_COLLECTION } from '@/constants/Products';
import Link from 'next/link';

export const EditorialGallery = () => {
    return (
        // z-20 y bg-brand-bg aseguran que este bloque pase por encima de tu fondo texturizado anterior
        <section className='relative z-20 w-full bg-brand-bg px-6 py-20 md:px-12 lg:py-0'>

            <div className='mx-auto flex max-w-[1400px] flex-col lg:flex-row'>

                {/* LADO IZQUIERDO: Contexto (Sticky en Desktop) */}
                <div className='mb-16 lg:sticky lg:top-0 lg:mb-0 lg:flex lg:h-screen lg:w-1/3 lg:flex-col lg:justify-center lg:pr-10'>
                    <FadeIn
                        direction='right'
                        distance={30}
                        useWhileInView
                        viewportMargin='-100px'
                    >
                        <span className='mb-4 block font-body text-[10px] font-bold uppercase tracking-[0.4em] text-brand-coral'>
                            Catálogo
                        </span>
                        <h2 className='mb-6 font-body text-6xl leading-[0.9] text-brand-pink md:text-7xl'>
                            Colección
                        </h2>
                        <p className='max-w-sm border-l-2 border-brand-pink/30 pl-4 font-body text-lg leading-relaxed text-brand-choco/80'>
                            Cada pieza es ensamblada a mano bajo pedido. Diseños que desafían la gravedad y sabores que redefinen la alta repostería.
                        </p>
                    </FadeIn>
                </div>

                {/* LADO DERECHO: Los Productos (Scroll) */}
                <div className='flex flex-col gap-24 lg:w-2/3 lg:py-32'>
                    {SIGNATURE_COLLECTION.map((product) => (
                        <FadeIn
                            as='article'
                            key={product.id}
                            direction='up'
                            distance={50}
                            useWhileInView
                            viewportMargin='-100px'
                            className='flex flex-col group'
                        >
                            {/* Imagen del Producto (Estilo Retrato/Revista) */}
                            <Link href={`/producto/${product.id}`} className='relative mb-8 w-full rounded-2xl overflow-hidden bg-brand-choco/5 pt-[120%] md:pt-[80%] lg:pt-[100%] block '>
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className='absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105'
                                    loading='lazy'
                                />
                            </Link>

                            {/* Información y CTA */}
                            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-8'>

                                {/* Textos */}
                                <div className='md:w-2/3'>
                                    <Link href={`/producto/${product.id}`} className='block group/title'>
                                        <h3 className='mb-4 font-subtitle text-4xl text-brand-choco md:text-5xl group-hover/title:text-brand-pink transition-colors'>
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Notas de Sabor (Estilo Perfume) */}
                                    <div className='mb-4 flex flex-wrap gap-2 font-body text-[9px] font-bold uppercase tracking-widest text-brand-choco/50'>
                                        {product.notes.map((note, i) => (
                                            <span key={i} className='flex items-center gap-2'>
                                                {note}
                                                {i !== product.notes.length - 1 && <span className='h-1 w-1 rounded-full bg-brand-pink/50' />}
                                            </span>
                                        ))}
                                    </div>

                                    <p className='font-body text-md leading-relaxed text-brand-choco/80'>
                                        {product.description}
                                    </p>
                                </div>

                                {/* Call To Action (Precio y Botón) */}
                                <div className='flex flex-row items-center md:items-end md:w-1/3 min-w-[200px] justify-around'>
                                    <span className=' font-subtitle text-sm font-bold tracking-widest text-brand-choco'>
                                        {product.price}
                                    </span>

                                    {/* BOTÓN DE COMPRA: Minimalista, elegante y directo */}
                                    <button className='group/btn relative flex w-1/2 items-center justify-between overflow-hidden rounded-full border border-brand-choco px-6 py-4 transition-all hover:bg-brand-choco hover:text-brand-bg md:w-auto'>
                                        <span className='relative z-10 font-body text-[10px] font-bold uppercase tracking-[0.2em]'>
                                            Añadir al Pedido
                                        </span>
                                        <div className='relative z-10 ml-6 flex h-6 w-6 items-center justify-center rounded-full bg-brand-choco/10 transition-colors group-hover/btn:bg-brand-bg/20'>
                                            <ShoppingBag size={24} />
                                        </div>
                                    </button>
                                </div>

                            </div>
                        </FadeIn>
                    ))}
                </div>

            </div>
        </section>
    );
};