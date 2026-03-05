import { BackgroundTextures } from '../components/hero/BackgroundTextures';
import { FallingCake } from '../components/cake/FallingCake';
import { TEXTURES } from '../constants/Pastry';
import { MainLayout } from '../components/layout/MainLayout';

export default function Home() {
    return (
        <MainLayout className="p-0!">
            {/* HERO BLOCK - 100dvh flush to viewport */}
            <section className="relative w-full h-dvh overflow-hidden flex flex-col">
                <BackgroundTextures textures={TEXTURES} />

                <div className="flex-1 w-full px-16 relative z-10 flex flex-col items-center justify-center text-center gap-4">
                    <p className="font-body text-2xl/7 text-brand-choco">
                        Transformamos tus sueños en dulces realidades
                    </p>
                    <p className="font-body text-[10px] font-bold uppercase tracking-[0.5em] text-brand-choco/60">
                        respoteria creativa & postres únicos
                    </p>
                </div>

                {/* Pastel anclado al ras de la parte inferior */}
                <div className="relative z-20 w-full flex justify-center">
                    <FallingCake />
                </div>

                {/* Texto de Apoyo Editorial */}

            </section>

            {/* PRÓXIMOS BLOQUES (Se añadirán después según necesidad) */}
        </MainLayout>
    );
}