import { motion } from 'framer-motion';

interface MenuToggleProps {
    toggle: () => void;
    isOpen: boolean;
}

export const MenuToggle = ({ toggle, isOpen }: MenuToggleProps) => (
    <button
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-choco/5 backdrop-blur-md hover:bg-brand-choco/10 transition-colors z-80"
        aria-label="Toggle Menu"
    >
        <svg width="23" height="18" viewBox="0 0 23 18">
            <motion.path
                fill="transparent"
                strokeWidth="3"
                stroke="currentColor"
                strokeLinecap="round"
                variants={{
                    closed: { d: "M 2 2.5 L 20 2.5" },
                    open: { d: "M 3 16.5 L 17 2.5" }
                }}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
                className="text-brand-choco"
            />
            <motion.path
                fill="transparent"
                strokeWidth="3"
                stroke="currentColor"
                strokeLinecap="round"
                d="M 2 9.423 L 20 9.423"
                variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                }}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.1 }}
                className="text-brand-choco"
            />
            <motion.path
                fill="transparent"
                strokeWidth="3"
                stroke="currentColor"
                strokeLinecap="round"
                variants={{
                    closed: { d: "M 2 16.346 L 20 16.346" },
                    open: { d: "M 3 2.5 L 17 16.346" }
                }}
                animate={isOpen ? "open" : "closed"}
                transition={{ duration: 0.3 }}
                className="text-brand-choco"
            />
        </svg>
    </button>
);
