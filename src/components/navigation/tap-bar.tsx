'use client';

import { Home, Cake, Sparkles, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TabItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}

const TABS: TabItem[] = [
    { label: 'Inicio', href: '/', icon: Home },
    { label: 'Catálogo', href: '/catalog', icon: Cake },
    { label: 'Carrito', href: '/checkout', icon: ShoppingCart },
    { label: 'Servicios', href: '/#servicios', icon: Sparkles },
    { label: 'Acerca de', href: '/about', icon: Heart },
];

const MotionLink = motion.create(Link);

export const TapBar = () => {
    const pathname = usePathname();
    const [hash, setHash] = useState<string | null>(null);

    useEffect(() => {
        setHash(window.location.hash || '');
        const handleHashChange = () => setHash(window.location.hash || '');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <nav
            className='fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1440px]'
            aria-label='Navegación principal'
        >
            {/* Subtle top divider */}
            <div className='h-px bg-linear-to-r from-transparent via-brand-choco/8 to-transparent' />

            <div className='flex items-center justify-around bg-brand-bg/80 backdrop-blur-2xl px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]'>
                <LayoutGroup id='tap-bar-group'>
                    {TABS.map((tab) => {
                        const tabHash = tab.href.includes('#') ? tab.href.substring(tab.href.indexOf('#')) : '';
                        
                        // Solo activamos si el hash ya ha sido sincronizado (no es null)
                        const isActive = hash !== null && (
                            tabHash ? hash === tabHash : pathname === tab.href && (hash === '' || hash === '#')
                        );

                        return (
                            <MotionLink
                                layout
                                key={tab.label}
                                href={tab.href}
                                onClick={() => setHash(tabHash)}
                                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                className={`group relative flex items-center justify-center gap-1.5 py-2 rounded-full ${isActive ? 'px-4' : 'px-2'
                                    }`}
                            >
                                {/* Active indicator pill */}
                                {isActive && (
                                    <motion.span
                                        layoutId='tap-bar-active'
                                        className='absolute inset-0 rounded-full bg-brand-pink/10'
                                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                    />
                                )}

                                <tab.icon
                                    size={20}
                                    strokeWidth={isActive ? 2 : 1.5}
                                    className={`relative z-10 transition-colors duration-300 ${isActive
                                        ? 'text-brand-pink'
                                        : 'text-brand-choco/40 group-hover:text-brand-choco/70'
                                        }`}
                                />

                                <AnimatePresence mode='popLayout'>
                                    {isActive && (
                                        <motion.span
                                            layout
                                            initial={{ width: 0, opacity: 0, scale: 0.8 }}
                                            animate={{ width: 'auto', opacity: 1, scale: 1 }}
                                            exit={{ width: 0, opacity: 0, scale: 0.8 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                            className='relative z-10 overflow-hidden whitespace-nowrap text-[11px] font-body font-medium tracking-wider text-brand-pink origin-left'
                                        >
                                            {tab.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </MotionLink>
                        );
                    })}
                </LayoutGroup>
            </div>
        </nav>
    );
};

