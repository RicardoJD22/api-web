import React, { useState, useRef, useEffect } from "react";

const images = [
  "/Galeria/AA.jpg",
  "/Galeria/sea2.jpg",
  "/Galeria/malecon2.jpg",
  "/Galeria/whale.jpg",
  "/Galeria/sun.jpg",
  "/Galeria/night.jpg",
  "/Galeria/kios.jpg",
  "/Galeria/perla.jpg",
  "/Galeria/piedra.jpg",
  "/Galeria/tiburon.jpg",
  "/Galeria/BB.jpg",
  "/Galeria/EE.jpg",
  "/Galeria/hotel.jpg",
  "/Galeria/sea.jpg",
  "/Galeria/CC.jpg",
  "/Galeria/blog.jpg",
  "/Galeria/lp.jpg",
  "/Galeria/food.jpg",
  "/Galeria/catedral.jpg",
  "/Galeria/tardecer.jpg",
  "/Galeria/night.jpg",
  "/Galeria/mirador.jpg",
  "/Galeria/fishers.jpg",
  "/Galeria/farol.jpg"
];

function MasonryGallery() {
  const [lightbox, setLightbox] = useState({ open: false, idx: 0 });
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInput = useRef();

  const [qrOrigin, setQrOrigin] = useState("");
  useEffect(() => {
    setQrOrigin(window.location.origin);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-950 p-4">
      
      {/* Botón debajo del logo/header */}
      <div className="flex items-center justify-between mb-8" style={{ minHeight: '4.5rem' }}>
        <button
          className="bg-slate-800 border border-slate-700 active:scale-[0.98] text-white font-semibold py-3 px-5 rounded-full shadow-lg text-lg flex items-center gap-2 transition touch-manipulation"
          onClick={() => window.location.href = '/'}
          aria-label="Volver Atrás"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver
        </button>
        
        <div className="flex flex-col items-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold py-4 px-8 rounded-full shadow-2xl text-xl flex items-center gap-3 transition touch-manipulation"
            onClick={() => window.location.href = '/sube-tu-foto'}
            aria-label="Enviar foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            ¡Envía tu foto!
          </button>
          
          {/* QR Integrado con Origin Dinámico */}
          {qrOrigin && (
            <div className="flex flex-col items-center mt-3">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrOrigin + '/sube-tu-foto')}`} alt="QR" className="rounded-xl border border-indigo-400 p-1 shadow bg-white" width="100" height="100" loading="lazy" />
              <span className="text-xs text-center text-white bg-indigo-700/80 px-3 py-1 rounded-full backdrop-blur shadow mt-2 tracking-wide">Escanear</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-0 md:mt-2">
        <h1 className="text-5xl md:text-[5rem] font-black text-center text-indigo-400 mb-1 md:mb-2 tracking-tighter uppercase drop-shadow-lg">Galería</h1>
        <p className="text-xl md:text-2xl text-center text-slate-300 font-semibold mb-8 md:mb-10 tracking-widest uppercase">Postales de nuestros visitantes</p>
        
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((src, idx) => (
            <div
              key={src}
              className="w-full mb-4 break-inside-avoid cursor-pointer rounded-2xl overflow-hidden shadow-lg shadow-black/40 border border-slate-700/60 relative active:scale-[0.97] transition-transform duration-200 touch-manipulation group"
              onClick={() => setLightbox({ open: true, idx })}
            >
              <img
                src={src}
                alt={`Foto ${idx + 1}`}
                className="w-full object-cover aspect-[4/3] touch-pan-y"
                loading="lazy"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition duration-150" />
            </div>
          ))}
        </div>
      </div>

      {/* Botón flotante Inferior */}
      <div className="max-w-6xl mx-auto flex justify-center mt-12 mb-12">
        <button
          className="bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 font-bold py-5 px-10 rounded-full shadow-[0_10px_30px_rgba(79,70,229,0.5)] text-2xl flex items-center gap-3 transition touch-manipulation"
          onClick={() => setShowForm(true)}
          aria-label="Enviar foto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          ¡Sube tu foto!
        </button>
      </div>

      {/* Modal formulario touch-friendly */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fadein px-4" onClick={() => setShowForm(false)}>
          <form
            className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-8 w-full max-w-lg flex flex-col gap-6 relative touch-manipulation"
            onClick={e => e.stopPropagation()}
            onSubmit={e => { e.preventDefault(); alert('¡Gracias!'); setShowForm(false); setPreview(null); }}
          >
            <button type="button" className="absolute -top-4 -right-4 bg-slate-800 border-2 border-slate-600 rounded-full w-14 h-14 flex justify-center items-center text-white active:scale-90 shadow-xl" onClick={() => { setShowForm(false); setPreview(null); }} aria-label="Cerrar">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <h2 className="text-3xl font-black text-center text-indigo-400 mb-2 uppercase tracking-tight">Carga tu memoria</h2>
            
            <div className="flex flex-col gap-4">
              <input
                type="file"
                accept="image/*"
                className="file:bg-indigo-600 file:border-none file:text-white file:px-6 file:py-3 file:rounded-full file:font-bold file:mr-4 file:active:scale-95 text-slate-300 font-medium"
                required
                ref={fileInput}
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = ev => setPreview(ev.target.result);
                    reader.readAsDataURL(file);
                  } else {
                    setPreview(null);
                  }
                }}
              />
              {preview && (
                <img src={preview} alt="Preview" className="w-full object-cover rounded-2xl border border-indigo-500 shadow-xl aspect-video" />
              )}
            </div>
            
            <input type="text" className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-4 text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" placeholder="Tu nombre (opcional)" />
            <textarea className="bg-slate-800 border-slate-700 text-white rounded-xl px-4 py-4 text-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" placeholder="Un lindo comentario (opcional)" rows={2} />
            
            <label className="flex items-center gap-4 text-slate-300 text-lg cursor-pointer p-2 active:bg-slate-800 rounded-lg">
              <input type="checkbox" className="w-6 h-6 accent-indigo-500 rounded" required />
              Acepto que mi foto sea compartida.
            </label>
            
            <button type="submit" className="w-full bg-indigo-600 active:scale-[0.98] text-white font-bold py-5 rounded-full shadow-[0_5px_20px_rgba(79,70,229,0.5)] text-xl transition mt-2">Publicar Foto</button>
          </form>
        </div>
      )}

      {/* Lightbox Gigante para Kioskos */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl animate-fadein"
          onClick={() => setLightbox({ open: false, idx: 0 })}
        >
          {/* Close - Tap Area Gigante */}
          <button
            className="absolute top-6 right-6 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-slate-800/80 backdrop-blur-xl rounded-full text-white z-50 active:scale-90 transition border border-slate-600/50 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            onClick={e => { e.stopPropagation(); setLightbox({ open: false, idx: 0 }); }}
            aria-label="Cerrar"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {/* Prev - Hit Area gigante vertical */}
          <button
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-16 md:w-24 h-40 md:h-56 flex items-center justify-center bg-slate-800/60 backdrop-blur-xl rounded-3xl text-white z-50 active:scale-[0.98] active:bg-indigo-600 transition border border-slate-600/50 shadow-2xl touch-manipulation"
            onClick={e => { e.stopPropagation(); setLightbox(l => ({ open: true, idx: (l.idx - 1 + images.length) % images.length })); }}
            aria-label="Anterior"
          >
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          </button>
          
          {/* Foto Principal */}
          <img
            src={images[lightbox.idx]}
            alt="Foto ampliada"
            className="max-h-[90vh] max-w-[85vw] rounded-3xl shadow-[0_15px_60px_rgba(0,0,0,0.8)] object-contain pointer-events-none"
            onClick={e => e.stopPropagation()}
            draggable={false}
          />
          
          {/* Next - Hit Area gigante vertical */}
          <button
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-16 md:w-24 h-40 md:h-56 flex items-center justify-center bg-slate-800/60 backdrop-blur-xl rounded-3xl text-white z-50 active:scale-[0.98] active:bg-indigo-600 transition border border-slate-600/50 shadow-2xl touch-manipulation"
            onClick={e => { e.stopPropagation(); setLightbox(l => ({ open: true, idx: (l.idx + 1) % images.length })); }}
            aria-label="Siguiente"
          >
            <svg className="w-12 h-12 md:w-16 md:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
      <style>{`
        .animate-fadein { animation: fadein 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadein { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(16px); } }
      `}</style>
    </div>
  );
}

export default MasonryGallery;
