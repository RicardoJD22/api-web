import React, { useEffect, useState } from "react";

const CACHE_KEY = "weather_cache";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

function formatTime(unix) {
  return new Date(unix * 1000).toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getDayName(dt) {
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  return days[new Date(dt * 1000).getDay()];
}

function getTheme(code, isDay) {
  if (code >= 200 && code < 300)
    return { bg: ["#1e293b", "#312e81", "#0f172a"], accent: "#c4b5fd", type: "storm" };
  if (code >= 300 && code < 600)
    return { bg: ["#1e3a5f", "#1d4ed8", "#1e293b"], accent: "#93c5fd", type: "rain" };
  if (code >= 600 && code < 700)
    return { bg: ["#cbd5e1", "#bfdbfe", "#e2e8f0"], accent: "#1e40af", type: "snow" };
  if (code >= 700 && code < 800)
    return { bg: ["#44556a", "#64748b", "#334155"], accent: "#e2e8f0", type: "fog" };
  if (code === 800) {
    if (isDay) return { bg: ["#0369a1", "#0ea5e9", "#0284c7"], accent: "#fef08a", type: "sunny" };
    return { bg: ["#0f172a", "#1e1b4b", "#020617"], accent: "#a5b4fc", type: "night" };
  }
  return { bg: ["#334155", "#475569", "#374151"], accent: "#bae6fd", type: "cloudy" };
}

// Pre-computed random positions so no hydration mismatch
const RAIN_DROPS = Array.from({ length: 22 }, (_, i) => ({
  left: ((i * 47 + 13) % 100),
  height: 15 + (i * 7) % 20,
  duration: 0.55 + (i * 3) % 50 / 100,
  delay: (i * 13) % 100 / 100,
}));
const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37 + 5) % 100,
  top: (i * 29 + 7) % 65,
  size: 1 + (i * 3) % 3,
  duration: 1.5 + (i * 7) % 30 / 10,
  delay: (i * 11) % 20 / 10,
}));

