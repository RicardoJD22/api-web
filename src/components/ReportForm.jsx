import React, { useState, useRef, useEffect } from "react";

// ── Virtual Keyboard ──────────────────────────────────────────────────────────
const KB_ROWS = [
  ["1","2","3","4","5","6","7","8","9","0"],
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l","ñ"],
  ["⇧","z","x","c","v","b","n","m","⌫"],
  ["á","é","í","ó","ú","¿","¡",","," ","↵"],
];

function VirtualKeyboard({ onKey, onClose, accent }) {
  const [shifted, setShifted] = useState(false);
  const ac = ACCENT_CLASSES[accent] ?? ACCENT_CLASSES.blue;

  function handleKey(k) {
    if (k === "⌫") { onKey("BACKSPACE"); return; }
    if (k === "↵") { onClose(); return; }
    if (k === "⇧") { setShifted((s) => !s); return; }
    const char = shifted && k.length === 1 && k.match(/[a-záéíóúñ]/i) ? k.toUpperCase() : k;
    onKey(char);
    if (shifted && k !== "⇧") setShifted(false);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/98 backdrop-blur-md border-t border-white/15 shadow-2xl select-none">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-white/10">
        <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Teclado</span>
        <button
          onPointerDown={(e) => { e.preventDefault(); onClose(); }}
          className={`flex items-center gap-1.5 px-5 py-2 rounded-full ${ac.bg} text-white text-sm font-bold shadow-lg active:scale-95 transition`}
        >
          Listo ✓
        </button>
      </div>

      {/* Keys */}
      <div className="px-2 pb-5 pt-2 space-y-2">
        {KB_ROWS.map((row, ri) => (
          <div key={ri} className="flex w-full gap-1.5">
            {row.map((k) => {
              const isShift = k === "⇧";
              const isBackspace = k === "⌫";
              const isDone = k === "↵";
              const isSpace = k === " ";
              const label = isSpace
                ? "espacio"
                : shifted && k.length === 1 && k.match(/[a-záéíóúñ]/i)
                  ? k.toUpperCase()
                  : k;

              let flexVal = "flex-1";
              if (isShift || isBackspace) flexVal = "flex-[1.6]";
              if (isDone) flexVal = "flex-[1.6]";
              if (isSpace) flexVal = "flex-[4]";

              return (
                <button
                  key={k}
                  onPointerDown={(e) => { e.preventDefault(); handleKey(k); }}
                  className={[
                    flexVal,
                    "py-5 rounded-2xl font-bold text-lg transition active:scale-90 active:brightness-125 min-w-0",
                    isSpace ? "bg-white/10 text-white/50 text-base" : "",
                    isDone ? `${ac.bg} text-white shadow-md` : "",
                    isBackspace ? "bg-red-500/25 text-red-300 text-xl" : "",
                    isShift
                      ? (shifted ? `${ac.bg} text-white shadow-md` : "bg-white/10 text-white/60") + " text-xl"
                      : "",
                    !isSpace && !isDone && !isBackspace && !isShift
                      ? "bg-white/10 text-white hover:bg-white/20"
                      : "",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

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
      className={`relative overflow-hidden rounded-3xl flex flex-col items-center justify-end aspect-[3/4] transition-all duration-300 active:scale-95 focus:outline-none ${
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg z-10">
          <span className="text-slate-900 text-base font-black">✓</span>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-5 w-full text-left">
                <p className="text-white font-black text-xl leading-tight">{zone.name}</p>
        <p className="text-white/60 text-sm leading-tight mt-1">{zone.ref}</p>
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
  const [usedHints, setUsedHints] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const textareaRef = useRef(null);

  // Validación: si llegan al step 2 sin zona, vuelven al 1
  useEffect(() => {
    if (step === 2 && !selectedZone) setStep(1);
  }, [step, selectedZone]);

  function handleVirtualKey(k) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart ?? description.length;
    const end = ta.selectionEnd ?? description.length;
    let next;
    if (k === "BACKSPACE") {
      if (start === end && start > 0) {
        next = description.slice(0, start - 1) + description.slice(end);
        setDescription(next);
        requestAnimationFrame(() => ta.setSelectionRange(start - 1, start - 1));
      } else if (start !== end) {
        next = description.slice(0, start) + description.slice(end);
        setDescription(next);
        requestAnimationFrame(() => ta.setSelectionRange(start, start));
      }
    } else {
      next = description.slice(0, start) + k + description.slice(end);
      if (next.length <= 500) {
        setDescription(next);
        requestAnimationFrame(() => ta.setSelectionRange(start + k.length, start + k.length));
      }
    }
  }

  function handleHintClick(hint) {
    if (usedHints.includes(hint)) return;
    setUsedHints((u) => [...u, hint]);
    setDescription((d) => (d ? d + ". " + hint : hint));
  }

  const canNext = selectedZone !== null;
  const canSubmit = description.trim().length >= 10;

  async function handleSubmit() {
    setSubmitting(true);
    // Simulate API call (swap for real endpoint later)
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    let secs = 4;
    const timer = setInterval(() => {
      secs -= 1;
      setCountdown(secs);
      if (secs <= 0) {
        clearInterval(timer);
        window.location.href = "/";
      }
    }, 1000);
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
        <p className="text-slate-500 text-sm mb-8">Gracias por ayudarnos a mejorar el malecón</p>
        <p className="text-white/30 text-xs mb-6">Redirigiendo en {countdown}…</p>
        <a
          href="/"
          className="px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold transition"
        >
          Ir al inicio ahora
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-white/5 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <a
            href="/?skip=1"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-cyan-500/40 active:scale-95 transition-transform duration-150 touch-manipulation select-none"
            style={{ background: "linear-gradient(135deg, rgba(8,47,73,0.92) 0%, rgba(12,74,110,0.88) 100%)" }}
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30">
              <svg viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 -translate-x-px">
                <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
              </svg>
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400/70">Regresar</span>
              <span className="text-sm font-black uppercase tracking-wide text-cyan-100">Inicio</span>
            </span>
          </a>
          <StepIndicator current={step} accent={meta.accent} />
          <div className={`px-5 py-2 rounded-full border text-sm font-bold ${ac.badge}`}>
            {selectedZone ? `${selectedZone.name}` : `${meta.icon} ${meta.label}`}
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
          <div className={showKeyboard ? "pb-[30rem]" : ""}>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white mb-1">Describe el problema</h1>
              <p className="text-slate-400 text-sm">
                Cuéntanos qué está pasando en{" "}
                <span className={`font-semibold ${ac.text}`}>{selectedZone?.name}</span>.
              </p>
            </div>

            {/* Hint chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {meta.hint.split(",").map((h) => {
                const hint = h.trim();
                const used = usedHints.includes(hint);
                return (
                  <button
                    key={hint}
                    onClick={() => handleHintClick(hint)}
                    disabled={used}
                    className={`px-3 py-1.5 text-xs rounded-full border transition active:scale-95 ${
                      used
                        ? "bg-white/5 text-white/20 border-white/5 cursor-not-allowed line-through"
                        : "bg-white/8 hover:bg-white/15 text-white/60 border-white/10"
                    }`}
                  >
                    {used ? hint : `+ ${hint}`}
                  </button>
                );
              })}
            </div>

            {/* Textarea con feedback de color */}
            <textarea
              ref={textareaRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onFocus={() => setShowKeyboard(true)}
              placeholder="Ej: La luminaria frente a la fuente lleva 3 días apagada…"
              rows={10}
              maxLength={500}
              readOnly={showKeyboard}
              className={`w-full bg-white/5 rounded-2xl p-4 text-white placeholder-white/25 text-base resize-none outline-none transition mb-2 border ${
                description.length === 0
                  ? "border-white/10"
                  : description.length < 10
                  ? "border-red-500/60"
                  : description.length < 40
                  ? "border-yellow-400/60"
                  : "border-emerald-400/60"
              }`}
            />
            <div className="flex justify-between text-xs mb-6">
              <span className={
                description.length === 0 ? "text-white/25" :
                description.length < 10 ? "text-red-400" :
                description.length < 40 ? "text-yellow-400" : "text-emerald-400"
              }>
                {description.length === 0
                  ? "Escribe al menos 10 caracteres"
                  : description.length < 10
                  ? `Faltan ${10 - description.length} caracteres`
                  : description.length < 40
                  ? "Puedes agregar más detalle"
                  : "✓ Descripción completa"}
              </span>
              <span className="text-white/25">{description.length}/500</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!canSubmit || submitting}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
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
          </div>
        )}
      </div>

      {showKeyboard && (
        <VirtualKeyboard
          onKey={handleVirtualKey}
          onClose={() => setShowKeyboard(false)}
          accent={meta.accent}
        />
      )}

      {/* ── Modal de confirmación ─────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Icono */}
            <div className="flex flex-col items-center pt-8 pb-4 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2">¿Enviar reporte?</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Estás a punto de enviar un reporte en{" "}
                <span className={`font-semibold ${ac.text}`}>{selectedZone?.name}</span>.
                <br />¿Deseas continuar?
              </p>
            </div>

            {/* Resumen */}
            <div className="mx-6 mb-5 p-3 rounded-2xl bg-white/5 border border-white/8 text-xs text-white/50 leading-relaxed line-clamp-3">
              {description}
            </div>

            {/* Botones */}
            <div className="flex border-t border-white/10">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 text-white/50 font-semibold text-sm hover:bg-white/5 transition border-r border-white/10"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setShowConfirm(false); handleSubmit(); }}
                className={`flex-1 py-4 font-bold text-sm ${ac.bg} text-white transition active:brightness-110`}
              >
                Sí, enviar ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
