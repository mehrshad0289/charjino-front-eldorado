import { connection } from "next/server";
import { NextResponse } from "next/server";
import { secretMatches, sitemapSecret } from "@/lib/sitemap/config";
import { requestSitemapRevalidate } from "@/lib/sitemap/engine";

export const instant = false;

function providedSecret(request, body) {
  return (
    request.headers.get("x-revalidate-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    (typeof body.secret === "string" ? body.secret : null)
  );
}

export async function POST(request) {
  await connection();
  if (!sitemapSecret()) {
    return NextResponse.json({ success: false, message: "REVALIDATE_SECRET is not set" }, { status: 503 });
  }
  let body = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  if (!secretMatches(providedSecret(request, body))) {
    return NextResponse.json({ success: false, message: "unauthorized" }, { status: 401 });
  }
  requestSitemapRevalidate();
  return NextResponse.json({ success: true, message: "sitemap revalidate queued" });
}
