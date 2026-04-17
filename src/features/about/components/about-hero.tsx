'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export const AboutHero = () => {
    return (
        <section className="relative w-full min-h-[90vh] flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-brand-bg">
            <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                
                {/* Text Content */}
                <div className="flex flex-col gap-6 relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="font-body text-xs md:text-sm uppercase tracking-[0.4em] text-brand-pink font-semibold"
                    >
                        Nuestra Historia
                    </motion.span>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-title text-6xl md:text-8xl lg:text-[10rem] text-brand-choco leading-[0.85]"
                    >
                        EL ARTE <br /> 
                        <span className="text-brand-pink">DEL SABOR</span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="font-body text-brand-choco/70 text-base md:text-lg leading-relaxed max-w-lg mt-6"
                    >
                        Un pequeño sueño que nació entre harinas y azúcares. Dolce AmoreMio ha evolucionado de una cocina familiar a un referente de la repostería creativa, donde cada receta guarda un secreto y cada técnica cuenta una historia de pasión artesanal.
                    </motion.p>
                </div>

                {/* Hero Image */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[3/4] rounded-[2rem] overflow-hidden"
                >
                    <Image 
                        src="/landing2.webp" 
                        alt="Nuestro taller" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    
                    {/* Artistic overlay */}
                    <div className="absolute inset-0 bg-brand-choco/10 mix-blend-overlay" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-soft/40 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
                </motion.div>
            </div>
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-brand-choco) 1px, transparent 0)', backgroundSize: '48px 48px' }} />
        </section>
    );
};