function WeatherParticles({ type }) {
  if (type === "sunny") return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes sunrotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sunpulse { 0%,100%{opacity:.15;transform:scale(1)} 50%{opacity:.3;transform:scale(1.08)} }
        .sun-ray { position:absolute; top:50%; left:50%; height:2px; background:linear-gradient(to right,rgba(253,224,71,.7),transparent); transform-origin:0 50%; border-radius:2px; }
      `}</style>
      <div className="absolute top-3 right-5 w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-yellow-300/20" style={{animation:"sunpulse 3s ease-in-out infinite"}}/>
        <div className="absolute inset-3 rounded-full bg-yellow-200/25" style={{animation:"sunpulse 3s ease-in-out infinite .5s"}}/>
        <div className="absolute inset-0" style={{animation:"sunrotate 18s linear infinite"}}>
          {[...Array(8)].map((_,i) => (
            <div key={i} className="sun-ray" style={{width:36,transform:`rotate(${i*45}deg)`}}/>
          ))}
        </div>
      </div>
    </div>
  );

  if (type === "rain" || type === "storm") return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes rain-fall { from{transform:translateY(-15px) skewX(-3deg);opacity:0} 40%{opacity:.55} to{transform:translateY(110%) skewX(-3deg);opacity:0} }
        @keyframes lightning { 0%,90%,100%{opacity:0} 92%,96%{opacity:.4} }
        .wc-drop { position:absolute; top:0; border-radius:2px; animation:rain-fall linear infinite; }
      `}</style>
      {type === "storm" && <div className="absolute inset-0 bg-purple-300/10" style={{animation:"lightning 4s ease-in-out infinite"}}/>}
      {RAIN_DROPS.map((d,i) => (
        <div key={i} className="wc-drop" style={{
          left:`${d.left}%`, height:`${d.height}px`,
          width: type === "storm" ? "2px" : "1.5px",
          background: type === "storm" ? "linear-gradient(to bottom,transparent,rgba(196,181,253,.55))" : "linear-gradient(to bottom,transparent,rgba(147,197,253,.6))",
          animationDuration:`${d.duration}s`, animationDelay:`${d.delay}s`
        }}/>
      ))}
    </div>
  );

  if (type === "night") return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes twinkle { 0%,100%{opacity:.15;transform:scale(.8)} 50%{opacity:1;transform:scale(1.3)} }
        .wc-star { position:absolute; background:white; border-radius:50%; animation:twinkle ease-in-out infinite; }
      `}</style>
      {STARS.map((s,i) => (
        <div key={i} className="wc-star" style={{
          left:`${s.left}%`, top:`${s.top}%`,
          width:`${s.size}px`, height:`${s.size}px`,
          animationDuration:`${s.duration}s`, animationDelay:`${s.delay}s`
        }}/>
      ))}
    </div>
  );

  if (type === "cloudy") return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <style>{`
        @keyframes cloud-drift { from{transform:translateX(-15px)} to{transform:translateX(15px)} }
        .wc-cloud { position:absolute; background:rgba(255,255,255,.06); border-radius:50%; animation:cloud-drift ease-in-out infinite alternate; }
      `}</style>
      {[{w:130,h:55,t:5,l:2,d:"5s"},{w:90,h:38,t:18,l:50,d:"7s"},{w:110,h:45,t:8,l:25,d:"6s"}].map((c,i) => (
        <div key={i} className="wc-cloud" style={{width:c.w,height:c.h,top:`${c.t}%`,left:`${c.l}%`,animationDuration:c.d}}/>
      ))}
    </div>
  );

  return null;
}

function processForecast(list) {
  const days = {};
  list.forEach(item => {
    const d = new Date(item.dt * 1000);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!days[key]) days[key] = { dt: item.dt, temps: [], icons: [] };
    days[key].temps.push(item.main.temp);
    days[key].icons.push(item.weather[0].icon);
  });
  return Object.values(days).slice(1, 6).map(d => ({
    dt: d.dt,
    day: getDayName(d.dt),
    min: Math.round(Math.min(...d.temps)),
    max: Math.round(Math.max(...d.temps)),
    icon: d.icons[Math.floor(d.icons.length / 2)],
  }));
}

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [todayMin, setTodayMin] = useState(null);
  const [todayMax, setTodayMax] = useState(null);

  useEffect(() => {
    // Intentar servir desde caché del cliente
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          applyData(data.current, data.forecast);
          return;
        }
      }
    } catch (_) {}

    fetch("/api/weather")
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
        } catch (_) {}
        applyData(data.current, data.forecast);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  function applyData(cur, fore) {
    if (!cur || cur.cod !== 200) { setError(true); setLoading(false); return; }
    setWeather(cur);
    if (fore?.list) {
      setForecast(processForecast(fore.list));
      // Min/max reales del día de hoy desde el forecast
      const todayKey = (() => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; })();
      const todayItems = fore.list.filter(item => {
        const d = new Date(item.dt * 1000);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === todayKey;
      });
      if (todayItems.length) {
        const temps = todayItems.map(i => i.main.temp);
        setTodayMin(Math.round(Math.min(...temps)));
        setTodayMax(Math.round(Math.max(...temps)));
      }
    }
    setLoading(false);
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full w-full gap-3">
      <div className="w-9 h-9 border-4 border-white/20 border-t-white/70 rounded-full animate-spin"/>
      <span className="text-white/50 text-xs tracking-widest uppercase">Cargando clima…</span>
    </div>
  );

  if (error || !weather) return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 gap-2">
      <span className="text-4xl">🌡️</span>
      <span className="text-white/50 text-sm text-center">Clima no disponible</span>
    </div>
  );

  const code = weather.weather[0].id;
  const now = Date.now() / 1000;
  const isDay = now > weather.sys.sunrise && now < weather.sys.sunset;
  const theme = getTheme(code, isDay);

  const icon = weather.weather[0].icon;
  const desc = weather.weather[0].description;
  const temp = Math.round(weather.main.temp);
  const feels = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const wind = Math.round(weather.wind.speed * 3.6);
  const min = todayMin ?? Math.round(weather.main.temp_min);
  const max = todayMax ?? Math.round(weather.main.temp_max);
  const pressure = weather.main.pressure;
  const sunrise = formatTime(weather.sys.sunrise);
  const sunset = formatTime(weather.sys.sunset);

  return (
    <div
      className="relative flex flex-col h-full w-full overflow-hidden rounded-[2.5rem]"
      style={{ background: `linear-gradient(160deg, ${theme.bg[0]} 0%, ${theme.bg[1]} 50%, ${theme.bg[2]} 100%)` }}
    >
      <WeatherParticles type={theme.type} />

      {/* Header row */}
      <div className="relative z-10 flex items-start justify-between px-5 pt-5">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-[.2em]">La Paz, BCS</p>
          <p className="text-white/60 text-xs font-medium">{isDay ? "☀️ Día" : "🌙 Noche"}</p>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-white/50 text-xs">💧 {humidity}%</span>
          <span className="text-white/50 text-xs">🌬️ {wind} km/h</span>
        </div>
      </div>

      {/* Temperature */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-1 pb-0">
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={desc}
          className="w-[6.5rem] h-[6.5rem] drop-shadow-[0_0_25px_rgba(255,255,255,0.25)] -mb-3"
        />
        <div className="flex items-start leading-none">
          <span className="text-[5.5rem] font-black leading-none drop-shadow-2xl" style={{ color: theme.accent }}>
            {temp}
          </span>
          <span className="text-2xl font-bold text-white/60 mt-5">°C</span>
        </div>
        <p className="text-white/75 text-sm font-semibold leading-snug -mt-1 capitalize">{desc}</p>
        <p className="text-white/40 text-xs mt-0.5">Sensación {feels}° · {min}° / {max}°</p>
      </div>

      {/* Stats grid */}
      <div className="relative z-10 mx-4 mt-3 grid grid-cols-3 gap-2">
        {[
          { icon: "🌅", label: "Amanecer", val: sunrise },
          { icon: "🌇", label: "Atardecer", val: sunset },
          { icon: "📊", label: "Presión", val: `${pressure} hPa` },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl py-2.5 px-1">
            <span className="text-xl leading-none mb-1">{s.icon}</span>
            <span className="text-white/40 text-xs uppercase tracking-wider">{s.label}</span>
            <span className="text-white text-xs font-semibold text-center leading-tight mt-0.5">{s.val}</span>
          </div>
        ))}
      </div>

      {/* 5-day forecast */}
      {forecast.length > 0 && (
        <div className="relative z-10 mx-4 mt-3 mb-4">
          <p className="text-white/30 text-xs uppercase tracking-[.2em] mb-2 text-center">Próximos días</p>
          <div className="flex gap-1.5">
            {forecast.map(day => (
              <div key={day.dt} className="flex-1 flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-2xl py-2 px-0.5">
                <span className="text-white/55 text-xs font-bold uppercase">{day.day}</span>
                <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="" className="w-8 h-8 -my-0.5"/>
                <span className="text-white text-xs font-bold">{day.max}°</span>
                <span className="text-white/35 text-xs">{day.min}°</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
