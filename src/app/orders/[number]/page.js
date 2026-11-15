import { redirect } from "next/navigation";

export const instant = false;

export default async function CatalogOrderPage({ params, searchParams }) {
  const { number } = await params;
  const query = searchParams ? await searchParams : {};
  const payment = String(query.payment || "").trim();
  const href = `/dashboard/orders/purchased/${encodeURIComponent(number)}`;
  redirect(payment ? `${href}?payment=${encodeURIComponent(payment)}` : href);
}
