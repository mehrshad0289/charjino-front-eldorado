import PrivacyPolicyDoc from "../../components/eldorado/PrivacyPolicyDoc";
import JsonLd from "../../components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = buildMetadata({
  title: "حریم خصوصی — شارژینو",
  description: "سیاست نگهداری و استفاده از دادهٔ شخصی در فروشگاه شارژینو.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "حریم خصوصی", path: "/privacy-policy" },
        ])}
      />
      <PrivacyPolicyDoc />
    </>
  );
}
