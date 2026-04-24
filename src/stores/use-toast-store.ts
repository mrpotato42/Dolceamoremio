import { create } from 'zustand';

export type ToastIconType = 'cart' | 'info' | 'success';

interface ToastState {
    id: number;
    message: string | null;
    icon: ToastIconType | null;
    showToast: (message: string, icon?: ToastIconType) => void;
    hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    id: 0,
    message: null,
    icon: null,
    showToast: (message, icon = 'info') => set({ id: Date.now(), message, icon }),
    hideToast: () => set({ message: null, icon: null }),
}));
