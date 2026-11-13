import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getSessionUser } from "../../actions/auth.actions";
import { listingToOffer, loadMarketListing } from "../../lib/store-engine";
import { apiPaths } from "../../lib/api-paths";
import { serverFetch } from "../../lib/server-fetcher";
import AccountCheckoutForm from "./AccountCheckoutForm";
import Footer from "./Footer";

async function loadQuote(listingId, quantity) {
  try {
    return await serverFetch(apiPaths.marketQuote(listingId, quantity));
  } catch {
    return null;
  }
}

export default async function AccountCheckoutPage({ listingId, quantity }) {
  await connection();
  const listing = await loadMarketListing(listingId);
  if (!listing) notFound();
  const isItem = listing.offer_type === "CustomItem";
  const isCurrency = listing.offer_type === "Currency";
  const offer = listingToOffer(listing, isCurrency ? "currency" : isItem ? "items" : "accounts");
  const user = await getSessionUser();
  const next = `/checkout?listing=${encodeURIComponent(String(listing.id))}`;
  const quote = await loadQuote(listing.id, quantity);
  const sellerId = listing.seller?.id != null ? String(listing.seller.id) : "";
  const isOwn = Boolean(user?.id && sellerId && String(user.id) === sellerId);
  const stock = listing.stock != null ? Number(listing.stock) : quote?.stock;
  const minQuantity = listing.min_quantity != null ? Number(listing.min_quantity) : quote?.min_quantity || 1;
  const checkoutFields = Array.isArray(listing.checkout_fields)
    ? listing.checkout_fields
    : Array.isArray(quote?.checkout_fields)
      ? quote.checkout_fields
      : [];
  const deliveryLabel = listing.delivery_label || quote?.delivery_label || "";

  return (
    <div className="flex min-h-screen flex-col bg-page text-ink">
      <header className="flex min-h-[72px] items-center bg-white px-4 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
        <a href="/" className="text-[18px] font-bold">شارژینو</a>
      </header>
      <main className="mx-auto grid w-full max-w-[1100px] gap-6 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <section className="rounded-lg bg-white p-6 shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px]">
          <h1 className="text-[24px] font-bold">تسویه امن</h1>
          <div className="mt-6 flex items-start gap-4">
            {offer?.img ? (
              <img alt="" src={offer.img} className="h-[72px] w-[72px] rounded-lg object-cover" />
            ) : (
              <span className="h-[72px] w-[72px] rounded-lg bg-badgebg" />
            )}
            <div className="min-w-0">
              <p className="text-[18px] font-bold">{offer?.title}</p>
              <p className="mt-1 text-[14px] text-graytext">{listing.game_name}</p>
              <p className="mt-2 text-[14px]">فروشنده: {offer?.seller}</p>
              {isItem && offer?.itemTypeName ? (
                <p className="mt-1 text-[14px] text-graytext">{offer.itemTypeName}</p>
              ) : null}
            </div>
          </div>
          <p className="mt-6 text-[24px] font-bold">{offer?.price}</p>
          <p className="mt-2 text-[14px] leading-[22px] text-graytext">
            پول تا وقتی تحویل را تأیید کنی نزد شارژینو می‌ماند.
          </p>
        </section>
        <AccountCheckoutForm
          listingId={listing.id}
          loggedIn={Boolean(user)}
          next={next}
          isOwn={isOwn}
          isItem={isItem}
          isCurrency={isCurrency}
          initialQuantity={quantity}
          quote={quote}
          stock={stock}
          minQuantity={minQuantity}
          checkoutFields={checkoutFields}
          deliveryLabel={deliveryLabel}
        />
      </main>
      <Footer />
    </div>
  );
}
