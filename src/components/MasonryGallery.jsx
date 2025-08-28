
import React, { useState, useRef } from "react";

// Efecto de brillo animado en el borde de cada foto y rotación continua
const galleryGlowStyle = `
  .gallery-glow {
    position: relative;
    z-index: 0;
  }
  .gallery-glow::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 0.75rem;
    border: 2.5px solid;
    border-image: linear-gradient(120deg, #60a5fa, #f472b6, #ffe066, #34d399, #60a5fa) 1;
    pointer-events: none;
    z-index: 10;
    animation: border-glow 1s linear infinite;
  }
  @keyframes border-glow {
    0% { border-image-source: linear-gradient(120deg, #60a5fa, #f472b6, #ffe066, #34d399, #60a5fa); }
    100% { border-image-source: linear-gradient(480deg, #60a5fa, #f472b6, #ffe066, #34d399, #60a5fa); }
  }
  .gallery-rotate {
    animation: gallery-rotate 2.5s ease-in-out infinite alternate;
    will-change: transform;
    display: block;
  }
  @keyframes gallery-rotate {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }
`;

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

  // Galería principal
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <style>{galleryGlowStyle}</style>
      {/* Botón debajo del logo/header */}
      <div className="flex items-center -mb-56" style={{ minHeight: '4.5rem' }}>
        <div className="ml-4 md:ml-8" style={{ width: '140px', minWidth: '140px' }} />
        <div className="flex flex-col items-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-full shadow-2xl text-lg flex items-center gap-2 transition mt-12"
            onClick={() => window.location.href = '/sube-tu-foto'}
            aria-label="Enviar foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            ¡Envía tu foto!
          </button>
          {/* QR justo debajo del botón */}
          <div className="flex flex-col items-center mt-2">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=http://192.168.1.71:4322/sube-tu-foto" alt="QR para subir foto" className="rounded-xl border-2 border-blue-400 shadow bg-white" width="120" height="120" loading="lazy" />
            <span className="text-xs text-center text-white bg-blue-700 px-2 py-1 rounded-lg shadow mt-2">Escanea para subir tu foto</span>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-0 md:mt-2">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-300 mb-1 md:mb-2 tracking-tight">Galería Malecón</h1>
        <p className="text-xl md:text-2xl text-center text-blue-200 mb-4 md:mb-6">Fotos tomadas por nuestros visitantes ✨</p>
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {images.map((src, idx) => (
            <div
              key={src}
              className="w-full mb-4 break-inside-avoid cursor-pointer rounded-xl overflow-hidden shadow-lg group relative transition-transform duration-300 gallery-glow"
              style={{ perspective: '800px' }}
              onClick={() => setLightbox({ open: true, idx })}
            >
              <img
                src={src}
                alt={`Foto ${idx + 1}`}
                className="w-full object-cover aspect-[4/3] group-hover:rotate-3 group-hover:-translate-y-2 group-hover:scale-110 group-hover:shadow-2xl group-hover:z-20 transition duration-300 gallery-rotate"
                loading="lazy"
                draggable={false}
                style={{ transition: 'transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s' }}
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
            </div>
          ))}
        </div>
      </div>

      {/* Botón flotante */}
      <div className="max-w-6xl mx-auto flex justify-start mb-6">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-full shadow-2xl text-lg flex items-center gap-2 transition"
          onClick={() => setShowForm(true)}
          aria-label="Enviar foto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          ¡Envía tu foto!
        </button>
      </div>

      {/* Modal formulario */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadein" onClick={() => setShowForm(false)}>
          <form
            className="bg-white rounded-2xl shadow-2xl p-8 w-[95vw] max-w-md flex flex-col gap-4 relative"
            onClick={e => e.stopPropagation()}
            onSubmit={e => { e.preventDefault(); alert('¡Gracias por tu foto! (Funcionalidad de backend pendiente)'); setShowForm(false); setPreview(null); }}
          >
            <button type="button" className="absolute top-3 right-4 text-2xl text-gray-500 hover:text-red-500" onClick={() => { setShowForm(false); setPreview(null); }} aria-label="Cerrar">×</button>
            <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">Envía tu foto</h2>
            <input
              type="file"
              accept="image/*"
              className="border rounded px-3 py-2"
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
              <img src={preview} alt="Preview" className="w-full max-h-48 object-contain rounded border mb-2" />
            )}
            <input type="text" className="border rounded px-3 py-2" placeholder="Tu nombre (opcional)" />
            <textarea className="border rounded px-3 py-2" placeholder="Comentario (opcional)" rows={2} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required />
              Acepto que mi foto sea publicada en la galería
            </label>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition">Enviar foto</button>
          </form>
        </div>
      )}

      {/* Lightbox */}
      {lightbox.open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadein"
          onClick={() => setLightbox({ open: false, idx: 0 })}
        >
          <button
            className="absolute top-6 right-8 text-white text-4xl font-bold z-50 hover:scale-110 transition"
            onClick={e => { e.stopPropagation(); setLightbox({ open: false, idx: 0 }); }}
            aria-label="Cerrar"
          >
            ×
          </button>
          <button
            className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 text-white text-4xl font-bold z-50 hover:scale-125 transition"
            onClick={e => { e.stopPropagation(); setLightbox(l => ({ open: true, idx: (l.idx - 1 + images.length) % images.length })); }}
            aria-label="Anterior"
          >
            ‹
          </button>
          <img
            src={images[lightbox.idx]}
            alt="Foto ampliada"
            className="max-h-[80vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain touch-pan-y"
            style={{ boxShadow: "0 8px 40px #000a" }}
            onClick={e => e.stopPropagation()}
            draggable={false}
          />
          <button
            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 text-white text-4xl font-bold z-50 hover:scale-125 transition"
            onClick={e => { e.stopPropagation(); setLightbox(l => ({ open: true, idx: (l.idx + 1) % images.length })); }}
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      )}
      <style>{`
        .animate-fadein { animation: fadein 0.3s; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}

export default MasonryGallery;
