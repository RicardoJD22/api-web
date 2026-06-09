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
  { id: 'comida',          name: 'Restaurantes',   icon: '🌮' },
  { id: 'hoteles',         name: 'Hoteles',        icon: '🏨' },
  { id: 'antros',          name: 'Bares / Antros', icon: '🎵' },
  { id: 'transporte',      name: 'Transporte',     icon: '🚌' },
  { id: 'comercios',       name: 'Comercios',      icon: '🛍️' },
  { id: 'entretenimiento', name: 'Entretenimiento',icon: '🛹' },
  { id: 'servicios',       name: 'Servicios',      icon: '🛎️' },
];

const pois = [
  // ── MONUMENTOS ──────────────────────────────────────────────────────────────
  { id: 1,  category: 'monumentos',  name: "El Molinito",              coords: [24.1728, -110.3138], desc: "Mirador espectacular famoso por sus esculturas y brisa constante. Ideal para el atardecer.", image: "https://images.unsplash.com/photo-1566375005881-2292025cc02f?q=80&w=600" },
  { id: 2,  category: 'monumentos',  name: "Letras de La Paz",         coords: [24.1614, -110.3183], desc: "El parador fotográfico más icónico. ¡Tómate la foto del recuerdo frente a la bahía!",      image: "https://images.unsplash.com/photo-1596395819057-cb37dd3254b6?q=80&w=600" },
  { id: 3,  category: 'monumentos',  name: "Kiosco del Malecón",       coords: [24.1618, -110.3180], desc: "Corazón del malecón. Punto de encuentro para eventos culturales y conciertos al aire libre.", image: "https://images.unsplash.com/photo-1574958269340-fa927503f3da?q=80&w=600" },
  { id: 4,  category: 'monumentos',  name: "Muelle Fiscal",            coords: [24.1595, -110.3192], desc: "Muelle histórico. Perfecto para adentrarse al mar y observar tortugas y veleros.",           image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=600" },
  { id: 5,  category: 'monumentos',  name: "Monumento al Pescador",    coords: [24.1645, -110.3165], desc: "Escultura emblemática que rinde homenaje a los pescadores sudcalifornianos.",                image: "https://images.unsplash.com/photo-1620914907441-01de36a10b06?q=80&w=600" },
  { id: 6,  category: 'monumentos',  name: "Faro del Malecón",         coords: [24.1665, -110.3155], desc: "Faro histórico que ha guiado embarcaciones por décadas. Punto de referencia del malecón.",  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" },

  // ── RESTAURANTES ────────────────────────────────────────────────────────────
  { id: 7,  category: 'comida',      name: "Restaurante Bismarkcito",  coords: [24.1638, -110.3168], desc: "Tradición sudcaliforniana. Famoso por tacos de pescado, mariscos y clamatos frente al mar.", image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600" },
  { id: 8,  category: 'comida',      name: "Harker Board Co.",         coords: [24.1633, -110.3172], desc: "Terraza con la mejor vista. Pizza a la leña, cerveza artesanal y vibra surfera.",           image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600" },
  { id: 9,  category: 'comida',      name: "Heladería La Fuente",      coords: [24.1622, -110.3177], desc: "La nevería más tradicional. Prueba las paletas de frutas tropicales mexicanas.",             image: "https://images.unsplash.com/photo-1563805042-7684c8e9e9cb?q=80&w=600" },
  { id: 10, category: 'comida',      name: "Puestos de Hot Dogs",      coords: [24.1648, -110.3163], desc: "Imperdibles 'Hates' con tocino, crema y pan calentito. Clásicos nocturnos del malecón.",    image: "https://images.unsplash.com/photo-1605904323214-72cc85b88137?q=80&w=600" },
  { id: 11, category: 'comida',      name: "El Taste",                 coords: [24.1625, -110.3176], desc: "Mariscos frescos y botanas con vista al mar. Ambiente familiar y porciones generosas.",     image: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=600" },
  { id: 12, category: 'comida',      name: "La Pazta Nostra",          coords: [24.1631, -110.3173], desc: "Pasta fresca artesanal y cocina italiana con vista a la bahía de La Paz.",                  image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600" },
  { id: 13, category: 'comida',      name: "Rancho Viejo",             coords: [24.1641, -110.3166], desc: "Auténtica carne asada y cortes norteños. El sabor de Baja California en el malecón.",      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600" },

  // ── HOTELES ─────────────────────────────────────────────────────────────────
  { id: 14, category: 'hoteles',     name: "Hotel Perla",              coords: [24.1617, -110.3179], desc: "Ícono histórico del malecón. Vista directa a la bahía, alberca, restaurante y bar.",        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600" },
  { id: 15, category: 'hoteles',     name: "Hotel Los Arcos",          coords: [24.1610, -110.3185], desc: "Ubicado en el corazón del malecón con acceso directo a la playa y zona de restaurantes.",   image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600" },
  { id: 16, category: 'hoteles',     name: "Hotel Seven Crown",        coords: [24.1630, -110.3174], desc: "Hotel moderno frente a la bahía. Habitaciones con vista al mar y servicio de primera.",     image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=600" },
  { id: 17, category: 'hoteles',     name: "La Concha Beach Resort",   coords: [24.1580, -110.3195], desc: "Resort de playa con marina privada, kayaks y acceso directo a la tranquila bahía.",         image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600" },

  // ── BARES / ANTROS ──────────────────────────────────────────────────────────
  { id: 18, category: 'antros',      name: "La Miserable",             coords: [24.1635, -110.3170], desc: "Bar de ambiente bohemio con música en vivo, cócteles artesanales y terraza al malecón.",    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600" },
  { id: 19, category: 'antros',      name: "Sancho's Bar & Grill",     coords: [24.1628, -110.3175], desc: "Favorito de locales y turistas. Cervezas frías, cócteles tropicales y música relajada.",    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=600" },
  { id: 20, category: 'antros',      name: "El Zarape Bar",            coords: [24.1642, -110.3165], desc: "Antro con DJ los fines de semana, pista de baile y los mejores tragos del malecón.",        image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=600" },
  { id: 21, category: 'antros',      name: "Roof Bar Malecón",         coords: [24.1620, -110.3178], desc: "Terraza en azotea con vista panorámica a la bahía. Ambiente lounge y sunsets únicos.",      image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=600" },

  // ── TRANSPORTE ──────────────────────────────────────────────────────────────
  { id: 22, category: 'transporte',  name: "Terminal de Autobuses",    coords: [24.1432, -110.3180], desc: "Terminal principal Autobuses Águila y ABC. Rutas a Los Cabos, Loreto, La Paz-Tijuana.",     image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=600" },
  { id: 23, category: 'transporte',  name: "Muelle Pichilingue (Ferry)",coords: [24.2050, -110.3120], desc: "Terminal de ferry BAJA FERRIES. Servicio a Mazatlán y Topolobampo. ~6 hrs de travesía.",   image: "https://images.unsplash.com/photo-1623238913972-02bc6dc7bde7?q=80&w=600" },
  { id: 24, category: 'transporte',  name: "Sitio de Taxis Malecón",   coords: [24.1619, -110.3181], desc: "Taxis autorizados disponibles 24/7. Traslados al aeropuerto, hoteles y puntos turísticos.", image: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=600" },
  { id: 25, category: 'transporte',  name: "Aeropuerto Gral. Márquez", coords: [24.0722, -110.3621], desc: "Aeropuerto Internacional de La Paz. Vuelos a CDMX, Guadalajara, Los Ángeles y más.",        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600" },

  // ── COMERCIOS ───────────────────────────────────────────────────────────────
  { id: 26, category: 'comercios',   name: "Artesanías del Malecón",   coords: [24.1623, -110.3177], desc: "Tienda de artesanías, recuerdos y productos típicos de Baja California Sur.",               image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600" },
  { id: 27, category: 'comercios',   name: "Farmacia Similares",       coords: [24.1626, -110.3176], desc: "Farmacia con medicamentos genéricos de bajo costo. Médico gratis en consulta básica.",       image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=600" },
  { id: 28, category: 'comercios',   name: "OXXO Malecón",             coords: [24.1629, -110.3174], desc: "Tienda de conveniencia abierta 24/7. Bebidas, snacks, recargas y pago de servicios.",       image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=600" },
  { id: 29, category: 'comercios',   name: "Boutique Mar de Cortés",   coords: [24.1636, -110.3169], desc: "Ropa de playa, trajes de baño y accesorios. Marcas locales e internacionales.",             image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=600" },

  // ── ENTRETENIMIENTO ─────────────────────────────────────────────────────────
  { id: 30, category: 'entretenimiento', name: "Rentas de Bicicletas", coords: [24.1657, -110.3158], desc: "Explora la ciclovía costera rentando ecobicis, carritos de pedales o patinetas.",          image: "https://images.unsplash.com/photo-1528629297340-d1d466945cb5?q=80&w=600" },
  { id: 31, category: 'entretenimiento', name: "Museo de la Ballena",  coords: [24.1606, -110.3187], desc: "Exposiciones sobre mamíferos marinos y biodiversidad del Golfo de California.",             image: "https://images.unsplash.com/photo-1469502932371-d8ec78913b82?q=80&w=600" },
  { id: 32, category: 'entretenimiento', name: "Parque Cuauhtémoc",    coords: [24.1551, -110.3210], desc: "Sombra bajo altos árboles. Juegos infantiles, skate park y zona deportiva.",                image: "https://images.unsplash.com/photo-1620355462534-722a490bd2c7?q=80&w=600" },
  { id: 33, category: 'entretenimiento', name: "Tour en Kayak",        coords: [24.1600, -110.3190], desc: "Operadoras de tour en kayak y paddleboard. Explora el mar de Cortés desde el malecón.",    image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?q=80&w=600" },

  // ── SERVICIOS ───────────────────────────────────────────────────────────────
  { id: 34, category: 'servicios',   name: "Baños Públicos",           coords: [24.1621, -110.3179], desc: "Sanitarios públicos con acceso para personas con discapacidad. Mantenimiento constante.",    image: "https://images.unsplash.com/photo-1584622781867-1a4a2b9d3f78?q=80&w=600" },
  { id: 35, category: 'servicios',   name: "Cajero BBVA",              coords: [24.1631, -110.3173], desc: "Cajero BBVA disponible 24/7. Acepta tarjetas nacionales e internacionales.",                 image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600" },
  { id: 36, category: 'servicios',   name: "Módulo de Turismo COTUCO", coords: [24.1616, -110.3182], desc: "Información oficial turística. Mapas, folletos, tours y recomendaciones de BCS.",           image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600" },
  { id: 37, category: 'servicios',   name: "Estacionamiento Público",  coords: [24.1610, -110.3196], desc: "Estacionamiento tarifado con vigilancia. Acceso desde Calle 5 de Mayo.",                    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=600" },
  { id: 38, category: 'servicios',   name: "Cruz Roja La Paz",         coords: [24.1580, -110.3210], desc: "Delegación Cruz Roja. Atención de emergencias y primeros auxilios.",                        image: "https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?q=80&w=600" },
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
            <div className="px-5 pb-3 shrink-0 grid grid-cols-3 gap-2">
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
