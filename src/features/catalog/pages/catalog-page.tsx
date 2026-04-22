import { CatalogGrid } from '../components/catalog-grid';

export const CatalogPage = () => {
    return (
        <div className="w-full flex-1 flex flex-col pt-32 pb-20">
            {/* Header Section */}
            <div className="w-full text-center px-6 mb-12">
                <h1 className="font-title text-6xl md:text-8xl text-brand-choco mb-6">
                    Catálogo
                </h1>
                <p className="font-body text-sm md:text-base text-brand-choco/60 tracking-[0.2em] uppercase max-w-xl mx-auto">
                    Nuestra selección de repostería artesanal, diseñada con pasión y dedicación para tus mejores momentos.
                </p>
            </div>

            {/* Grid & Filters */}
            <CatalogGrid />
        </div>
    );
};
