'use client';

import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CatalogFilters, type CategoryOption } from './catalog-filters';
import { ProductCard } from './product-card';
import { getCategories, getProducts } from '@/services/productService';
import { messageOf } from '@/services/api';
import type { Category, Product } from '@/services/types';

const ALL: CategoryOption = { slug: 'todos', name: 'Todos' };

export const CatalogGrid = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState(ALL.slug);

    useEffect(() => {
        const fetchCatalog = async () => {
            try {
                // Both requests at once — neither depends on the other.
                const [productList, categoryList] = await Promise.all([getProducts(), getCategories()]);
                setProducts(productList);
                setCategories(categoryList);
            } catch (err) {
                setError(messageOf(err));
            } finally {
                setLoading(false);
            }
        };
        fetchCatalog();
    }, []);

    const filterOptions = useMemo(
        () => [ALL, ...categories.map(({ slug, name }) => ({ slug, name }))],
        [categories],
    );

    // Filtering happens here rather than through /products?category= so that
    // switching pills is instant and the layout animation stays smooth.
    const filteredProducts = useMemo(() => {
        if (selectedCategory === ALL.slug) {
            return products;
        }
        return products.filter(product => product.category?.slug === selectedCategory);
    }, [products, selectedCategory]);

    if (loading) {
        return (
            <div className="w-full py-32 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-brand-choco/10 border-t-brand-pink rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full py-32 flex flex-col items-center justify-center text-center px-6">
                <p className="font-body text-xl text-brand-choco/50">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-12">
            <CatalogFilters
                categories={filterOptions}
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
                            key={product.id_product}
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
