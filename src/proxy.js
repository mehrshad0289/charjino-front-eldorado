import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_MAX_AGE,
  AUTH_COOKIE_BASE_OPTIONS,
} from "@/lib/auth-cookie-options";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/constants";
import { needsAccessRefresh } from "@/lib/jwt-exp";
import { RefreshAuthError, requestNewAccessToken } from "@/lib/request-access-token";

function buildRequestHeadersWithAccessToken(request, accessToken) {
  const headers = new Headers(request.headers);
  const cookies = request.cookies
    .getAll()
    .filter((cookie) => cookie.name !== ACCESS_TOKEN_COOKIE)
    .map((cookie) => `${cookie.name}=${cookie.value}`);

  cookies.push(`${ACCESS_TOKEN_COOKIE}=${accessToken}`);
  headers.set("cookie", cookies.join("; "));
  return headers;
}

function isRefreshAuthError(error) {
  return (
    error instanceof RefreshAuthError ||
    (error instanceof Error && error.name === "RefreshAuthError")
  );
}

export async function proxy(request) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!needsAccessRefresh(accessToken)) {
    return NextResponse.next();
  }

  try {
    const nextAccessToken = await requestNewAccessToken(refreshToken);
    const response = NextResponse.next({
      request: {
        headers: buildRequestHeadersWithAccessToken(request, nextAccessToken),
      },
    });

    response.cookies.set(ACCESS_TOKEN_COOKIE, nextAccessToken, {
      ...AUTH_COOKIE_BASE_OPTIONS,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });

    return response;
  } catch (error) {
    if (!isRefreshAuthError(error)) {
      return NextResponse.next();
    }

    const response = NextResponse.next();
    response.cookies.delete({ name: ACCESS_TOKEN_COOKIE, path: "/" });
    response.cookies.delete({ name: REFRESH_TOKEN_COOKIE, path: "/" });
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|home/|image/|icons/|storage/).*)",
  ],
};
