import React, { useState } from "react";

function GuiaMaleconCard() {
  const [modal, setModal] = useState(false);
  return (
    <div className="bento-glow col-span-1 row-span-1 flex flex-col justify-center items-center shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#10312B] to-gray-900 min-h-[20rem] relative">
      <div className="w-full flex flex-col items-center justify-center p-8 select-none">
        {/* Icono de mapa grande y claro */}
        <button
          className="mb-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 flex flex-col items-center"
          style={{ position: 'absolute', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
          onClick={() => setModal(true)}
          aria-label="Abrir mapa del malecón"
        >
          <img src="/map.png" alt="Icono mapa" className="w-16 h-16 object-contain" draggable={false} />
          <span className="mt-2 text-white text-base font-semibold drop-shadow animate-pulse-glow" style={{letterSpacing:'0.04em',textShadow:'0 2px 8px #2563eb88'}}>Touch me!</span>
        </button>
        <style>{`
          @keyframes pulse-glow {
            0% { opacity: 0.7; text-shadow: 0 2px 8px #2563eb88, 0 0 0 #fff0; }
            50% { opacity: 1; text-shadow: 0 2px 16px #38bdf8cc, 0 0 8px #fff4; }
            100% { opacity: 0.7; text-shadow: 0 2px 8px #2563eb88, 0 0 0 #fff0; }
          }
          .animate-pulse-glow {
            animation: pulse-glow 1.8s infinite;
          }
        `}</style>
  <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-2 mt-32 tracking-wide drop-shadow-lg">Guía del Malecón</h2>
        <span
          className="block text-white text-center text-base md:text-lg font-medium mb-4 px-4 py-2 rounded-xl shadow-lg"
          style={{
            background: 'rgba(30,41,59,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)'
          }}
        >
          Descubre el malecón y sus puntos clave.
        </span>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in" style={{width:'100vw',height:'100vh',overflow:'hidden'}}>
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gray-900" style={{padding:0,margin:0}}>
            <button
              className="absolute top-4 right-8 text-gray-400 hover:text-blue-400 text-4xl font-bold z-10"
              onClick={() => setModal(false)}
              aria-label="Cerrar"
              style={{background:'rgba(0,0,0,0.2)',borderRadius:'50%',width:'3rem',height:'3rem',display:'flex',alignItems:'center',justifyContent:'center'}}
            >
              ×
            </button>
            <h2 className="text-3xl font-bold text-white text-center mb-4 mt-8 drop-shadow-lg">Mapa del Malecón</h2>
            <div className="w-full h-full flex justify-center items-center">
              <iframe
                title="Mapa interactivo del Malecón de La Paz"
                src="https://www.google.com/maps?q=Malec%C3%B3n%20de%20La%20Paz%2C%20B.C.S.&z=16&output=embed"
                width="100%"
                height="500"
                style={{border:0, borderRadius:'1rem', width:'100%', height:'70vh', minHeight:'350px', boxShadow:'0 0 32px #0008'}}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <span className="text-white text-center mt-6 text-lg drop-shadow-lg">Haz zoom para ver detalles de los puntos de interés, baños, estacionamientos y rutas recomendadas.</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default GuiaMaleconCard;
