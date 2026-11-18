function storageOrigin() {
  const hosted = Boolean(
    process.env.VERCEL ||
      process.env.VERCEL_ENV ||
      process.env.VERCEL_URL ||
      process.env.NODE_ENV === "production",
  );
  const fallback = hosted ? "https://api.charjino.ir/api" : "http://127.0.0.1:3000/api";
  const api = (process.env.BACKEND_URL || fallback)
    .replace(/\/+$/, "")
    .replace("://localhost", "://127.0.0.1");
  return api.replace(/\/api$/i, "") || (hosted ? "https://api.charjino.ir" : "http://127.0.0.1:3000");
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  compress: false,
  allowedDevOrigins: ["127.0.0.1"],
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "api.charjino.ir", pathname: "/storage/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "3000", pathname: "/storage/**" },
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "/storage/**" },
      { protocol: "https", hostname: "storage.googleapis.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/invoices", destination: "/dashboard/orders/purchased", permanent: false },
      { source: "/invoices/:number", destination: "/dashboard/orders/purchased/:number", permanent: false },
      { source: "/profile/orders", destination: "/dashboard/orders/purchased", permanent: false },
      { source: "/profile/orders/:number", destination: "/dashboard/orders/purchased/:number", permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: "/sitemap/:id.xml", destination: "/sitemaps/:id" },
      {
        source: "/storage/:path*",
        destination: `${storageOrigin()}/storage/:path*`,
      },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/image/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/illustrations/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/home/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source:
          "/:file(favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|icon-192.png|icon-512.png|icon-maskable-512.png|og-image.png|twitter-image.png|site.webmanifest)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
