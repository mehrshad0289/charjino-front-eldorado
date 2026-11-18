import CategoryNav from "./CategoryNav";
import ChatBubble from "./ChatBubble";
import Footer from "./Footer";
import { noIndexMetadata } from "@/lib/seo";

export function comingSoonMetadata(title) {
  return noIndexMetadata({
    title: `${title} | شارژینو`,
    description: "این صفحه به‌زودی آماده می‌شود.",
  });
}

export default function ComingSoonPage({ title }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <CategoryNav />
      <main className="isolate">
        <div className="mx-auto flex min-h-[50vh] max-w-[682px] flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-[36px] font-black leading-[40px]">به‌زودی</h1>
          {title ? <p className="mt-4 text-[18px] font-bold leading-[27px]">{title}</p> : null}
          <p className="mt-3 text-[16px] leading-[24px] text-graytext">این صفحه هنوز آماده نیست. کمی دیگر سر بزن.</p>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
