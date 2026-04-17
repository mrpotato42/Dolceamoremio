'use client';

import { motion } from 'framer-motion';

const values = [
    { title: 'Pasión', description: 'Cada detalle cuenta al crear nuestras obras.' },
    { title: 'Calidad', description: 'Ingredientes premium seleccionados a mano.' },
    { title: 'Innovación', description: 'Sabores y texturas que sorprenden el paladar.' },
    { title: 'Arte', description: 'Postres que son verdaderas esculturas comestibles.' },
];

export const MissionVision = () => {
    return (
        <section className="w-full bg-brand-choco text-white py-32 px-6">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
                
                {/* Mission / Vision */}
                <div className="flex flex-col gap-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col gap-4"
                    >
                        <h3 className="font-title text-4xl md:text-5xl text-brand-pink">Misión</h3>
                        <p className="font-body text-base md:text-lg text-white/70 leading-relaxed font-light">
                            Crear momentos de felicidad inolvidables a través de la repostería de autor, donde la técnica impecable y la calidez del hogar se unen en cada bocado para transformar una celebración en una obra de arte.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-col gap-4"
                    >
                        <h3 className="font-title text-4xl md:text-5xl text-brand-pink">Visión</h3>
                        <p className="font-body text-base md:text-lg text-white/70 leading-relaxed font-light">
                            Ser el referente líder en pastelería boutique, expandiendo nuestra magia a nivel nacional sin perder nuestra esencia artesanal ni nuestro compromiso inquebrantable con el detalle.
                        </p>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <div className="flex flex-col gap-8">
                    <motion.h3 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="font-body text-xs uppercase tracking-[0.4em] text-brand-soft mb-4"
                    >
                        Nuestros Valores
                    </motion.h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {values.map((v, i) => (
                            <motion.div 
                                key={v.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: 0.1 * i }}
                                className="flex flex-col gap-2 p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-colors duration-300"
                            >
                                <span className="font-title text-3xl text-brand-pink">{v.title}</span>
                                <span className="font-body text-sm text-white/60 leading-relaxed">{v.description}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
