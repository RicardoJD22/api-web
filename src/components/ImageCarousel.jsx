import { useEffect, useState } from "react";

export default function ImageCarousel({ images, interval = 4000, alt = "", slogans = [] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-end relative">
      <div className="flex-1 w-full flex items-center justify-center">
        <img
          src={images[current]}
          alt={alt}
          className={`object-contain transition-transform duration-700 ease-[cubic-bezier(.68,-0.55,.27,1.55)] animate-bounce-slider ${images[current].includes('m-lapaz') ? 'w-[60%] h-[60%]' : 'w-[80%] h-[80%]'}`}
          draggable={false}
          style={{
            animation: 'bounce-slider 0.7s',
          }}
        />
      </div>
      {slogans.length > 0 && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-bold drop-shadow text-center z-30 bg-black/60 px-4 py-2 rounded-xl w-[90%] max-w-[95vw]">
          COMPROMETIDOS CON LA COMUNIDAD
        </span>
      )}
      <style>{`
        @keyframes bounce-slider {
          0% { transform: scale(0.95) translateY(30px); opacity: 0.7; }
          60% { transform: scale(1.05) translateY(-10px); opacity: 1; }
          80% { transform: scale(0.98) translateY(2px); }
          100% { transform: scale(1) translateY(0); }
        }
        .animate-bounce-slider {
          animation: bounce-slider 0.7s;
        }
      `}</style>
    </div>
  );
}
