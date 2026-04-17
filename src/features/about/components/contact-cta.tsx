'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const ContactCTA = () => {
    return (
        <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-brand-choco">
            
            {/* Background Texture/Image */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <div className="w-full h-full bg-[url('/landing3.webp')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-brand-choco/80" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
                <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="font-body text-xs md:text-sm uppercase tracking-[0.4em] text-brand-pink mb-6"
                >
                    Hagamos magia
                </motion.span>

                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="font-title text-5xl md:text-7xl text-white mb-12"
                >
                    ¿Listo para tu <br /> próximo evento?
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                >
                    <Link
                        href="/#servicios"
                        className="group relative flex items-center justify-between gap-6 bg-white text-brand-choco px-8 md:px-10 py-6 md:py-8 rounded-full overflow-hidden transition-transform duration-500 hover:scale-105 active:scale-95"
                    >
                        <span className="font-body text-sm md:text-base uppercase tracking-[0.2em] font-bold z-10">
                            Contáctanos
                        </span>

                        <div className="bg-brand-soft text-brand-choco p-3 rounded-full transition-transform duration-500 group-hover:bg-brand-pink group-hover:text-white group-hover:-rotate-45 z-10">
                            <ArrowRight size={20} strokeWidth={2.5} />
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
