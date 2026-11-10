import { cookies } from "next/headers";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants";

export const ACCESS_TOKEN_MAX_AGE = 30 * 60;
export const REFRESH_TOKEN_MAX_AGE = 5 * 24 * 60 * 60;

const AUTH_COOKIE_BASE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function getAccessToken() {
  const store = await cookies();
  return store.get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  const store = await cookies();
  return store.get(REFRESH_TOKEN_COOKIE)?.value;
}

export async function setAccessToken(access) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, access, {
    ...AUTH_COOKIE_BASE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
}

export async function setAuthTokens(access, refresh) {
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, access, {
    ...AUTH_COOKIE_BASE_OPTIONS,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  store.set(REFRESH_TOKEN_COOKIE, refresh, {
    ...AUTH_COOKIE_BASE_OPTIONS,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete({ name: ACCESS_TOKEN_COOKIE, path: "/" });
  store.delete({ name: REFRESH_TOKEN_COOKIE, path: "/" });
}
