import { connection } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverFetch, ApiError } from "../../../../lib/server-fetcher";
import { apiPaths } from "../../../../lib/api-paths";
import { ACCESS_TOKEN_COOKIE } from "../../../../lib/constants";

export const instant = false;

async function authorizationHeader(request) {
  const header = request.headers.get("authorization");
  if (header) return header;
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value?.trim();
  return token ? `Bearer ${token}` : "";
}

export async function POST(request) {
  await connection();
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const headers = {};
  const authorization = await authorizationHeader(request);
  if (authorization) headers.Authorization = authorization;

  try {
    const data = await serverFetch(apiPaths.checkoutCoupon, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data, message: "کد تخفیف اعمال شد." });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 503;
    const message =
      error instanceof ApiError
        ? error.statusCode === 401
          ? "برای اعمال کد تخفیف وارد شوید."
          : error.message
        : "کد تخفیف اعمال نشد";
    return NextResponse.json(
      {
        success: false,
        message,
        ...(error instanceof ApiError && error.errorCode ? { error: { code: error.errorCode } } : {}),
      },
      { status },
    );
  }
}
