import { type ReactNode } from 'react';
import { Footer } from '@/app/(landing)/_components/footer';
import { HeaderWrapper } from './_components/header-wrapper';

/**
 * Catalog Group Layout
 * Reusing the landing group's Header and Footer components but maintaining 
 * its own route group structure for future catalog-specific logic (e.g., sidebars).
 */
function CatalogLayout({ children }: { children: ReactNode }) {
    return (
        <div className='min-h-svh w-full bg-brand-bg flex justify-center overflow-x-hidden'>
            <a
                href='#main-content'
                className='sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-9999 focus:rounded-lg focus:bg-brand-pink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none'
            >
                Saltar al contenido principal
            </a>
            
            <div className='relative w-full max-w-full sm:max-w-[100vw] md:max-w-3xl lg:max-w-5xl xl:max-w-[1440px] min-h-svh flex flex-col bg-brand-bg shadow-2xl xl:shadow-[0_0_50px_rgba(0,0,0,0.05)] overflow-hidden'>
                <HeaderWrapper />
                <main id='main-content' className='flex-1 w-full relative z-10 flex flex-col pt-0'>
                    {children}
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default CatalogLayout;
