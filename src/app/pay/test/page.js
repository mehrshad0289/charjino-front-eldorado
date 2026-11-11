import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getBuyerOrder } from "@/actions/market.actions";
import TestBankGateway from "../../../components/eldorado/TestBankGateway";

export const instant = false;

export const metadata = {
  title: "درگاه پرداخت آزمایشی — شارژینو",
};

export default async function TestPayPage({ searchParams }) {
  await connection();
  const query = searchParams ? await searchParams : {};
  const reference = String(query.reference || "").trim();
  const orderNo = String(query.order || "").trim();
  const amountFromQuery = Number(query.amount || 0);
  if (!reference) redirect("/dashboard/orders/purchased");

  const user = await getSessionUser();
  const next = `/pay/test?reference=${encodeURIComponent(reference)}&order=${encodeURIComponent(orderNo)}&amount=${encodeURIComponent(String(amountFromQuery || ""))}`;
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);

  let amount = amountFromQuery;
  let title = "";
  if (orderNo) {
    const order = await getBuyerOrder(orderNo);
    if (order.ok && order.data) {
      amount = Number(order.data.buyer_paid_amount || amount);
      title = order.data.listing?.title || "";
    }
  }

  return <TestBankGateway reference={reference} orderNo={orderNo} amount={amount} title={title} />;
}
