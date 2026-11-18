import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Logo from "../../../../../components/eldorado/Logo";
import Footer from "../../../../../components/eldorado/Footer";
import MarketZibalVerifyScreen from "../../../../../components/eldorado/MarketZibalVerifyScreen";
import LoadingSpinner from "../../../../../components/eldorado/LoadingSpinner";
import { noIndexMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = noIndexMetadata({
  title: "تأیید پرداخت بازارچه — شارژینو",
});

const GATEWAYS = new Set(["zibal", "zarinpal", "fake"]);

export default async function MarketPaymentVerifyPage({ params }) {
  await connection();
  const { gateway } = await params;
  const name = String(gateway || "").trim().toLowerCase();
  if (!GATEWAYS.has(name)) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <header className="flex min-h-[72px] items-center bg-white px-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <a href="/" aria-label="شارژینو" className="flex items-center">
          <Logo color="#0A0A0A" />
        </a>
      </header>
      <main className="grow">
        <Suspense fallback={<LoadingSpinner variant="page" />}>
          <MarketZibalVerifyScreen gateway={name} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
