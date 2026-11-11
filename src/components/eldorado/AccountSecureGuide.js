import {
  SUPPORT_BUYER_PROTECTION,
  SUPPORT_CHANGE_GAME_EMAIL,
  SUPPORT_HOME,
  SUPPORT_RECEIVE_DETAILS,
} from "./data/supportData";
import { ORDER_COPY } from "./data/orderData";

const STEPS = [
  "با مشخصات ورود وارد اکانت بازی شو و با آگهی مقایسه کن. اگر فرق دارد دریافت را نزن.",
  "وارد ایمیلی شو که به اکانت وصل است.",
  "ایمیل اکانت بازی را به ایمیل خودت عوض کن.",
  "اگر کد تأیید به ایمیل قبلی رفت، در گفتگوی همین سفارش از فروشنده بخواه کد را بفرستد.",
  "رمز اکانت بازی و رمز ایمیل را عوض کن.",
  "تأیید دو مرحله‌ای را روشن کن.",
  "فقط بعد از این کارها «سفارش را دریافت کردم» را بزن.",
];

export default function AccountSecureGuide() {
  return (
    <section className="mt-5 rounded-lg border border-[rgb(231,231,231)] bg-white p-4">
      <h3 className="text-[15px] font-bold">{ORDER_COPY.secureTitle}</h3>
      <p className="mt-2 text-[14px] leading-[24px] text-graytext">{ORDER_COPY.secureIntro}</p>
      <ol className="mt-3 list-decimal space-y-2 pr-5 text-[14px] leading-[24px]">
        {STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="mt-4 flex flex-col gap-2 text-[14px] font-bold">
        <a href={SUPPORT_CHANGE_GAME_EMAIL} className="text-linkblue">
          {ORDER_COPY.linkChangeEmail}
        </a>
        <a href={SUPPORT_RECEIVE_DETAILS} className="text-linkblue">
          {ORDER_COPY.linkReceiveDetails}
        </a>
        <a href={SUPPORT_BUYER_PROTECTION} className="text-linkblue">
          {ORDER_COPY.linkBuyerProtection}
        </a>
        <a href={SUPPORT_HOME} className="text-linkblue">
          {ORDER_COPY.linkSupportHome}
        </a>
        <a href="#order-chat" className="text-linkblue">
          {ORDER_COPY.linkOrderChat}
        </a>
      </div>
    </section>
  );
}
