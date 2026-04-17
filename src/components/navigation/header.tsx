'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';

export const Header = () => {
    return (
        <header className='fixed top-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-full md:max-w-3xl lg:max-w-5xl xl:max-w-[1440px]'>
            <div className='flex items-center justify-between px-5 py-3 md:px-8 md:py-3.5 bg-brand-bg/80 backdrop-blur-2xl'>
                {/* Left: Spacer to balance the layout */}
                <div className='w-10' />

                {/* Center: Logo */}
                <Link href='/' className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className='cursor-pointer flex items-center justify-center'
                    >
                        <Image
                            src='/logo.webp'
                            alt='Dolce AmoreMio Logo'
                            width={160}
                            height={40}
                            className='h-8 w-auto object-contain md:h-10'
                            priority
                        />
                    </motion.div>
                </Link>

                {/* Right: Shopping Bag */}
                <motion.button
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className='flex items-center justify-center rounded-full bg-brand-choco/8 p-2.5 transition-all duration-300 hover:bg-brand-choco/15 active:scale-95'
                    aria-label='Carrito de compras'
                >
                    <ShoppingBag size={18} className='text-brand-choco/60' strokeWidth={1.5} />
                </motion.button>
            </div>

            {/* Subtle bottom divider */}
            <div className='h-px bg-gradient-to-r from-transparent via-brand-choco/8 to-transparent' />
        </header>
    );
};
