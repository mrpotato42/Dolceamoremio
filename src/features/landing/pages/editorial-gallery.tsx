import { ProductInfoCard, ProductInfoCardProps } from '@/features/landing/components/product-info-card';

/** Configuration for each editorial section */
interface EditorialSection {
    /** Background image path (should be a full-width product photo) */
    image: string;
    /** Alt text for the background image */
    alt: string;
    /** ID of the product */
    productId: string;
    /** 
     * Focus of the image. 
     * Controls which part of the photo stays visible when cropping. 
     * Typical: 'center', 'top', 'bottom', or percentages like '50% 20%'
     */
    focus?: string;
    /** 
     * Amount to enlarge the image (zoom). 
     * 1.0 is original size, > 1 increases the zoom. 
     */
    zoom?: number;
    /** Props for the ProductInfoCard */
    product: Omit<ProductInfoCardProps, 'className' | 'productId'>;
}

/** Define your sections here — add or remove as needed */
const SECTIONS: EditorialSection[] = [
    {
        image: '/landing1.JPG',
        alt: 'Selección de cupcakes y brownies artesanales',
        productId: '01',
        focus: '50% 100%', // Focused on the top half to see the cupcakes
        zoom: 1,        // Moderate zoom to focus on detail
        product: {
            title: 'Cupcakes Artesanales',
            description: 'Mini cupcakes decorados a mano con crema de mantequilla y toques de pistacho. Perfectos para cualquier ocasión especial.',
            price: '$45.000',
            position: 'bottom-right',
        },
    },
    {
        image: '/landing3.JPG',
        alt: 'Postres en vasito con frutos rojos',
        productId: '02',
        focus: '50% 75%',    // Perfectly centered
        zoom: 1.5,         // Subtle zoom
        product: {
            title: 'Vasitos de Cheesecake',
            description: 'Cheesecake cremoso servido en vasito con coulis de frutos rojos y crumble de galleta dorada. Un bocado irresistible.',
            price: '$32.000',
            position: 'bottom-left',
        },
    },
    {
        image: '/landing2.JPG',
        alt: 'Torta personalizada de chocolate y macarons',
        productId: '03',
        focus: '70% 80%', // Focused on the cake area
        zoom: 1.45,        // Higher zoom for the main cake
        product: {
            title: 'Torta Premium',
            description: 'Torta de vainilla con ganache de chocolate, decorada con macarons artesanales y láminas de oro. Personalizable.',
            price: '$120.000',
            position: 'bottom-right',
        },
    },
];

export const EditorialGallery = () => {
    return (
        <section className="relative z-20 w-full">
            {SECTIONS.map((section, index) => (
                <div
                    key={index}
                    className="relative w-full h-[65vh] md:h-screen overflow-hidden"
                >
                    {/* Full-bleed background image with adjustable focus and zoom */}
                    <div className="absolute inset-0">
                        <img
                            src={section.image}
                            alt={section.alt}
                            className="h-full w-full object-cover transition-transform duration-700"
                            style={{
                                objectPosition: section.focus || 'center',
                                transform: `scale(${section.zoom || 1})`,
                                transformOrigin: section.focus || 'center'
                            }}
                            loading={index === 0 ? 'eager' : 'lazy'}
                        />
                    </div>

                    {/* Product info card — positioned via its `position` prop */}
                    <ProductInfoCard
                        productId={section.productId}
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