import { connection } from "next/server";
import { NextResponse } from "next/server";
import { buildNavMegaCached, NAV_VERTICALS } from "../../../lib/nav-mega";

export const instant = false;

export async function GET(request) {
  await connection();
  const vertical = new URL(request.url).searchParams.get("vertical") || "";
  if (!NAV_VERTICALS[vertical]) {
    return NextResponse.json({ success: false, message: "دسته پیدا نشد." }, { status: 404 });
  }
  const data = await buildNavMegaCached(vertical);
  return NextResponse.json(
    { success: true, data },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}
