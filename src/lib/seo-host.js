const INDEXABLE_HOSTS = new Set(["charjino.ir", "www.charjino.ir"]);

export function hostnameFromHostHeader(hostHeader) {
  const raw = String(hostHeader || "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.startsWith("[")) {
    const end = raw.indexOf("]");
    return end > 0 ? raw.slice(1, end) : raw;
  }
  return raw.split(":")[0] || "";
}

export function seoHostFromRequest(request) {
  const headers = request?.headers;
  const candidates = [
    headers?.get?.("host"),
    headers?.get?.("x-forwarded-host")?.split(",")[0]?.trim() ?? null,
    request?.nextUrl?.hostname ?? null,
  ];
  for (const candidate of candidates) {
    if (isIndexableSeoHost(candidate)) {
      return hostnameFromHostHeader(candidate);
    }
  }
  return hostnameFromHostHeader(candidates.find(Boolean) ?? "");
}

export function isIndexableSeoHost(hostHeader) {
  return INDEXABLE_HOSTS.has(hostnameFromHostHeader(hostHeader));
}
