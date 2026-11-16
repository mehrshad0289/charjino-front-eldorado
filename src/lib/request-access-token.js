import { getBackendUrl } from "@/lib/env";
import { apiPaths } from "@/lib/api-paths";

export class RefreshAuthError extends Error {
  statusCode = 401;

  constructor(message = "تمدید نشست انجام نشد") {
    super(message);
    this.name = "RefreshAuthError";
  }
}

export async function requestNewAccessToken(refreshToken) {
  const response = await fetch(`${getBackendUrl()}${apiPaths.authRefresh}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => undefined);
  const wrapped = payload && typeof payload === "object" && "data" in payload ? payload.data : undefined;
  const accessToken =
    wrapped?.access_token ??
    (payload && typeof payload === "object" && "access_token" in payload ? payload.access_token : undefined);

  if (response.status === 401) {
    throw new RefreshAuthError();
  }

  if (!response.ok || !accessToken) {
    throw new Error("تمدید نشست انجام نشد");
  }

  return accessToken;
}
