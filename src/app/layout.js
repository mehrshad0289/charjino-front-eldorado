import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata = {
  title: "Eldorado - Largest & Safest Game Items Marketplace",
  description:
    "Buy and sell game items, accounts, currencies and boosting services safely.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light-theme">
      <body className={lato.variable}>{children}</body>
    </html>
  );
}
