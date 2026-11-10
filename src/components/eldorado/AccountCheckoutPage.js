import { notFound } from "next/navigation";
import { getSessionUser } from "../../actions/auth.actions";
import { listingToOffer, loadMarketListing } from "../../lib/store-engine";
import AccountCheckoutForm from "./AccountCheckoutForm";
import Footer from "./Footer";

export default async function AccountCheckoutPage({ listingId }) {
  const listing = await loadMarketListing(listingId);
  if (!listing) notFound();
  const offer = listingToOffer(listing, "accounts");
  const user = await getSessionUser();
  const next = `/checkout?listing=${encodeURIComponent(String(listing.id))}`;

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
            </div>
          </div>
          <p className="mt-6 text-[24px] font-bold">{offer?.price}</p>
          <p className="mt-2 text-[14px] leading-[22px] text-graytext">پول تا وقتی تحویل را تأیید کنی نزد شارژینو می‌ماند.</p>
        </section>
        <AccountCheckoutForm listingId={listing.id} loggedIn={Boolean(user)} next={next} />
      </main>
      <Footer />
    </div>
  );
}
