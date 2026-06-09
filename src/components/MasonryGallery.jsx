import React, { useState, useMemo, useRef, useEffect } from "react";

// ── Imágenes con categoría ────────────────────────────────────────────────────
const images = [
  { src: "/Galeria/AA.jpg",       category: "malecon",     alt: "Malecón" },
  { src: "/Galeria/sea2.jpg",     category: "naturaleza",  alt: "Mar" },
  { src: "/Galeria/malecon2.jpg", category: "malecon",     alt: "Malecón" },
  { src: "/Galeria/whale.jpg",    category: "fauna",       alt: "Ballena jorobada" },
  { src: "/Galeria/sun.jpg",      category: "atardecer",   alt: "Atardecer" },
  { src: "/Galeria/night.jpg",    category: "noche",       alt: "Malecón de noche" },
  { src: "/Galeria/kios.jpg",     category: "malecon",     alt: "Kiosco del Malecón" },
  { src: "/Galeria/perla.jpg",    category: "naturaleza",  alt: "Isla Espíritu Santo" },
  { src: "/Galeria/piedra.jpg",   category: "naturaleza",  alt: "Formaciones rocosas" },
  { src: "/Galeria/tiburon.jpg",  category: "fauna",       alt: "Tiburón ballena" },
  { src: "/Galeria/BB.jpg",       category: "malecon",     alt: "Malecón" },
  { src: "/Galeria/EE.jpg",       category: "malecon",     alt: "Malecón" },
  { src: "/Galeria/hotel.jpg",    category: "ciudad",      alt: "Hotel frente al mar" },
  { src: "/Galeria/sea.jpg",      category: "naturaleza",  alt: "Bahía de La Paz" },
  { src: "/Galeria/CC.jpg",       category: "malecon",     alt: "Malecón" },
  { src: "/Galeria/blog.jpg",     category: "ciudad",      alt: "Centro histórico" },
  { src: "/Galeria/lp.jpg",       category: "ciudad",      alt: "La Paz BCS" },
  { src: "/Galeria/food.jpg",     category: "gastronomia", alt: "Gastronomía local" },
  { src: "/Galeria/catedral.jpg", category: "ciudad",      alt: "Catedral de La Paz" },
  { src: "/Galeria/tardecer.jpg", category: "atardecer",   alt: "Atardecer en la bahía" },
  { src: "/Galeria/mirador.jpg",  category: "malecon",     alt: "Mirador El Molinito" },
  { src: "/Galeria/fishers.jpg",  category: "naturaleza",  alt: "Pescadores" },
  { src: "/Galeria/farol.jpg",    category: "malecon",     alt: "Farol del Malecón" },
];

// ── Categorías ────────────────────────────────────────────────────────────────
const categories = [
  { id: "all",         name: "Todas",         icon: "📷" },
  { id: "ciudadano",   name: "Comunidad",     icon: "🙌" },
  { id: "malecon",     name: "Malecón",       icon: "🌊" },
  { id: "fauna",       name: "Fauna Marina",  icon: "🐋" },
  { id: "atardecer",   name: "Atardecer",     icon: "🌅" },
  { id: "ciudad",      name: "Ciudad",        icon: "🏙️" },
  { id: "naturaleza",  name: "Naturaleza",    icon: "🌿" },
  { id: "gastronomia", name: "Gastronomía",   icon: "🍽️" },
  { id: "noche",       name: "Noche",         icon: "🌙" },
];

function MasonryGallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightbox, setLightbox]             = useState({ open: false, idx: 0 });
  const [animKey, setAnimKey]               = useState(0);
  const [allImages, setAllImages]           = useState(images);
  const carouselRef                         = useRef();
  const btnRefs                             = useRef({});

  // Cargar fotos subidas por usuarios
  useEffect(() => {
    fetch('/api/photos')
      .then(r => r.ok ? r.json() : [])
      .then(userPhotos => {
        if (userPhotos.length > 0) {
          setAllImages([...userPhotos, ...images]);
        }
      })
      .catch(() => {});
  }, []);

  // URL base para el QR: usa la variable de entorno si está configurada,
  // si no, detecta la origin real en tiempo de ejecución
  const envUrl = import.meta.env.PUBLIC_SITE_URL || "";
  const [qrOrigin, setQrOrigin] = useState(envUrl);
  useEffect(() => {
    if (!envUrl) setQrOrigin(window.location.origin);
  }, []);

  // Auto-avance del carrusel cada 3.5 s (pausa si el lightbox está abierto)
  const pauseAuto   = useRef(false);
  const autoTimerRef = useRef(null);

  const scheduleNext = () => {
    clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      if (pauseAuto.current) { scheduleNext(); return; }
      setActiveCategory(prev => {
        const ids  = categories.map(c => c.id);
        const next = ids[(ids.indexOf(prev) + 1) % ids.length];
        setAnimKey(k => k + 1);
        setTimeout(() => {
          const btn  = btnRefs.current[next];
          const rail = carouselRef.current;
          if (btn && rail) {
            rail.scrollTo({ left: btn.offsetLeft + btn.offsetWidth / 2 - rail.clientWidth / 2, behavior: "smooth" });
          }
        }, 10);
        return next;
      });
      scheduleNext();
    }, 3500);
  };

  useEffect(() => {
    scheduleNext();
    return () => clearTimeout(autoTimerRef.current);
  }, []); // eslint-disable-line

  // Pausar auto-avance cuando el lightbox está visible
  useEffect(() => { pauseAuto.current = lightbox.open; }, [lightbox.open]);

  // Imágenes filtradas
  const filtered = useMemo(() =>
    activeCategory === "all" ? allImages : allImages.filter(img => img.category === activeCategory),
    [activeCategory, allImages]
  );

  // Cambiar categoría con animación + auto-centrado en el carrusel
  const handleCategory = (id) => {
    if (id === activeCategory) return;
    setActiveCategory(id);
    setAnimKey(k => k + 1);
    if (lightbox.open) setLightbox({ open: false, idx: 0 });
    // Reiniciar temporizador automático al interactuar manualmente
    scheduleNext();
    // Centrar el botón seleccionado en el carrusel
    setTimeout(() => {
      const btn = btnRefs.current[id];
      const rail = carouselRef.current;
      if (btn && rail) {
        const btnCenter = btn.offsetLeft + btn.offsetWidth / 2;
        const railCenter = rail.clientWidth / 2;
        rail.scrollTo({ left: btnCenter - railCenter, behavior: "smooth" });
      }
    }, 10);
  };

  // Scroll del carrusel con flechas (reinicia temporizador)
  const scrollCarousel = (dir) => {
    const rail = carouselRef.current;
    if (rail) rail.scrollBy({ left: dir * 200, behavior: "smooth" });
    scheduleNext();
  };

  // Navegar dentro del filtro activo
  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightbox(l => ({ open: true, idx: (l.idx - 1 + filtered.length) % filtered.length }));
  };
  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightbox(l => ({ open: true, idx: (l.idx + 1) % filtered.length }));
  };

  // Conteo por categoría
  const countFor = (id) => id === "all" ? allImages.length : allImages.filter(i => i.category === id).length;

  return (
    <div className="w-full min-h-screen bg-slate-950 pb-16">

      {/* ── ENCABEZADO ──────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tighter uppercase leading-none">
          Galería
        </h1>
        <p className="text-slate-400 text-base font-semibold mt-1 tracking-widest uppercase">
          Postales del Malecón de La Paz
        </p>
      </div>

      {/* ── QR FLOTANTE ─────────────────────────────────────────────────── */}
      {qrOrigin && (
        <a href="/sube-tu-foto"
           className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4
                      bg-slate-900/85 backdrop-blur-md border border-indigo-400/30
                      rounded-3xl px-5 py-4 shadow-[0_0_40px_rgba(99,102,241,0.25)]
                      no-underline active:scale-[0.97] transition-transform touch-manipulation"
           style={{ animation: "qrFloat 3s ease-in-out infinite" }}>
          {/* QR */}
          <div className="shrink-0 rounded-2xl overflow-hidden border-2 border-indigo-400/60
                          shadow-[0_0_14px_rgba(99,102,241,0.5)] bg-white p-1.5">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&color=312e81&bgcolor=ffffff&data=${encodeURIComponent(qrOrigin + '/sube-tu-foto')}`}
              alt="QR sube tu foto"
              width="100" height="100" loading="lazy"
              className="block rounded-lg"
            />
          </div>
          {/* Texto */}
          <div className="flex flex-col gap-1 max-w-[170px]">
            <span className="text-indigo-300 font-black text-sm leading-tight tracking-wide uppercase">
              ¡Comparte tu foto!
            </span>
            <span className="text-slate-400 text-xs leading-snug">
              Escanea con tu celular o toca aquí para subir tu postal
            </span>
            <span className="text-indigo-500/80 text-[10px] font-mono mt-1 truncate"
                  title={qrOrigin + '/sube-tu-foto'}>
              {qrOrigin.replace(/^https?:\/\//, '')}/sube-tu-foto
            </span>
          </div>
          {/* Flecha animada */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-indigo-400 text-lg"
               style={{ animation: "qrArrow 1.2s ease-in-out infinite" }}>◀</div>
        </a>
      )}

      {/* ── CARRUSEL DE FILTROS ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="relative flex items-center gap-2">

          {/* Flecha izquierda */}
          <button
            onClick={() => scrollCarousel(-1)}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 active:scale-90 active:bg-indigo-500/30 transition touch-manipulation z-10"
            aria-label="Categorías anteriores"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          {/* Rail con gradiente de fade en bordes */}
          <div className="relative flex-1 overflow-hidden">
            {/* Fade izquierda */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10"
                 style={{ background: "linear-gradient(to right, rgb(2 6 23), transparent)" }} />
            {/* Fade derecha */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
                 style={{ background: "linear-gradient(to left, rgb(2 6 23), transparent)" }} />

            {/* Scroll container con snap */}
            <div
              ref={carouselRef}
              className="flex gap-3 overflow-x-auto pb-2 no-scrollbar"
              style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
            >
              {categories.map(cat => {
                const count = countFor(cat.id);
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    ref={el => (btnRefs.current[cat.id] = el)}
                    onClick={() => handleCategory(cat.id)}
                    style={{ scrollSnapAlign: "center" }}
                    className={`shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-250 focus:outline-none active:scale-95 border touch-manipulation ${
                      isActive
                        ? "bg-indigo-500/25 border-indigo-400/70 text-indigo-200 shadow-[0_0_20px_rgba(99,102,241,0.35)] scale-105"
                        : "bg-slate-800/60 border-white/8 text-slate-400"
                    }`}
                  >
                    <span className={`text-xl leading-none transition-transform duration-300 ${isActive ? "scale-125" : "scale-100"}`}>
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full transition-colors ${
                      isActive ? "bg-indigo-500/40 text-indigo-200" : "bg-slate-700 text-slate-400"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Flecha derecha */}
          <button
            onClick={() => scrollCarousel(1)}
            className="shrink-0 w-11 h-11 flex items-center justify-center rounded-xl bg-slate-800/80 border border-white/10 text-slate-300 active:scale-90 active:bg-indigo-500/30 transition touch-manipulation z-10"
            aria-label="Más categorías"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        {/* Indicadores de posición (dots) */}
        <div className="flex justify-center gap-1.5 mt-3">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategory(cat.id)}
              className={`rounded-full transition-all duration-300 touch-manipulation ${
                activeCategory === cat.id
                  ? "w-6 h-2 bg-indigo-400"
                  : "w-2 h-2 bg-slate-600 hover:bg-slate-500"
              }`}
              aria-label={cat.name}
            />
          ))}
        </div>

        {/* Contador de resultados */}
        <p className="text-slate-500 text-xs font-semibold mt-2 tracking-wide text-center">
          {filtered.length} {filtered.length === 1 ? "fotografía" : "fotografías"} · {categories.find(c => c.id === activeCategory)?.name}
        </p>
      </div>

      {/* ── GRID MASONRY ────────────────────────────────────────────────── */}
      <div key={animKey} className="max-w-6xl mx-auto px-4 columns-2 md:columns-3 lg:columns-4 gap-3 gallery-grid">
        {filtered.map((img, idx) => (
          <div
            key={img.src + idx}
            className="w-full mb-3 break-inside-avoid cursor-pointer rounded-2xl overflow-hidden shadow-lg shadow-black/40 border border-slate-700/50 relative active:scale-[0.97] transition-transform duration-200 touch-manipulation group gallery-item"
            onClick={() => setLightbox({ open: true, idx })}
            style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full object-cover aspect-[4/3] touch-pan-y"
              loading="lazy"
              draggable={false}
            />
            {/* Badge comunidad */}
            {img.category === "ciudadano" && (
              <div className="absolute top-2 left-2 bg-indigo-600/90 backdrop-blur text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                🙌 Comunidad
              </div>
            )}
            {/* Overlay con nombre al hover/active */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-active:opacity-100 transition-opacity duration-150 flex items-end p-3">
              <span className="text-white text-xs font-bold leading-tight">{img.alt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── LIGHTBOX ────────────────────────────────────────────────────── */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fadein"
          onClick={() => setLightbox({ open: false, idx: 0 })}
        >
          {/* Contador */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800/80 backdrop-blur px-4 py-1.5 rounded-full text-white text-sm font-bold border border-white/10 pointer-events-none z-50">
            {lightbox.idx + 1} / {filtered.length} · {filtered[lightbox.idx]?.alt}
          </div>

          {/* Cerrar */}
          <button
            className="absolute top-6 right-6 w-16 h-16 flex items-center justify-center bg-slate-800/80 backdrop-blur-xl rounded-full text-white z-50 active:scale-90 transition border border-slate-600/50 shadow-2xl"
            onClick={e => { e.stopPropagation(); setLightbox({ open: false, idx: 0 }); }}
            aria-label="Cerrar"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* Anterior */}
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-16 h-44 flex items-center justify-center bg-slate-800/60 backdrop-blur-xl rounded-3xl text-white z-50 active:scale-[0.98] active:bg-indigo-600 transition border border-slate-600/50 shadow-2xl touch-manipulation"
            onClick={prevPhoto} aria-label="Anterior"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>

          {/* Foto principal */}
          <img
            src={filtered[lightbox.idx]?.src}
            alt={filtered[lightbox.idx]?.alt}
            className="max-h-[88vh] max-w-[82vw] rounded-3xl shadow-[0_15px_60px_rgba(0,0,0,0.9)] object-contain pointer-events-none"
            draggable={false}
            onClick={e => e.stopPropagation()}
          />

          {/* Siguiente */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-16 h-44 flex items-center justify-center bg-slate-800/60 backdrop-blur-xl rounded-3xl text-white z-50 active:scale-[0.98] active:bg-indigo-600 transition border border-slate-600/50 shadow-2xl touch-manipulation"
            onClick={nextPhoto} aria-label="Siguiente"
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Miniaturas strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto no-scrollbar max-w-[80vw] px-2 pb-1">
            {filtered.map((img, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setLightbox({ open: true, idx: i }); }}
                className={`shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                  i === lightbox.idx ? "border-indigo-400 scale-110 shadow-lg" : "border-transparent opacity-60"
                }`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" draggable={false} />
              </button>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .gallery-grid { }
        .gallery-item {
          animation: galleryFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes galleryFadeIn {
          from { opacity: 0; transform: scale(0.94) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadein { animation: fadein 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes qrFloat {
          0%, 100% { transform: translateX(-50%) translateY(0px);   }
          50%       { transform: translateX(-50%) translateY(-6px);  }
        }
        @keyframes qrArrow {
          0%, 100% { transform: translateY(-50%) translateX(0px);  opacity: 1;   }
          50%       { transform: translateY(-50%) translateX(-5px); opacity: 0.5; }
        }
        button, a { touch-action: manipulation; }
      `}</style>
    </div>
  );
}

export default MasonryGallery;