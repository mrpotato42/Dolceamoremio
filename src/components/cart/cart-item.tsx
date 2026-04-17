'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, type CartItem as CartItemType } from '@/stores/use-cart-store';
import { formatPrice } from '@/lib/data/products';

interface CartItemProps {
    item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    return (
        <div className="flex gap-4 py-6 border-b border-brand-choco/10">
            {/* Image */}
            <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-brand-soft/50">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                        <h4 className="font-body text-base text-brand-choco font-medium leading-tight">
                            {item.name}
                        </h4>
                        <span className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-choco/50 mt-1">
                            {item.category}
                        </span>
                    </div>
                    <button 
                        onClick={() => removeItem(item.id)}
                        className="text-brand-choco/40 hover:text-red-500 transition-colors p-1"
                        aria-label="Eliminar producto"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-brand-soft/30 rounded-full px-3 py-1">
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-brand-choco/60 hover:text-brand-choco transition-colors p-1"
                            disabled={item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="font-body text-sm font-medium text-brand-choco w-4 text-center">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-brand-choco/60 hover:text-brand-choco transition-colors p-1"
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Price */}
                    <span className="font-title text-brand-choco text-lg">
                        {formatPrice(typeof item.price === 'string' 
                            ? (parseInt(item.price.replace(/\D/g, ''), 10) || 0) * item.quantity 
                            : item.price * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    );
};
