import { connection } from "next/server";
import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/actions/auth.actions";
import { ApiError } from "@/lib/server-fetcher";
import { RefreshAuthError } from "@/lib/request-access-token";

export const instant = false;

function isUnauthorizedRefresh(error) {
  if (error instanceof RefreshAuthError) return true;
  if (error instanceof Error && error.name === "RefreshAuthError") return true;
  return error instanceof ApiError && error.statusCode === 401;
}

export async function POST() {
  await connection();
  try {
    await refreshAccessToken();
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (isUnauthorizedRefresh(error)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
