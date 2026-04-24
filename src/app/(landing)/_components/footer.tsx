import { Facebook, Instagram } from 'lucide-react';

const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

export const Footer = () => {
    const year = new Date().getFullYear();

    const socialLinks = [
        { icon: Instagram, href: 'https://instagram.com/dolceamoremiio', label: 'Instagram' },
        { icon: Facebook, href: 'https://facebook.com/dolceamoremiio', label: 'Facebook' },
        { icon: WhatsAppIcon, href: 'https://wa.me/573186224291', label: 'WhatsApp' },
    ];

    return (
        <footer className="w-full bg-transparent pt-8 pb-24 px-6 md:px-12 flex flex-col items-center">
            <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12 border-t border-brand-choco/10 pt-12">

                {/* Brand Side */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img src="/logo.webp" alt="Dolce AmoreMio" className="h-12 w-auto opacity-80" />
                    <p className="font-body text-xs text-brand-choco/50 tracking-widest uppercase">Repostería de Autor</p>
                </div>

                {/* Contact Side */}
                <div className="flex flex-col gap-6 items-center md:items-end">
                    <p className="font-body text-xs text-brand-choco/70 tracking-tight">Síguenos en Redes Sociales</p>
                    <div className="flex gap-6">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-brand-choco/60 hover:text-brand-pink transition-colors duration-300"
                                aria-label={social.label}
                            >
                                <social.icon size={20} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <p className="font-body text-[9px] uppercase tracking-[0.4em] text-brand-choco/30 text-center">
                    &copy; <span className="font-number">{year}</span> Dolce Amore Mio — Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};
