import Link from "next/link";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { FA } from "../../../components/eldorado/data/faCopy";
import { CONSOLE_PLATFORMS } from "../../../lib/console-games";

import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "بازی — شارژینو",
  description: "کنسول را انتخاب کنید. دیسک، کارتریج، اکانت و راک آگهی کاربر است. گیفت و اشتراک را شارژینو می‌فروشد.",
  path: "/shop/games",
});

export default function GamesShopPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav activeCategory="Games" />
      <main className="mx-auto w-full max-w-[1048px] px-4 py-8">
        <h1 className="text-[30px] font-semibold leading-[36px]">{FA.games}</h1>
        <p className="mt-2 max-w-[640px] text-[15px] leading-7 text-graytext">
          کنسول را انتخاب کنید. تب بازی آگهی‌های دیسک، کارتریج، اکانت و راک است. شارژ با آیدی، آیتم و ارز داخل بازی در دستهٔ خودشان می‌مانند.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CONSOLE_PLATFORMS.map((console) => (
            <Link
              key={console.key}
              href={`/shop/games/${console.key}`}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-[0_2px_4px_rgba(9,9,11,0.05)]"
            >
              <img src={console.image} alt="" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <span>
                <span className="block text-[20px] font-bold">{console.title}</span>
                <span className="mt-1 block text-[13px] leading-5 text-graytext">{console.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
