import { connection } from "next/server";
import { NextResponse } from "next/server";
import { serverFetch, ApiError } from "../../../lib/server-fetcher";
import { apiPaths } from "../../../lib/api-paths";

export const instant = false;

export async function POST(request) {
  await connection();
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  try {
    const data = await serverFetch(apiPaths.catalogCheckoutPreview, {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const status = error instanceof ApiError ? error.statusCode : 503;
    const message = error instanceof ApiError ? error.message : "پیش‌نمایش خرید انجام نشد";
    return NextResponse.json({ success: false, message }, { status });
  }
}
