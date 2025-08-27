import React, { useState, useEffect } from "react";

const images = [
  "/Galeria/AA.jpg",
  "/Galeria/sea2.jpg",
  "/Galeria/malecon2.jpg",
  "/Galeria/whale.jpg",
  "/Galeria/sun.jpg",
  "/Galeria/night.jpg"
];

function getClass(idx, active, len) {
  const diff = (idx - active + len) % len;
  if (diff === 0) return "center";
  if (diff === 1 || diff === -len+1) return "right1";
  if (diff === 2 || diff === -len+2) return "right2";
  if (diff === len-1 || diff === -1) return "left1";
  if (diff === len-2 || diff === -2) return "left2";
  return "hidden";
}

export default function CoverflowGallery() {
  const [active, setActive] = useState(2);
  useEffect(() => {
    const id = setInterval(() => {
      setActive(a => (a + 1) % images.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="absolute left-0 top-0 bottom-0 w-full h-full flex items-center justify-center">
      <div className="relative w-[95%] h-[85%] flex flex-col items-center justify-center overflow-visible">
        <div className="w-full flex flex-row gap-2 gallery-coverflow items-center justify-center">
          {images.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Galería ${idx+1}`}
              className={`coverflow-img ${getClass(idx, active, images.length)}`}
              style={{display: getClass(idx, active, images.length)==="hidden" ? "none" : undefined}}
            />
          ))}
        </div>
        {/* Badge de cantidad de fotos reales en esquina superior derecha */}
        <span className="absolute top-2 right-4 bg-pink-500 text-white text-lg font-bold px-4 py-1 rounded-full shadow-lg border-2 border-white animate-bounce z-20">+29 fotos</span>
        {/* Eslogan centrado en la parte inferior */}
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-semibold drop-shadow text-center z-30 bg-black/60 px-4 py-2 rounded-xl">Explora las mejores fotos del malecón</span>
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40 rounded-xl pointer-events-none"></div>
      </div>
      <style>{`
        .gallery-coverflow {
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          position: relative;
        }
        .coverflow-img {
          width: 120px;
          height: 200px;
          object-fit: cover;
          border-radius: 1rem;
          box-shadow: 0 8px 32px #000a;
          margin: 0 0.5rem;
          transition: transform 0.4s cubic-bezier(.4,2,.6,1), box-shadow 0.4s, filter 0.4s;
          filter: brightness(1.1) contrast(1.15);
        }
        .coverflow-img.center {
          transform: scale(1.18);
          z-index: 3;
          box-shadow: 0 12px 48px #fff8, 0 0 0 6px #fff8;
          filter: brightness(1.25) contrast(1.2) drop-shadow(0 0 16px #fff8);
        }
        .coverflow-img.left1 {
          transform: translateX(-40px) scale(0.95) rotateY(18deg);
          z-index: 2;
        }
        .coverflow-img.right1 {
          transform: translateX(40px) scale(0.95) rotateY(-18deg);
          z-index: 2;
        }
        .coverflow-img.left2 {
          transform: translateX(-80px) scale(0.85) rotateY(32deg);
          z-index: 1;
        }
        .coverflow-img.right2 {
          transform: translateX(80px) scale(0.85) rotateY(-32deg);
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
