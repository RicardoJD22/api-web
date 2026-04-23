import type { APIRoute } from "astro";

export const prerender = false;

const CACHE_TTL = 10 * 60 * 1000; // 10 minutos en ms
let cache: { data: unknown; ts: number } | null = null;

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key no configurada" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Servir desde caché del servidor si está vigente
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return new Response(JSON.stringify(cache.data), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Cache": "HIT" },
    });
  }

  try {
    const base = `https://api.openweathermap.org/data/2.5`;
    const [curRes, foreRes] = await Promise.all([
      fetch(`${base}/weather?q=La%20Paz,mx&appid=${apiKey}&units=metric&lang=es`),
      fetch(`${base}/forecast?q=La%20Paz,mx&appid=${apiKey}&units=metric&lang=es&cnt=40`),
    ]);

    if (!curRes.ok) throw new Error(`Weather API error: ${curRes.status}`);

    const [current, forecast] = await Promise.all([curRes.json(), foreRes.json()]);

    const payload = { current, forecast };
    cache = { data: payload, ts: Date.now() };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json", "X-Cache": "MISS" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error al obtener el clima" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }
};
