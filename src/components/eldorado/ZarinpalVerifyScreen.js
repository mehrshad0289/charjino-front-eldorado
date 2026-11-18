"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyZarinpalPayment } from "../../actions/checkout.actions";
import { catalogOrderHref } from "../../lib/catalog-checkout";
import LoadingSpinner from "./LoadingSpinner";

export default function ZarinpalVerifyScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const started = useRef(false);
  const [message, setMessage] = useState("در حال تأیید پرداخت…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const authority = (params.get("Authority") ?? params.get("authority") ?? "").trim();
    const status = (params.get("Status") ?? params.get("status") ?? "").trim();
    if (!authority) {
      setError("بازگشت از درگاه ناقص است. از سفارش‌های خرید ادامه بده.");
      return;
    }
    void (async () => {
      const result = await verifyZarinpalPayment({ authority, status });
      if (!result.ok) {
        setError(result.message || "پرداخت تأیید نشد.");
        return;
      }
      setMessage("پرداخت تأیید شد. در حال رفتن به سفارش…");
      router.replace(`${catalogOrderHref(result.data.number)}?payment=success`);
    })();
  }, [params, router]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      {error ? (
        <>
          <h1 className="text-[24px] font-bold">پرداخت تأیید نشد</h1>
          <p className="max-w-md text-[14px] leading-[22px] text-red-600">{error}</p>
          <a href="/dashboard/orders/purchased" className="text-[14px] font-bold text-linkblue">
            سفارش‌های خرید
          </a>
        </>
      ) : (
        <>
          <LoadingSpinner variant="page" />
          <p className="text-[14px] text-graytext">{message}</p>
          <a href="/dashboard/orders/purchased" className="text-[14px] font-bold text-linkblue">
            اگر منتقل نشدی، سفارش‌های خرید را باز کن
          </a>
        </>
      )}
    </div>
  );
}
