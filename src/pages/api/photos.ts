export const prerender = false;

import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const META_FILE = path.join(process.cwd(), 'uploads-meta.json');

export const GET: APIRoute = async () => {
  try {
    if (!existsSync(META_FILE)) {
      return json([], 200);
    }
    const photos = JSON.parse(await readFile(META_FILE, 'utf-8'));
    return json(photos, 200);
  } catch {
    return json([], 200);
  }
};

function json(data: unknown, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
