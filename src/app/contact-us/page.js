import { connection } from "next/server";
import { getSessionUser } from "@/actions/auth.actions";
import ContactUsPage from "../../components/eldorado/ContactUsPage";
import { buildMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = buildMetadata({
  title: "تماس با ما — شارژینو",
  description: "تیکت پشتیبانی شارژینو. موضوع، توضیح و عکس پیوست کن تا تیم پاسخ بدهد.",
  path: "/contact-us",
});

export default async function ContactUsRoute() {
  await connection();
  const user = await getSessionUser();
  return <ContactUsPage user={user} />;
}
