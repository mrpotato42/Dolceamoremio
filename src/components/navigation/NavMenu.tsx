import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuLinks = [
    { title: 'MENU 1', href: '#' },
    { title: 'MENU 2', href: '#' },
    { title: 'MENU 3', href: '#' },
    { title: 'MENU 4', href: '#' },
    { title: 'MENU 5', href: '#' },
    { title: 'MENU 6', href: '#' },
];

export const NavMenu = ({ isOpen, onClose }: NavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Menu Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-70 flex w-full max-w-sm flex-col bg-[#0B0B0B] text-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-6 text-sm font-medium tracking-widest">
                                <button className="flex items-center gap-1 hover:text-brand-pink transition-colors">
                                    <Globe size={16} />
                                    EN
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 px-8 py-12">
                            <p className="mb-8 text-xs font-bold tracking-[0.2em] text-white/40">
                                CATEGORÍAS
                            </p>
                            <div className="flex flex-col gap-4">
                                {menuLinks.map((link, idx) => (
                                    <motion.a
                                        key={link.title}
                                        href={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                        className="font-title text-4xl font-black tracking-tight hover:text-brand-pink transition-colors md:text-5xl"
                                    >
                                        {link.title}
                                    </motion.a>
                                ))}
                            </div>
                        </nav>

                        {/* Footer / Extra info */}
                        <div className="p-8 border-t border-white/5">
                            <div className="flex gap-4 overflow-x-auto no-scrollbar">
                                <button className="rounded-full bg-white px-6 py-2 text-black font-bold text-sm whitespace-nowrap">
                                    Categoría 1
                                </button>
                                <button className="rounded-full border border-white/20 px-6 py-2 font-bold text-sm whitespace-nowrap hover:bg-white/10 transition-colors">
                                    Categoría 2
                                </button>
                                <button className="rounded-full border border-white/20 px-6 py-2 font-bold text-sm whitespace-nowrap hover:bg-white/10 transition-colors">
                                    Categoría 3
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
