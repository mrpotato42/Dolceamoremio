'use client';
import { BackgroundTextures } from '@/features/landing/components/hero/background-textures';
import { FallingCake } from '@/features/landing/components/cake/falling-cake';
import { TEXTURES } from '@/constants/Pastry';
import { FadeIn } from '@/components/animations/fade-in';
import { EditorialGallery } from '@/features/landing/pages/editorial-gallery';
import { Catalog } from '@/features/landing/components/catalog';
import { AboutUs } from '@/features/landing/components/about-us';
import { CustomOrders } from '@/features/landing/components/custom-orders';

export default function Home() {
    return (
        <div className='w-full flex-1 flex flex-col'>
            {/* HERO BLOCK - 100svh flush to viewport */}
            <section className='relative w-full h-svh overflow-hidden flex flex-col'>
                <BackgroundTextures textures={TEXTURES} />

                <FadeIn
                    direction='up'
                    distance={10}
                    delay={1.5}
                    duration={0.3}
                    className='flex-1 w-full px-12 pt-32 pb-16 md:pt-32 md:pb-20 relative z-10 flex flex-col items-center justify-center text-center gap-3'
                >
                    <p className='font-body text-2xl/7 uppercase font-se tracking-[0.5em] text-brand-choco'>
                        reposteria creativa
                    </p>
                    <p className='font-body text-[10px] font-light text-brand-choco/80'>
                        Transformamos tus sueños en dulces realidades
                    </p>
                </FadeIn>

                {/* Pastel anclado al ras de la parte inferior */}
                <div className='relative z-20 w-full flex justify-center'>
                    <FallingCake />
                </div>

                {/* Texto de Apoyo Editorial */}

            </section>

            {/*<AboutUs />*/}

            <section id='coleccion'>
                <EditorialGallery />
            </section>


            <CustomOrders />

            {/* CTA AL CATÁLOGO COMPLETO */}
            <Catalog />

            {/* PRÓXIMOS BLOQUES (Se añadirán después según necesidad) */}
        </div>
    );
}