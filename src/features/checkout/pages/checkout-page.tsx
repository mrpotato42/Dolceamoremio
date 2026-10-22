'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/stores/use-cart-store';
import { formatPrice, productImage } from '@/lib/format';
import { createOrder, dateInputToISO } from '@/services/orderService';
import { messageOf } from '@/services/api';
import Image from 'next/image';

export const CheckoutPage = () => {
    const [mounted, setMounted] = useState(false);
    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const clearCart = useCartStore((state) => state.clearCart);
    const cartId = useCartStore((state) => state.cartId);
    const syncCart = useCartStore((state) => state.syncCart);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        // Prices may have changed since the cart was filled; show what the API
        // will actually charge.
        syncCart();
    }, [syncCart]);

    const subtotal = mounted ? getSubtotal() : 0;
    // Display only — mirrors the API's SHIPPING_COST setting. The order's real
    // total is computed by the API and is what gets stored.
    const shipping = 15000;
    const total = subtotal + shipping;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cartId) return;

        const form = new FormData(e.currentTarget);
        const field = (name: string) => String(form.get(name) ?? '').trim();

        setIsSubmitting(true);
        setError(null);
        try {
            await createOrder({
                id_cart: cartId,
                name: field('name'),
                email: field('email'),
                phone1: field('phone1'),
                delivery_address: field('delivery_address'),
                delivery_date: dateInputToISO(field('delivery_date')),
                description_order: field('description_order') || null,
            });
            // The API marked the cart 'converted'; a new one is opened on the
            // next add.
            clearCart();
            setIsSuccess(true);
        } catch (err) {
            setError(messageOf(err));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return <div className="min-h-screen bg-brand-bg relative selection:bg-brand-pink/20 selection:text-brand-choco" />;

    if (isSuccess) {
        return (
            <main className="w-full min-h-screen flex items-center justify-center bg-brand-bg px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white p-12 rounded-4xl shadow-xl flex flex-col items-center text-center"
                >
                    <CheckCircle2 size={64} className="text-green-500 mb-6" />
                    <h1 className="font-title text-4xl text-brand-choco mb-4">¡Orden Recibida!</h1>
                    <p className="font-body text-brand-choco/60 mb-8 leading-relaxed">
                        Gracias por confiar en Dolce AmoreMio. Te hemos enviado un correo con los detalles de tu compra y nos pondremos en contacto pronto.
                    </p>
                    <Link href="/">
                        <button className="px-8 py-3 bg-brand-choco text-white rounded-full font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-pink transition-colors">
                            Volver al Inicio
                        </button>
                    </Link>
                </motion.div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="w-full min-h-screen flex flex-col items-center justify-center bg-brand-bg px-6 text-center">
                <h1 className="font-title text-5xl md:text-7xl text-brand-choco mb-6">Oops...</h1>
                <p className="font-body text-brand-choco/60 mb-8 max-w-md leading-relaxed">
                    Parece que no tienes nada en tu orden todavía. Descubre el arte en cada una de nuestras creaciones.
                </p>
                <Link href="/catalog">
                    <button className="px-8 py-3 bg-brand-choco text-white rounded-full font-body text-xs uppercase tracking-[0.2em] font-bold hover:bg-brand-pink transition-colors">
                        Explorar Catálogo
                    </button>
                </Link>
            </main>
        );
    }

    return (
        <main className="w-full min-h-screen bg-brand-bg relative selection:bg-brand-pink/20 selection:text-brand-choco pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-[1200px] mx-auto">
                <Link href="/catalog" className="inline-flex items-center gap-2 text-brand-choco/50 hover:text-brand-choco mb-8 transition-colors">
                    <ArrowLeft size={16} />
                    <span className="font-body text-xs uppercase tracking-[0.2em] font-bold">Volver atrás</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Left Column: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="col-span-1 lg:col-span-7 flex flex-col"
                    >
                        <h1 className="font-title text-4xl md:text-5xl text-brand-choco mb-10">Checkout</h1>

                        <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-10">
                            {/* Section: Contacto */}
                            <div className="flex flex-col gap-6 p-8 bg-white/50 rounded-4xl border border-brand-choco/5">
                                <h2 className="font-body text-xs uppercase tracking-[0.3em] text-brand-pink font-bold">1. Datos de Contacto</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-body text-sm text-brand-choco/80 font-medium">Nombre completo</label>
                                        <input required name="name" maxLength={150} type="text" className="bg-transparent border-b border-brand-choco/30 py-2 focus:border-brand-pink outline-none transition-colors font-body text-brand-choco placeholder:text-brand-choco/30" placeholder="Ej. Ana García" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-body text-sm text-brand-choco/80 font-medium">Teléfono</label>
                                        <input required name="phone1" maxLength={20} type="tel" className="bg-transparent border-b border-brand-choco/30 py-2 focus:border-brand-pink outline-none transition-colors font-body text-brand-choco placeholder:text-brand-choco/30" placeholder="+57 300 000 0000" />
                                    </div>
                                    <div className="flex flex-col gap-2 md:col-span-2">
                                        <label className="font-body text-sm text-brand-choco/80 font-medium">Correo Electrónico</label>
                                        <input required name="email" type="email" className="bg-transparent border-b border-brand-choco/30 py-2 focus:border-brand-pink outline-none transition-colors font-body text-brand-choco placeholder:text-brand-choco/30" placeholder="ana@ejemplo.com" />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Entrega */}
                            <div className="flex flex-col gap-6 p-8 bg-white/50 rounded-4xl border border-brand-choco/5">
                                <h2 className="font-body text-xs uppercase tracking-[0.3em] text-brand-pink font-bold">2. Entrega</h2>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="font-body text-sm text-brand-choco/80 font-medium">Dirección de envío</label>
                                        <input required name="delivery_address" minLength={5} maxLength={255} type="text" className="bg-transparent border-b border-brand-choco/30 py-2 focus:border-brand-pink outline-none transition-colors font-body text-brand-choco placeholder:text-brand-choco/30" placeholder="Calle 123 #45-67, Apto 801" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-body text-sm text-brand-choco/80 font-medium">Fecha de entrega</label>
                                            <input required name="delivery_date" type="date" className="bg-transparent border-b border-brand-choco/30 py-2 focus:border-brand-pink outline-none transition-colors font-body text-brand-choco/60" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-body text-sm text-brand-choco/80 font-medium">Indicaciones especiales</label>
                                            <input name="description_order" type="text" className="bg-transparent border-b border-brand-choco/30 py-2 focus:border-brand-pink outline-none transition-colors font-body text-brand-choco placeholder:text-brand-choco/30" placeholder="Dejar en portería, cuidado con alergias, etc." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </motion.div>

                    {/* Right Column: Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="col-span-1 lg:col-span-5 sticky top-32"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-brand-choco/5">
                            <h2 className="font-title text-2xl text-brand-choco mb-8">Resumen de Orden</h2>

                            {/* Items */}
                            <div className="flex flex-col gap-6 max-h-[40vh] overflow-y-auto mb-8 pr-2 scrollbar-hide">
                                {items.map(item => (
                                    <div key={item.id_product} className="flex gap-4">
                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                            <Image src={productImage(item.product)} alt={item.product?.name ?? 'Producto'} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col flex-1 text-sm">
                                            <span className="font-body font-medium text-brand-choco">{item.product?.name}</span>
                                            <span className="font-body text-brand-choco/50">Cant: {item.quantity}</span>
                                            <span className="font-title text-brand-choco mt-1 font-bold">
                                                {formatPrice(item.item_subtotal)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col gap-4 border-t border-brand-choco/10 pt-6 mb-8">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-body text-brand-choco/60">Subtotal</span>
                                    <span className="font-body font-medium text-brand-choco">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-body text-brand-choco/60">Envío Local</span>
                                    <span className="font-body font-medium text-brand-choco">{formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-4 border-t border-brand-choco/5">
                                    <span className="font-title text-xl text-brand-choco">Total</span>
                                    <span className="font-title text-2xl text-brand-pink">{formatPrice(total)}</span>
                                </div>
                            </div>

                            {error && (
                                <p role="alert" className="mb-4 px-4 py-3 rounded-xl bg-red-50 font-body text-sm text-red-700">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-brand-choco text-white rounded-xl font-body text-sm uppercase tracking-[0.2em] font-bold hover:bg-brand-pink transition-colors disabled:opacity-70 flex justify-center items-center h-[52px]"
                            >
                                {isSubmitting ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                ) : (
                                    'Confirmar y Pagar'
                                )}
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </main>
    );
};
