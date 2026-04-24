'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Info, CheckCircle } from 'lucide-react';
import { useToastStore, ToastIconType } from '@/stores/use-toast-store';

const getIcon = (type: ToastIconType | null) => {
    switch (type) {
        case 'cart':
            return <ShoppingBag size={18} className="text-white" />;
        case 'success':
            return <CheckCircle size={18} className="text-white" />;
        case 'info':
        default:
            return <Info size={18} className="text-white" />;
    }
};

export const Toast = () => {
    const id = useToastStore((state) => state.id);
    const message = useToastStore((state) => state.message);
    const icon = useToastStore((state) => state.icon);
    const hideToast = useToastStore((state) => state.hideToast);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                hideToast();
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [message, id, hideToast]);

    return (
        <AnimatePresence mode="wait">
            {message && (
                <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 50, x: '-50%' }}
                    className="fixed bottom-20 left-[29%] z-[110] bg-brand-pink text-white border-2 border-brand-coral shadow-xl px-3 py-2 rounded-xl flex items-center gap-3 pointer-events-none"
                >
                    {getIcon(icon)}
                    <span className="font-body text-[11px] font-bold tracking-widest uppercase mt-0.5">
                        {message}
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
