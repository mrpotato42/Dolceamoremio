'use client';
import { useState, useMemo } from 'react';
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

            <div className="relative -mx-6 md:mx-0">
                {/* Degradados laterales para mobile */}
                <div className="absolute left-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-r from-brand-bg to-transparent md:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-l from-brand-bg to-transparent md:hidden" />

                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 md:gap-x-8 md:gap-y-16 px-6 md:px-0 pb-12">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className="min-w-[80vw] sm:min-w-[300px] md:min-w-0 snap-center"
                        >
                            <ProductCard product={product} index={index} />
                        </div>
                    ))}
                </div>
            </div>

            {filteredProducts.length === 0 && (
                <div className="w-full py-32 flex flex-col items-center justify-center text-center">
                    <p className="font-body text-xl text-brand-choco/50">
                        Próximamente tendremos productos en esta categoría.
                    </p>
                </div>
            )}
        </div>
    );
};
