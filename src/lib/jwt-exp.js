export function decodeJwtExp(token) {
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;

    let normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4 !== 0) {
      normalized += "=";
    }

    const payload = JSON.parse(atob(normalized));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function needsAccessRefresh(accessToken) {
  if (!accessToken) return true;
  const exp = decodeJwtExp(accessToken);
  if (exp === null) return true;
  return exp * 1000 <= Date.now() + 30_000;
}
