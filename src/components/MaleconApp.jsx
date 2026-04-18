import React, { useState } from 'react';
import MaleconMap from './MaleconMap';

const categories = [
  { id: 'all', name: 'Todos los Puntos', icon: '📍' },
  { id: 'monumentos', name: 'Fotos y Monumentos', icon: '📸' },
  { id: 'comida', name: 'Comida y Bebida', icon: '🌮' },
  { id: 'entretenimiento', name: 'Entretenimiento', icon: '🛹' },
];

const pois = [
  { id: 1, category: 'monumentos', name: "El Molinito", coords: [24.17210, -110.31550], desc: "Mirador espectacular famoso por sus esculturas y brisa constante. Ideal para el atardecer.", image: "https://images.unsplash.com/photo-1566375005881-2292025cc02f?q=80&w=600&auto=format&fit=crop" },
  { id: 2, category: 'monumentos', name: "Letras de La Paz", coords: [24.161049, -110.316812], desc: "El parador fotográfico oficial por excelencia. ¡Tómate la foto del recuerdo frente a la bahía!", image: "https://images.unsplash.com/photo-1596395819057-cb37dd3254b6?q=80&w=600&auto=format&fit=crop" },
  { id: 3, category: 'monumentos', name: "Kiosco del Malecón", coords: [24.161476, -110.316499], desc: "El corazón del malecón. Punto de encuentro principal que alberga eventos culturales.", image: "https://images.unsplash.com/photo-1574958269340-fa927503f3da?q=80&w=600&auto=format&fit=crop" },
  { id: 4, category: 'comida', name: "Heladería La Fuente", coords: [24.161823, -110.316021], desc: "La nevería más tradicional del malecón. Prueba las paletas de frutas tropicales mexicanas.", image: "https://images.unsplash.com/photo-1563805042-7684c8e9e9cb?q=80&w=600&auto=format&fit=crop" },
  { id: 5, category: 'comida', name: "Restaurante Bismarkcito", coords: [24.163013, -110.316654], desc: "Tradición sudcaliforniana. Famoso por sus tacos de pescado, mariscos y clamatos frente al mar.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop" },
  { id: 6, category: 'comida', name: "Harker Board Co.", coords: [24.162800, -110.316700], desc: "Terraza con la mejor vista. Disfruta de pizza a la leña, cerveza artesanal y vibra surfera.", image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop" },
  { id: 7, category: 'entretenimiento', name: "Rentas de Bicicletas", coords: [24.164500, -110.315900], desc: "Explora la ciclovía costera rentando ecobicis, carritos de pedales familiares o patinetas.", image: "https://images.unsplash.com/photo-1528629297340-d1d466945cb5?q=80&w=600&auto=format&fit=crop" },
  { id: 8, category: 'entretenimiento', name: "Museo de la Ballena", coords: [24.160500, -110.317000], desc: "Exposiciones masivas e imponentes sobre mamíferos marinos y la biodiversidad del Golfo.", image: "https://images.unsplash.com/photo-1469502932371-d8ec78913b82?q=80&w=600&auto=format&fit=crop" },
  { id: 9, category: 'monumentos', name: "Muelle Fiscal", coords: [24.160100, -110.317500], desc: "Muelle histórico de la ciudad. Perfecto para adentrarse sobre el mar y observar tortugas y yates.", image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600&auto=format&fit=crop" },
  { id: 10, category: 'entretenimiento', name: "Parque Cuauhtémoc", coords: [24.156550, -110.319500], desc: "Sombra bajo altos árboles. Ideal para familias, tiene juegos infantiles y un popular skate park.", image: "https://images.unsplash.com/photo-1620355462534-722a490bd2c7?q=80&w=600&auto=format&fit=crop" },
  { id: 11, category: 'comida', name: "Puestos de Hot Dogs", coords: [24.163500, -110.316200], desc: "Imperdibles 'Hates' (hot dogs locales) con tocino, crema y pan calentito. Clásicos nocturnos.", image: "https://images.unsplash.com/photo-1605904323214-72cc85b88137?q=80&w=600&auto=format&fit=crop" }
];

export default function MaleconApp() {
  const [activePoi, setActivePoi] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredPois = (activeCategory === 'all') 
    ? pois 
    : pois.filter(p => p.category === activeCategory);

  return (
    <div className="w-full h-screen bg-slate-950 flex flex-col overflow-hidden relative select-none" 
         style={{ background: 'radial-gradient(circle at top, #082f49 0%, #020617 100%)' }}>
      
      {/* Botón Flotante para Regresar - Kiosk Style */}
      <a href="/" draggable={false} className="absolute top-8 left-8 z-[2000] bg-slate-950/80 backdrop-blur-xl hover:bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black text-2xl flex items-center gap-4 border border-white/20 shadow-2xl transition-all active:scale-90 select-none focus:outline-none ring-1 ring-sky-400/30">
         <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
         INICIO
      </a>

      {/* Map Area (Top Section) */}
      <div className="flex-[1.2] w-full relative z-10">
          <MaleconMap activePoi={activePoi} pois={filteredPois} setActivePoi={setActivePoi} />
          
          {/* Legend / Overlay info for Map */}
          <div className="absolute top-8 right-8 z-[500] pointer-events-none">
             <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
                <span className="text-sky-300 font-bold tracking-widest text-sm uppercase">Modo Exploración</span>
             </div>
          </div>
      </div>

      {/* Directory Section (Bottom Sheet) */}
      <div className="flex-1 w-full bg-slate-900/80 backdrop-blur-3xl rounded-t-[4rem] border-t border-white/15 shadow-[0_-30px_60px_rgba(0,0,0,0.8)] z-20 flex flex-col overflow-hidden relative translate-y-0 transition-transform duration-500">
         
         {/* Decorative Handle */}
         <div className="w-20 h-2 bg-white/20 rounded-full mx-auto mt-6 mb-2 shrink-0"></div>

         <div className="px-10 pt-4 pb-6 shrink-0">
             <h1 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-sky-400 drop-shadow-xl tracking-tight">Directorio del Malecón</h1>
             <p className="text-slate-400 text-xl font-medium mt-2">Toca un lugar para ubicarlo en el mapa</p>
         </div>

         {/* Selector de Categorías (Tabs Horizontales) */}
         <div className="px-8 pb-6 flex gap-4 overflow-x-auto custom-scrollbar-horizontal shrink-0 no-scrollbar">
            {categories.map(cat => (
                <button
                   key={cat.id}
                   onClick={() => { setActiveCategory(cat.id); setActivePoi(null); }}
                   className={`whitespace-nowrap px-8 py-5 rounded-3xl font-extrabold text-xl transition-all focus:outline-none active:scale-95 flex items-center gap-3 border-2 ${
                       activeCategory === cat.id 
                       ? 'bg-sky-500 border-sky-300 shadow-[0_0_30px_rgba(14,165,233,0.4)] text-white' 
                       : 'bg-slate-800/40 border-white/5 text-slate-400'
                   }`}
                >
                   <span className="text-3xl">{cat.icon}</span>
                   {cat.name}
                </button>
            ))}
         </div>
         
         {/* Lista Vertical Deslizable de POIs */}
         <div className="flex-1 overflow-y-auto px-8 pb-10 space-y-6 custom-scrollbar relative">
            {filteredPois.map((poi, idx) => (
                <button 
                  key={poi.id}
                  onClick={() => setActivePoi(poi)}
                  className={`w-full text-left p-5 rounded-[2.5rem] transition-all duration-300 border-2 flex items-center gap-6 focus:outline-none active:scale-[0.98] 
                    ${activePoi?.id === poi.id 
                        ? 'bg-sky-500/20 border-sky-400/60 shadow-[0_0_40px_rgba(56,189,248,0.2)]' 
                        : 'bg-slate-800/30 border-white/5 hover:border-white/10'
                    }`}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                   <div className="w-28 h-28 rounded-3xl shrink-0 overflow-hidden shadow-2xl border border-white/10">
                     <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" draggable="false" />
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-xs font-black bg-sky-500/20 text-sky-400 px-2.5 py-1 rounded-full uppercase tracking-widest border border-sky-500/30">
                            {categories.find(c => c.id === poi.category)?.name}
                         </span>
                      </div>
                      <h3 className={`text-3xl font-black ${activePoi?.id === poi.id ? 'text-sky-300' : 'text-white'} leading-tight`}>{poi.name}</h3>
                      <p className="text-slate-400 text-lg leading-snug mt-2 line-clamp-1">{poi.desc}</p>
                   </div>
                   <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-colors ${activePoi?.id === poi.id ? 'bg-sky-500 border-sky-300 text-white' : 'bg-slate-900 border-white/10 text-slate-600'}`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                   </div>
                </button>
            ))}
         </div>
      </div>

      {/* Tarjeta de Detalle Flotante - Rediseñada para Vertical */}
      {activePoi && (
          <div key={activePoi.id} className="absolute inset-0 z-[3000] flex items-end justify-center p-8 bg-slate-950/40 backdrop-blur-sm pointer-events-none">
              <div className="w-full max-w-2xl bg-slate-900 border border-white/20 rounded-[3.5rem] shadow-[0_40px_80px_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-bottom-20 pointer-events-auto">
                  
                  {/* Imagen de Cabecera Pop */}
                  <div className="w-full h-72 bg-slate-800 relative overflow-hidden">
                     <img src={activePoi.image} alt={activePoi.name} className="w-full h-full object-cover scale-105" draggable="false" />
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
                     <button onClick={() => setActivePoi(null)} className="absolute top-8 right-8 w-16 h-16 bg-black/50 backdrop-blur-2xl rounded-full flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all shadow-2xl border border-white/10 focus:outline-none z-20 overflow-hidden ring-1 ring-white/20">
                        <svg className="w-10 h-10 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                     </button>
                  </div>

                  {/* Contenido Detallado */}
                  <div className="p-10 pt-4 relative z-10 -mt-12 bg-slate-900">
                     <div className="inline-flex items-center gap-3 px-6 py-2 bg-sky-500 rounded-full text-white text-base font-black tracking-widest uppercase shadow-xl mb-6">
                        <span className="text-2xl">{categories.find(c => c.id === activePoi.category)?.icon}</span>
                        {categories.find(c => c.id === activePoi.category)?.name}
                     </div>
                     <h2 className="text-5xl font-black text-white leading-[1.1] mb-6 drop-shadow-2xl">{activePoi.name}</h2>
                     <p className="text-slate-300 text-2xl leading-relaxed mb-8 font-medium">{activePoi.desc}</p>
                     
                     <div className="flex flex-col gap-4">
                        <button className="w-full bg-sky-500 hover:bg-sky-400 text-white font-black py-6 rounded-3xl text-2xl shadow-[0_20px_40px_rgba(14,165,233,0.3)] transition-all active:scale-95 flex items-center justify-center gap-4">
                           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                           SOLICITAR DIRECCIONES AL MÓVIL (QR)
                        </button>
                        <button onClick={() => setActivePoi(null)} className="w-full bg-slate-800 text-slate-300 font-bold py-5 rounded-3xl text-xl transition-all active:scale-95 border border-white/5">
                           CERRAR DETALLES
                        </button>
                     </div>
                  </div>
              </div>
          </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar, .custom-scrollbar-horizontal::-webkit-scrollbar {
          width: 12px;
          height: 10px;
        }
        .no-scrollbar::-webkit-scrollbar {
           display: none;
        }
        .custom-scrollbar::-webkit-scrollbar-track, .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb, .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          border: 3px solid rgba(0,0,0,0);
          background-clip: padding-box;
        }
        .animate-in {
          animation: modalfade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes modalfade {
          from { opacity: 0; transform: translateY(100px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        button, a {
            touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}
