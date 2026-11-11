import { connection } from "next/server";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth-cookies";
import { getBackendUrl } from "@/lib/env";
import { apiPaths } from "@/lib/api-paths";

export const instant = false;

export async function GET(request) {
  await connection();
  const accessToken = await getAccessToken();
  const login = new URL("/login", request.url);
  login.searchParams.set("next", "/dashboard/orders/sold");

  if (!accessToken) {
    return NextResponse.redirect(login);
  }

  const incoming = new URL(request.url);
  const params = new URLSearchParams();
  for (const key of ["status", "period", "q"]) {
    const value = incoming.searchParams.get(key);
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  const backend = `${getBackendUrl()}${apiPaths.marketSellerOrdersInvoice}${qs ? `?${qs}` : ""}`;

  let response;
  try {
    response = await fetch(backend, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "text/csv",
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ success: false, message: "اتصال به سرور برقرار نشد" }, { status: 503 });
  }

  if (response.status === 401) {
    return NextResponse.redirect(login);
  }
  if (!response.ok) {
    return NextResponse.json({ success: false, message: "فاکتور دانلود نشد." }, { status: response.status });
  }

  const headers = new Headers();
  headers.set("Content-Type", response.headers.get("Content-Type") || "text/csv; charset=UTF-8");
  const disposition = response.headers.get("Content-Disposition");
  headers.set("Content-Disposition", disposition || 'attachment; filename="charjino-invoices.csv"');

  return new NextResponse(response.body, { status: 200, headers });
}
