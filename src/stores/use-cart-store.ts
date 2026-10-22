import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ApiError, messageOf } from '@/services/api';
import * as cartService from '@/services/cartService';
import type { Cart, CartItem, Product } from '@/services/types';
import { toNumber } from '@/lib/format';

export type { CartItem };

/** Mirrors the API's per-line ceiling (CartItemAdd / CartItemUpdate, le=100). */
export const MAX_LINE_QUANTITY = 100;

/**
 * The cart lives on the server (POST /carts). The browser only remembers which
 * cart is its own — `cartId` is the one thing persisted to localStorage — and
 * `items` is a copy of the last cart the API returned.
 */
interface CartState {
    cartId: string | null;
    items: CartItem[];
    isOpen: boolean;
    /** A request to the API is in flight — UI disables cart controls meanwhile. */
    isSyncing: boolean;
    error: string | null;
    // Actions
    syncCart: () => Promise<void>;
    addItem: (product: Product, quantity?: number, instructions?: string) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    /** Forget the cart locally — after checkout the API has already closed it. */
    clearCart: () => void;
    // UI Logic
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    // Getter/Computed Simulation
    getTotalItems: () => number;
    getSubtotal: () => number;
}

const clamp = (quantity: number) => Math.min(Math.max(1, quantity), MAX_LINE_QUANTITY);

/** 404: the cart no longer exists. 409: it is no longer active (already ordered). */
const isStaleCart = (error: unknown) =>
    error instanceof ApiError && (error.status === 404 || error.status === 409);

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => {
            // Shared while a cart is being created, so two quick "add" clicks
            // on an empty bag do not open two carts.
            let creatingCart: Promise<string> | null = null;

            const ensureCartId = async (): Promise<string> => {
                const { cartId } = get();
                if (cartId) return cartId;

                creatingCart ??= cartService
                    .createCart()
                    .then((cart) => {
                        set({ cartId: cart.id_cart, items: cart.items });
                        return cart.id_cart;
                    })
                    .finally(() => {
                        creatingCart = null;
                    });
                return creatingCart;
            };

            const forgetCart = () => set({ cartId: null, items: [] });

            /** Run one cart request, keeping isSyncing/error/items in step with it. */
            const mutate = async (request: () => Promise<Cart>, onStaleCart: () => Promise<Cart | void>) => {
                set({ isSyncing: true, error: null });
                try {
                    let cart: Cart | void;
                    try {
                        cart = await request();
                    } catch (error) {
                        if (!isStaleCart(error)) throw error;
                        cart = await onStaleCart();
                    }
                    if (cart) set({ items: cart.items });
                } catch (error) {
                    set({ error: messageOf(error) });
                } finally {
                    set({ isSyncing: false });
                }
            };

            return {
                cartId: null,
                items: [],
                isOpen: false,
                isSyncing: false,
                error: null,

                syncCart: async () => {
                    const { cartId } = get();
                    if (!cartId) return;
                    try {
                        const cart = await cartService.getCart(cartId);
                        if (cart.status === 'active') set({ items: cart.items });
                        else forgetCart();
                    } catch (error) {
                        if (error instanceof ApiError && error.status === 404) forgetCart();
                        // Anything else (API down, network) keeps the id: the
                        // cart is still there, we just could not reach it.
                    }
                },

                addItem: async (product, quantity = 1, instructions = '') => {
                    set({ isOpen: true }); // Auto-open cart on add
                    const add = async () =>
                        cartService.addCartItem(await ensureCartId(), product.id_product, clamp(quantity), instructions);

                    // A stale cart (already checked out, or gone) is replaced
                    // by a fresh one and the add is retried there.
                    await mutate(add, async () => {
                        forgetCart();
                        return add();
                    });
                },

                removeItem: async (productId) => {
                    const { cartId } = get();
                    if (!cartId) return;
                    await mutate(() => cartService.removeCartItem(cartId, productId), get().syncCart);
                },

                updateQuantity: async (productId, quantity) => {
                    const { cartId } = get();
                    if (!cartId) return;
                    await mutate(
                        () => cartService.updateCartItem(cartId, productId, clamp(quantity)),
                        get().syncCart,
                    );
                },

                clearCart: forgetCart,

                toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
                openCart: () => set({ isOpen: true }),
                closeCart: () => set({ isOpen: false }),

                getTotalItems: () => {
                    return get().items.reduce((total, item) => total + item.quantity, 0);
                },

                getSubtotal: () => {
                    // item_subtotal is computed by the API; the order total is
                    // recomputed there again at checkout, so this is display only.
                    return get().items.reduce((total, item) => total + toNumber(item.item_subtotal), 0);
                },
            };
        },
        {
            name: 'dolce-amore-mio-cart', // key in local storage
            // Only the cart id: the lines are the server's, not ours to cache.
            partialize: (state) => ({ cartId: state.cartId }),
            // v0 stored the mock cart's lines; there is no server cart behind
            // them, so they are dropped rather than migrated.
            version: 1,
            migrate: () => ({ cartId: null }),
        }
    )
);
