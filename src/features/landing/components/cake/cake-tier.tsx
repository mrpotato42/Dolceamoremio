'use client';
import { motion } from 'framer-motion';

interface TierProps {
    level: number;
    color: string;
    sizeClass: string; // Clases de Tailwind para ancho/alto
    marginLeft: string;
    zIndex: number;
    children?: React.ReactNode;
}

export const CakeTier = ({ level, color, sizeClass, marginLeft, zIndex, children }: TierProps) => (
    <motion.div
        initial={{ y: -1000, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
            delay: 0.4 + ((level * 2) - 1) * 0.1, // Lógica inversa para que el de abajo caiga primero
            type: 'spring',
            stiffness: 100,
            damping: 15,
            mass: 2
        }}
        style={{ backgroundColor: color, marginLeft, zIndex }}
        className={`relative -mt-1 border-x-4 border-t-4 border-white shadow-2xl rounded-t-sm ${sizeClass}`}
    >
        {children}
    </motion.div>
);