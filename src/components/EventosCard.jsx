import React, { useState } from "react";

const eventos = [
  {
    icon: "🎨",
    color: "text-pink-300",
    title: "Noche de Arte Urbano",
    resumen: "Exposición y muralismo en vivo",
    descripcion: "Disfruta de una noche llena de creatividad con artistas locales pintando murales en tiempo real, música ambiental y talleres para toda la familia.",
    fecha: "Viernes 6 de septiembre, 19:00 hrs",
    lugar: "Kiosco del Malecón",
    imagen: "/eventos/arte.jpg"
  },
  {
    icon: "🏃‍♂️",
    color: "text-green-300",
    title: "Carrera Atlética 5K",
    resumen: "Deporte y convivencia familiar",
    descripcion: "Participa en la tradicional carrera 5K a lo largo del malecón. Inscripción gratuita, medallas para los primeros lugares y ambiente familiar.",
    fecha: "Domingo 8 de septiembre, 7:00 hrs",
    lugar: "Inicio: Muelle Fiscal",
    imagen: "/eventos/carrera.jpg"
  },
  {
    icon: "🎶",
    color: "text-yellow-300",
    title: "Festival de Jazz al Atardecer",
    resumen: "Música en vivo frente al mar",
    descripcion: "Bandas de jazz nacionales e internacionales se presentan en un escenario frente al mar. Zona de foodtrucks y área lounge.",
    fecha: "Sábado 14 de septiembre, 18:00 hrs",
    lugar: "Escenario principal, explanada del malecón",
    imagen: "/eventos/jazz.jpg"
  },
  {
    icon: "🚴‍♀️",
    color: "text-blue-300",
    title: "Rodada Nocturna",
    resumen: "Ciclismo recreativo para todos",
    descripcion: "Únete a la rodada nocturna familiar. Se recomienda llevar casco y luces. Habrá premios para las bicicletas mejor decoradas.",
    fecha: "Viernes 20 de septiembre, 20:00 hrs",
    lugar: "Punto de reunión: Kiosco",
    imagen: "/eventos/rodada.jpg"
  },
  {
    icon: "🎭",
    color: "text-purple-300",
    title: "Teatro al Aire Libre",
    resumen: "Obras y espectáculos familiares",
    descripcion: "Presentación de obras clásicas y espectáculos para niños y adultos. Lleva tu silla o manta para mayor comodidad.",
    fecha: "Domingo 22 de septiembre, 19:30 hrs",
    lugar: "Foro cultural del malecón",
    imagen: "/eventos/teatro.jpg"
  }
];

function EventosCard() {
  const [eventoActivo, setEventoActivo] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6">
      <h2 className="text-2xl font-bold text-white text-center mb-3 tracking-wide">Eventos</h2>
      <ul className="w-full max-w-xs space-y-3">
        {eventos.map((ev, idx) => (
          <li
            key={ev.title}
            className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 shadow cursor-pointer hover:bg-white/20 transition"
            onClick={() => setEventoActivo(idx)}
          >
            <span className={`${ev.color} text-xl`}>{ev.icon}</span>
            <div>
              <span className="text-white font-semibold">{ev.title}</span>
              <div className="text-xs text-gray-200">{ev.resumen}</div>
            </div>
          </li>
        ))}
      </ul>
      {eventoActivo !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 relative animate-fade-in">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-pink-500 text-2xl font-bold"
              onClick={() => setEventoActivo(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className={`${eventos[eventoActivo].color} text-2xl`}>{eventos[eventoActivo].icon}</span>
              <span className="text-xl font-bold text-gray-800">{eventos[eventoActivo].title}</span>
            </div>
            <img
              src={eventos[eventoActivo].imagen}
              alt={eventos[eventoActivo].title}
              className="w-full h-40 object-cover rounded-xl mb-3"
              style={{background:'#eee'}}
            />
            <div className="text-gray-700 mb-2 text-base">{eventos[eventoActivo].descripcion}</div>
            <div className="text-sm text-gray-600 mb-1"><b>Fecha:</b> {eventos[eventoActivo].fecha}</div>
            <div className="text-sm text-gray-600 mb-1"><b>Lugar:</b> {eventos[eventoActivo].lugar}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventosCard;
