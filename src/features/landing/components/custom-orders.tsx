'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/animations/fade-in';
import { ArrowDown } from 'lucide-react';
import { CustomOrderForm } from '@/components/forms/custom-order-form';

interface CustomOrdersProps {
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

export const CustomOrders = ({ id = "servicios", className = '' }: CustomOrdersProps) => {
    const [isInterested, setIsInterested] = useState(false);

    return (
        <section id={id} className={`relative w-full py-28 md:py-40 overflow-hidden ${className}`}>
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-linear-to-b from-brand-bg via-white to-brand-bg" />

            {/* Background Texture (Scattered stamps repeated vertically) */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex flex-col opacity-[0.2]">
                {[0, 1].map((blockIndex) => (
                    <div key={blockIndex} className="relative w-full h-[110vh] shrink-0">
                        {BACKGROUND_STAMPS.map((stamp, index) => (
                            <span
                                key={`stamp-${blockIndex}-${index}`}
                                className={`absolute font-title text-brand-choco leading-none whitespace-nowrap mix-blend-multiply ${stamp.rotate}`}
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
                ))}
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

                {/* Section Header */}
                <FadeIn direction="up" distance={30}>
                    <div className="text-center mb-16 flex flex-col items-center">
                        <h2 className="font-title text-5xl md:text-7xl lg:text-[8rem] text-brand-choco leading-[0.8] mb-8 text-center">
                            PEDIDOS <span className="text-brand-pink block md:inline mt-2 md:mt-0">PERSONALIZADOS</span>
                        </h2>

                        <p className="font-body text-base md:text-lg text-brand-choco text-center max-w-2xl leading-relaxed px-4 mix-blend-color-burn">
                            Diseñamos la torta de tus sueños. Cuéntanos tu visión y la haremos realidad con nuestro sello artesanal.
                        </p>
                    </div>
                </FadeIn>

                {/* Toggle Button CTA */}
                <div className="flex justify-center mb-16">
                    <motion.button
                        layout
                        type="button"
                        onClick={() => setIsInterested(!isInterested)}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: isInterested ? -10 : -8 }}
                        className={`
                            group relative flex items-center overflow-hidden transition-all duration-500
                            bg-brand-choco text-white hover:bg-brand-pink cursor-pointer border border-brand-choco/20
                            ${isInterested
                                ? 'w-16 h-16 md:w-20 md:h-20 rounded-full justify-center p-0 shadow-lg'
                                : 'flex-col justify-center gap-2 w-[80%] max-w-md px-8 md:px-12 py-5 md:py-14 rounded-[2rem] md:rounded-[3rem] shadow-xl hover:shadow-2xl hover:shadow-brand-pink/30'}
                        `}
                        transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
                    >
                        {/* Shimmer / Hover background effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" />

                        <AnimatePresence mode="popLayout">
                            {!isInterested && (
                                <motion.div
                                    layout
                                    className="relative z-10 flex flex-col items-center gap-2 text-center mt-2"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)", transition: { duration: 0.2 } }}
                                >
                                    <span className="font-body text-2xl md:text-3xl uppercase tracking-[0.2em] font-bold">Cuéntanos tu idea</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            layout
                            animate={{ rotate: isInterested ? -180 : 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="shrink-0 z-10"
                        >
                            <div className={`relative p-4 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg ${isInterested ? 'bg-transparent text-white' : 'bg-brand-peach text-brand-choco mt-2'}`}>
                                <ArrowDown size={28} strokeWidth={2} />
                            </div>
                        </motion.div>
                    </motion.button>
                </div>

                {/* Form reveal */}
                <FadeIn direction="down" distance={20} delay={0.1}>
                    <AnimatePresence>
                        {isInterested && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="bg-white/90 backdrop-blur-xl p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-brand-choco/5 border border-white mx-auto relative z-20"
                            >
                                <CustomOrderForm />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </FadeIn>
            </div>
        </section>
    );
};
