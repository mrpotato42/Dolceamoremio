'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Minus, Plus, CreditCard, Sparkles } from 'lucide-react';
import { getProductBySlug } from '@/services/productService';
import { type Product, formatPrice } from '@/lib/data/products';
import { useCartStore } from '@/stores/use-cart-store';
import { FadeIn } from '@/components/animations/fade-in';

interface ProductDetailPageProps {
    slug: string;
}

export const ProductDetailPage = ({ slug }: ProductDetailPageProps) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchProduct = async () => {
            const data = await getProductBySlug(slug);
            setProduct(data);
            setLoading(false);
        };
        fetchProduct();
    }, [slug]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-brand-bg">
                <div className="w-12 h-12 border-4 border-brand-choco/10 border-t-brand-pink rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-bg px-6 text-center">
                <h1 className="font-title text-5xl text-brand-choco mb-6">404</h1>
                <p className="font-body text-brand-choco/60 mb-8 max-w-sm">
                    No encontramos la creación que buscas. Tal vez se la llevaron volando...
                </p>
                <Link href="/catalog">
                    <button className="px-8 py-3 bg-brand-choco text-white rounded-full font-body text-xs uppercase tracking-[0.2em] font-bold">
                        Volver al Catálogo
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <main className="w-full min-h-screen bg-brand-bg pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-[1200px] mx-auto">
                <Link href="/catalog" className="inline-flex items-center gap-2 text-brand-choco/50 hover:text-brand-choco mb-12 transition-colors">
                    <ArrowLeft size={16} />
                    <span className="font-body text-xs uppercase tracking-[0.2em] font-bold">Volver al Catálogo</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Visual Section */}
                    <FadeIn direction="right" distance={30}>
                        <div className="relative aspect-4/5 rounded-[2.5rem] overflow-hidden bg-brand-soft/20 group shadow-2xl">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                priority
                            />
                            {/* Subtle light effect over image */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-60 pointer-events-none" />
                        </div>
                    </FadeIn>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <FadeIn direction="left" distance={20} delay={0.2}>
                            <div className="flex flex-col gap-6 mb-10">
                                <div className="flex flex-col gap-2">
                                    <span className="font-body text-xs uppercase tracking-[0.4em] text-brand-pink font-semibold">
                                        {product.category}
                                    </span>
                                    <h1 className="font-title text-5xl md:text-7xl text-brand-choco leading-tight">
                                        {product.name}
                                    </h1>
                                </div>
                                <span className="font-title text-3xl text-brand-choco">
                                    {formatPrice(product.price)}
                                </span>
                                <p className="font-body text-lg text-brand-choco/70 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </FadeIn>

                        {/* Details Grid */}
                        <FadeIn direction="left" distance={20} delay={0.3}>
                            <div className="grid grid-cols-2 gap-8 py-8 border-y border-brand-choco/10 mb-10">
                                <div className="flex items-start gap-4">
                                    <Sparkles className="text-brand-pink shrink-0" size={20} />
                                    <div className="flex flex-col">
                                        <span className="font-body text-xs font-bold text-brand-choco uppercase tracking-wider"><span className="font-number">100%</span> Artesanal</span>
                                        <span className="font-body text-[10px] text-brand-choco/50">Hecho con pasión</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <CreditCard className="text-brand-pink shrink-0" size={20} />
                                    <div className="flex flex-col">
                                        <span className="font-body text-xs font-bold text-brand-choco uppercase tracking-wider">Pago Seguro</span>
                                        <span className="font-body text-[10px] text-brand-choco/50">Varias opciones</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Actions Area */}
                        <FadeIn direction="up" distance={20} delay={0.4}>
                            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                                {/* Quantity Selector */}
                                <div className="flex items-center justify-between border border-brand-choco/20 rounded-xl p-2 min-w-[140px] bg-white/50">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-brand-choco/50 hover:text-brand-choco transition-colors"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="font-number font-bold text-brand-choco">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-brand-choco/50 hover:text-brand-choco transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 group flex items-center justify-center gap-3 bg-brand-choco text-white py-4 px-8 rounded-xl hover:bg-brand-pink transition-all duration-300 shadow-xl hover:shadow-brand-pink/20 active:scale-[0.98]"
                                >
                                    <ShoppingBag size={20} />
                                    <span className="font-body text-xs uppercase tracking-[0.2em] font-bold">
                                        Agregar a la Bolsa
                                    </span>
                                </button>
                            </div>
                        </FadeIn>
                    </div>

                </div>
            </div>
        </main>
    );
};
