import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ShoppingBag, ArrowRight, Instagram, Play, Facebook } from 'lucide-react';

/**
 * PROPS PARA LOS PISOS DEL PASTEL
 * level: determina el orden de caída (0 es la base, 2 es la cima)
 */
interface TierProps {
  level: number;
  color: string;
  width: string;
  height: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * COMPONENTE: PISO DEL PASTEL
 * Implementa física de masa para que se sienta como un objeto sólido al caer.
 */
const CakeTier: React.FC<TierProps> = ({ level, color, width, height, className, children }) => {
  const variants: Variants = {
    initial: { 
      y: -1200, 
      opacity: 0, 
      rotateX: 10 
    },
    animate: { 
      y: 0, 
      opacity: 1,
      rotateX: 0,
      transition: {
        // El nivel 0 (base) cae primero, luego el 1, luego el 2
        delay: level * 0.5, 
        type: "spring",
        stiffness: 180, // Rigidez
        damping: 18,    // Amortiguación (evita rebote excesivo tipo goma)
        mass: 2,        // Masa (hace que la caída se sienta pesada)
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      style={{ width, height, backgroundColor: color }}
      className={`relative -mt-1 border-x-4 border-t-4 border-white shadow-2xl origin-bottom ${className}`}
    >
      {/* Detalle de brillo superior para dar volumen */}
      <div className="absolute top-0 w-full h-px bg-white/30" />
      {children}
    </motion.div>
  );
};

/**
 * COMPONENTE PRINCIPAL: PASTRY HERO
 */
const PastryHero: React.FC = () => {
  
  // Animación sutil de "temblor" cuando cae la base
  const containerImpact: Variants = {
    animate: {
      y: [0, 3, 0],
      transition: { 
        delay: 0.1, 
        duration: 0.2 
      }
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-pink selection:text-white overflow-hidden bg-brand-bg">
      
      {/* HEADER / NAV (ESTILO EDITORIAL) */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="font-title text-4xl text-brand-pink tracking-tight"
        >
          Maison Rosé
        </motion.div>
        
        <div className="hidden md:flex gap-14 font-body text-[10px] uppercase tracking-[0.4em] font-bold text-brand-choco">
          <a href="#" className="hover:text-brand-pink transition-colors relative group">
            Colecciones
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-pink group-hover:w-full transition-all" />
          </a>
          <a href="#" className="hover:text-brand-pink transition-colors relative group">
            Atelier
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-pink group-hover:w-full transition-all" />
          </a>
          <a href="#" className="hover:text-brand-pink transition-colors relative group">
            Pedidos
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-pink group-hover:w-full transition-all" />
          </a>
        </div>

        <div className="flex items-center gap-8 text-brand-choco">
          <div className="hidden sm:flex gap-5 opacity-40">
            <Instagram size={18} className="cursor-pointer hover:text-brand-pink transition-colors" />
            <Facebook size={18} className="cursor-pointer hover:text-brand-pink transition-colors" />
          </div>
          <div className="w-px h-6 bg-brand-choco/20 hidden sm:block" />
          <div className="relative cursor-pointer group">
            <ShoppingBag size={22} strokeWidth={1.5} />
            <span className="absolute -top-2 -right-2 bg-brand-coral text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </div>
        </div>
      </nav>

      {/* HERO MAIN CONTENT */}
      <main className="grid lg:grid-cols-12 min-h-screen items-center px-8 md:px-16 pt-20">
        
        {/* COLUMNA IZQUIERDA: TIPOGRAFÍA */}
        <div className="lg:col-span-6 z-10">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="font-body text-brand-coral text-xs font-black uppercase tracking-[0.6em] mb-8 block">
              Haute Pâtisserie d'Auteur
            </span>
            
            <h1 className="font-subtitle text-[7rem] md:text-[11rem] leading-[0.8] text-brand-choco mb-12">
              Dulce <br />
              <span className="text-brand-pink italic">Estructura.</span>
            </h1>
            
            <div className="max-w-md space-y-10">
              <p className="font-body text-xl text-brand-choco/80 leading-relaxed italic border-l-2 border-brand-pink/30 pl-6">
                “Entendemos la repostería como una disciplina arquitectónica donde el sabor es el cimiento de cada obra.”
              </p>
              
              <div className="flex items-center gap-8">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-brand-choco text-brand-soft font-body uppercase tracking-widest text-[11px] font-bold px-12 py-7 rounded-full hover:bg-brand-pink hover:text-white transition-all duration-500 shadow-2xl"
                >
                  Ver Catálogo
                </motion.button>
                
                <button className="flex items-center gap-3 group font-body text-[10px] uppercase tracking-widest text-brand-choco font-bold">
                  <div className="w-10 h-10 rounded-full border border-brand-choco/20 flex items-center justify-center group-hover:bg-brand-choco group-hover:text-white transition-all">
                    <Play size={12} fill="currentColor" />
                  </div>
                  <span>El Proceso</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* COLUMNA DERECHA: ENSAMBLAJE DEL PASTEL */}
        <div className="lg:col-span-6 h-full flex items-center justify-center relative perspective-[2000px]">
          
          {/* Brillo de fondo (Aura) */}
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute w-[120%] aspect-square bg-brand-soft/20 rounded-full blur-[120px] -z-10"
          />

          {/* Contenedor del pastel con reacción al impacto */}
          <motion.div 
            variants={containerImpact}
            animate="animate"
            className="flex flex-col items-center relative"
          >
            {/* Piso 3 (Top) - Color Pink */}
            <CakeTier level={2} color="var(--color-brand-pink)" width="150px" height="130px">
              {/* Decoración cima */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
                 <div className="w-1 h-8 bg-brand-choco/20" />
                 <div className="w-4 h-4 rounded-full bg-white shadow-lg -mt-1" />
              </div>
            </CakeTier>

            {/* Piso 2 (Medio) - Color Coral */}
            <CakeTier level={1} color="var(--color-brand-coral)" width="260px" height="170px">
               <div className="absolute inset-x-0 top-1/2 h-px bg-white/20" />
               <div className="flex justify-around items-center h-full px-6 opacity-20">
                  {[...Array(4)].map((_, i) => <div key={i} className="w-px h-full bg-white" />)}
               </div>
            </CakeTier>

            {/* Piso 1 (Base) - Color Peach */}
            <CakeTier level={0} color="var(--color-brand-peach)" width="400px" height="210px">
               <div className="absolute bottom-4 inset-x-0 h-8 bg-brand-choco/5" />
               {/* Sutil gradiente para profundidad */}
               <div className="absolute inset-0 bg-gradient-to-t from-brand-choco/10 to-transparent opacity-50" />
            </CakeTier>

            {/* BASE / PLATO DE PRESENTACIÓN */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120, delay: 0.1 }}
              className="w-[500px] h-5 bg-brand-choco rounded-full relative z-0 -mt-2 shadow-[0_40px_70px_-15px_rgba(145,74,50,0.4)]"
            >
              {/* Reflejo en el plato */}
              <div className="absolute top-1 left-10 right-10 h-1 bg-white/10 rounded-full" />
            </motion.div>
            
            {/* SOMBRA ARROJADA EN EL SUELO */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 0.4 }}
              className="w-[380px] h-10 bg-black blur-[40px] rounded-[100%] mt-6"
            />
          </motion.div>
        </div>
      </main>

      {/* MARCAS LATERALES (EDITORIAL) */}
      <div className="fixed bottom-12 left-12 hidden lg:flex flex-col gap-3 opacity-30 font-body text-[8px] uppercase tracking-[0.5em] text-brand-choco">
        <div className="flex items-center gap-4">
          <span className="w-8 h-px bg-brand-choco" />
          <span>Ingredientes de Origen</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="w-8 h-px bg-brand-choco" />
          <span>Técnica Neoclásica</span>
        </div>
      </div>

      {/* TEXTO DE FONDO (GIGANTE) */}
      <div className="fixed -bottom-20 -right-20 rotate-[-90deg] origin-bottom-right opacity-[0.03] pointer-events-none select-none">
        <h2 className="font-title text-[25rem] leading-none text-brand-choco">ROSE</h2>
      </div>

    </div>
  );
};

export default PastryHero;