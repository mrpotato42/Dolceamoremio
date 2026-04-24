'use client';
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [centeredIndex, setCenteredIndex] = useState(0);

    // Reset center index when category changes
    useEffect(() => {
        setCenteredIndex(0);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [selectedCategory]);

    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const centerScrollPosition = container.scrollLeft + container.clientWidth / 2;

        let minDiff = Infinity;
        let closestIndex = 0;

        const children = container.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            const childCenter = child.offsetLeft + child.offsetWidth / 2;

            const diff = Math.abs(childCenter - centerScrollPosition);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }

        setCenteredIndex((prev) => prev === closestIndex ? prev : closestIndex);
    }, []);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-12 pb-4 md:pb-12">
            <CatalogFilters
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
            />
            {/* Pagination dots (Mobile only) */}
            {filteredProducts.length > 1 && (
                <div className="flex justify-center items-center h-3 mb-5 mt-6 md:hidden">
                    {filteredProducts.map((_, i) => {
                        const distance = Math.abs(i - centeredIndex);
                        const isVisible = distance <= 1;
                        const isFocus = distance === 0;

                        return (
                            <div
                                key={i}
                                className={`transition-all duration-300 rounded-full bg-brand-choco ${isFocus ? 'w-2 h-2 opacity-100 mx-1' :
                                    isVisible ? 'w-1.5 h-1.5 opacity-40 mx-1' :
                                        'w-0 h-0 opacity-0 mx-0'
                                    }`}
                            />
                        );
                    })}
                </div>
            )}
            <div className="relative -mx-6 md:mx-0">

                {/* Degradados laterales para mobile */}
                <div className="absolute left-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-r from-brand-bg to-transparent md:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-12 z-20 pointer-events-none bg-gradient-to-l from-brand-bg to-transparent md:hidden" />

                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex relative md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 md:gap-x-8 md:gap-y-16 px-6 md:px-0"
                >
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
