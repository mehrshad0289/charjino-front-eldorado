import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_MAX_AGE,
  AUTH_COOKIE_BASE_OPTIONS,
} from "@/lib/auth-cookie-options";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/constants";
import { needsAccessRefresh } from "@/lib/jwt-exp";
import { RefreshAuthError, requestNewAccessToken } from "@/lib/request-access-token";
import { isPublicCachePath, isSitemapPath, PAGE_CACHE_CONTROL } from "@/lib/page-cache";
import { isIndexableSeoHost, seoHostFromRequest } from "@/lib/seo-host";

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

function applySeoHeaders(request, response) {
  const pathname = request.nextUrl.pathname;
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  const indexable = isIndexableSeoHost(seoHostFromRequest(request));
  if (!indexable) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  const authed = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);
  if (
    request.method === "GET" &&
    !authed &&
    indexable &&
    isPublicCachePath(pathname) &&
    !isSitemapPath(pathname)
  ) {
    response.headers.set("Cache-Control", PAGE_CACHE_CONTROL);
  }
  return response;
}

function next(request, init) {
  return applySeoHeaders(request, NextResponse.next(init));
}

export async function proxy(request) {
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  if (!refreshToken) {
    return next(request);
  }

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  if (!needsAccessRefresh(accessToken)) {
    return next(request);
  }

  try {
    const nextAccessToken = await requestNewAccessToken(refreshToken);
    const response = next(request, {
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
      return next(request);
    }

    const response = next(request);
    response.cookies.delete({ name: ACCESS_TOKEN_COOKIE, path: "/" });
    response.cookies.delete({ name: REFRESH_TOKEN_COOKIE, path: "/" });
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|fonts/|home/|image/|icons/|illustrations/|storage/).*)",
  ],
};
