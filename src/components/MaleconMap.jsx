import React, { useEffect, useRef } from 'react';
import Map, { Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

// ──────────────────────────────────────────────────────────────────────────────
//  ESTILO DEL MAPA
//  OpenFreeMap "fiord" (azul marino profundo) — sin API key, vector tiles nítidos
// ──────────────────────────────────────────────────────────────────────────────
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/dark';

// Centro del Malecón — Paseo Álvaro Obregón, La Paz BCS
const DEFAULT_LNG  = -110.3178;
const DEFAULT_LAT  =  24.1618;
const DEFAULT_ZOOM =  17;

// Ubicación exacta del kiosco interactivo
const KIOSK_LAT =  24.1618;
const KIOSK_LNG = -110.3180;

// ──────────────────────────────────────────────────────────────────────────────
//  SISTEMA DE SÍMBOLOS CARTOGRÁFICOS POR CATEGORÍA
// ──────────────────────────────────────────────────────────────────────────────
const CATEGORIES = {
  monumentos: {
    bg:     '#f59e0b',
    border: '#78350f',
    glow:   '245,158,11',
    Icon: ({ size }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
        {/* Cámara fotográfica / monumento */}
        <path d="M12 2C8.13 2 5 5.13 5 9c0 3.28 1.82 6.12 4.5 7.6V21h5v-4.4C17.18 15.12 19 12.28 19 9c0-3.87-3.13-7-7-7zm0 10c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
    ),
  },
  comida: {
    bg:     '#ef4444',
    border: '#7f1d1d',
    glow:   '239,68,68',
    Icon: ({ size }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
        {/* Tenedor & cuchillo */}
        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
      </svg>
    ),
  },
  entretenimiento: {
    bg:     '#22c55e',
    border: '#14532d',
    glow:   '34,197,94',
    Icon: ({ size }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
        <path d="M12 3a9 9 0 100 18A9 9 0 0012 3zm-1 13v-4H7l5-9v4h4l-5 9z" />
      </svg>
    ),
  },
  servicios: {
    bg:     '#a855f7',
    border: '#581c87',
    glow:   '168,85,247',
    Icon: ({ size }) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="white">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
      </svg>
    ),
  },
};

