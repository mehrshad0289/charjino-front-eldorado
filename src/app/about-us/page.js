import AboutUsPage from "../../components/eldorado/AboutUsPage";
import JsonLd from "../../components/seo/json-ld";
import { ABOUT_FAQ } from "../../components/eldorado/data/aboutData";
import { breadcrumbJsonLd, faqPageJsonLd } from "../../lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = buildMetadata({
  title: "درباره ما — شارژینو",
  description: "شارژینو بازارچهٔ گیفت‌کارت، شارژ بازی، کلید، اکانت و بوست با پرداخت ریالی است. پول تا تأیید تحویل نزد ما می‌ماند.",
  path: "/about-us",
});

export default function AboutUsRoute() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "خانه", path: "/" }, { name: "درباره ما", path: "/about-us" }])} />
      <JsonLd data={faqPageJsonLd(ABOUT_FAQ.items)} />
      <AboutUsPage />
    </>
  );
}
