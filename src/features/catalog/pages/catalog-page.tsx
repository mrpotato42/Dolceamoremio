'use client';

/**
 * Catalog Page Component
 * Centralizing all product display and filtering logic for the store.
 */
export const CatalogPage = () => {
    return (
        <div className="w-full flex-1 flex flex-col items-center justify-center py-40 md:py-60 px-6 text-center">
            <h1 className="font-title text-7xl md:text-9xl text-brand-choco mb-6">Catálogo</h1>
            <p className="font-body text-sm md:text-base text-brand-choco/60 tracking-[0.3em] uppercase">Estamos preparando nuestra vitrina digital completa</p>
            
            <div className="mt-20 w-4 h-[20vh] bg-brand-pink/20 rounded-full animate-bounce" />
        </div>
    );
};
