import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getSellerMe } from "@/actions/market.actions";
import DashboardPageHeader from "../../../../../components/eldorado/DashboardPageHeader";
import ConsoleGameForm from "../../../../../components/eldorado/ConsoleGameForm";
import { sellBlockers } from "@/lib/listing";

export const instant = false;

export const metadata = {
  title: "آگهی بازی جدید — شارژینو",
};

export default async function NewConsoleGamePage({ searchParams }) {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard/offers/ConsoleGame/new");
  const seller = await getSellerMe();
  if (seller.unauthorized) redirect("/login?next=/dashboard/offers/ConsoleGame/new");
  const query = await searchParams;
  const platform = typeof query.platform === "string" ? query.platform : "playstation";
  const blockers = sellBlockers(seller);

  return (
    <>
      <DashboardPageHeader
        icon="offers"
        title="آگهی بازی"
        action={{ label: "آگهی‌ها", href: "/dashboard/offers/ConsoleGame", ariaLabel: "آگهی‌ها" }}
      />
      <div className="mt-1 w-full px-6 pb-[50px]">
        {blockers.length ? (
          <div className="mb-5 rounded-xl bg-white p-5">
            {blockers.map((line) => (
              <p key={line} className="text-[14px] text-[rgb(232,27,22)]">{line}</p>
            ))}
          </div>
        ) : (
          <ConsoleGameForm platform={platform} />
        )}
      </div>
    </>
  );
}
