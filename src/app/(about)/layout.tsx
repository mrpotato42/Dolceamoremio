import { type ReactNode } from 'react';
import { MainLayout } from '@/components/layouts/main-layout';

/**
 * About Group Layout
 * Uses the shared MainLayout for consistent Header, Footer, and TapBar
 * across all about-related pages.
 */
function AboutLayout({ children }: { children: ReactNode }) {
    return <MainLayout>{children}</MainLayout>;
}

export default AboutLayout;
