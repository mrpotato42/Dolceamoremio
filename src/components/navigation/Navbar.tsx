import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavMenu } from './NavMenu';
import { MenuToggle } from './MenuToggle';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="absolute top-0 left-0 z-50 flex w-full items-start justify-between px-6 pt-8 pb-12 md:px-12 backdrop-blur-sm mask-b-from-75% mask-b-to-100% bg-white/5">
                <motion.img
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2, duration: 0.3 }}
                    src="/logo.webp"
                    alt="Dolce AmoreMio Logo"
                    className="h-10 w-auto object-contain md:h-14 lg:h-16"
                />
            </header>

            <motion.div initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.3 }}
                className="absolute top-8 right-6 z-80 md:right-12"
            >
                <MenuToggle isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
            </motion.div>

            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};