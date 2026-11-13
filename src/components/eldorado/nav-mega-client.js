const cache = new Map();
const inflight = new Map();

export function peekNavMega(vertical) {
  return cache.get(vertical) ?? null;
}

export function loadNavMega(vertical) {
  if (!vertical) return Promise.resolve(null);
  const hit = cache.get(vertical);
  if (hit) return Promise.resolve(hit);
  const pending = inflight.get(vertical);
  if (pending) return pending;

  const request = fetch(`/api/nav-mega?vertical=${encodeURIComponent(vertical)}&v=topup-hub-v8`)
    .then((res) => res.json())
    .then((payload) => {
      if (!payload?.success || !payload.data) return null;
      cache.set(vertical, payload.data);
      return payload.data;
    })
    .catch(() => null)
    .finally(() => {
      inflight.delete(vertical);
    });

  inflight.set(vertical, request);
  return request;
}

export function prefetchNavMegas(keys) {
  keys.forEach((key) => {
    loadNavMega(key);
  });
}
