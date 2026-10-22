'use client';

import { motion } from 'framer-motion';

/** A filter pill. 'todos' is the pseudo-category that shows everything. */
export interface CategoryOption {
    slug: string;
    name: string;
}

interface CatalogFiltersProps {
    categories: CategoryOption[];
    selectedCategory: string;
    onSelectCategory: (slug: string) => void;
}

export const CatalogFilters = ({ categories, selectedCategory, onSelectCategory }: CatalogFiltersProps) => {
    return (
        <div className="w-full flex justify-center mb-12 md:mb-16">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 max-w-4xl mx-auto">
                {categories.map((category) => (
                    <button
                        key={category.slug}
                        onClick={() => onSelectCategory(category.slug)}
                        className={`relative px-5 py-2.5 md:px-6 md:py-3 rounded-full font-body text-xs md:text-sm uppercase tracking-[0.2em] transition-colors duration-300 ${
                            selectedCategory === category.slug
                                ? 'text-white'
                                : 'text-brand-choco/60 hover:text-brand-choco hover:bg-brand-choco/5'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        {selectedCategory === category.slug && (
                            <motion.div
                                layoutId="active-category-pill"
                                className="absolute inset-0 bg-brand-choco rounded-full origin-center"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                style={{ zIndex: -1 }}
                            />
                        )}
                        <span className="relative z-10">{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
