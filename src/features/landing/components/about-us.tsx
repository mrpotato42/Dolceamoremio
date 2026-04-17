import { motion } from 'framer-motion';
import { FadeIn } from '@/components/animations/fade-in';

export const AboutUs = () => {
    return (
        <section id="sobre-nosotros" className="w-full bg-white py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Content side */}
                <div className="flex flex-col gap-12">
                    <FadeIn direction="left" distance={30} delay={0.4}>
                        <div className="flex flex-col gap-4">
                            <span className="font-body text-xs uppercase tracking-[0.4em] text-brand-pink font-semibold">Nuestra Esencia</span>
                            <h2 className="font-body text-4xl md:text-5xl lg:text-6xl text-brand-choco leading-tight">Dolce AmoreMio</h2>
                        </div>
                    </FadeIn>

                    <div className="flex flex-col gap-10">
                        {/* History */}
                        <FadeIn direction="left" distance={20} delay={0.6}>
                            <div className="flex flex-col gap-3">
                                <h3 className="font-body text-lg uppercase tracking-wider text-brand-choco/80 font-medium">Nuestra Historia</h3>
                                <p className="font-body text-brand-choco/60 leading-relaxed text-sm md:text-base italic">
                                    "Un pequeño sueño que nació entre harinas y azúcares, Dolce AmoreMio ha evolucionado de una cocina familiar a un referente de la repostería creativa, donde cada receta guarda un secreto y cada técnica cuenta una historia de pasión artesanal."
                                </p>
                            </div>
                        </FadeIn>

                        {/* Mission */}
                        <FadeIn direction="left" distance={20} delay={0.7}>
                            <div className="flex flex-col gap-3">
                                <h3 className="font-body text-lg uppercase tracking-wider text-brand-choco/80 font-medium">Misión</h3>
                                <p className="font-body text-brand-choco/70 leading-relaxed text-sm md:text-base">
                                    Crear momentos de felicidad inolvidables a través de la repostería de autor, donde la técnica impecable y la calidez del hogar se unen en cada bocado para transformar una celebración en una obra de arte.
                                </p>
                            </div>
                        </FadeIn>

                        {/* Values grid */}
                        <FadeIn direction="left" distance={20} delay={0.8}>
                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-brand-choco/10">
                                <div className="flex flex-col gap-1">
                                    <span className="font-body text-sm font-bold text-brand-choco">Pasión</span>
                                    <span className="font-body text-xs text-brand-choco/50">Cada detalle cuenta</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-body text-sm font-bold text-brand-choco">Calidad</span>
                                    <span className="font-body text-xs text-brand-choco/50">Ingredientes premium</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-body text-sm font-bold text-brand-choco">Innovación</span>
                                    <span className="font-body text-xs text-brand-choco/50">Sabores que sorprenden</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-body text-sm font-bold text-brand-choco">Arte</span>
                                    <span className="font-body text-xs text-brand-choco/50">Postres que son esculturas</span>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
};
