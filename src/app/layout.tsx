import '@/styles/index.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Dolce Amoremio',
  icons: {
    icon: '/DolceIcon.svg',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='es'>
      <body>
        {children}
      </body>
    </html>
  );
}
