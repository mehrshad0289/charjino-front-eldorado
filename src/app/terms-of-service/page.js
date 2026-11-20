import TermsOfServiceDoc from "../../components/eldorado/TermsOfServiceDoc";
import JsonLd from "../../components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = buildMetadata({
  title: "شرایط استفاده — شارژینو",
  description: "شرایط خرید، فروش و استفاده از فروشگاه و بازارچهٔ شارژینو.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "شرایط استفاده", path: "/terms-of-service" },
        ])}
      />
      <TermsOfServiceDoc />
    </>
  );
}
