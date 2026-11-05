import { NextResponse } from "next/server";
import { serverFetch, ApiError } from "../../../lib/server-fetcher";
import { apiPaths } from "../../../lib/api-paths";
import { mapCategorySuggestions } from "../../../lib/catalog-home";

export async function GET() {
  try {
    const items = await serverFetch(apiPaths.catalogCategories);
    return NextResponse.json({ success: true, data: mapCategorySuggestions(items) });
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "دسته‌ها در دسترس نیست";
    return NextResponse.json({ success: false, message }, { status: 503 });
  }
}
