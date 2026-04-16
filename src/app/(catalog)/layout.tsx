import { type ReactNode } from 'react';
import { MainLayout } from '@/components/layouts/main-layout';

/**
 * Catalog Group Layout
 * Uses the shared MainLayout for consistent Header, Footer, and TapBar
 * across all catalog pages.
 */
function CatalogLayout({ children }: { children: ReactNode }) {
    return <MainLayout>{children}</MainLayout>;
}

export default CatalogLayout;
