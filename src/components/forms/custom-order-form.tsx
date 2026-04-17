'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Check, X, ArrowRight } from 'lucide-react';

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

export const CustomOrderForm = () => {
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
    );
};
