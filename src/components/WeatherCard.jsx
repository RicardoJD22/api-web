import React, { useEffect, useState } from "react";

function WeatherCard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=La%20Paz,mx&appid=33ae159cdf4300bbd252e18b6cda5aca&units=metric&lang=es`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo obtener el clima");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Clima</h2>
        <span className="text-white text-center mt-2">Cargando...</span>
      </div>
    );
  }
  if (error || !weather || weather.cod !== 200) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Clima</h2>
        <span className="text-white text-center mt-2">No disponible</span>
      </div>
    );
  }

  const icon = weather.weather?.[0]?.icon;
  const desc = weather.weather?.[0]?.description;
  const temp = Math.round(weather.main.temp);
  const feels = Math.round(weather.main.feels_like);
  const humidity = weather.main.humidity;
  const wind = Math.round(weather.wind.speed * 3.6); // m/s a km/h
  const min = Math.round(weather.main.temp_min);
  const max = Math.round(weather.main.temp_max);
  const city = weather.name;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6">
      <h2 className="text-2xl font-bold text-white text-center mb-3 tracking-wide">Clima</h2>
      <div className="flex flex-col items-center justify-center bg-white/10 rounded-2xl px-6 py-4 shadow-inner mb-2 w-full max-w-xs">
        {icon && (
          <img
            src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
            alt={desc}
            className="w-20 h-20 mb-1 drop-shadow-lg"
            loading="lazy"
          />
        )}
        <span className="text-5xl font-extrabold text-yellow-200 drop-shadow text-center leading-none mb-1">{temp}°C</span>
        <span className="text-white text-lg capitalize text-center mb-2">{desc}</span>
        <div className="flex flex-row justify-center gap-4 w-full mb-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-300">Mín</span>
            <span className="text-base text-white font-semibold">{min}°C</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-300">Máx</span>
            <span className="text-base text-white font-semibold">{max}°C</span>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-4 w-full mb-2">
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-300">Sensación</span>
            <span className="text-base text-white font-semibold">{feels}°C</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-300">Humedad</span>
            <span className="text-base text-white font-semibold">{humidity}%</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-gray-300">Viento</span>
            <span className="text-base text-white font-semibold">{wind} km/h</span>
          </div>
        </div>
        <span className="text-white text-base font-medium mt-1 text-center">{city}, BCS</span>
      </div>
      <span className="text-white text-center mt-2 italic text-sm opacity-80">¡Que tengas un gran día en el malecón!</span>
    </div>
  );
}

export default WeatherCard;
