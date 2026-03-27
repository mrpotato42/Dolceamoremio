import { ProductInfoCard, ProductInfoCardProps } from '@/features/landing/components/product-info-card';

/** Configuration for each editorial section */
interface EditorialSection {
    /** Background image path (should be a full-width product photo) */
    image: string;
    /** Alt text for the background image */
    alt: string;
    /** Props for the ProductInfoCard */
    product: Omit<ProductInfoCardProps, 'className'>;
}

/** Define your sections here — add or remove as needed */
const SECTIONS: EditorialSection[] = [
    {
        image: '/landing1.JPG',
        alt: 'Selección de cupcakes y brownies artesanales',
        product: {
            title: 'Cupcakes Artesanales',
            description: 'Mini cupcakes decorados a mano con crema de mantequilla y toques de pistacho. Perfectos para cualquier ocasión especial.',
            price: '$45.000',
            position: 'center-right',
        },
    },
    {
        image: '/landing2.JPG',
        alt: 'Postres en vasito con frutos rojos',
        product: {
            title: 'Vasitos de Cheesecake',
            description: 'Cheesecake cremoso servido en vasito con coulis de frutos rojos y crumble de galleta dorada. Un bocado irresistible.',
            price: '$32.000',
            position: 'center-left',
        },
    },
    {
        image: '/landing3.JPG',
        alt: 'Torta personalizada de chocolate y macarons',
        product: {
            title: 'Torta Premium',
            description: 'Torta de vainilla con ganache de chocolate, decorada con macarons artesanales y láminas de oro. Personalizable.',
            price: '$120.000',
            position: 'center-right',
        },
    },
];

export const EditorialGallery = () => {
    return (
        <section className="relative z-20 w-full">
            {SECTIONS.map((section, index) => (
                <div
                    key={index}
                    className="relative w-full h-[85vh] md:h-screen overflow-hidden"
                >
                    {/* Full-bleed background image */}
                    <div className="absolute inset-0">
                        <img
                            src={section.image}
                            alt={section.alt}
                            className="h-full w-full object-cover"
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />

                        {/* Subtle overlay vignette for contrast */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
                    </div>

                    {/* Product info card — positioned via its `position` prop */}
                    <ProductInfoCard
                        title={section.product.title}
                        description={section.product.description}
                        price={section.product.price}
                        position={section.product.position}
                    />
                </div>
            ))}
        </section>
    );
};