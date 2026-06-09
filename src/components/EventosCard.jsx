import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ─── DATOS DE EVENTOS ────────────────────────────────────────────────────────
const eventos = [
  {
    id: 1,
    icon: "🎨",
    accent: "#ec4899",       // pink
    accentDark: "#831843",
    title: "Noche de Arte Urbano",
    resumen: "Muralismo en vivo & exposición",
    descripcion: "Artistas locales pintan murales en tiempo real bajo las estrellas. Música ambiental, talleres para toda la familia y zona de food trucks.",
    fecha: "Vie 6 Sep",
    hora: "19:00 hrs",
    lugar: "Kiosco del Malecón",
    tag: "Arte & Cultura",
    image: "https://images.unsplash.com/photo-1509721434272-b79147e0e708?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 2,
    icon: "🏃‍♂️",
    accent: "#22c55e",       // green
    accentDark: "#14532d",
    title: "Carrera Atlética 5K",
    resumen: "Deporte & convivencia familiar",
    descripcion: "La carrera clásica del malecón. Inscripción gratuita, medallas para los primeros lugares y ambiente deportivo familiar frente a la bahía.",
    fecha: "Dom 8 Sep",
    hora: "7:00 hrs",
    lugar: "Inicio: Muelle Fiscal",
    tag: "Deporte",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 3,
    icon: "🎶",
    accent: "#f59e0b",       // amber
    accentDark: "#78350f",
    title: "Festival de Jazz",
    resumen: "Música en vivo frente al mar",
    descripcion: "Bandas de jazz nacionales e internacionales en un escenario con vista al Golfo. Zona lounge, foodtrucks y el mejor atardecer de La Paz.",
    fecha: "Sáb 14 Sep",
    hora: "18:00 hrs",
    lugar: "Explanada del Malecón",
    tag: "Música",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 4,
    icon: "🚴‍♀️",
    accent: "#38bdf8",       // sky
    accentDark: "#0c4a6e",
    title: "Rodada Nocturna",
    resumen: "Ciclismo recreativo nocturno",
    descripcion: "Únete a la rodada familiar bajo las luces del malecón. Casco y luces recomendados. Premios a las bicicletas mejor decoradas.",
    fecha: "Vie 20 Sep",
    hora: "20:00 hrs",
    lugar: "Punto: Kiosco Central",
    tag: "Recreativo",
    image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=700&auto=format&fit=crop",
  },
  {
    id: 5,
    icon: "🎭",
    accent: "#a855f7",       // purple
    accentDark: "#4a1d96",
    title: "Teatro al Aire Libre",
    resumen: "Obras & espectáculos familiares",
    descripcion: "Obras clásicas y espectáculos para todas las edades en el foro cultural. Lleva tu silla o manta para mayor comodidad bajo las estrellas.",
    fecha: "Dom 22 Sep",
    hora: "19:30 hrs",
    lugar: "Foro Cultural",
    tag: "Teatro",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=700&auto=format&fit=crop",
  },
];

