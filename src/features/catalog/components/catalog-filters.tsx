import { type ProductCategory } from '@/lib/data/products';

interface CatalogFiltersProps {
    categories: ProductCategory[];
    selectedCategory: ProductCategory;
    onSelectCategory: (category: ProductCategory) => void;
}

export const CatalogFilters = ({ categories, selectedCategory, onSelectCategory }: CatalogFiltersProps) => {
    return (
        <div className="w-full mb-10 md:mb-16">
            <div className="relative">
                {/* Degradado Izquierdo */}
                <div className="absolute left-0 top-0 bottom-0 w-10 md:w-24 z-20 pointer-events-none bg-gradient-to-r from-brand-bg via-brand-bg/80 to-transparent" />

                {/* Degradado Derecho */}
                <div className="absolute right-0 top-0 bottom-0 w-10 md:w-24 z-20 pointer-events-none bg-gradient-to-l from-brand-bg via-brand-bg/80 to-transparent" />

                {/* Contenedor con scroll */}
                <div
                    className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory pb-6 pt-2"
                >
                    <div className="flex items-center gap-3 md:gap-4 px-[calc(50vw-65px)] md:px-12 min-w-max">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={(e) => {
                                    onSelectCategory(category);
                                    e.currentTarget.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'nearest',
                                        inline: 'center'
                                    });
                                }}
                                className={`flex-shrink-0 relative px-6 py-3 md:px-8 md:py-4 rounded-full font-body text-[11px] md:text-xs uppercase tracking-[0.2em] transition-all duration-500 snap-center ${selectedCategory === category
                                    ? 'text-white bg-brand-choco shadow-[0_10px_10px_-2px_rgba(145,74,50,0.9)] scale-105'
                                    : 'text-brand-choco/50 hover:text-brand-choco hover:bg-brand-choco/5'
                                    }`}
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <span className="relative z-10">{category}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
