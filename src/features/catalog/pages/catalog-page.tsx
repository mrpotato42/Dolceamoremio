'use client';

import { motion } from 'framer-motion';
import { CatalogGrid } from '../components/catalog-grid';

export const CatalogPage = () => {
    return (
        <div className="w-full flex-1 flex flex-col pt-32 pb-20">
            {/* Header Section */}
            <div className="w-full text-center px-6 mb-12">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-title text-6xl md:text-8xl text-brand-choco mb-6"
                >
                    Catálogo
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-body text-sm md:text-base text-brand-choco/60 tracking-[0.2em] uppercase max-w-xl mx-auto"
                >
                    Nuestra selección de repostería artesanal, diseñada con pasión y dedicación para tus mejores momentos.
                </motion.p>
            </div>

            {/* Grid & Filters */}
            <CatalogGrid />
        </div>
    );
};
