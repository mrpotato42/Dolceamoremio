import type { ReactNode } from 'react';
import { Navbar } from '@/components/navigation/nav-bar';

interface MainLayoutProps {
    children: ReactNode;
    className?: string;
}

export const MainLayout = ({ children, className = '' }: MainLayoutProps) => {
    return (
        // Fondo general para el viewport entero si la pantalla es más grande que el layout
        <div className='min-h-screen w-full bg-brand-bg flex justify-center overflow-x-hidden'>

            {/* Contenedor Constraints (Mobile First Method)
                - Comienza con 100% width en móvil
                - Limita su ancho en diferentes breakpoints para no desbordarse jamás
                - position: relative y overflow-hidden aseguran que todo absolute/fixed 
                  se mantenga OBLIGATORIAMENTE dentro del Layout.
            */}
            <div className='relative w-full max-w-full sm:max-w-[100vw] md:max-w-3xl lg:max-w-5xl xl:max-w-[1440px] min-h-screen flex flex-col bg-brand-bg shadow-2xl xl:shadow-[0_0_50px_rgba(0,0,0,0.05)] overflow-hidden'>

                {/* Navbar encapsulado dentro del layout */}
                <Navbar />

                {/* Main Content encapsulado */}
                <main className={`flex-1 w-full relative z-10 flex flex-col ${className}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};
