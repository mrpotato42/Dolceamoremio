'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
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
        image: '/landing1.webp',
        alt: 'Selección de cupcakes y brownies artesanales',
        productId: '01',
        focus: '50% 100%',
        zoom: 1,
        product: {
            title: 'Cupcakes Artesanales',
            description: 'Mini cupcakes decorados a mano con crema de mantequilla y toques de pistacho. Perfectos para cualquier ocasión especial.',
            price: '$45.000',
            position: 'bottom-right',
        },
    },
    {
        image: '/landing3.webp',
        alt: 'Postres en vasito con frutos rojos',
        productId: '02',
        focus: '70% 90%',
        zoom: 1,
        product: {
            title: 'Vasitos de Cheesecake',
            description: 'Cheesecake cremoso servido en vasito con coulis de frutos rojos y crumble de galleta dorada. Un bocado irresistible.',
            price: '$32.000',
            position: 'bottom-left',
        },
    },
    {
        image: '/landing2.webp',
        alt: 'Torta personalizada de chocolate y macarons',
        productId: '03',
        focus: '65% 70%',
        zoom: 1.45,
        product: {
            title: 'Torta Premium',
            description: 'Torta de vainilla con ganache de chocolate, decorada con macarons artesanales y láminas de oro. Personalizable.',
            price: '$120.000',
            position: 'bottom-right',
        },
    },
];

/** Component for an individual editorial section with scroll-linked animations */
const EditorialItem = ({ section, index }: { section: EditorialSection; index: number }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect: Image moves slightly slower than the scroll
    const yRange = shouldReduceMotion ? ["0%", "0%"] : ["-50%", "50%"];
    const yImage = useTransform(scrollYProgress, [0, 1], yRange);

    // Zoom effect: Subtle zoom in and out as user scrolls through
    const scaleRange = shouldReduceMotion ? [section.zoom || 1, section.zoom || 1] : [section.zoom || 1.1, (section.zoom || 1.1) * 1.08, section.zoom || 1.1];
    const scaleImage = useTransform(scrollYProgress, [0, 0.5, 1], scaleRange);

    // Fade reveal: Elements fade in and out at the edges of the viewport
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    // Card slide: Card slides up into position
    const yCardRange = shouldReduceMotion ? [0, 0] : [80, 0, -80];
    const yCard = useTransform(scrollYProgress, [0, 0.5, 1], yCardRange);

    // Smooth physics for the parallax and movement
    const smoothYImage = useSpring(yImage, { stiffness: 120, damping: 30, restDelta: 0.001 });
    const smoothYCard = useSpring(yCard, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <motion.div
            ref={sectionRef}
            className="relative w-full h-svh overflow-hidden bg-neutral-100"
            style={{ opacity }}
        >
            {/* Background Image Layer with Parallax */}
            <motion.div
                className="absolute inset-x-0 -top-[15%] h-[130%]"
                style={{
                    y: smoothYImage,
                    scale: scaleImage,
                    transformOrigin: section.focus || 'center'
                }}
            >
                <Image
                    src={section.image}
                    alt={section.alt}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover grayscale-[0.2] hover:grayscale-0 transition-[filter] duration-1000"
                    style={{ objectPosition: section.focus || 'center' }}
                />
                {/* Visual texture/overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
            </motion.div>

            {/* Content Layer */}
            <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ y: smoothYCard }}
            >
                {/* Text Overlay */}
                <div className="absolute top-[25%] md:top-[60%] -translate-y-1/2 left-6 md:left-16 w-[85%] md:w-1/2 max-w-lg text-left flex flex-col items-start">
                    {/* Title outside the box */}
                    <h2 className="w-2/3 text-4xl md:text-6xl font-body text-brand-coral mb-10 tracking-wider drop-shadow-[2px_4px_1px_rgba(0,0,0,0.8)]">
                        {section.product.title}
                    </h2>

                    {/* Description inside a semi-transparent white box */}
                    <div className="w-2/3 p-4 md:p-6 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
                        <p className="text-black/70 text-base md:text-lg font-medium leading-relaxed drop-shadow-md">
                            {section.product.description}
                        </p>
                    </div>
                </div>

                <div className="relative w-full h-full pointer-events-auto">
                    <ProductInfoCard
                        title={section.product.title}
                        description={section.product.description}
                        price={section.product.price}
                        position={section.product.position}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

interface EditorialGalleryProps {
    id?: string;
    className?: string;
}

export const EditorialGallery = ({ id, className = '' }: EditorialGalleryProps) => {
    const galleryRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: galleryRef,
        offset: ["start start", "end end"]
    });

    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section id={id} ref={galleryRef} className={`relative z-20 w-full bg-[#fafafa] ${className}`}>
            {/* Gallery Navigation Progress Bar */}
            {/*<motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-pink to-brand-coral z-50 origin-left"
                style={{ scaleX }}
            />*/}

            {/* Sections */}
            <div className="flex flex-col">
                {SECTIONS.map((section, index) => (
                    <EditorialItem
                        key={`${section.productId}-${index}`}
                        section={section}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};