import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    textures: string[];
}

export const BackgroundTextures = ({ textures }: Props) => {
    const [index, setIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Retraso inicial de las texturas
        const startTimer = setTimeout(() => {
            setIsVisible(true);
        }, 3000);

        // Control de tiempo de cambio de imagen
        const intervalTimer = setInterval(() => {
            setIndex((prev) => (prev + 1) % textures.length);
        }, 8000); // Control de tiempo de cambio de imagen

        return () => {
            clearTimeout(startTimer);
            clearInterval(intervalTimer);
        };
    }, [textures.length]);

    return (
        <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
                {isVisible && (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 1.3 }}
                        animate={{ opacity: 0.4, scale: 1.1 }}
                        exit={{ opacity: 0, scale: 1.4 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        className="absolute inset-0 h-full w-full"
                    >
                        <img
                            src={textures[index]}
                            className="h-full w-full object-cover grayscale-20 contrast-[1.3]"
                            alt="Pastry Texture"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-brand-bg via-transparent to-brand-bg/20" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};