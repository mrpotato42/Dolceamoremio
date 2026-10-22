'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore, MAX_LINE_QUANTITY, type CartItem as CartItemType } from '@/stores/use-cart-store';
import { formatPrice, productImage } from '@/lib/format';

interface CartItemProps {
    item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const isSyncing = useCartStore((state) => state.isSyncing);
    const name = item.product?.name ?? 'Producto';

    return (
        <div className="flex gap-4 py-6 border-b border-brand-choco/10">
            {/* Image */}
            <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-brand-soft/50">
                <Image
                    src={productImage(item.product)}
                    alt={name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between flex-1">
                <div className="flex justify-between items-start gap-2">
                    <div className="flex flex-col">
                        <h4 className="font-body text-base text-brand-choco font-medium leading-tight">
                            {name}
                        </h4>
                        <span className="font-body text-[10px] uppercase tracking-[0.2em] text-brand-choco/50 mt-1">
                            {item.product?.category?.name}
                        </span>
                    </div>
                    <button 
                        onClick={() => removeItem(item.id_product)}
                        disabled={isSyncing}
                        className="text-brand-choco/40 hover:text-red-500 transition-colors p-1 disabled:opacity-40"
                        aria-label="Eliminar producto"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-brand-soft/30 rounded-full px-3 py-1">
                        <button 
                            onClick={() => updateQuantity(item.id_product, item.quantity - 1)}
                            className="text-brand-choco/60 hover:text-brand-choco transition-colors p-1 disabled:opacity-40"
                            disabled={isSyncing || item.quantity <= 1}
                        >
                            <Minus size={14} />
                        </button>
                        <span className="font-body text-sm font-medium text-brand-choco w-4 text-center">
                            {item.quantity}
                        </span>
                        <button 
                            onClick={() => updateQuantity(item.id_product, item.quantity + 1)}
                            className="text-brand-choco/60 hover:text-brand-choco transition-colors p-1 disabled:opacity-40"
                            disabled={isSyncing || item.quantity >= MAX_LINE_QUANTITY}
                        >
                            <Plus size={14} />
                        </button>
                    </div>

                    {/* Price */}
                    <span className="font-title text-brand-choco text-lg">
                        {formatPrice(item.item_subtotal)}
                    </span>
                </div>
            </div>
        </div>
    );
};
