import React, { useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import MaleconMap from './MaleconMap';

// Ubicación del kiosco (punto de referencia para calcular distancias)
const KIOSK_COORDS = [24.1618, -110.3180];

function haversineMeters([lat1, lon1], [lat2, lon2]) {
  const R = 6371000;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function walkTime(meters) {
  const mins = Math.round(meters / 80);
  if (mins < 1) return '< 1 min';
  return `~${mins} min`;
}

const categories = [
  { id: 'all',             name: 'Todos',          icon: '📍' },
  { id: 'monumentos',      name: 'Monumentos',     icon: '📸' },
  { id: 'comida',          name: 'Comida',         icon: '🌮' },
  { id: 'entretenimiento', name: 'Entretenimiento',icon: '🛹' },
  { id: 'servicios',       name: 'Servicios',      icon: '🛎️' },
];

const pois = [
  { id: 1,  category: 'monumentos',      name: "El Molinito",              coords: [24.1728, -110.3138], desc: "Mirador espectacular famoso por sus esculturas y brisa constante. Ideal para el atardecer.",   image: "https://images.unsplash.com/photo-1566375005881-2292025cc02f?q=80&w=600&auto=format&fit=crop" },
  { id: 2,  category: 'monumentos',      name: "Letras de La Paz",          coords: [24.1614, -110.3183], desc: "El parador fotográfico oficial por excelencia. ¡Tómate la foto del recuerdo frente a la bahía!", image: "https://images.unsplash.com/photo-1596395819057-cb37dd3254b6?q=80&w=600&auto=format&fit=crop" },
  { id: 3,  category: 'monumentos',      name: "Kiosco del Malecón",        coords: [24.1618, -110.3180], desc: "El corazón del malecón. Punto de encuentro principal que alberga eventos culturales.",           image: "https://images.unsplash.com/photo-1574958269340-fa927503f3da?q=80&w=600&auto=format&fit=crop" },
  { id: 4,  category: 'comida',          name: "Heladería La Fuente",       coords: [24.1622, -110.3177], desc: "La nevería más tradicional del malecón. Prueba las paletas de frutas tropicales mexicanas.",    image: "https://images.unsplash.com/photo-1563805042-7684c8e9e9cb?q=80&w=600&auto=format&fit=crop" },
  { id: 5,  category: 'comida',          name: "Restaurante Bismarkcito",   coords: [24.1638, -110.3168], desc: "Tradición sudcaliforniana. Famoso por sus tacos de pescado, mariscos y clamatos frente al mar.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop" },
  { id: 6,  category: 'comida',          name: "Harker Board Co.",          coords: [24.1633, -110.3172], desc: "Terraza con la mejor vista. Disfruta de pizza a la leña, cerveza artesanal y vibra surfera.",   image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop" },
  { id: 7,  category: 'entretenimiento', name: "Rentas de Bicicletas",      coords: [24.1657, -110.3158], desc: "Explora la ciclovía costera rentando ecobicis, carritos de pedales familiares o patinetas.",    image: "https://images.unsplash.com/photo-1528629297340-d1d466945cb5?q=80&w=600&auto=format&fit=crop" },
  { id: 8,  category: 'entretenimiento', name: "Museo de la Ballena",       coords: [24.1606, -110.3187], desc: "Exposiciones masivas e imponentes sobre mamíferos marinos y la biodiversidad del Golfo.",       image: "https://images.unsplash.com/photo-1469502932371-d8ec78913b82?q=80&w=600&auto=format&fit=crop" },
  { id: 9,  category: 'monumentos',      name: "Muelle Fiscal",             coords: [24.1595, -110.3192], desc: "Muelle histórico de la ciudad. Perfecto para adentrarse sobre el mar y observar tortugas y yates.", image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600&auto=format&fit=crop" },
  { id: 10, category: 'entretenimiento', name: "Parque Cuauhtémoc",         coords: [24.1551, -110.3210], desc: "Sombra bajo altos árboles. Ideal para familias, juegos infantiles y skate park.",               image: "https://images.unsplash.com/photo-1620355462534-722a490bd2c7?q=80&w=600&auto=format&fit=crop" },
  { id: 11, category: 'comida',          name: "Puestos de Hot Dogs",       coords: [24.1648, -110.3163], desc: "Imperdibles 'Hates' con tocino, crema y pan calentito. Clásicos nocturnos del malecón.",        image: "https://images.unsplash.com/photo-1605904323214-72cc85b88137?q=80&w=600&auto=format&fit=crop" },
  { id: 12, category: 'servicios',       name: "Baños Públicos",            coords: [24.1621, -110.3179], desc: "Sanitarios públicos con acceso para personas con discapacidad. Mantenimiento constante.",        image: "https://images.unsplash.com/photo-1584622781867-1a4a2b9d3f78?q=80&w=600&auto=format&fit=crop" },
  { id: 13, category: 'servicios',       name: "Cajero Automático (BBVA)",  coords: [24.1631, -110.3173], desc: "Cajero BBVA disponible 24/7. Acepta tarjetas nacionales e internacionales.",                    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop" },
  { id: 14, category: 'servicios',       name: "Estacionamiento Público",   coords: [24.1610, -110.3196], desc: "Estacionamiento tarifado con vigilancia. Acceso desde Calle 5 de Mayo.",                        image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=600&auto=format&fit=crop" },
  { id: 15, category: 'servicios',       name: "Módulo de Turismo",         coords: [24.1616, -110.3182], desc: "Información oficial de COTUCO. Mapas, folletos y recomendaciones de tours en BCS.",             image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600&auto=format&fit=crop" },
];

// ─── Componente: tarjeta de detalle (se muestra dentro del sidebar) ──────────
function DetailPanel({ poi, onClose, showQR, setShowQR, buildMapsUrl }) {
  const cat = categories.find(c => c.id === poi.category);
  const dist = haversineMeters(KIOSK_COORDS, poi.coords);

  return (
    <div className="flex flex-col h-full animate-sidebar-in">
      {/* Imagen */}
      <div className="relative w-full h-44 shrink-0 overflow-hidden">
        <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" draggable="false" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
        <button
          onClick={onClose}
          className="absolute top-3 left-3 w-11 h-11 bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white active:scale-90 transition-all border border-white/15 focus:outline-none z-10"
          aria-label="Volver al directorio"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500 rounded-full text-white text-xs font-black uppercase tracking-wider">
            <span>{cat?.icon}</span> {cat?.name}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700/80 rounded-full text-slate-200 text-xs font-bold border border-white/10">
            🚶 {walkTime(dist)} caminando
          </span>
        </div>

        <h2 className="text-2xl font-black text-white leading-tight">{poi.name}</h2>
        <p className="text-slate-300 text-sm leading-relaxed">{poi.desc}</p>

        {/* Panel QR */}
        {showQR && (
          <div className="flex flex-col items-center gap-3 bg-white rounded-2xl p-4 shadow-2xl">
            <QRCodeSVG
              value={buildMapsUrl(poi)}
              size={160}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iIzRhODVlZiIgZD0iTTEyIDJDOC4xMyAyIDUgNS4xMyA1IDljMCA1LjI1IDcgMTMgNyAxM3M3LTcuNzUgNy0xM2MwLTMuODctMy4xMy03LTctN3ptMCA5LjVjLTEuMzggMC0yLjUtMS4xMi0yLjUtMi41czEuMTItMi41IDIuNS0yLjUgMi41IDEuMTIgMi41IDIuNS0xLjEyIDIuNS0yLjUgMi41eiIvPjwvc3ZnPg==',
                height: 28, width: 28, excavate: true,
              }}
            />
            <div className="text-center">
              <p className="text-slate-800 font-black text-sm">📱 Escanea con tu celular</p>
              <p className="text-slate-500 text-xs mt-0.5">Abre Google Maps con ruta a <strong>{poi.name}</strong></p>
            </div>
            <button onClick={() => setShowQR(false)} className="text-slate-400 text-xs underline focus:outline-none">
              Ocultar QR
            </button>
          </div>
        )}
      </div>

      {/* Botón QR fijo abajo */}
      <div className="px-5 pb-5 pt-3 shrink-0 border-t border-white/8">
        <button
          onClick={() => setShowQR(prev => !prev)}
          className={`w-full font-black py-4 rounded-2xl text-base transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg ${
            showQR ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
          }`}
        >
          {showQR ? (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg> QR LISTO</>
          ) : (
            <><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3zm1 1v5h5V4zm1 1h3v3H5zm8-2h7v7h-7zm1 1v5h5V4zm1 1h3v3h-3zM3 13h7v7H3zm1 1v5h5v-5zm1 1h3v3H5zm9 0h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm2 0h2v2h-2zM15 13h2v2h-2zm4 0h2v2h-2zm-2 2h2v2h-2z"/></svg> ENVIAR AL MÓVIL (QR)</>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function MaleconApp() {
  const [activePoi, setActivePoi]       = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [showQR, setShowQR]             = useState(false);
  const [search, setSearch]             = useState('');

  const buildMapsUrl = (poi) => {
    const [lat, lng] = poi.coords;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(poi.name)}&travelmode=walking`;
  };

  const filteredPois = useMemo(() => {
    let list = activeCategory === 'all' ? pois : pois.filter(p => p.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    }
    return list;
  }, [activeCategory, search]);

  const handleSelectPoi = (poi) => {
    setActivePoi(poi);
    setShowQR(false);
  };

  const handleClosePoi = () => {
    setActivePoi(null);
    setShowQR(false);
  };

  return (
    <div
      className="w-full h-screen overflow-hidden flex flex-row select-none"
      style={{ background: 'radial-gradient(circle at top left, #082f49 0%, #020617 100%)' }}
    >
      {/* ── MAPA (izquierda, flexible) ──────────────────────────────────── */}
      <div className="flex-1 relative">
        <MaleconMap activePoi={activePoi} pois={filteredPois} setActivePoi={handleSelectPoi} />
      </div>

      {/* ── SIDEBAR (derecha, ancho fijo) ───────────────────────────────── */}
      <aside
        className="w-[400px] shrink-0 h-full flex flex-col overflow-hidden relative z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(2,8,28,0.97) 0%, rgba(8,30,63,0.97) 100%)',
          borderLeft: '1.5px solid rgba(56,189,248,0.15)',
          boxShadow: '-12px 0 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Vista: Directorio */}
        {!activePoi && (
          <div className="flex flex-col h-full">
            {/* Encabezado */}
            <div className="px-5 pt-6 pb-3 shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-cyan-400 text-xs font-black uppercase tracking-[0.2em]">Guía Interactiva</span>
              </div>
              <h1 className="text-2xl font-black text-white leading-tight">
                Directorio del<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-400">Malecón de La Paz</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">Toca un lugar para verlo en el mapa</p>
            </div>

            {/* Buscador */}
            <div className="px-5 pb-3 shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar lugar..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-slate-800/70 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500/60 transition-colors"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 focus:outline-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filtros de categoría (grid 2 col) */}
            <div className="px-5 pb-3 shrink-0 grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl font-bold text-sm transition-all focus:outline-none active:scale-95 border ${
                    activeCategory === cat.id
                      ? 'bg-sky-500/20 border-sky-400/60 text-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.2)]'
                      : 'bg-slate-800/40 border-white/8 text-slate-400'
                  }`}
                >
                  <span className="text-lg leading-none">{cat.icon}</span>
                  <span className="leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Contador de resultados */}
            <div className="px-5 pb-2 shrink-0">
              <span className="text-slate-500 text-xs font-semibold">
                {filteredPois.length} {filteredPois.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
              </span>
            </div>

            {/* Lista de POIs */}
            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3 custom-scrollbar">
              {filteredPois.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                  <span className="text-4xl mb-3">🔍</span>
                  <p className="font-semibold text-sm">Sin resultados</p>
                  <p className="text-xs mt-1">Intenta con otro término</p>
                </div>
              )}
              {filteredPois.map((poi) => {
                const isActive = activePoi?.id === poi.id;
                const dist = haversineMeters(KIOSK_COORDS, poi.coords);
                const cat = categories.find(c => c.id === poi.category);
                return (
                  <button
                    key={poi.id}
                    onClick={() => handleSelectPoi(poi)}
                    className={`w-full text-left rounded-2xl transition-all duration-200 border overflow-hidden flex items-stretch focus:outline-none active:scale-[0.98] ${
                      isActive
                        ? 'bg-sky-500/15 border-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                        : 'bg-slate-800/40 border-white/6 hover:border-white/15'
                    }`}
                  >
                    {/* Imagen lateral */}
                    <div className="w-20 h-20 shrink-0 overflow-hidden">
                      <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" draggable="false" />
                    </div>
                    {/* Texto */}
                    <div className="flex-1 px-3 py-2.5 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs leading-none">{cat?.icon}</span>
                        <span className={`text-xs font-bold truncate ${isActive ? 'text-sky-400' : 'text-slate-400'}`}>
                          {cat?.name}
                        </span>
                        <span className="ml-auto text-[11px] text-slate-500 font-medium whitespace-nowrap">🚶 {walkTime(dist)}</span>
                      </div>
                      <p className={`font-black text-sm leading-snug ${isActive ? 'text-sky-200' : 'text-white'}`}>{poi.name}</p>
                      <p className="text-slate-400 text-xs leading-snug mt-0.5 line-clamp-2">{poi.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista: Detalle del POI seleccionado */}
        {activePoi && (
          <DetailPanel
            poi={activePoi}
            onClose={handleClosePoi}
            showQR={showQR}
            setShowQR={setShowQR}
            buildMapsUrl={buildMapsUrl}
          />
        )}
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 99px; }
        .animate-sidebar-in { animation: sidebarIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes sidebarIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        button, a { touch-action: manipulation; }
      `}</style>
    </div>
  );
}
