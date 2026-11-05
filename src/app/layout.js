import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata = {
  title: "شارژینو",
  description: "خرید گیفت کارت، شارژ بازی و اکانت با پرداخت ریالی.",
};

export default function RootLayout({ children }) {
  return (
    /* next/font variable on <html> (not body): Tailwind v4 resolves the
       @theme --font-sans value at :root, so --font-lato must exist there —
       on body it resolved empty and every page silently fell back to the
       system font stack (found via the /blog session-12 font trace). */
    <html lang="fa" dir="rtl" className={`${lato.variable} light-theme`}>
      <body>{children}</body>
    </html>
  );
}
