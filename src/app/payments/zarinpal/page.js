import { connection } from "next/server";
import { Suspense } from "react";
import Logo from "../../../components/eldorado/Logo";
import Footer from "../../../components/eldorado/Footer";
import ZarinpalVerifyScreen from "../../../components/eldorado/ZarinpalVerifyScreen";
import LoadingSpinner from "../../../components/eldorado/LoadingSpinner";
import { noIndexMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = noIndexMetadata({
  title: "تأیید پرداخت — شارژینو",
});

export default async function ZarinpalPaymentReturnPage() {
  await connection();
  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <header className="flex min-h-[72px] items-center bg-white px-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <a href="/" aria-label="شارژینو" className="flex items-center">
          <Logo color="#0A0A0A" />
        </a>
      </header>
      <main className="grow">
        <Suspense fallback={<LoadingSpinner variant="page" />}>
          <ZarinpalVerifyScreen />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
