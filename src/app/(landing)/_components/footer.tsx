import Link from 'next/link';

export const Footer = () => {
    const year = new Date().getFullYear();
    
    return (
        <footer className="w-full bg-transparent pt-32 pb-12 px-6 md:px-12 flex flex-col items-center">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 border-t border-brand-choco/10 pt-16">
                
                {/* Brand Side */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img src="/logo.webp" alt="Dolce AmoreMio" className="h-12 w-auto opacity-80" />
                    <p className="font-body text-xs text-brand-choco/50 tracking-widest uppercase">Repostería de Autor</p>
                </div>

                {/* Main Links */}
                <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
                    <div className="flex flex-col gap-3 text-center md:text-left">
                        <Link href="/" className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-choco/60 hover:text-brand-pink transition-colors">Inicio</Link>
                        <Link href="/catalog" className="font-body text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-choco/60 hover:text-brand-pink transition-colors">Catálogo</Link>
                    </div>
                </div>

                {/* Contact Side */}
                <div className="flex flex-col gap-4 items-center md:items-end">
                    <p className="font-body text-xs text-brand-choco/70 tracking-tight">Síguenos en Redes Sociales</p>
                    <div className="flex gap-4">
                         {/* Social placeholders could go here */}
                         <span className="w-8 h-px bg-brand-pink" />
                    </div>
                </div>
            </div>

            <div className="mt-20 flex flex-col items-center gap-2">
                <p className="font-body text-[9px] uppercase tracking-[0.4em] text-brand-choco/30">
                    &copy; {year} Dolce Amore Mio — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};
