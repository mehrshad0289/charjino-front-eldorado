export function getBackendUrl() {
  const raw = process.env.BACKEND_URL?.trim();
  const url = (raw ? raw.replace(/\/+$/, "") : "http://127.0.0.1:3000/api");
  return url.replace("://localhost", "://127.0.0.1");
}
