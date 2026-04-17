'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CatalogFilters } from './catalog-filters';
import { ProductCard } from './product-card';
import { PRODUCTS, CATEGORIES, type ProductCategory } from '@/lib/data/products';

export const CatalogGrid = () => {
    const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Todos');

    const filteredProducts = useMemo(() => {
        if (selectedCategory === 'Todos') {
            return PRODUCTS;
        }
        return PRODUCTS.filter(product => product.category === selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12">
            <CatalogFilters
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />

            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                            transition={{ duration: 0.4 }}
                        >
                            <ProductCard product={product} index={index} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full py-32 flex flex-col items-center justify-center text-center"
                >
                    <p className="font-body text-xl text-brand-choco/50">
                        Próximamente tendremos productos en esta categoría.
                    </p>
                </motion.div>
            )}
        </div>
    );
};
