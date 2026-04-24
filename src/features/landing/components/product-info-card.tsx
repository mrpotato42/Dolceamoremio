import { useState } from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

export interface ProductInfoCardProps {
    title: string;
    price: string;
    description: string;
    /** Where to position the card within its parent container */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-left' | 'center-right';
    className?: string;
    onAdd?: (quantity: number) => void;
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
    title,
    description,
    price,
    position = 'bottom-right',
    className = '',
    onAdd,
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
                    onClick={() => onAdd?.(quantity)}
                    className="group relative w-full flex items-center justify-center gap-2 bg-brand-choco text-white py-2.5 md:py-3 px-4 rounded-xl overflow-hidden transition-all duration-500 hover:bg-brand-pink hover:translate-y-[-2px] active:scale-95 shadow-lg"
                >
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                    <ShoppingBag size={15} className="relative z-10 shrink-0" />
                    <span className="relative z-10 font-body text-[10px] md:text-xs uppercase tracking-[0.15em] md:tracking-[0.2em] font-bold whitespace-nowrap">
                        Agregar a la bolsa
                    </span>
                </button>
            </div>
        </div>
    );
};
