'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MenuToggle } from '@/components/navigation/menu-toggle';
import { NavMenu } from '@/components/navigation/nav-menu';

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className='absolute top-0 left-0 z-50 flex w-full items-start justify-between px-6 pt-8 pb-12 md:px-12 backdrop-blur-sm bg-white/5'>
                <Link href='/'>
                    <motion.img
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        src='/logo.webp'
                        alt='Dolce AmoreMio Logo'
                        className='h-10 w-auto object-contain md:h-14 lg:h-16 cursor-pointer'
                    />
                </Link>
            </header>

            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='fixed top-8 right-6 z-[80] md:right-12'
            >
                <MenuToggle isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
            </motion.div>

            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};
