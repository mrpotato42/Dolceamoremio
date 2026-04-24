'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CatalogCTAProps {
    id?: string;
    className?: string;
}

const BACKGROUND_STAMPS = [
    { top: '-5%', left: '-10%', size: '18vw', rotate: '-rotate-12' },
    { top: '25%', right: '-15%', size: '12vw', rotate: 'rotate-6' },
    { bottom: '10%', left: '5%', size: '15vw', rotate: '-rotate-3' },
    { top: '55%', left: '-20%', size: '22vw', rotate: 'rotate-12' },
    { top: '-15%', right: '5%', size: '10vw', rotate: '-rotate-6' },
    { bottom: '-10%', right: '10%', size: '20vw', rotate: '-rotate-12' },
];

const CatalogCTA = ({ id, className = '' }: CatalogCTAProps) => {
    return (
        <section id={id} className={`relative w-full bg-brand-peach py-28 md:py-48 lg:py-60 flex flex-col items-center justify-center overflow-hidden ${className}`}>
            {/* Background Texture (Scattered stamps) */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none select-none overflow-hidden">
                {BACKGROUND_STAMPS.map((stamp, index) => (
                    <span
                        key={index}
                        className={`absolute font-title text-white/80 leading-none whitespace-nowrap mix-blend-overlay ${stamp.rotate}`}
                        style={{
                            top: stamp.top,
                            left: stamp.left,
                            right: stamp.right,
                            bottom: stamp.bottom,
                            fontSize: stamp.size
                        }}
                    >
                        Dolce Amore Mio
                    </span>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-[1200px] px-6 flex flex-col items-center">
                {/* Minimalist Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-title text-6xl md:text-8xl lg:text-[10rem] text-brand-choco leading-[0.8] mb-8 text-center"
                >
                    EL <span className="text-brand-pink">CATÁLOGO</span>
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="font-body text-base md:text-lg text-brand-choco text-center max-w-2xl mb-16 leading-relaxed px-4 mix-blend-color-burn"
                >
                    Descubre nuestra colección de postres y pasteles. Cada creación está elaborada con
                    pasión, ingredientes premium y un diseño que elevará tus momentos especiales.
                </motion.p>

                {/* Large, striking CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                    className="w-[80%]  max-w-md"
                >
                    <Link
                        href="/catalog"
                        className="group relative flex flex-col items-center justify-center gap-2 w-full bg-brand-choco text-white px-8 md:px-12 py-5 md:py-14 rounded-[2rem] md:rounded-[3rem] overflow-hidden transition-all duration-500 hover:bg-brand-pink hover:translate-y-[-8px] active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-brand-pink/30 border border-brand-choco/20"
                    >
                        {/* Shimmer / Hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                            <span className="font-body text-[12px] md:text-xs uppercase tracking-[0.4em] text-brand-peach">Explora la vitrina</span>
                            <span className="font-body text-2xl md:text-3xl uppercase tracking-[0.2em] font-bold">Ver Todo</span>
                        </div>

                        <div className="relative z-10 bg-brand-peach text-brand-choco p-4 rounded-full transition-all duration-500 group-hover:-rotate-45 group-hover:scale-110 shadow-lg ">
                            <ArrowRight size={28} strokeWidth={2} />
                        </div>
                    </Link>
                </motion.div>

                {/* Small indicator text (optional, very subtle) */}
                <p
                    className="mt-12 font-body text-xs uppercase tracking-[0.5em] text-white text-center"
                >
                    Piezas exclusivas bajo pedido
                </p>
            </div>
        </section>
    );
};

export { CatalogCTA as Catalog };