import React, { useState } from "react";
import ImageCarousel from "./ImageCarousel.jsx";

function GuiaMaleconCard() {
  const [modal, setModal] = useState(false);
  return (
    <div className="bento-glow col-span-1 row-span-1 flex flex-col justify-center items-center shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-[#10312B] to-gray-900 min-h-[20rem] relative">
      <div className="w-full flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xs rounded-xl overflow-hidden mb-3 shadow-lg">
          <ImageCarousel
            client:load
            images={["/map-mal1.jpeg", "/map-mal2.jpeg", "/map-mal3.jpeg", "/map-mal4.jpeg"]}
            interval={2000}
            alt=""
          />
        </div>
        <h2 className="text-2xl font-bold text-white text-center mb-2 tracking-wide">Guía del Malecón</h2>
        <span className="text-white text-center text-base mb-4">Explora el malecón, descubre puntos de interés, servicios y rutas recomendadas.</span>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full shadow-lg text-lg transition"
          onClick={() => setModal(true)}
        >
          Ver mapa completo
        </button>
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
