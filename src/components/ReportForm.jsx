import React, { useState } from "react";

const ZONES = [
  {
    id: "muelle",
    name: "Muelle Turístico",
    ref: "Marina y embarcadero",
    emoji: "⛵",
    img: "/avisanos/muelle.jpg",
    gradient: "from-cyan-900 to-blue-900",
  },
  {
    id: "ballena",
    name: "Zona Ballena",
    ref: "Monumento a la Ballena Azul",
    emoji: "🐋",
    img: "/avisanos/malecon.jpg",
    gradient: "from-sky-900 to-indigo-900",
  },
  {
    id: "teatro",
    name: "Zona Teatro",
    ref: "Frente al Teatro de la Ciudad",
    emoji: "🎭",
    img: null,
    gradient: "from-purple-900 to-slate-900",
  },
  {
    id: "paseo",
    name: "Paseo Central",
    ref: "Área de bancas y palmeras",
    emoji: "🌴",
    img: "/avisanos/malecon2.jpg",
    gradient: "from-teal-900 to-cyan-900",
  },
  {
    id: "gastronomia",
    name: "Zona Gastronómica",
    ref: "Restaurantes y locales",
    emoji: "🍽️",
    img: null,
    gradient: "from-orange-900 to-rose-900",
  },
  {
    id: "playa",
    name: "Zona de Playa",
    ref: "Accesos al litoral costero",
    emoji: "🏖️",
    img: null,
    gradient: "from-amber-900 to-yellow-900",
  },
];

const CATEGORY_META = {
  alumbrado: {
    label: "Problemas de alumbrado",
    icon: "💡",
    accent: "yellow",
    hint: "Luminarias apagadas, cables expuestos, postes dañados…",
  },
  infraestructura: {
    label: "Deterioro en la infraestructura",
    icon: "🏗️",
    accent: "blue",
    hint: "Baches, aceras rotas, mobiliario urbano dañado…",
  },
  contaminacion: {
    label: "Contaminación visual y ambiental",
    icon: "♻️",
    accent: "green",
    hint: "Basura acumulada, vertidos, grafiti, malos olores…",
  },
};

const ACCENT_CLASSES = {
  yellow: {
    ring: "ring-yellow-400",
    border: "border-yellow-400",
    bg: "bg-yellow-500",
    text: "text-yellow-300",
    dot: "bg-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  blue: {
    ring: "ring-blue-400",
    border: "border-blue-400",
    bg: "bg-blue-500",
    text: "text-blue-300",
    dot: "bg-blue-400",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/40",
  },
  green: {
    ring: "ring-emerald-400",
    border: "border-emerald-400",
    bg: "bg-emerald-500",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  },
};

