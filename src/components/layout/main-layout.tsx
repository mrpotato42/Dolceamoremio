import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
    className?: string;
}

/**
 * @deprecated Use app/(landing)/layout.tsx for global layout constraints.
 * This component is kept for backward compatibility or specific isolated views.
 */
export const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
    return (
        <div className='min-h-svh w-full bg-brand-bg flex justify-center overflow-x-hidden'>
            <div className='relative w-full max-w-full sm:max-w-[100vw] md:max-w-3xl lg:max-w-5xl xl:max-w-[1440px] min-h-svh flex flex-col bg-brand-bg shadow-2xl xl:shadow-[0_0_50px_rgba(0,0,0,0.05)] overflow-hidden'>
                <main className={`flex-1 w-full relative z-10 flex flex-col ${className}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};
