'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CatalogCTAProps {
    id?: string;
    className?: string;
}

const CatalogCTA = ({ id, className = '' }: CatalogCTAProps) => {
    return (
        <section id={id} className={`relative w-full bg-white py-32 md:py-48 lg:py-60 flex flex-col items-center justify-center overflow-hidden ${className}`}>
            {/* Background Texture (Extreme minimalism) 
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none overflow-hidden flex items-center justify-center">
                <span className="font-title text-[40vw] text-brand-choco leading-none whitespace-nowrap -rotate-6">Dolce Amore Mio</span>
            </div>*/}

            <div className="relative z-10 w-full max-w-[1200px] px-6 flex flex-col items-center">
                {/* Minimalist Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-title text-6xl md:text-8xl lg:text-[10rem] text-brand-choco leading-[0.8] mb-16 md:mb-24 text-center"
                >
                    EL <span className="text-brand-pink">CATÁLOGO</span>
                </motion.h2>

                {/* Large, striking CTA Button */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                    className="w-full max-w-sm"
                >
                    <Link
                        href="/catalog"
                        className="group relative flex items-center justify-between w-full bg-brand-choco text-white px-8 md:px-12 py-8 md:py-10 rounded-2xl md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:bg-brand-pink hover:translate-y-[-4px] active:scale-95"
                    >
                        {/* Shimmer / Hover background effect */}
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />

                        <div className="relative z-10 flex flex-col items-start gap-1">
                            <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-60">Explora la vitrina</span>
                            <span className="font-body text-xl md:text-2xl uppercase tracking-[0.2em] font-bold">Ver Todo</span>
                        </div>

                        <div className="relative z-10 bg-white text-brand-choco p-4 rounded-full transition-transform duration-500 group-hover:rotate-[-45deg] group-hover:bg-brand-soft">
                            <ArrowRight size={24} strokeWidth={2.5} />
                        </div>
                    </Link>
                </motion.div>

                {/* Small indicator text (optional, very subtle) */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="mt-8 font-body text-[10px] uppercase tracking-[0.5em] text-brand-choco/30"
                >
                    Piezas exclusivas bajo pedido
                </motion.p>
            </div>
        </section>
    );
};

export { CatalogCTA as Catalog };