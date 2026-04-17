import { type ReactNode } from 'react';
import { MainLayout } from '@/components/layouts/main-layout';

export default function CheckoutLayout({ children }: { children: ReactNode }) {
    return (
        <MainLayout showFooter={false}>
            {children}
        </MainLayout>
    );
}
