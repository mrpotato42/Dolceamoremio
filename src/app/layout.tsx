import '@/styles/index.css';
import type { ReactNode } from 'react';
import { fontTitle, fontSubtitle, fontBody, fontNumber } from '@/lib/fonts/fonts';

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
        {children}
      </body>
    </html>
  );
}
