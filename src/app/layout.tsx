import '@/styles/index.css';
import type { ReactNode } from 'react';
import { fontTitle, fontSubtitle, fontBody, fontNumber } from '@/lib/fonts/fonts';
import { Header } from '@/components/navigation/header';
import { TapBar } from '@/components/navigation/tap-bar';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Toast } from '@/components/ui/toast';

export const metadata = {
  title: 'Dolce Amoremio',
  icons: {
    icon: '/DolceIcon.svg',
  },
};


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='es' className={`
      ${fontTitle.variable}
      ${fontSubtitle.variable}
      ${fontBody.variable}
      ${fontNumber.variable}
    `}>
      <body>
        <div className='min-h-svh w-full bg-brand-bg flex justify-center overflow-x-hidden'>
          {children}
          
          {/* Fixed navigation elements (positioned outside overflow-hidden) */}
          <Header />
          <TapBar />
          
          {/* Global Overlays */}
          <CartDrawer />
          <Toast />
        </div>
      </body>
    </html>
  );
}
