import { redirect } from "next/navigation";

export const instant = false;

export default function CatalogOrdersPage() {
  redirect("/dashboard/orders/purchased");
}
