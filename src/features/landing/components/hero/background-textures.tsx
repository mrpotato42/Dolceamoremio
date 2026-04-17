'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    textures: string[];
}

export const BackgroundTextures = ({ textures }: Props) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // Control de tiempo de cambio de imagen
        const intervalTimer = setInterval(() => {
            setIndex((prev) => (prev + 1) % textures.length);
        }, 5000);

        return () => {
            clearInterval(intervalTimer);
        };
    }, [textures.length]);

    return (
        <div className='absolute inset-0 z-0 bg-brand-bg'>
            {textures.map((texture, i) => (
                <motion.div
                    key={texture}
                    initial={{ opacity: 0, scale: 1.3 }}
                    animate={{
                        opacity: index === i ? 0.6 : 0,
                        scale: index === i ? 1.1 : 1.4,
                        zIndex: index === i ? 10 : 0
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeInOut',
                        delay: i === 0 && index === 0 ? 0.5 : 0 // Retraso de 500ms solo al inicio de carga para la primera
                    }}
                    className='absolute inset-0 h-full w-full pointer-events-none'
                >
                    <Image
                        src={texture}
                        alt={`Pastry Texture ${i + 1}`}
                        fill
                        priority={i === 0} // La imagen 0 siempre tendrá priority y fetchpriority="high" en el payload inicial
                        sizes="100vw"
                        className='object-cover grayscale-20 contrast-130'
                    />
                    <div className='absolute inset-0 bg-linear-to-b from-brand-bg via-transparent to-transparent opacity-80' />
                </motion.div>
            ))}
        </div>
    );
};