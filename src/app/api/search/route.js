import { NextResponse } from "next/server";
import { getBackendUrl } from "../../../lib/env";
import { rewriteGiftSearchItems } from "../../../lib/gift-card-shop";

export async function GET(request) {
  const incoming = new URL(request.url);
  const q = (incoming.searchParams.get("q") ?? "").slice(0, 100);
  const page = incoming.searchParams.get("page") ?? "1";
  const perPage = incoming.searchParams.get("per_page") ?? "10";
  const mode = incoming.searchParams.get("mode") ?? "auto";
  const search = new URLSearchParams({ q, page, per_page: perPage, mode });

  try {
    const response = await fetch(`${getBackendUrl()}/catalog/smart-search?${search}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const payload = await response.json().catch(() => ({
      success: false,
      message: "پاسخ سرچ نامعتبر بود",
    }));
    const data = payload?.data;
    if (data && typeof data === "object" && Array.isArray(data.items)) {
      payload.data = { ...data, items: rewriteGiftSearchItems(data.items) };
    }
    return NextResponse.json(payload, { status: response.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "اتصال به سرور برقرار نشد" },
      { status: 503 },
    );
  }
}
