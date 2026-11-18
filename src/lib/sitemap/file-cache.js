import { mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { tmpdir } from "os";

const memory = new Map();

function cacheDir() {
  const fromEnv = process.env.SITEMAP_CACHE_DIR?.trim();
  if (fromEnv) return fromEnv;
  try {
    const dir = path.join(process.cwd(), ".sitemap-cache");
    mkdirSync(dir, { recursive: true });
    return dir;
  } catch {
    return path.join(tmpdir(), "charjino-v2-sitemap-cache");
  }
}

function fileFor(key) {
  return path.join(cacheDir(), `${key}.json`);
}

export function readChunk(key) {
  const fromMemory = memory.get(key);
  try {
    const parsed = JSON.parse(readFileSync(fileFor(key), "utf8"));
    if (!parsed || !Array.isArray(parsed.locs) || typeof parsed.generatedAt !== "number") {
      return fromMemory ?? null;
    }
    memory.set(key, parsed);
    return parsed;
  } catch {
    return fromMemory ?? null;
  }
}

export function writeChunk(key, chunk) {
  memory.set(key, chunk);
  const file = fileFor(key);
  const tmp = `${file}.${process.pid}.tmp`;
  try {
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(tmp, JSON.stringify(chunk));
    renameSync(tmp, file);
  } catch {
    try {
      writeFileSync(file, JSON.stringify(chunk));
    } catch {
      /* in-memory copy remains */
    }
  }
}

export function markStale(key) {
  const current = readChunk(key);
  if (!current) return;
  writeChunk(key, { ...current, generatedAt: 0 });
}