// ─── TARJETA MINI EN EL CARRUSEL ─────────────────────────────────────────────
function EventoMiniCard({ evento, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Ver detalles de ${evento.title}`}
      style={{
        width: "100%",
        background: isActive
          ? `linear-gradient(135deg, ${evento.accent}22, ${evento.accent}11)`
          : "rgba(255,255,255,0.04)",
        border: `1.5px solid ${isActive ? evento.accent + "60" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "1.5rem",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        textAlign: "left",
        outline: "none",
        boxShadow: isActive ? `0 0 24px ${evento.accent}30` : "none",
      }}
    >
      {/* Ícono con fondo de color */}
      <div style={{
        width: 48, height: 48,
        borderRadius: "1rem",
        background: `linear-gradient(135deg, ${evento.accent}33, ${evento.accent}11)`,
        border: `1px solid ${evento.accent}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem",
        flexShrink: 0,
      }}>
        {evento.icon}
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          color: "white", fontWeight: 900, fontSize: "1rem",
          lineHeight: 1, letterSpacing: "-0.05em",
          textTransform: "uppercase",
          marginBottom: 3,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          fontFamily: "'Outfit', sans-serif",
        }}>
          {evento.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            color: evento.accent, fontSize: "0.75rem", fontWeight: 700,
            background: `${evento.accent}20`, padding: "2px 8px",
            borderRadius: 999, border: `1px solid ${evento.accent}30`,
            whiteSpace: "nowrap",
          }}>
            {evento.tag}
          </span>
          <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            {evento.fecha}
          </span>
        </div>
      </div>

      {/* Flecha */}
      <svg width="16" height="16" fill="none" stroke={isActive ? evento.accent : "rgba(255,255,255,0.25)"} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  );
}

// ─── MODAL DE DETALLE ─────────────────────────────────────────────────────────
function EventoModal({ evento, onClose }) {
  // Bloquear scroll del body mientras el modal esté abierto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const overlay = (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0,
        zIndex: 99999,
        background: "rgba(2,6,23,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        animation: "overlayIn 0.25s ease forwards",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          overflowY: "auto",
          background: "linear-gradient(170deg, #0f172a 0%, #0c1a2e 60%, #020617 100%)",
          border: `2px solid ${evento.accent}50`,
          borderRadius: "2.5rem",
          boxShadow: `0 0 120px ${evento.accent}30`,
          animation: "modalUp 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
          scrollbarWidth: "none",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── IMAGEN DE CABECERA ── */}
        <div style={{ position: "relative", height: "42%", minHeight: 280, flexShrink: 0, overflow: "hidden", borderRadius: "2.5rem 2.5rem 0 0" }}>
          <img
            src={evento.image}
            alt={evento.title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, #0f172a 0%, ${evento.accent}15 55%, transparent 100%)`,
          }} />
          {/* Tag flotante */}
          <div style={{
            position: "absolute", top: 24, left: 24,
            background: evento.accent,
            color: "#fff", fontWeight: 800,
            fontSize: "1rem", letterSpacing: "0.15em",
            textTransform: "uppercase",
            padding: "10px 24px", borderRadius: 999,
            boxShadow: `0 4px 24px ${evento.accent}70`,
            fontFamily: "'Outfit', sans-serif",
          }}>
            {evento.icon} {evento.tag}
          </div>
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              position: "absolute", top: 20, right: 20,
              width: 64, height: 64,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255,255,255,0.25)",
              borderRadius: "50%",
              color: "white", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              outline: "none",
            }}
          >
            <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── CONTENIDO ── */}
        <div style={{ flex: 1, padding: "36px 40px 44px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Título */}
          <h2 style={{
            color: "white", fontWeight: 900, fontSize: "2.8rem",
            lineHeight: 1, letterSpacing: "-0.04em",
            textTransform: "uppercase",
            margin: 0,
            fontFamily: "'Outfit', sans-serif",
            textShadow: `0 0 40px ${evento.accent}50`,
          }}>
            {evento.title}
          </h2>

          {/* Descripción */}
          <p style={{
            color: "rgba(255,255,255,0.8)", fontSize: "1.25rem",
            lineHeight: 1.65, margin: 0,
            fontFamily: "'Outfit', sans-serif",
            flex: 1,
          }}>
            {evento.descripcion}
          </p>

          {/* Info chips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { emoji: "📅", label: `${evento.fecha} · ${evento.hora}` },
              { emoji: "📍", label: evento.lugar },
            ].map(({ emoji, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 14,
                background: `${evento.accent}15`,
                border: `1.5px solid ${evento.accent}40`,
                borderRadius: "1.25rem",
                padding: "16px 22px",
              }}>
                <span style={{ fontSize: "1.6rem" }}>{emoji}</span>
                <span style={{ color: "rgba(255,255,255,0.95)", fontSize: "1.1rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Botón principal */}
          <button
            onClick={onClose}
            style={{
              width: "100%",
              background: `linear-gradient(135deg, ${evento.accent}, ${evento.accent}cc)`,
              color: "white", fontWeight: 900,
              fontSize: "1.3rem", letterSpacing: "0.1em",
              textTransform: "uppercase",
              border: "none", borderRadius: "1.75rem",
              padding: "26px",
              cursor: "pointer",
              boxShadow: `0 16px 48px ${evento.accent}55`,
              fontFamily: "'Outfit', sans-serif",
              marginTop: "auto",
            }}
          >
            ¡Nos Vemos en el Evento!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes overlayIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : null;
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
function EventosCard() {
  const [eventoActivo, setEventoActivo] = useState(null);
  const [modalEvento, setModalEvento]   = useState(null);
  const [autoIdx, setAutoIdx]           = useState(0);
  const intervalRef = useRef(null);

  // Auto-rotación cada 4 s
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setAutoIdx(i => (i + 1) % eventos.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleCardClick = (idx) => {
    clearInterval(intervalRef.current); // parar auto-rotación al interactuar
    setEventoActivo(idx === eventoActivo ? null : idx);
  };

  const openModal = (ev) => { setModalEvento(ev); };
  const closeModal = () => setModalEvento(null);

  // Evento destacado en el hero (el activo o el auto)
  const heroIdx = eventoActivo !== null ? eventoActivo : autoIdx;
  const hero    = eventos[heroIdx];

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      background: "linear-gradient(160deg, #020617 0%, #0a1628 100%)",
      borderRadius: "inherit",
      overflow: "hidden",
      position: "relative",
      userSelect: "none",
    }}>

      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        height: 170,
        flexShrink: 0,
        overflow: "hidden",
        transition: "all 0.4s ease",
      }}>
        {/* Imagen de fondo del evento destacado */}
        <img
          key={hero.id}
          src={hero.image}
          alt={hero.title}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transition: "opacity 0.6s ease",
          }}
        />
        {/* Gradiente oscuro */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to top, #020617 0%, ${hero.accent}20 50%, rgba(0,0,0,0.3) 100%)`,
        }} />

        {/* Badge "PRÓXIMOS EVENTOS" */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(2,6,23,0.75)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.7)",
          fontSize: "0.75rem", fontWeight: 800,
          letterSpacing: "0.18em", textTransform: "uppercase",
          padding: "5px 12px", borderRadius: 999,
        }}>
          🗓️ Próximos Eventos
        </div>

        {/* Indicadores de posición */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          display: "flex", gap: 5,
        }}>
          {eventos.map((_, i) => (
            <div key={i} style={{
              width: i === heroIdx ? 18 : 6, height: 6,
              borderRadius: 3,
              background: i === heroIdx ? hero.accent : "rgba(255,255,255,0.25)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        {/* Info del evento hero */}
        <div style={{
          position: "absolute", bottom: 14, left: 14, right: 14,
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: hero.accent,
            color: "white", fontSize: "0.75rem", fontWeight: 800,
            letterSpacing: "0.12em", textTransform: "uppercase",
            padding: "3px 10px", borderRadius: 999, marginBottom: 5,
          }}>
            {hero.icon} {hero.tag}
          </div>
          <div style={{
            color: "white", fontWeight: 900,
            fontSize: "1.25rem", lineHeight: 1,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            fontFamily: "'Outfit', sans-serif",
          }}>
            {hero.title}
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem", fontWeight: 600, marginTop: 2 }}>
            {hero.fecha} · {hero.hora} · {hero.lugar}
          </div>
        </div>
      </div>

      {/* ── LISTA DE EVENTOS ───────────────────────────────────────────────── */}
      <div style={{
        flex: 1, overflowY: "auto",
        padding: "10px 12px 12px",
        display: "flex", flexDirection: "column", gap: 7,
        scrollbarWidth: "none",
      }}>
        {eventos.map((ev, idx) => (
          <div key={ev.id} style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <EventoMiniCard
              evento={ev}
              isActive={idx === heroIdx}
              onClick={() => handleCardClick(idx)}
            />
            {/* Panel expandido inline */}
            {eventoActivo === idx && (
              <div style={{
                background: `${ev.accent}10`,
                border: `1px solid ${ev.accent}30`,
                borderTop: "none",
                borderRadius: "0 0 1.25rem 1.25rem",
                padding: "12px 16px 14px",
                animation: "expandIn 0.3s ease",
              }}>
                <p style={{
                  color: "rgba(255,255,255,0.7)", fontSize: "0.875rem",
                  lineHeight: 1.375, fontWeight: 600, marginBottom: 10,
                }}>
                  {ev.descripcion}
                </p>
                <button
                  onClick={() => openModal(ev)}
                  style={{
                    background: ev.accent,
                    color: "white", fontWeight: 800,
                    fontSize: "0.75rem", letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    border: "none", borderRadius: "0.75rem",
                    padding: "10px 20px",
                    cursor: "pointer",
                    boxShadow: `0 8px 20px ${ev.accent}40`,
                    width: "100%",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Ver Todos los Detalles →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── MODAL ─────────────────────────────────────────────────────────── */}
      {modalEvento && <EventoModal evento={modalEvento} onClose={closeModal} />}

      {/* ── KEYFRAMES ─────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes expandIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default EventosCard;
