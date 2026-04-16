'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '@/components/animations/fade-in';
import { Upload, ArrowRight, X, ImageIcon, Check, ArrowDown } from 'lucide-react';

const OCCASION_OPTIONS = [
    'Cumpleaños',
    'Boda',
    'Baby Shower',
    'Aniversario',
    'Graduación',
    'Primera Comunión',
    'Evento Corporativo',
    'Otro',
];

const GUESTS_OPTIONS = [
    '10 – 20',
    '20 – 50',
    '50 – 100',
    '100+',
];

export const CustomOrders = () => {
    const [isInterested, setIsInterested] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
    const [selectedGuests, setSelectedGuests] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <section id="servicios" className="relative w-full py-32 md:py-40 overflow-hidden">
            {/* Subtle background texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-white to-brand-bg" />
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
                                : 'w-full max-w-md justify-between px-8 md:px-12 py-8 md:py-10 rounded-2xl md:rounded-[2rem]'}
                        `}
                        transition={{ layout: { type: "spring", stiffness: 400, damping: 30 } }}
                    >
                        {/* Shimmer / Hover background effect */}
                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />

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
                                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-16">
                                    {/* ROW 1 — Contact Info: Clean, minimal inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                        <div className="group">
                                            <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-3">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Tu nombre completo"
                                                className="w-full bg-transparent border-b border-brand-choco/50 pb-3 font-body text-base text-brand-choco placeholder:text-brand-choco/40 focus:border-brand-pink focus:outline-none transition-colors duration-300 placeholder:font-sans"
                                            />
                                        </div>
                                        <div className="group">
                                            <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-3">
                                                Correo electronico
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Tu correo electronico"
                                                className="w-full bg-transparent border-b border-brand-choco/50 pb-3 font-body text-base text-brand-choco placeholder:text-brand-choco/40 focus:border-brand-pink focus:outline-none transition-colors duration-300 placeholder:font-sans"
                                                style={{ fontFamily: 'system-ui, sans-serif' }}
                                            />
                                        </div>
                                    </div>

                                    {/* ROW 2 — Date + Occasion: Pill selectors */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <div>
                                            <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-3">
                                                Fecha del evento
                                            </label>
                                            <input
                                                type="date"
                                                className="w-full bg-transparent border-b border-brand-choco/50 pb-3 font-body text-base text-brand-choco/40 focus:border-brand-pink focus:outline-none transition-colors duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-4">
                                                Ocasión
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {OCCASION_OPTIONS.map((option) => (
                                                    <motion.button
                                                        key={option}
                                                        type="button"
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedOccasion(selectedOccasion === option ? null : option)}
                                                        className={`px-4 py-2 rounded-full font-body text-xs tracking-wide transition-all duration-300 border cursor-pointer ${selectedOccasion === option
                                                            ? 'bg-brand-choco text-white border-brand-choco'
                                                            : 'bg-transparent text-brand-choco/80 border-brand-choco/50 hover:border-brand-choco/30 hover:text-brand-choco/80'
                                                            }`}
                                                    >
                                                        {option}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ROW 3 — Guests + Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                        <div>
                                            <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-4">
                                                Invitados
                                            </label>
                                            <div className="flex gap-3">
                                                {GUESTS_OPTIONS.map((option) => (
                                                    <motion.button
                                                        key={option}
                                                        type="button"
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setSelectedGuests(selectedGuests === option ? null : option)}
                                                        className={`flex-1 py-3 rounded-xl font-body text-xs tracking-wide transition-all duration-300 border cursor-pointer ${selectedGuests === option
                                                            ? 'bg-brand-choco text-white border-brand-choco shadow-lg'
                                                            : 'bg-transparent text-brand-choco/80 border-brand-choco/50 hover:border-brand-choco/30'
                                                            }`}
                                                        style={{ fontFamily: 'system-ui, sans-serif' }}
                                                    >
                                                        {option}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-3">
                                                Cuéntanos tu idea
                                            </label>
                                            <textarea
                                                rows={4}
                                                placeholder="Describe el diseño, sabores, colores o temática que imaginas..."
                                                className="w-full bg-transparent border-b border-brand-choco/50 pb-3 font-body text-base text-brand-choco placeholder:text-brand-choco/40 placeholder:font-sans focus:border-brand-pink focus:outline-none transition-colors duration-300 resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* ROW 4 — Image Upload: Editorial style */}
                                    <div>
                                        <label className="block font-body text-[20px] uppercase tracking-[0.3em] text-brand-choco mb-4">
                                            Imagen de referencia
                                        </label>

                                        <AnimatePresence mode="wait">
                                            {imagePreview ? (
                                                <motion.div
                                                    key="preview"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="relative inline-block"
                                                >
                                                    <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-lg group">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Referencia"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-brand-choco/0 group-hover:bg-brand-choco/30 transition-all duration-300" />
                                                        <button
                                                            type="button"
                                                            onClick={removeImage}
                                                            className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer"
                                                        >
                                                            <X size={14} className="text-brand-choco" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Check size={12} className="text-green-600" />
                                                        <span className="font-body text-xs text-brand-choco/50">Imagen cargada</span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.label
                                                    key="upload"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="group flex items-center gap-6 cursor-pointer w-fit"
                                                >
                                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-dashed border-brand-choco/50 flex items-center justify-center group-hover:border-brand-pink group-hover:bg-brand-pink/5 transition-all duration-500">
                                                        <ImageIcon size={24} className="text-brand-choco/50 group-hover:text-brand-pink/60 transition-colors duration-500" />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-body text-sm text-brand-choco/60 group-hover:text-brand-choco transition-colors duration-300">
                                                            Sube una foto de inspiración
                                                        </span>
                                                        <span className="text-[10px] text-brand-choco/70" style={{ fontFamily: 'system-ui, sans-serif' }}>
                                                            JPG, PNG o WEBP · Máx 10 MB
                                                        </span>
                                                    </div>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        accept="image/*"
                                                    />
                                                </motion.label>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* SUBMIT */}
                                    <div className="flex flex-col items-center gap-4 pt-4">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ x: 6 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group inline-flex items-center gap-4 font-body text-md uppercase tracking-[0.25em] text-brand-choco hover:text-brand-pink transition-colors duration-300 cursor-pointer"
                                        >
                                            Solicitar Cotización
                                            <ArrowRight size={16} className="group-hover:translate-x-4 transition-transform duration-300" />
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </FadeIn>
            </div>
        </section>
    );
};
