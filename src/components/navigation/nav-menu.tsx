'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuLinks = [
    { title: 'INICIO', href: '/' },
    { title: 'COLECCIÓN', href: '/#coleccion' },
    { title: 'HISTORIA', href: '#' },
    { title: 'CONTACTO', href: '#' },
];

export const NavMenu = ({ isOpen, onClose }: NavMenuProps) => {
    // Bloquear el scroll del body cuando el menú esté abierto
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [isOpen]);

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
                        className='fixed inset-0 z-60 bg-black/40 backdrop-blur-sm'
                    />

                    {/* Menu Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className='fixed inset-y-0 right-0 z-70 flex w-full max-w-sm flex-col bg-brand-choco text-white shadow-2xl'
                    >
                        {/* Header */}
                        <div className='flex items-center justify-between p-6'>
                            <div className='flex items-center gap-6 text-sm font-medium tracking-widest'>
                                <button className='flex items-center gap-1 hover:text-brand-pink transition-colors'>
                                    <Globe size={16} />
                                    EN
                                    <ChevronDown size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className='flex-1 px-8 py-12'>
                            <p className='mb-8 text-xs font-bold tracking-[0.2em] text-white/40'>
                                EXPLORAR
                            </p>
                            <div className='flex flex-col gap-4'>
                                {menuLinks.map((link, idx) => (
                                    <motion.div
                                        key={link.title}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + idx * 0.05 }}
                                    >
                                        {link.href.startsWith('/') ? (
                                            <Link
                                                href={link.href}
                                                onClick={onClose}
                                                className='font-title text-4xl font-black tracking-tight hover:text-brand-pink transition-colors md:text-5xl'
                                            >
                                                {link.title}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className='font-title text-4xl font-black tracking-tight hover:text-brand-pink transition-colors md:text-5xl'
                                            >
                                                {link.title}
                                            </a>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </nav>

                        {/* ... existing categories or other footer elements ... */}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
