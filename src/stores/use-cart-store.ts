import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/data/products';

export interface CartItem extends Product {
    quantity: number;
    specialInstructions?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    // Actions
    addItem: (product: Product, quantity?: number, instructions?: string) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    // UI Logic
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    // Getter/Computed Simulation
    getTotalItems: () => number;
    getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1, instructions = '') => {
                set((state) => {
                    const existingItemIndex = state.items.findIndex(item => item.id === product.id);
                    
                    if (existingItemIndex >= 0) {
                        // Update existing item
                        const newItems = [...state.items];
                        newItems[existingItemIndex].quantity += quantity;
                        if (instructions) {
                            newItems[existingItemIndex].specialInstructions = instructions;
                        }
                        return { items: newItems, isOpen: true }; // Auto-open cart on add
                    }
                    
                    // Add new item
                    return { 
                        items: [...state.items, { ...product, quantity, specialInstructions: instructions }],
                        isOpen: true // Auto-open cart on add
                    };
                });
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter(item => item.id !== productId)
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => ({
                    items: state.items.map(item => 
                        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
                    )
                }));
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => {
                    // For the sake of mock data, if price is a string like "Desde 450.000", 
                    // we'll parse it out or ignore it in math for now if it fails.
                    const numericPrice = typeof item.price === 'string' 
                        ? parseInt(item.price.replace(/\D/g, ''), 10) || 0 
                        : item.price;
                        
                    return total + (numericPrice * item.quantity);
                }, 0);
            }
        }),
        {
            name: 'dolce-amore-mio-cart', // key in local storage
            partialize: (state) => ({ items: state.items }), // Only persist items, not isOpen state
        }
    )
);
