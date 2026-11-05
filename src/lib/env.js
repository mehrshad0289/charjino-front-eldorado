const LOCAL_API = "http://127.0.0.1:3000/api";
const PROD_API = "https://api.charjino.ir/api";

function hostedRemote() {
  return Boolean(
    process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.VERCEL_URL ||
      process.env.NODE_ENV === "production",
  );
}

export function getBackendUrl() {
  const raw = process.env.BACKEND_URL?.trim();
  const fallback = hostedRemote() ? PROD_API : LOCAL_API;
  const url = raw ? raw.replace(/\/+$/, "") : fallback;
  return url.replace("://localhost", "://127.0.0.1");
}
