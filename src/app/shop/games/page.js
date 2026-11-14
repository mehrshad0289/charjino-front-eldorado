import Link from "next/link";
import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import { CONSOLE_PLATFORMS } from "../../../lib/console-games";

export const metadata = {
  title: "بازی — شارژینو",
  description: "دیسک، کارتریج، اکانت و راک کنسول، به‌علاوه گیفت و اشتراک رسمی شارژینو.",
};

export default function GamesShopPage() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar />
      <CategoryNav activeCategory="Games" />
      <main className="mx-auto w-full max-w-[1048px] px-4 py-8">
        <h1 className="text-[30px] font-semibold leading-[36px]">بازی</h1>
        <p className="mt-2 max-w-[640px] text-[15px] leading-7 text-graytext">
          پلتفرم را انتخاب کنید. کالای فیزیکی و اکانت را کاربران می‌فروشند. گیفت، پلاس، گیم‌پس و والت استیم را شارژینو می‌فروشد.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CONSOLE_PLATFORMS.map((platform) => (
            <Link
              key={platform.key}
              href={`/shop/games/${platform.key}`}
              className="rounded-xl bg-white p-5 shadow-[0_2px_4px_rgba(9,9,11,0.05)]"
            >
              <h2 className="text-[20px] font-bold">{platform.title}</h2>
              <p className="mt-2 text-[14px] leading-6 text-graytext">{platform.text}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
