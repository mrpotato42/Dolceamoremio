'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

export interface ProductInfoCardProps {
    productId: string;
    title: string;
    description: string;
    price: string;
    /** Where to position the card within its parent container */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
    className?: string;
}

const positionClasses: Record<NonNullable<ProductInfoCardProps['position']>, string> = {
    'top-left': 'top-6 left-6 md:top-10 md:left-10',
    'top-right': 'top-6 right-6 md:top-10 md:right-10',
    'bottom-left': 'bottom-6 left-6 md:bottom-10 md:left-10',
    'bottom-right': 'bottom-6 right-6 md:bottom-10 md:right-10',
    'center-left': 'top-1/2 left-6 -translate-y-1/2 md:left-10',
    'center-right': 'top-1/2 right-6 -translate-y-1/2 md:right-10',
};

export const ProductInfoCard = ({
    productId,
    title,
    description,
    price,
    position = 'bottom-right',
    className = '',
}: ProductInfoCardProps) => {
    const [quantity, setQuantity] = useState(1);

    const increment = () => setQuantity((q) => q + 1);
    const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

    return (
        <div
            className={`
                absolute z-10 ${positionClasses[position]}
                w-[230px] md:w-[310px]
                backdrop-blur-xl bg-white/85
                border border-white/50
                rounded-2xl
                shadow-[0_8px_40px_rgba(145,74,50,0.12),0_2px_12px_rgba(145,74,50,0.06)]
                overflow-hidden
                ${className}
            `}
        >


            <div className="p-4 md:p-5 flex flex-col gap-3">
                {/* Title */}
                <h3 className="font-subtitle text-lg md:text-xl text-brand-choco leading-tight">
                    {title}
                </h3>

                {/* Description acting as a Link */}
                <Link
                    href={`/producto/${productId}`}
                    className="group/desc block"
                >
                    <p className="font-body text-[11px] md:text-xs leading-relaxed text-brand-choco/65 line-clamp-2 transition-colors group-hover/desc:text-brand-pink">
                        {description}
                    </p>
                </Link>

                {/* Price + Quantity row (No divider to save space) */}
                <div className="flex items-center justify-between mt-1">
                    {/* Price */}
                    <span className="font-subtitle text-base md:text-lg tracking-wide text-brand-choco font-semibold">
                        {price}
                    </span>

                    {/* Quantity selector */}
                    <div className="flex items-center gap-0 rounded-lg border border-brand-choco/12 overflow-hidden bg-white/50">
                        <button
                            onClick={decrement}
                            aria-label="Disminuir cantidad"
                            className="group/minus flex items-center justify-center w-7 h-7 text-brand-choco/60 hover:bg-brand-pink/10 hover:text-brand-pink transition-all duration-200"
                        >
                            <Minus size={12} strokeWidth={2} />
                        </button>
                        <span className="flex items-center justify-center w-7 h-7 font-subtitle text-xs text-brand-choco select-none">
                            {quantity}
                        </span>
                        <button
                            onClick={increment}
                            aria-label="Aumentar cantidad"
                            className="group/plus flex items-center justify-center w-7 h-7 text-brand-choco/60 hover:bg-brand-pink/10 hover:text-brand-pink transition-all duration-200"
                        >
                            <Plus size={12} strokeWidth={2} />
                        </button>
                    </div>
                </div>

                {/* Add to cart button */}
                <button
                    className="
                        group/cart relative w-full flex items-center justify-center gap-2
                        py-2.5 rounded-xl
                        bg-linear-to-r from-brand-pink to-brand-coral
                        text-white font-body text-[10px] md:text-[11px] uppercase tracking-[0.15em]
                        overflow-hidden
                        transition-shadow duration-300
                        hover:shadow-[0_4px_15px_rgba(235,93,141,0.3)]
                        active:scale-[0.98]
                    "
                >
                    {/* Shimmer effect */}
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/cart:translate-x-full transition-transform duration-700 ease-in-out" />

                    <span className="relative z-10">Agregar al pedido</span>
                    <ShoppingBag size={14} strokeWidth={1.8} className="relative mb-px z-10 transition-transform duration-300 group-hover/cart:-translate-y-0.5" />
                </button>
            </div>
        </div>
    );
};