function StepIndicator({ current, accent }) {
  const ac = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.blue;
  return (
    <div className="flex items-center gap-2">
      {[1, 2].map((n) => (
        <React.Fragment key={n}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              n <= current
                ? `${ac.bg} text-white shadow-lg`
                : "bg-white/10 text-white/40"
            }`}
          >
            {n < current ? "✓" : n}
          </div>
          {n < 2 && (
            <div
              className={`flex-1 h-0.5 rounded transition-all duration-500 ${
                current > n ? ac.bg : "bg-white/10"
              }`}
              style={{ width: 40 }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function ZoneCard({ zone, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(zone)}
      className={`relative overflow-hidden rounded-2xl flex flex-col items-center justify-end aspect-[4/3] transition-all duration-300 active:scale-95 focus:outline-none ${
        selected ? "ring-4 ring-offset-2 ring-offset-slate-900 scale-[1.03] shadow-2xl" : "ring-0 hover:scale-[1.01]"
      } ${selected ? "ring-white/80" : ""}`}
      aria-label={zone.name}
    >
      {/* Background */}
      {zone.img ? (
        <img
          src={zone.img}
          alt={zone.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${zone.gradient}`} />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
          <span className="text-slate-900 text-sm font-black">✓</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-3 w-full text-left">
        <div className="text-2xl leading-none mb-1">{zone.emoji}</div>
        <p className="text-white font-bold text-sm leading-tight">{zone.name}</p>
        <p className="text-white/55 text-[11px] leading-tight mt-0.5">{zone.ref}</p>
      </div>
    </button>
  );
}

export default function ReportForm({ category = "infraestructura" }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META.infraestructura;
  const ac = ACCENT_CLASSES[meta.accent];

  const [step, setStep] = useState(1);
  const [selectedZone, setSelectedZone] = useState(null);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canNext = selectedZone !== null;
  const canSubmit = description.trim().length >= 10;

  async function handleSubmit() {
    setSubmitting(true);
    // Simulate API call (swap for real endpoint later)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }

  // ── Success screen ───────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 animate-bounce">
          <span className="text-5xl">✅</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-3">¡Reporte enviado!</h2>
        <p className="text-slate-400 max-w-xs mb-2">
          Tu reporte en <span className={`font-semibold ${ac.text}`}>{selectedZone?.name}</span> ha
          sido registrado. El equipo lo atenderá a la brevedad.
        </p>
        <p className="text-slate-500 text-sm mb-8">Gracias por ayudarnos a mejorar el malecón 🙏</p>
        <a
          href="/reports"
          className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold transition"
        >
          Volver a reportes
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-white/5 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <a href="/reports" className="text-white/40 hover:text-white/70 transition text-sm flex items-center gap-1.5">
            ← Regresar
          </a>
          <StepIndicator current={step} accent={meta.accent} />
          <div className={`px-3 py-1 rounded-full border text-xs font-semibold ${ac.badge}`}>
            {meta.icon} {meta.label}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-5 py-6">
        {/* ── STEP 1: Zone selector ─────────────────────────── */}
        {step === 1 && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white mb-1">¿Dónde está el problema?</h1>
              <p className="text-slate-400 text-sm">
                Selecciona la zona del malecón que corresponde al reporte.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {ZONES.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  selected={selectedZone?.id === zone.id}
                  onSelect={setSelectedZone}
                />
              ))}
            </div>

            {selectedZone && (
              <div className={`mb-5 p-3 rounded-xl border flex items-center gap-3 ${ac.badge}`}>
                <span className="text-xl">{selectedZone.emoji}</span>
                <div>
                  <p className="font-semibold text-sm">{selectedZone.name}</p>
                  <p className="text-xs opacity-70">{selectedZone.ref}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!canNext}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                canNext
                  ? `${ac.bg} text-white shadow-lg active:scale-95`
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              Continuar →
            </button>
          </>
        )}

        {/* ── STEP 2: Details ───────────────────────────────── */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white mb-1">Describe el problema</h1>
              <p className="text-slate-400 text-sm">
                Cuéntanos qué está pasando en{" "}
                <span className={`font-semibold ${ac.text}`}>{selectedZone?.name}</span>.
              </p>
            </div>

            {/* Hint chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {meta.hint.split(",").map((h) => (
                <button
                  key={h}
                  onClick={() =>
                    setDescription((d) =>
                      d ? d + ". " + h.trim() : h.trim()
                    )
                  }
                  className="px-3 py-1.5 bg-white/8 hover:bg-white/15 text-white/60 text-xs rounded-full border border-white/10 transition active:scale-95"
                >
                  + {h.trim()}
                </button>
              ))}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: La luminaria frente a la fuente lleva 3 días apagada…"
              rows={5}
              maxLength={500}
              className="w-full bg-white/5 border border-white/10 focus:border-white/30 rounded-2xl p-4 text-white placeholder-white/25 text-sm resize-none outline-none transition mb-2"
            />
            <div className="flex justify-between text-xs text-white/25 mb-6">
              <span>{description.length < 10 ? `Mínimo ${10 - description.length} caracteres más` : "✓ Listo"}</span>
              <span>{description.length}/500</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-2xl font-bold text-white/60 bg-white/5 hover:bg-white/10 transition"
              >
                ← Atrás
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className={`flex-[2] py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
                  canSubmit && !submitting
                    ? `${ac.bg} text-white shadow-lg active:scale-95`
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando…
                  </span>
                ) : (
                  "Enviar reporte ✓"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
