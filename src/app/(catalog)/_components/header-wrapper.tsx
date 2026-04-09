'use client';
import { usePathname } from 'next/navigation';
import { Header } from '@/app/(landing)/_components/header';

export function HeaderWrapper() {
    const pathname = usePathname();
    const isProductPage = pathname?.includes('/products/');

    if (isProductPage) return null;

    return <Header />;
}
