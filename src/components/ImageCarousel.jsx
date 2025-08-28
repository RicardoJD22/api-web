
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
          className={
            slogans.length > 0
              ? 'object-contain transition-transform duration-700 animate-bounce-slider w-[60%] h-[60%]'
              : 'w-full h-full object-cover transition-transform duration-700 animate-bounce-slider'
          }
          draggable={false}
          style={
            slogans.length > 0
              ? {
                  animation: 'bounce-slider 0.7s',
                  width: '60%',
                  height: '60%',
                  objectFit: 'contain',
                }
              : {
                  animation: 'bounce-slider 0.7s',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }
          }
        />
      </div>
      {slogans.length > 0 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-[95vw] overflow-hidden rounded-xl"
          style={{
            background: 'rgba(30,41,59,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            boxShadow: '0 2px 16px 0 rgba(0,0,0,0.18)'
          }}
        >
          <div className="marquee whitespace-nowrap py-2 px-4 text-white text-lg font-bold drop-shadow text-center">
            <span>
              COMPROMETIDOS CON LA COMUNIDAD &nbsp;•&nbsp; COMPROMETIDOS CON LA COMUNIDAD &nbsp;•&nbsp; COMPROMETIDOS CON LA COMUNIDAD &nbsp;•&nbsp;
            </span>
          </div>
          <style>{`
            .marquee {
              display: block;
              width: 100%;
              animation: marquee-move 12s linear infinite;
            }
            @keyframes marquee-move {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>
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
