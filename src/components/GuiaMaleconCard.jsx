import React from "react";

function GuiaMaleconCard() {
  return (
    <div 
      className="bento-glow col-span-1 row-span-1 flex flex-col justify-between items-center shadow-2xl rounded-[2.5rem] overflow-hidden relative h-full min-h-[22rem] group"
      style={{
        background: 'linear-gradient(165deg, #020617 0%, #0c4a6e 100%)',
      }}
    >
      {/* Decorative blurred backgrounds - Dynamic Depth */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 bg-sky-400/20 rounded-full mix-blend-screen filter blur-[90px] pointer-events-none transition-transform duration-1000 group-hover:scale-110"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[80px] pointer-events-none"></div>

      <div className="z-10 w-full flex-grow flex flex-col items-center justify-center p-6 relative">
        <a
          href="/mapa-malecon"
          className="group/btn relative flex flex-col items-center focus:outline-none active:scale-90 transition-all duration-300 ease-out mt-4 no-underline"
          aria-label="Abrir mapa interactivo del malecón"
          draggable={false}
        >
          {/* Glowing pulse effect behind button - More subtle and professional */}
          <div className="absolute inset-0 rounded-full bg-sky-400/30 blur-2xl animate-pulse scale-75"></div>
          
          <div className="relative w-32 h-32 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xl rounded-full shadow-[0_0_50px_rgba(14,165,233,0.25)] border border-white/20 overflow-hidden z-10 transition-all duration-500 group-hover/btn:border-sky-400/50 group-hover/btn:shadow-[0_0_60px_rgba(14,165,233,0.4)]">
            {/* Shimmer effect inside button */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] shimmer-animation"></div>
            
            <img 
              src="/map.png" 
              alt="" 
              className="w-16 h-16 object-contain z-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover/btn:scale-110" 
              draggable={false} 
            />
          </div>
        </a>

        <div className="mt-auto w-full flex flex-col items-center text-center pb-2 pt-10 pointer-events-none">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-sky-100 to-sky-400 leading-none tracking-tighter uppercase mb-3 drop-shadow-2xl whitespace-nowrap">
            EL MALECÓN
          </h2>
          <div className="px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite]"></div>
            <span className="text-slate-200 text-sm font-semibold leading-snug relative z-10 block">
              Explora monumentos, gastronomía y cultura frente al mar de Cortés.
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes custom-shimmer {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        .shimmer-animation {
          animation: custom-shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default GuiaMaleconCard;
