'use client';

import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "La torta superó todas nuestras expectativas. No solo era una obra de arte visualmente, sino que el sabor era sublime.",
        author: "Camila E.",
        event: "Boda Botánica"
    },
    {
        quote: "Increíble atención al detalle. Dolce AmoreMio logró capturar la esencia exacta que queríamos para nuestro aniversario.",
        author: "Roberto M.",
        event: "Aniversario"
    },
    {
        quote: "Siempre confío en ellos para mis eventos. Nunca decepcionan, la calidad de los ingredientes se nota en cada bocado.",
        author: "Sofía G.",
        event: "Evento Corporativo"
    }
];

export const SocialProof = () => {
    return (
        <section className="w-full bg-white py-32 px-6">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center">
                
                <motion.h2 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="font-title text-4xl md:text-6xl text-brand-choco mb-20 text-center"
                >
                    Voces de <span className="text-brand-pink">Nuestros Clientes</span>
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full">
                    {testimonials.map((t, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="bg-brand-soft/20 p-8 rounded-[2rem] flex flex-col justify-between"
                        >
                            <p className="font-body text-brand-choco/70 italic text-lg leading-relaxed mb-8">
                                "{t.quote}"
                            </p>
                            
                            <div className="flex flex-col gap-1 border-t border-brand-choco/10 pt-6">
                                <span className="font-title text-2xl text-brand-choco">{t.author}</span>
                                <span className="font-body text-xs text-brand-pink tracking-[0.2em] uppercase">{t.event}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Achievements / Numbers */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-8 pt-24 mt-20 border-t border-brand-choco/10 text-center">
                    <div className="flex flex-col gap-2">
                        <span className="font-title text-5xl text-brand-pink">+1,200</span>
                        <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco/50">Eventos</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-title text-5xl text-brand-pink">+5 Años</span>
                        <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco/50">De Experiencia</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-title text-5xl text-brand-pink">100%</span>
                        <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco/50">Artesanal</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="font-title text-5xl text-brand-pink">+50</span>
                        <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco/50">Recetas Únicas</span>
                    </div>
                </div>

            </div>
        </section>
    );
};
