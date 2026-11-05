function storageOrigin() {
  const fallback = process.env.VERCEL ? "https://api.charjino.ir/api" : "http://127.0.0.1:3000/api";
  const api = (process.env.BACKEND_URL || fallback)
    .replace(/\/+$/, "")
    .replace("://localhost", "://127.0.0.1");
  return api.replace(/\/api$/i, "") || (process.env.VERCEL ? "https://api.charjino.ir" : "http://127.0.0.1:3000");
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${storageOrigin()}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
