'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const team = [
    {
        name: 'Valentina Rossi',
        role: 'Chef Pastelera & Fundadora',
        image: '/landing1.webp', // fallback placeholder
    },
    {
        name: 'Mateo Lombardi',
        role: 'Maestro Chocolatero',
        image: '/landing3.webp',
    },
    {
        name: 'Isabella Conti',
        role: 'Directora de Arte',
        image: '/landing2.webp',
    }
];

export const OurTeam = () => {
    return (
        <section className="w-full bg-brand-bg py-32 px-6">
            <div className="max-w-[1200px] mx-auto flex flex-col items-center">
                
                <div className="text-center mb-20">
                    <motion.span 
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-body text-xs uppercase tracking-[0.4em] text-brand-pink font-semibold block mb-4"
                    >
                        Manos Creadoras
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-title text-5xl md:text-7xl text-brand-choco"
                    >
                        El Equipo Humano
                    </motion.h2>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8">
                    {team.map((member, index) => (
                        <motion.div 
                            key={member.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.1 * index }}
                            className="flex flex-col items-center group cursor-pointer"
                        >
                            <div className="relative w-full max-w-[300px] aspect-3/4 mb-8 overflow-hidden rounded-4xl bg-brand-soft">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-brand-choco/20 mix-blend-multiply group-hover:opacity-0 transition-opacity duration-500" />
                            </div>
                            
                            <h3 className="font-title text-3xl text-brand-choco mb-2">{member.name}</h3>
                            <p className="font-body text-sm text-brand-choco/60 uppercase tracking-[0.2em]">{member.role}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};
