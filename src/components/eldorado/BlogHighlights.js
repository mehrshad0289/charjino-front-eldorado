import { BLOG_HIGHLIGHTS } from "./data/blogData";

const ITEMS = [
  { title: "راهنماهای جامعه", text: "نکات اقتصاد MMO، لول‌گیری و متای روز." },
  { title: "کدهای فعال", text: "کدهای تبلیغاتی رایگان برای پیشروی." },
  { title: "آموزش و بررسی", text: "چطور داخل و بیرون بازی امن بازی و معامله کنی، و اصلاً ارزشش را دارد؟" },
  { title: "خبر و به‌روزرسانی", text: "پوشش به‌موقع پچ، انتشار، ایونت و جابه‌جایی صنعت." },
];

export default function BlogHighlights() {
  return (
    <section className="pb-16 max-md:pb-10">
      <div className="relative z-[10] mx-auto w-full max-w-[1240px] ps-6 pe-6 max-md:ps-4 max-md:pe-4">
        <div className="mb-[48px] text-center max-md:mb-[32px]">
          <h3 className="blog-display text-center text-[32px] font-black uppercase leading-[48px] tracking-[1.28px] max-md:text-[24px] max-md:leading-[36px] max-md:tracking-[0.96px]">
            هوشمند بازی کن. گرایند را رد کن.
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-[24px] md:grid-cols-4">
          {ITEMS.map((item, index) => {
            const chrome = BLOG_HIGHLIGHTS[index] || {};
            return (
              <div className="text-center" key={item.title}>
                <div
                  className="mb-[16px] inline-flex h-[60px] w-[60px] items-center justify-center rounded-xl text-center"
                  style={{ backgroundColor: chrome.bg }}
                >
                  <div className="h-[33px] w-[33px] overflow-hidden text-center">
                    {chrome.icon ? <img alt="" className="block size-full" src={chrome.icon} /> : null}
                  </div>
                </div>
                <h4 className="mb-[20px] mt-[5px] text-center text-[24px] font-bold leading-[31.2px] max-md:text-[18px] max-md:leading-[23.4px]">
                  {item.title}
                </h4>
                <p className="text-center text-[18px] leading-[27px] text-[rgb(138,134,157)]">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
