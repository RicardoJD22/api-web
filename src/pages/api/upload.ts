export const prerender = false;

import type { APIRoute } from 'astro';
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync }                  from 'node:fs';
import path                            from 'node:path';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'Galeria', 'uploads');
const META_FILE   = path.join(process.cwd(), 'uploads-meta.json');

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!existsSync(UPLOADS_DIR)) {
      await mkdir(UPLOADS_DIR, { recursive: true });
    }

    const formData  = await request.formData();
    const file      = formData.get('photo')      as File   | null;
    const nombre    = (formData.get('nombre')    as string | null)?.trim();
    const comentario = (formData.get('comentario') as string | null) ?? '';

    if (!file || !nombre) {
      return json({ error: 'Faltan datos requeridos' }, 400);
    }
    if (!file.type.startsWith('image/')) {
      return json({ error: 'El archivo no es una imagen válida' }, 400);
    }
    if (file.size > 5 * 1024 * 1024) {
      return json({ error: 'La imagen supera el límite de 5 MB' }, 400);
    }

    // Guardar archivo
    const ext      = (file.name.split('.').pop() ?? 'jpg').toLowerCase();
    const filename = `foto_${Date.now()}.${ext}`;
    const buffer   = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(UPLOADS_DIR, filename), buffer);

    // Actualizar metadatos
    let meta: object[] = [];
    if (existsSync(META_FILE)) {
      meta = JSON.parse(await readFile(META_FILE, 'utf-8'));
    }
    const entry = {
      filename,
      src:        `/Galeria/uploads/${filename}`,
      nombre,
      comentario,
      date:       new Date().toISOString(),
      category:   'ciudadano',
      alt:        `Foto de ${nombre}`,
    };
    meta.unshift(entry);
    await writeFile(META_FILE, JSON.stringify(meta, null, 2));

    return json({ success: true, photo: entry }, 200);
  } catch (err) {
    console.error('[upload]', err);
    return json({ error: 'Error interno al subir la foto' }, 500);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
