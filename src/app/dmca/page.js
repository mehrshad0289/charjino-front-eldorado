import DmcaDoc from "../../components/eldorado/DmcaDoc";
import JsonLd from "../../components/seo/json-ld";
import { breadcrumbJsonLd } from "@/lib/json-ld";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = buildMetadata({
  title: "قانون حق نشر — شارژینو",
  description:
    "اگر اثر دارای حق نشر شما بدون اجازه در شارژینو آمده، از تماس با ما با موضوع ادعای حق نشر اطلاع دهید تا بررسی کنیم.",
  path: "/dmca",
});

export default function DmcaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "خانه", path: "/" },
          { name: "قانون حق نشر", path: "/dmca" },
        ])}
      />
      <DmcaDoc />
    </>
  );
}
