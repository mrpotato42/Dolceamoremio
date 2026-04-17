'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { type Product, formatPrice } from '@/lib/data/products';

interface ProductCardProps {
    product: Product;
    index: number;
}

export const ProductCard = ({ product, index }: ProductCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.6, 
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.1 // Stagger effect
            }}
            className="group flex flex-col h-full"
        >
            <Link href={`/catalog/products/${product.slug}`} className="flex flex-col h-full block cursor-pointer">
                {/* Image Container */}
                <div className="relative w-full aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden bg-brand-soft/20 mb-6 relative">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-brand-choco/0 group-hover:bg-brand-choco/20 transition-colors duration-500" />
                    
                    {/* Badge */}
                    {product.isFeatured && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                            <span className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-choco font-bold">Destacado</span>
                        </div>
                    )}

                    {/* Quick Action Icon */}
                    <div className="absolute bottom-4 right-4 bg-white text-brand-choco w-12 h-12 rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out shadow-lg">
                        <ArrowUpRight size={20} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 justify-between px-2">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-body text-xl md:text-2xl text-brand-choco leading-tight group-hover:text-brand-pink transition-colors duration-300">
                                {product.name}
                            </h3>
                            <span className="font-title text-xl text-brand-choco whitespace-nowrap">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                        <p className="font-body text-sm text-brand-choco/60 line-clamp-2 leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-brand-choco/10">
                        <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco/40">
                            {product.category}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};
