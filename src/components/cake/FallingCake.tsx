import { motion } from 'framer-motion';
import { CakeTier } from './CakeTier';

export const FallingCake = () => {
    return (
        <div className="relative z-10 flex flex-col items-center">
            {/* Piso 3 */}
            <CakeTier
                level={2}
                color="var(--color-brand-pink)"
                sizeClass="h-24 w-40 md:h-36 md:w-56"
                marginLeft="-100%"
                zIndex={30}
            >
                <div className="absolute top-4 h-4 w-full bg-white/10" />
            </CakeTier>

            {/* Piso 2 */}
            <CakeTier
                level={1}
                color="var(--color-brand-coral)"
                sizeClass="h-32 w-56 md:h-48 md:w-80"
                marginLeft="-100%"
                zIndex={20}
            >
                <div className="absolute inset-0 flex items-center justify-around opacity-20">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-full w-px bg-white" />)}
                </div>
            </CakeTier>

            {/* Piso 1 */}
            <CakeTier
                level={0}
                color="var(--color-brand-peach)"
                sizeClass="h-40 w-72 md:h-60 md:w-[28rem]"
                marginLeft="-95%"
                zIndex={10}
            >
                <div className="absolute bottom-0 h-12 w-full bg-brand-choco/5" />
            </CakeTier>

            {/* Plato / Base */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1 }}
                style={{ marginLeft: '-80%' }}
                className="z-0 -mt-2 h-4 w-[110%] rounded-full bg-brand-choco shadow-xl md:h-6"
            />
        </div>
    );
};