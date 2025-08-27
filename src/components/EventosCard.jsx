import React, { useState } from "react";

const eventos = [
  {
    icon: "🎨",
  color: "text-pink-500",
    title: "Noche de Arte Urbano",
    resumen: "Exposición y muralismo en vivo",
    descripcion: "Disfruta de una noche llena de creatividad con artistas locales pintando murales en tiempo real, música ambiental y talleres para toda la familia.",
    fecha: "Viernes 6 de septiembre, 19:00 hrs",
    lugar: "Kiosco del Malecón",
  imagen: "arte-urbano.png"
  },
  {
    icon: "🏃‍♂️",
    color: "text-green-500",
    title: "Carrera Atlética 5K",
    resumen: "Deporte y convivencia familiar",
    descripcion: "Participa en la tradicional carrera 5K a lo largo del malecón. Inscripción gratuita, medallas para los primeros lugares y ambiente familiar.",
    fecha: "Domingo 8 de septiembre, 7:00 hrs",
    lugar: "Inicio: Muelle Fiscal",
    // Aquí va la imagen a cargar para este evento:
    imagen: "5k.png"
  },
  {
    icon: "🎶",
  color: "text-yellow-500",
    title: "Festival de Jazz al Atardecer",
    resumen: "Música en vivo frente al mar",
    descripcion: "Bandas de jazz nacionales e internacionales se presentan en un escenario frente al mar. Zona de foodtrucks y área lounge.",
    fecha: "Sábado 14 de septiembre, 18:00 hrs",
    lugar: "Escenario principal, explanada del malecón",
  imagen: "jazz.png"
  },
  {
    icon: "🚴‍♀️",
  color: "text-blue-500",
    title: "Rodada Nocturna",
    resumen: "Ciclismo recreativo para todos",
    descripcion: "Únete a la rodada nocturna familiar. Se recomienda llevar casco y luces. Habrá premios para las bicicletas mejor decoradas.",
    fecha: "Viernes 20 de septiembre, 20:00 hrs",
    lugar: "Punto de reunión: Kiosco",
  imagen: "rodada.png"
  },
  {
    icon: "🎭",
  color: "text-purple-500",
    title: "Teatro al Aire Libre",
    resumen: "Obras y espectáculos familiares",
    descripcion: "Presentación de obras clásicas y espectáculos para niños y adultos. Lleva tu silla o manta para mayor comodidad.",
    fecha: "Domingo 22 de septiembre, 19:30 hrs",
    lugar: "Foro cultural del malecón",
  imagen: "teatro.png"
  }
];

function EventosCard() {
  const [eventoActivo, setEventoActivo] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6">
      <h2 className="text-2xl font-bold text-white text-center mb-3 tracking-wide">Eventos</h2>
      <div className="w-full max-w-md h-96 overflow-hidden relative group">
        <ul className="space-y-6 absolute left-0 w-full animate-credit-scroll group-hover:pause-animation">
          {eventos.map((ev, idx) => (
            <li
              key={ev.title}
              className="flex items-center gap-6 bg-gray-800/90 rounded-2xl px-8 py-5 shadow-lg cursor-pointer hover:bg-blue-900/80 transition border-2 border-transparent focus-within:border-blue-400 outline-none"
              tabIndex={0}
              onClick={() => setEventoActivo(idx)}
              onKeyPress={e => (e.key === 'Enter' || e.key === ' ') && setEventoActivo(idx)}
              aria-label={`Ver detalles de ${ev.title}`}
            >
              <span className={`${ev.color} text-4xl drop-shadow-lg`} aria-hidden="true">{ev.icon}</span>
              <div>
                <span className="text-white font-bold text-2xl leading-tight block">{ev.title}</span>
                <div className="text-lg text-gray-200 leading-snug">{ev.resumen}</div>
              </div>
            </li>
          ))}
        </ul>
        <style>{`
          @keyframes credit-scroll {
            0% { top: 100%; }
            100% { top: -${eventos.length * 120}px; }
          }
          .animate-credit-scroll {
            animation: credit-scroll ${eventos.length * 3.5}s linear infinite;
          }
          .pause-animation {
            animation-play-state: paused !important;
          }
        `}</style>
      </div>
      {eventoActivo !== null && (
        <>
          {/* Overlay de fondo para cubrir todo el contenido */}
          <div className="fixed inset-0 bg-black/80" style={{zIndex: 2147483646}}></div>
          {/* Modal con z-index máximo */}
          <div className="fixed inset-0 flex items-center justify-center" style={{zIndex: 2147483647}}>
            <div className="bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full mx-1 sm:mx-8 p-4 sm:p-10 relative animate-fade-in border-4 border-blue-400">
            <button
              className="absolute top-4 right-4 text-gray-300 hover:text-pink-400 text-4xl font-extrabold focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full bg-black/30 w-12 h-12 flex items-center justify-center"
              onClick={() => setEventoActivo(null)}
              aria-label="Cerrar"
              style={{zIndex:1200}}
            >
              ×
            </button>
            <div className="flex items-center gap-8 mb-6">
              <span className={`${eventos[eventoActivo].color} text-7xl drop-shadow-lg`} aria-hidden="true">{eventos[eventoActivo].icon}</span>
              <span className="text-4xl font-extrabold text-white drop-shadow-lg">{eventos[eventoActivo].title}</span>
            </div>
            <div className="w-full flex justify-center mb-10">
              <div className="w-full max-w-3xl aspect-video rounded-2xl border-2 border-white/30 shadow-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden p-4">
                <img
                  src={eventos[eventoActivo].imagen ? `/eventos/${eventos[eventoActivo].imagen}` : "/eventos/default.jpg"}
                  alt={eventos[eventoActivo].title}
                  className="max-w-full max-h-[26rem] object-contain mx-auto my-0 block bg-[#222] rounded-xl"
                  style={{zIndex:1}}
                  onError={e => { e.target.onerror = null; e.target.src = '/eventos/default.jpg'; e.target.parentNode.querySelector('.img-placeholder').style.display = 'flex'; }}
                />
                <div className="img-placeholder flex flex-col items-center justify-center w-full h-full text-gray-400 text-6xl" style={{zIndex:2, display:'none'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" className="w-16 h-16 mb-2"><rect width="48" height="48" rx="12" fill="#374151"/><path d="M16 32l6-8 6 8M18 28h12" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="24" cy="20" r="2" fill="#9CA3AF"/></svg>
                  <span className="text-base text-gray-400 mt-2">Sin imagen</span>
                </div>
              </div>
            </div>
            <div className="text-white mb-4 text-lg leading-relaxed font-medium drop-shadow-lg">{eventos[eventoActivo].descripcion}</div>
            <div className="text-base text-blue-200 mb-1"><b>Fecha:</b> {eventos[eventoActivo].fecha}</div>
            <div className="text-base text-blue-200 mb-1"><b>Lugar:</b> {eventos[eventoActivo].lugar}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default EventosCard;
