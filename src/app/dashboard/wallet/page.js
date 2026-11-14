import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerTransactions, getSellerWallet } from "@/actions/market.actions";
import DashboardPageHeader from "../../../components/eldorado/DashboardPageHeader";
import DashboardWalletTable from "../../../components/eldorado/DashboardWalletTable";
import { DASHBOARD_WALLET_PAGE } from "../../../components/eldorado/data/dashboardData";

export const instant = false;

export const metadata = {
  title: "کیف پول — شارژینو",
  description: "موجودی قابل برداشت و تراکنش‌های فروش در شارژینو.",
};

export default async function DashboardWalletPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/wallet");
  const wallet = await getSellerWallet();
  if (wallet.unauthorized) redirect("/login?next=/dashboard/wallet");
  const feed = wallet.ok ? await getSellerTransactions() : { ok: false, items: [] };
  const balances = wallet.data?.balances || { pending: 0, withdrawable: 0, reserved: 0, held: 0 };

  return (
    <>
      <DashboardPageHeader icon={DASHBOARD_WALLET_PAGE.icon} title={DASHBOARD_WALLET_PAGE.title} />
      <div className="relative mt-[32px] w-full px-6 pb-[50px]">
        {!wallet.ok ? (
          <p className="text-[14px] text-[rgb(232,27,22)]">{wallet.message || "کیف پول خوانده نشد."}</p>
        ) : (
          <DashboardWalletTable balances={balances} items={feed.ok ? feed.items : []} />
        )}
      </div>
    </>
  );
}
