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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
                {filteredProducts.map((product, index) => (
                    <div key={product.id}>
                        <ProductCard product={product} index={index} />
                    </div>
                ))}
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
