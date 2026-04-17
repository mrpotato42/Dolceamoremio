import { type ReactNode } from 'react';
import { Header } from '@/components/navigation/header';
import { TapBar } from '@/components/navigation/tap-bar';
import { Footer } from '@/app/(landing)/_components/footer';

interface MainLayoutProps {
    children: ReactNode;
    /** Whether to show the footer section. Defaults to true. */
    showFooter?: boolean;
}

/**
 * MainLayout — Shared layout shell for all page groups.
 *
 * Renders the global sticky Header (top), the page content,
 * an optional Footer, and the sticky TapBar (bottom).
 *
 * Usage:
 *   (landing)/layout.tsx  →  <MainLayout>{children}</MainLayout>
 *   (catalog)/layout.tsx  →  <MainLayout>{children}</MainLayout>
 *   (servicios)/layout.tsx → <MainLayout>{children}</MainLayout>
 */
export function MainLayout({ children, showFooter = true }: MainLayoutProps) {
    return (
        <div className='min-h-svh w-full bg-brand-bg flex justify-center overflow-x-hidden'>

            {/* Main Constraints Container */}
            <div className='relative w-full max-w-full sm:max-w-[100vw] md:max-w-3xl lg:max-w-5xl xl:max-w-[1440px] min-h-svh flex flex-col bg-brand-bg shadow-2xl xl:shadow-[0_0_50px_rgba(0,0,0,0.05)] overflow-hidden'>
                <main id='main-content' className='flex-1 w-full relative z-10 flex flex-col'>
                    {children}
                </main>

                {showFooter && <Footer />}
            </div>

            {/* Fixed navigation elements (positioned outside overflow-hidden) */}
            <Header />
            <TapBar />
        </div>
    );
}
