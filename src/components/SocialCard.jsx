import React, { useState } from "react";

// ─── REDES SOCIALES ───────────────────────────────────────────────────────────
const REDES = [
  {
    id: "facebook",
    label: "Facebook",
    handle: "@MaleconLaPaz",
    url: "https://facebook.com",
    color: "#1877F3",
    colorDark: "#0d47a1",
    glow: "29,119,242",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 3.6 8.07 8.24 8.93v-6.32h-2.48v-2.61h2.48V9.41c0-2.45 1.49-3.8 3.77-3.8 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.61h-2.34v6.32c4.64-.86 8.24-4.52 8.24-8.93 0-5.5-4.46-9.96-9.96-9.96z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@malecon_lapaz",
    url: "https://instagram.com",
    color: "#E1306C",
    colorDark: "#6b0f2b",
    glow: "225,48,108",
    Icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <defs>
          <linearGradient id="ig-grad-card" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path fill="url(#ig-grad-card)" d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a5.25 5.25 0 1 1 0 10.5 5.25 5.25 0 0 1 0-10.5zm0 1.5a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm5.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
      </svg>
    ),
  },
];

// ─── BOTÓN DE RED SOCIAL ──────────────────────────────────────────────────────
function SocialButton({ red }) {
  const [pressed, setPressed] = useState(false);
  return (
    <a
      href={red.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Seguir en ${red.label}`}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: pressed
          ? `${red.color}25`
          : `${red.color}12`,
        border: `1.5px solid ${red.color}${pressed ? "70" : "35"}`,
        borderRadius: "1.25rem",
        padding: "14px 18px",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: pressed ? "scale(0.97)" : "scale(1)",
        boxShadow: pressed ? `0 0 28px ${red.color}40` : "none",
        width: "100%",
      }}
    >
      {/* Ícono con fondo */}
      <div style={{
        width: 50, height: 50,
        borderRadius: "0.875rem",
        background: `${red.color}20`,
        border: `1px solid ${red.color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        color: red.color,
      }}>
        <red.Icon />
      </div>

      {/* Texto */}
      <div style={{ flex: 1 }}>
        <div style={{
          color: "white", fontWeight: 800,
          fontSize: "1.125rem", lineHeight: 1.2,
        }}>
          {red.label}
        </div>
        <div style={{
          color: red.color,
          fontSize: "0.875rem", fontWeight: 600,
          opacity: 0.85,
        }}>
          {red.handle}
        </div>
      </div>

      {/* Flecha */}
      <svg width="18" height="18" fill="none" stroke={red.color} viewBox="0 0 24 24" style={{ opacity: 0.7, flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function SocialCard({ siteOrigin = "" }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&color=0ea5e9&bgcolor=020617&data=${encodeURIComponent((siteOrigin || "") + "/sube-tu-foto")}&qzone=1`;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      position: "relative",
      overflow: "hidden",
      background: "linear-gradient(145deg, #020617 0%, #0c1a2e 60%, #0a0f1e 100%)",
    }}>

      {/* ── BLOB decorativo de fondo ── */}
      <div style={{
        position: "absolute", top: "-20%", right: "-15%",
        width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,119,242,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", left: "-10%",
        width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(225,48,108,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ── CONTENIDO ── */}
      <div style={{
        flex: 1,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "20px 18px 18px",
        position: "relative", zIndex: 1,
        gap: 14,
      }}>

        {/* Header */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 999, padding: "5px 12px",
            marginBottom: 10,
          }}>
            <span style={{ fontSize: "0.85rem" }}>📡</span>
            <span style={{
              color: "rgba(255,255,255,0.55)", fontSize: "0.75rem",
              fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              Síguenos
            </span>
          </div>

          <h2 style={{
            color: "white", fontWeight: 900,
            fontSize: "2.25rem", lineHeight: 1,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            margin: "0 0 4px",
            fontFamily: "'Outfit', sans-serif",
          }}>
            Redes Sociales
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.45)", fontSize: "0.875rem",
            fontWeight: 600, margin: 0, lineHeight: 1.375,
          }}>
            Comparte tu visita al Malecón de La Paz
          </p>
        </div>

        {/* Botones de redes */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {REDES.map((red) => (
            <SocialButton key={red.id} red={red} />
          ))}
        </div>

        {/* Divisor */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          <span style={{
            color: "rgba(255,255,255,0.3)", fontSize: "0.75rem",
            fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}>
            📸 Sube tu foto
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Panel QR */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          background: "rgba(14,165,233,0.07)",
          border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: "1.25rem",
          padding: "12px 14px",
        }}>
          {/* QR */}
          <div style={{
            background: "white",
            borderRadius: "0.75rem",
            padding: 4,
            flexShrink: 0,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            <img
              src={qrUrl}
              alt="QR para subir foto"
              width={72}
              height={72}
              loading="lazy"
              style={{ display: "block", borderRadius: "0.5rem" }}
            />
          </div>

          {/* Texto CTA */}
          <div>
            <p style={{
              color: "white", fontWeight: 800,
              fontSize: "0.875rem", margin: "0 0 3px",
              lineHeight: 1.2,
            }}>
              ¿Tomaste una foto?
            </p>
            <p style={{
              color: "rgba(255,255,255,0.5)", fontSize: "0.75rem",
              fontWeight: 500, margin: "0 0 8px",
              lineHeight: 1.4,
            }}>
              Escanea el QR y compártela en nuestra galería
            </p>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "rgba(14,165,233,0.2)",
              border: "1px solid rgba(14,165,233,0.35)",
              borderRadius: 999, padding: "3px 10px",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#0ea5e9",
                animation: "socialPulse 1.5s ease-in-out infinite",
              }} />
              <span style={{
                color: "#38bdf8", fontSize: "0.75rem",
                fontWeight: 800, letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}>
                Escanea
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes socialPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}
