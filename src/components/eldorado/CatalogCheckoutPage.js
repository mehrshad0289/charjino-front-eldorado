import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getSessionUser } from "../../actions/auth.actions";
import { loadCatalogCheckout } from "../../lib/catalog-checkout";
import { formatTomanInWords } from "../../lib/price";
import { GIFT_SHOP_CHROME } from "./data/giftShopCopy";
import CatalogCheckoutForm from "./CatalogCheckoutForm";
import Footer from "./Footer";
import Logo from "./Logo";

export const instant = false;

export default async function CatalogCheckoutPage({ skuId, handle, couponCode, from }) {
  await connection();
  const id = Number(skuId);
  if (!Number.isInteger(id) || id < 1) notFound();
  const loaded = await loadCatalogCheckout(id, handle);
  if (!loaded) notFound();
  const user = await getSessionUser();
  const nextSearch = new URLSearchParams();
  nextSearch.set("sku", String(id));
  if (handle) nextSearch.set("handle", String(handle));
  if (couponCode) nextSearch.set("coupon", String(couponCode));
  if (from) nextSearch.set("from", String(from));
  const next = `/checkout?${nextSearch.toString()}`;
  const back = from && from.startsWith("/") ? from : "";

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <header className="flex min-h-[72px] items-center bg-white px-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <a href="/" aria-label="شارژینو" className="flex items-center">
          <Logo color="#0A0A0A" />
        </a>
      </header>
      <main className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
          <h1 className="text-[24px] font-bold">تسویه امن</h1>
          <div className="mt-6 flex items-start gap-4">
            {loaded.image ? (
              <img alt="" src={loaded.image} className="h-[72px] w-[72px] rounded-lg object-cover" />
            ) : (
              <span className="h-[72px] w-[72px] rounded-lg bg-badgebg" />
            )}
            <div className="min-w-0">
              <p className="text-[18px] font-bold">{loaded.title}</p>
              {loaded.skuName ? <p className="mt-1 text-[14px] text-graytext">{loaded.skuName}</p> : null}
              {loaded.region ? (
                <p className="mt-1 text-[14px] text-graytext">
                  {GIFT_SHOP_CHROME.region}: {loaded.region}
                </p>
              ) : null}
            </div>
          </div>
          {loaded.price > 0 ? (
            <p className="mt-6 text-[24px] font-bold">{formatTomanInWords(loaded.price)}</p>
          ) : null}
          <p className="mt-2 text-[14px] leading-[22px] text-graytext">{GIFT_SHOP_CHROME.deliveryInstructionsBody}</p>
          {back ? (
            <a href={back} className="mt-4 inline-flex text-[14px] font-bold text-linkblue">
              بازگشت به فروشگاه
            </a>
          ) : null}
        </section>
        <CatalogCheckoutForm
          skuId={id}
          loggedIn={Boolean(user)}
          next={next}
          price={loaded.price}
          couponCode={couponCode}
        />
      </main>
      <Footer />
    </div>
  );
}
