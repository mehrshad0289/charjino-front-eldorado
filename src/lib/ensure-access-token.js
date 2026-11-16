import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/lib/auth-cookies";
import { needsAccessRefresh } from "@/lib/jwt-exp";
import { RefreshAuthError, requestNewAccessToken } from "@/lib/request-access-token";

function isRefreshAuthError(error) {
  return (
    error instanceof RefreshAuthError ||
    (error instanceof Error && error.name === "RefreshAuthError")
  );
}

export async function ensureAccessToken() {
  const accessToken = await getAccessToken();
  if (!needsAccessRefresh(accessToken)) return accessToken;

  const refreshToken = await getRefreshToken();
  if (!refreshToken) return accessToken ?? null;

  try {
    const nextAccessToken = await requestNewAccessToken(refreshToken);
    await setAccessToken(nextAccessToken);
    return nextAccessToken;
  } catch (error) {
    if (isRefreshAuthError(error)) {
      await clearAuthCookies();
      return null;
    }
    return accessToken ?? null;
  }
}
