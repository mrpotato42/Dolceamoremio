'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/stores/use-cart-store';
import { CartItem } from './cart-item';
import { formatPrice } from '@/lib/data/products';

export const CartDrawer = () => {
    // Handling hydration mismatch by only rendering after mount
    const [mounted, setMounted] = useState(false);
    const isOpen = useCartStore((state) => state.isOpen);
    const closeCart = useCartStore((state) => state.closeCart);
    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Also close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [closeCart]);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-100"
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-dvh w-full max-w-md bg-brand-bg shadow-2xl z-101 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-brand-choco/10">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-brand-pink" size={20} />
                                <h2 className="font-title text-2xl text-brand-choco mt-1">Tu Orden</h2>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 bg-brand-choco/5 hover:bg-brand-choco/10 rounded-full text-brand-choco transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items Area */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center gap-6 opacity-60">
                                    <ShoppingBag size={48} className="text-brand-choco/30" />
                                    <p className="font-body text-base text-brand-choco">
                                        Tu bolsa visual está vacía.<br />¡Descubre nuestras creaciones!
                                    </p>
                                    <button
                                        onClick={closeCart}
                                        className="font-body text-xs uppercase tracking-[0.2em] font-bold text-brand-pink mt-4 hover:underline"
                                    >
                                        Ir al Catálogo
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {items.map((item) => (
                                        <CartItem key={item.id} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / Checkout CTA */}
                        {items.length > 0 && (
                            <div className="p-6 bg-white border-t border-brand-choco/10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-body text-sm uppercase tracking-[0.2em] text-brand-choco/60">Subtotal</span>
                                    <span className="font-title text-2xl text-brand-choco">{formatPrice(getSubtotal())}</span>
                                </div>
                                <p className="font-body text-xs text-brand-choco/50 mb-6 italic">
                                    Los costos de entrega se calculan en el siguiente paso.
                                </p>

                                <Link href="/checkout" onClick={closeCart}>
                                    <button className="group w-full flex items-center justify-center gap-3 bg-brand-choco text-white py-4 rounded-xl hover:bg-brand-pink transition-colors duration-300">
                                        <span className="font-body text-sm uppercase tracking-[0.2em] font-bold">
                                            Revisar y Pagar
                                        </span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
