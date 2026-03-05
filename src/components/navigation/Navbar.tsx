import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavMenu } from './NavMenu';
import { MenuToggle } from './MenuToggle';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="absolute top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-8 md:px-12 backdrop-blur-sm mask-b-from-75% mask-b-to-100%">
            <motion.img
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                src="/logo.webp"
                alt="Dolce AmoreMio Logo"
                className="h-10 w-auto object-contain md:h-14 lg:h-16 "
            />

            <MenuToggle isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />

            <NavMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
    );
};