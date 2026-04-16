import { type ReactNode } from 'react';
import { MainLayout } from '@/components/layouts/main-layout';

function LandingPageLayout({ children }: { children: ReactNode }) {
    return <MainLayout>{children}</MainLayout>;
}

export default LandingPageLayout;
