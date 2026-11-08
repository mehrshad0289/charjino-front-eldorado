import { connection } from "next/server";
import { NextResponse } from "next/server";
import { serverFetch, ApiError } from "../../../lib/server-fetcher";
import { apiPaths } from "../../../lib/api-paths";
import { rewriteGiftSearchItems } from "../../../lib/gift-card-shop";

export const instant = false;

export async function GET(request) {
  await connection();
  const incoming = new URL(request.url);
  const q = (incoming.searchParams.get("q") ?? "").slice(0, 100);
  const page = Number(incoming.searchParams.get("page") ?? "1") || 1;
  const perPage = Number(incoming.searchParams.get("per_page") ?? "10") || 10;
  const mode = incoming.searchParams.get("mode") ?? "auto";
  const group = incoming.searchParams.get("group") ?? "";
  const platform = incoming.searchParams.get("platform") ?? "";
  const region = incoming.searchParams.get("region") ?? "";

  try {
    const data = await serverFetch(
      apiPaths.smartSearch({
        q,
        page,
        perPage,
        mode,
        group: group || undefined,
        platform: platform || undefined,
        region: region || undefined,
      }),
    );
    const items = Array.isArray(data?.items) ? rewriteGiftSearchItems(data.items) : data?.items;
    return NextResponse.json({
      success: true,
      data: data && typeof data === "object" ? { ...data, items } : data,
    });
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "اتصال به سرور برقرار نشد";
    const status = error instanceof ApiError && error.statusCode ? error.statusCode : 503;
    return NextResponse.json({ success: false, message }, { status });
  }
}
