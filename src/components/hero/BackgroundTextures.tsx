import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    textures: string[];
}

export const BackgroundTextures = ({ textures }: Props) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % textures.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [textures.length]);

    return (
        <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.4, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 h-full w-full"
                >
                    <img
                        src={textures[index]}
                        className="h-full w-full object-cover grayscale-[20%] contrast-[1.1]"
                        alt="Pastry Texture"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-transparent to-brand-bg/20" />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};