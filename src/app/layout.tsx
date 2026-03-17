import '../index.css';
import '../App.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Dolce Amoremio',
  icons: {
    icon: '/DolceIcon.svg',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
