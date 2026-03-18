'use client';

import { HTMLMotionProps, motion } from 'framer-motion';

export interface FadeInProps extends HTMLMotionProps<'div'> {
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    distance?: number;
    delay?: number;
    duration?: number;
    useWhileInView?: boolean;
    viewportMargin?: string;
    once?: boolean;
    as?: any;
}

export const FadeIn = ({
    children,
    direction = 'none',
    distance = 20,
    delay = 0,
    duration = 0.5,
    useWhileInView = false,
    viewportMargin = '-50px',
    once = true,
    as = 'div',
    initial,
    animate,
    whileInView,
    transition,
    viewport,
    ...rest
}: FadeInProps) => {
    const Component = (motion as any)[as] || motion.div;

    let x = 0;
    let y = 0;

    if (direction === 'up') y = distance;
    if (direction === 'down') y = -distance;
    if (direction === 'left') x = distance;
    if (direction === 'right') x = -distance;

    const defaultInitial = { opacity: 0, x, y };
    const defaultTarget = { opacity: 1, x: 0, y: 0 };

    return (
        <Component
            initial={initial ?? defaultInitial}
            {...(useWhileInView
                ? { whileInView: whileInView ?? defaultTarget, viewport: viewport ?? { once, margin: viewportMargin } }
                : { animate: animate ?? defaultTarget }
            )}
            transition={transition ?? { delay, duration, ease: 'easeOut' }}
            {...rest}
        >
            {children}
        </Component>
    );
};
