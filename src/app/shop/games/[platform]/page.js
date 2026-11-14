import Link from "next/link";
import { notFound } from "next/navigation";
import HeaderBar from "../../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../../components/eldorado/CategoryNav";
import Footer from "../../../../components/eldorado/Footer";
import ChatBubble from "../../../../components/eldorado/ChatBubble";
import { serverFetch, ApiError } from "../../../../lib/server-fetcher";
import { apiPaths } from "../../../../lib/api-paths";
import { formatToman } from "../../../../lib/listing";
import { consoleFormatLabel, consoleModelLabel, consolePlatform } from "../../../../lib/console-games";

export const instant = false;

export async function generateMetadata({ params }) {
  const { platform } = await params;
  const row = consolePlatform(platform);
  return { title: row ? `${row.title} — بازی — شارژینو` : "بازی — شارژینو" };
}

export default async function ConsolePlatformPage({ params, searchParams }) {
  const { platform } = await params;
  const query = await searchParams;
  const row = consolePlatform(platform);
  if (!row) notFound();
  const q = typeof query.q === "string" ? query.q.trim() : "";
  let items = [];
  if (row.sell) {
    try {
      const payload = await serverFetch(
        apiPaths.marketListings({ offer: "ConsoleGame", platform: row.key, q, perPage: 48 }),
      );
      items = Array.isArray(payload?.items) ? payload.items : [];
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
  }

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav activeCategory="Games" />
      <main className="mx-auto w-full max-w-[1048px] px-4 py-8">
        <p className="text-[13px] text-graytext">
          <Link href="/shop/games" className="hover:text-ink">بازی</Link>
          <span> / {row.title}</span>
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[30px] font-semibold leading-[36px]">{row.title}</h1>
          {row.sell ? (
            <Link href={`/dashboard/offers/ConsoleGame/new?platform=${row.key}`} className="inline-flex min-h-[42px] items-center rounded-lg bg-ink px-4 text-[14px] font-bold text-white">
              ثبت آگهی
            </Link>
          ) : null}
        </div>
        <p className="mt-2 max-w-[720px] text-[15px] leading-7 text-graytext">{row.text}</p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {row.services.map((service) => (
            <Link key={service.title} href={service.href} className="rounded-xl bg-white p-4">
              <p className="text-[16px] font-bold">{service.title}</p>
              <p className="mt-1 text-[13px] text-graytext">{service.text}</p>
              <p className="mt-2 text-[12px] font-bold text-ink">{service.supplier}</p>
            </Link>
          ))}
        </div>
        {row.sell ? (
          <>
            <form className="mt-8 flex gap-2" action={`/shop/games/${row.key}`}>
              <input
                name="q"
                defaultValue={q}
                placeholder="جستجوی بازی"
                className="h-[42px] w-full max-w-[360px] rounded-lg bg-white px-3 text-[14px]"
              />
              <button type="submit" className="h-[42px] rounded-lg bg-brand px-4 text-[14px] font-bold text-ink">
                جستجو
              </button>
            </form>
            <div className="mt-4 grid grid-cols-1 gap-3 min-[961px]:grid-cols-2">
              {items.map((item) => (
                <Link key={item.id} href={`/shop/games/l/${item.id}`} className="rounded-xl bg-white p-4">
                  <p className="text-[16px] font-bold">{item.title}</p>
                  <p className="mt-1 text-[14px] text-graytext">
                    {item.game_name}
                    {item.attributes?.format ? ` · ${consoleFormatLabel(item.attributes.format)}` : ""}
                    {item.attributes?.console_model ? ` · ${consoleModelLabel(item.attributes.console_model)}` : ""}
                  </p>
                  <p className="mt-2 text-[15px] font-bold">{formatToman(item.price_amount)} تومان</p>
                </Link>
              ))}
            </div>
            {items.length === 0 ? <p className="mt-6 text-[14px] text-graytext">هنوز آگهی تأییدشده‌ای در این پلتفرم نیست.</p> : null}
          </>
        ) : null}
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
