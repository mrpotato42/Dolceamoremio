'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { type Product, formatPrice } from '@/lib/data/products';
import { useCartStore } from '@/stores/use-cart-store';
import { FadeIn } from '@/components/animations/fade-in';

interface ProductViewProps {
    product: Product;
}

export const ProductView = ({ product }: ProductViewProps) => {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleIncrease = () => setQuantity((prev) => prev + 1);
    const handleDecrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addItem(product, quantity);
    };

    return (
        <section className="w-full min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-24">
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-brand-choco/50 hover:text-brand-choco mb-12 transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-body text-xs uppercase tracking-[0.2em] font-bold">Volver al Catálogo</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Left Side: Image */}
                    <FadeIn direction="left" distance={40}>
                        <div className="relative aspect-4/5 rounded-4xl overflow-hidden bg-brand-soft/20 shadow-2xl">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            {product.isFeatured && (
                                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full">
                                    <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco font-bold">Edición Especial</span>
                                </div>
                            )}
                        </div>
                    </FadeIn>

                    {/* Right Side: Content */}
                    <div className="flex flex-col">
                        <FadeIn direction="up" distance={20} delay={0.2}>
                            <div className="flex flex-col gap-2 mb-8">
                                <span className="font-body text-xs uppercase tracking-[0.4em] text-brand-pink font-semibold">
                                    {product.category}
                                </span>
                                <h1 className="font-title text-5xl md:text-7xl lg:text-8xl text-brand-choco leading-tight">
                                    {product.name}
                                </h1>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" distance={20} delay={0.3}>
                            <div className="flex flex-col gap-6 mb-12 py-8 border-y border-brand-choco/10">
                                <span className="font-title text-4xl text-brand-choco">
                                    {formatPrice(product.price)}
                                </span>
                                <p className="font-body text-brand-choco/60 text-lg leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn direction="up" distance={20} delay={0.4}>
                            <div className="flex flex-col gap-8">
                                {/* Quantity Picker */}
                                <div className="flex flex-col gap-4">
                                    <span className="font-body text-xs uppercase tracking-[0.2em] text-brand-choco/40 font-bold">
                                        Cantidad
                                    </span>
                                    <div className="flex items-center gap-6 bg-white border border-brand-choco/10 w-fit px-6 py-4 rounded-2xl shadow-sm">
                                        <button
                                            onClick={handleDecrease}
                                            className="text-brand-choco/50 hover:text-brand-choco transition-colors p-1"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="font-body text-xl font-bold text-brand-choco w-8 text-center">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={handleIncrease}
                                            className="text-brand-choco/50 hover:text-brand-choco transition-colors p-1"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Add to Cart Action */}
                                <button
                                    onClick={handleAddToCart}
                                    className="group relative flex items-center justify-center gap-4 bg-brand-choco text-white py-6 px-12 rounded-2xl md:rounded-3xl overflow-hidden transition-all duration-500 hover:bg-brand-pink hover:translate-y-[-4px] active:scale-95 shadow-xl"
                                >
                                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                                    <ShoppingBag size={22} className="relative z-10" />
                                    <span className="relative z-10 font-body text-sm md:text-base uppercase tracking-[0.2em] font-bold">
                                        Agregar a la bolsa
                                    </span>
                                </button>

                                {/* Features / Trust items */}
                                <div className="grid grid-cols-2 gap-6 mt-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-soft/30 flex items-center justify-center">
                                            <span className="text-brand-choco text-lg">✨</span>
                                        </div>
                                        <span className="font-body text-xs text-brand-choco/60">Hecho a mano</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand-soft/30 flex items-center justify-center">
                                            <span className="text-brand-choco text-lg">🌿</span>
                                        </div>
                                        <span className="font-body text-xs text-brand-choco/60">Ingredientes Fresh</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
};
