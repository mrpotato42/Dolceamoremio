"use client";
import { BackgroundTextures } from '../components/hero/BackgroundTextures';
import { FallingCake } from '../components/cake/FallingCake';
import { TEXTURES } from '../constants/Pastry';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/layout/MainLayout';
import { EditorialGallery } from '../components/EditorialGallery';

export default function Home() {
    return (
        <MainLayout className="p-0!">
            {/* HERO BLOCK - 100dvh flush to viewport */}
            <section className="relative w-full h-dvh overflow-hidden flex flex-col">
                <BackgroundTextures textures={TEXTURES} />

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.3 }}
                    className="flex-1 w-full px-12 pt-32 pb-16 md:pt-32 md:pb-20 relative z-10 flex flex-col items-center justify-center text-center gap-3"
                >
                    <p className="font-body text-2xl/7 uppercase font-se tracking-[0.5em] text-brand-choco">
                        reposteria creativa
                    </p>
                    <p className="font-body text-[10px] font-light text-brand-choco/80">
                        Transformamos tus sueños en dulces realidades
                    </p>
                </motion.div>

                {/* Pastel anclado al ras de la parte inferior */}
                <div className="relative z-20 w-full flex justify-center">
                    <FallingCake />
                </div>

                {/* Texto de Apoyo Editorial */}

            </section>
            <section id="coleccion">
                <EditorialGallery />
            </section>
            {/* PRÓXIMOS BLOQUES (Se añadirán después según necesidad) */}
        </MainLayout>
    );
}