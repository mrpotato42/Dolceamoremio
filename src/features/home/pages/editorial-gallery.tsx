import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { SIGNATURE_COLLECTION } from '@/constants/Products';

export const EditorialGallery = () => {
    // Variantes de animación
    const imageVariant: Variants = {
        hidden: { y: 150, x: -30, rotate: -5, opacity: 0 },
        visible: {
            y: 0,
            x: 0,
            rotate: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                damping: 20,
                stiffness: 70,
                duration: 1.2
            }
        }
    };

    const textBlurVariant: Variants = {
        hidden: { y: 30, opacity: 0, filter: 'blur(8px)' },
        visible: (customDelay: number) => ({
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: customDelay
            }
        })
    };

    return (
        <section className='relative z-20 w-full bg-brand-bg px-6 py-24 md:px-12 lg:py-40'>
            <div className='mx-auto flex max-w-[1200px] flex-col lg:flex-row lg:gap-20'>

                {/* LADO IZQUIERDO: Contexto (Sticky en Desktop) */}
                <div className='mb-20 flex flex-col items-center text-center lg:sticky lg:top-32 lg:mb-0 lg:h-[calc(100vh-8rem)] lg:w-1/3 lg:items-start lg:text-left'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                    >
                        <motion.span
                            variants={textBlurVariant}
                            custom={0}
                            className='mb-4 block font-subtitle text-xs font-bold uppercase tracking-[0.3em] text-brand-coral md:mb-6'
                        >
                            Catálogo
                        </motion.span>
                        <motion.h2
                            variants={textBlurVariant}
                            custom={0.2}
                            className='mb-6 font-title text-6xl leading-[0.85] text-brand-pink md:mb-8 md:text-8xl lg:text-9xl'
                        >
                            Colec<br className='hidden lg:block' />ción
                        </motion.h2>
                        <motion.p
                            variants={textBlurVariant}
                            custom={0.4}
                            className='mx-auto max-w-[280px] font-body text-base leading-loose text-brand-choco/70 lg:mx-0'
                        >
                            Cada pieza es ensamblada a mano bajo pedido. Diseños que desafían la gravedad y sabores que redefinen la alta repostería contemporánea.
                        </motion.p>
                    </motion.div>
                </div>

                {/* LADO DERECHO: Los Productos (Scroll) */}
                <div className='flex w-full flex-col gap-32 lg:w-2/3 lg:gap-40 lg:pb-32 lg:pt-10'>
                    {SIGNATURE_COLLECTION.map((product) => (
                        <article key={product.id} className='group flex flex-col'>

                            {/* Imagen del Producto (Animación curva desde abajo + Bordes redondeados) */}
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: '-20%' }}
                                variants={imageVariant}
                                className='mb-8 block w-full md:mb-12'
                            >
                                <Link href={`/producto/${product.id}`} className='relative block aspect-4/5 w-full overflow-hidden rounded-[2.5rem] bg-brand-choco/5 lg:rounded-[3rem]'>
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className='absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105'
                                        loading='lazy'
                                    />
                                    {/* Overlay sutil para hover */}
                                    <div className='absolute inset-0 bg-brand-choco/0 transition-colors duration-500 group-hover:bg-brand-choco/10' />
                                </Link>
                            </motion.div>

                            {/* Información y CTA */}
                            <div className='flex flex-col items-start gap-6 px-2 md:flex-row md:items-end md:justify-between md:gap-8'>

                                {/* Textos animables */}
                                <div className='flex flex-col md:w-3/5'>
                                    {/* Título y Número */}
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-10%' }}
                                        variants={textBlurVariant}
                                        custom={0.1}
                                        className='mb-6 flex items-baseline gap-4 md:mb-8'
                                    >
                                        <span className='font-number text-5xl leading-none text-brand-choco/30 md:text-6xl'>
                                            {product.id}
                                        </span>
                                        <Link href={`/producto/${product.id}`} className='block group/title'>
                                            <h3 className='font-subtitle text-4xl text-brand-choco transition-colors duration-500 group-hover/title:text-brand-pink md:text-5xl lg:text-5xl'>
                                                {product.name}
                                            </h3>
                                        </Link>
                                    </motion.div>

                                    {/* Notas de Sabor */}
                                    <motion.div
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-10%' }}
                                        variants={textBlurVariant}
                                        custom={0.3}
                                        className='mb-6 flex flex-wrap gap-2.5 font-subtitle text-[10px] uppercase tracking-[0.25em] text-brand-choco/50 md:mb-8'
                                    >
                                        {product.notes.map((note, i) => (
                                            <span key={i} className='flex items-center gap-2.5'>
                                                {note}
                                                {i !== product.notes.length - 1 && <span className='h-0.5 w-0.5 rounded-full bg-brand-pink' />}
                                            </span>
                                        ))}
                                    </motion.div>

                                    {/* Descripción */}
                                    <motion.p
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: '-10%' }}
                                        variants={textBlurVariant}
                                        custom={0.5}
                                        className='max-w-sm font-body text-base leading-relaxed text-brand-choco/70'
                                    >
                                        {product.description}
                                    </motion.p>
                                </div>

                                {/* Precio y Botón (Aparecen al final al mismo tiempo) */}
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: '-10%' }}
                                    variants={textBlurVariant}
                                    custom={0.7}
                                    className='mt-6 flex w-full flex-row items-center justify-between border-t border-brand-choco/10 pt-6 md:mt-0 md:w-2/5 md:flex-col md:items-end md:justify-end md:border-none md:pt-0'
                                >
                                    <span className='font-subtitle text-sm tracking-[0.2em] text-brand-choco/80 md:mb-8'>
                                        {product.price}
                                    </span>

                                    <button className='group/btn relative flex items-center gap-4 overflow-hidden py-2 transition-all'>
                                        <span className='relative z-10 font-subtitle text-[11px] font-bold uppercase tracking-[0.2em] text-brand-choco transition-colors group-hover/btn:text-brand-pink'>
                                            Añadir al pedido
                                        </span>
                                        <div className='relative z-10 flex text-brand-choco transition-transform duration-500 group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 group-hover/btn:text-brand-pink'>
                                            <ShoppingBag size={16} strokeWidth={1.5} />
                                        </div>
                                        {/* Línea animada inferior */}
                                        <span className='absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-brand-pink transition-transform duration-500 ease-out group-hover/btn:scale-x-100' />
                                    </button>
                                </motion.div>

                            </div>

                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
};