const DEFAULT_CAT = {
  bg: '#6366f1', border: '#3730a3', glow: '99,102,241',
  Icon: ({ size }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="white"><circle cx="12" cy="12" r="6"/></svg>,
};

// ──────────────────────────────────────────────────────────────────────────────
//  COMPONENTE: "ESTÁS AQUÍ" — marcador fijo del kiosco
// ──────────────────────────────────────────────────────────────────────────────
function YouAreHereMarker() {
  return (
    <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Halo exterior pulsante */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: 'rgba(34,211,238,0.25)',
        animation: 'youHerePulse 2s ease-out infinite',
      }} />
      {/* Anillo medio */}
      <div style={{
        position: 'absolute', inset: 8, borderRadius: '50%',
        background: 'rgba(34,211,238,0.4)',
        animation: 'youHerePulse 2s ease-out infinite 0.4s',
      }} />
      {/* Punto central */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: 22, height: 22, borderRadius: '50%',
        background: 'linear-gradient(135deg, #22d3ee, #0891b2)',
        border: '3px solid white',
        boxShadow: '0 0 16px rgba(34,211,238,0.9), 0 2px 8px rgba(0,0,0,0.6)',
      }} />
      {/* Etiqueta */}
      <div style={{
        position: 'absolute', bottom: -28, left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        background: 'rgba(2,6,23,0.9)',
        backdropFilter: 'blur(8px)',
        border: '1.5px solid rgba(34,211,238,0.5)',
        borderRadius: 999,
        padding: '3px 10px',
        color: '#22d3ee',
        fontSize: 11, fontWeight: 800,
        letterSpacing: 1,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      }}>
        📍 Estás aquí
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  COMPONENTE: MARCADOR CARTOGRÁFICO
//  Forma teardrop (gota) rotada 45° — estándar en cartografía digital
// ──────────────────────────────────────────────────────────────────────────────
function MapMarker({ poi, isActive, index, onClick }) {
  const cat  = CATEGORIES[poi.category] || DEFAULT_CAT;
  const { Icon } = cat;
  const base = isActive ? 54 : 42;

  return (
    <div
      onClick={onClick}
      title={poi.name}
      style={{
        position: 'relative',
        width:  base,
        height: base + 10,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        filter: isActive
          ? `drop-shadow(0 0 14px rgba(${cat.glow},0.8))`
          : `drop-shadow(0 4px 8px rgba(0,0,0,0.7))`,
        transition: 'filter 0.3s ease, transform 0.3s ease',
        transform: isActive ? 'scale(1.15)' : 'scale(1)',
      }}
    >
      {/* Halo de pulso en el marcador activo */}
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 10,
          borderRadius: '50%',
          background: `rgba(${cat.glow}, 0.35)`,
          animation: 'markerPulse 1.8s ease-out infinite',
        }} />
      )}

      {/* Cuerpo teardrop */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width:  base,
        height: base,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        background: `linear-gradient(135deg, ${cat.bg}ee, ${cat.bg}cc)`,
        border: `2.5px solid ${cat.border}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 12px rgba(0,0,0,0.5)`,
        transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        {/* Ícono centrado (compensamos la rotación del padre) */}
        <div style={{
          position: 'absolute', inset: 0,
          transform: 'rotate(45deg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={Math.round(base * 0.5)} />
        </div>
      </div>

      {/* Número correlativo de referencia */}
      <div style={{
        position: 'absolute',
        top: -8, right: -7,
        width: 19, height: 19,
        background: '#fff',
        color: cat.bg,
        borderRadius: '50%',
        fontSize: 10, fontWeight: 900,
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `2px solid ${cat.border}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        zIndex: 3,
        lineHeight: 1,
      }}>
        {index + 1}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  BOTÓN DE ZOOM   (estilo kiosco premium)
// ──────────────────────────────────────────────────────────────────────────────
function ZoomButton({ onClick, ariaLabel, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      style={{
        width: 50, height: 50,
        background: 'rgba(2,6,23,0.85)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255,255,255,0.15)',
        borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', cursor: 'pointer',
        boxShadow: '0 6px 24px rgba(0,0,0,0.7)',
        transition: 'background 0.2s, transform 0.15s',
        outline: 'none',
      }}
    >
      {children}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  LEYENDA CARTOGRÁFICA
// ──────────────────────────────────────────────────────────────────────────────
const LEGEND_ITEMS = [
  { key: 'monumentos',      label: 'Monumentos / Fotos', color: '#f59e0b' },
  { key: 'comida',          label: 'Comida y Bebida',    color: '#ef4444' },
  { key: 'entretenimiento', label: 'Entretenimiento',    color: '#22c55e' },
  { key: 'servicios',       label: 'Servicios',          color: '#a855f7' },
];

// ──────────────────────────────────────────────────────────────────────────────
//  COMPONENTE PRINCIPAL
// ──────────────────────────────────────────────────────────────────────────────
export default function MaleconMap({ activePoi, pois, setActivePoi }) {
  const mapRef = useRef(null);

  // Vuelo animado al seleccionar un POI
  useEffect(() => {
    const map = mapRef.current?.getMap?.() ?? mapRef.current;
    if (!map) return;

    if (activePoi) {
      map.flyTo({
        center:   [activePoi.coords[1], activePoi.coords[0]],
        zoom:     18.5,
        duration: 1200,
        essential: true,
      });
    } else {
      map.flyTo({
        center:   [DEFAULT_LNG, DEFAULT_LAT],
        zoom:     DEFAULT_ZOOM,
        duration: 1000,
      });
    }
  }, [activePoi]);

  const zoomIn    = () => mapRef.current?.getMap?.()?.zoomIn()  ?? mapRef.current?.zoomIn();
  const zoomOut   = () => mapRef.current?.getMap?.()?.zoomOut() ?? mapRef.current?.zoomOut();
  const resetView = () => {
    const map = mapRef.current?.getMap?.() ?? mapRef.current;
    map?.flyTo({ center: [DEFAULT_LNG, DEFAULT_LAT], zoom: DEFAULT_ZOOM, duration: 1000 });
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>

      {/* ── MAPA PRINCIPAL ─────────────────────────────────────────────── */}
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: DEFAULT_LNG,
          latitude:  DEFAULT_LAT,
          zoom:      DEFAULT_ZOOM,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        minZoom={13}
        maxZoom={19}
        maxBounds={[[-110.370, 24.125], [-110.265, 24.205]]}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
      >
        {/* Marcadores POI */}
        {pois.map((poi, idx) => (
          <Marker
            key={poi.id}
            longitude={poi.coords[1]}
            latitude={poi.coords[0]}
            anchor="bottom"
            style={{ zIndex: activePoi?.id === poi.id ? 100 : idx + 1, cursor: 'pointer' }}
          >
            <MapMarker
              poi={poi}
              isActive={activePoi?.id === poi.id}
              index={idx}
              onClick={() => setActivePoi(poi)}
            />
          </Marker>
        ))}

        {/* Marcador fijo: "Estás aquí" (kiosco) */}
        <Marker
          longitude={KIOSK_LNG}
          latitude={KIOSK_LAT}
          anchor="center"
          style={{ zIndex: 200 }}
        >
          <YouAreHereMarker />
        </Marker>
      </Map>

      {/* ── CONTROLES DE ZOOM ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', right: 18, top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <ZoomButton onClick={zoomIn} ariaLabel="Acercar">
          <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"/>
          </svg>
        </ZoomButton>
        <ZoomButton onClick={zoomOut} ariaLabel="Alejar">
          <svg width="24" height="24" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4"/>
          </svg>
        </ZoomButton>
        <ZoomButton onClick={resetView} ariaLabel="Centrar en el Malecón">
          <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" strokeWidth="2.5"/>
            <path strokeLinecap="round" strokeWidth="2.5" d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
          </svg>
        </ZoomButton>
      </div>

      {/* ── LEYENDA ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 18, left: 18, zIndex: 10,
        background: 'rgba(2,6,23,0.88)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid rgba(255,255,255,0.12)',
        borderRadius: 20,
        padding: '14px 18px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.7)',
        display: 'flex', flexDirection: 'column', gap: 10,
        minWidth: 188,
      }}>
        <span style={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: 10, fontWeight: 800,
          letterSpacing: 2, textTransform: 'uppercase',
          marginBottom: 2,
        }}>
          Leyenda
        </span>
        {LEGEND_ITEMS.map(item => (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 13, height: 13,
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              background: item.color,
              border: '2px solid rgba(0,0,0,0.35)',
              flexShrink: 0,
            }} />
            <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, fontWeight: 600 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── BADGE SUPERIOR ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 14, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10, pointerEvents: 'none',
        background: 'rgba(2,6,23,0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(56,189,248,0.28)',
        borderRadius: 999,
        padding: '8px 24px',
        color: '#38bdf8',
        fontSize: 11, fontWeight: 800,
        letterSpacing: 3, textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        Malecón de La Paz · Guía Interactiva
      </div>

      {/* ── KEYFRAMES ──────────────────────────────────────────────────── */}
      <style>{`
        @keyframes markerPulse {
          0%   { transform: scale(0.85); opacity: 0.9; }
          70%  { transform: scale(2.4);  opacity: 0;   }
          100% { transform: scale(0.85); opacity: 0;   }
        }
        @keyframes youHerePulse {
          0%   { transform: scale(0.8);  opacity: 0.8; }
          70%  { transform: scale(1.8);  opacity: 0;   }
          100% { transform: scale(0.8);  opacity: 0;   }
        }
        /* Ocultar attribution de MapLibre */
        .maplibregl-ctrl-attrib,
        .maplibregl-ctrl-logo { display: none !important; }
        /* Sin outline al hacer click en el canvas */
        .maplibregl-canvas:focus { outline: none !important; }
        /* Cursor grab */
        .maplibregl-canvas-container { cursor: grab !important; }
        .maplibregl-canvas-container:active { cursor: grabbing !important; }
      `}</style>
    </div>
  );
}
