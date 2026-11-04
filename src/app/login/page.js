import { Open_Sans } from "next/font/google";
import LoginCard from "../../components/eldorado/LoginCard";
import { LOGIN_BG } from "../../components/eldorado/data/dashboardData";

const openSans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

/* Login page (login.eldorado.gg capture, 1920-only): full-viewport dark
   backdrop image, centered sign-in card (OAuth buttons + email form).
   No marketplace header/footer — the capture's login page stands alone.
   Mobile: card fills the width with light padding (no mobile reference;
   documented approximation). */

export const metadata = {
  title: "Sign in - Eldorado",
  description: "Sign in to your Eldorado account.",
};

export default function LoginPage() {
  return (
    <div
      className={`${openSans.variable} grid min-h-screen grid-rows-[auto_1fr_auto] bg-[rgb(15,_27,_42)] bg-center bg-cover font-[family-name:var(--font-opensans)]`}
      style={{ backgroundImage: `url("${LOGIN_BG}")` }}
    >
      <main className="flex items-center justify-center px-4 py-16 sm:px-[81px] sm:py-[162px]">
        <LoginCard />
      </main>
    </div>
  );
}
