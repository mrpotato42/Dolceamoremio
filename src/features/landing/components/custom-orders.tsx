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

export const CustomOrders = ({ id = "servicios", className = '' }: CustomOrdersProps) => {
    const [isInterested, setIsInterested] = useState(false);

    return (
        <section id={id} className={`relative w-full py-32 md:py-40 overflow-hidden ${className}`}>
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-linear-to-b from-brand-bg via-white to-brand-bg" />
            <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--color-brand-choco) 1px, transparent 0)', backgroundSize: '48px 48px' }} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">

                {/* Section Header */}
                <FadeIn direction="up" distance={30}>
                    <div className="text-center mb-20 md:mb-28">
                        <h2 className="font-body text-4xl md:text-6xl text-brand-choco mt-4 leading-tight">
                            Pedidos Personalizados
                        </h2>
                        <div className="w-16 h-px bg-brand-pink mx-auto mt-6" />
                        <p className="font-body text-sm text-brand-choco/50 mt-6 max-w-lg mx-auto leading-relaxed">
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
                        whileHover={{ y: isInterested ? -36 : -4 }}
                        className={`
                            group relative flex items-center overflow-hidden transition-colors duration-500
                            bg-brand-choco text-white hover:bg-brand-pink cursor-pointer
                            ${isInterested
                                ? 'w-16 h-16 md:w-20 md:h-20 rounded-full justify-center p-0'
                                : 'w-full max-w-md justify-between px-8 md:px-12 py-8 md:py-10 rounded-2xl md:rounded-4xl'}
                        `}
                        transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
                    >
                        {/* Shimmer / Hover background effect */}
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />

                        <AnimatePresence mode="popLayout">
                            {!isInterested && (
                                <motion.div
                                    layout
                                    className="relative z-10 flex flex-col items-start gap-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)", transition: { duration: 0.2 } }}
                                >
                                    <span className="font-body text-[10px] md:text-xs uppercase tracking-[0.4em] opacity-60">Tu visión, nuestro arte</span>
                                    <span className="font-body text-xl md:text-2xl uppercase tracking-[0.2em] font-bold">Cuéntanos tu idea</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div
                            layout
                            animate={{ rotate: isInterested ? -180 : 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="shrink-0 z-10"
                        >
                            <div className={`relative p-4 rounded-full flex items-center justify-center transition-all duration-500 ${isInterested ? 'bg-brand-choco text-white' : 'bg-white text-brand-choco'}`}>
                                <ArrowDown size={24} strokeWidth={2.5} />
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
