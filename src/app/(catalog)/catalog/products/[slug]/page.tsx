import { ProductDetailPage } from '@/features/catalog/pages/product-detail-page';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    return <ProductDetailPage slug={slug} />;
}
