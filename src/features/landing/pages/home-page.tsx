import { HeroSection } from '@/features/landing/components/hero/hero-section';
import { EditorialGallery } from '@/features/landing/components/editorial-gallery';
import { Catalog } from '@/features/landing/components/catalog';
// import { AboutUs } from '@/features/landing/components/about-us';
import { CustomOrders } from '@/features/landing/components/custom-orders';

export default function Home() {
    return (
        <div className='w-full flex-1 flex flex-col'>
            <HeroSection id='inicio' />

            {/* <AboutUs id='sobre-nosotros' /> */}

            <EditorialGallery id='coleccion' />

            <CustomOrders id='servicios' />

            <Catalog id='catalogo' />

        </div>
    );
}