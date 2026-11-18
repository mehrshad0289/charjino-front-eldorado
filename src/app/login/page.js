import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import LoginCard from "../../components/eldorado/LoginCard";
import { LOGIN_BG } from "../../components/eldorado/data/dashboardData";
import { safeNextPath } from "@/lib/safe-path";
import { noIndexMetadata } from "@/lib/seo";

export const instant = false;

export const metadata = noIndexMetadata({
  title: "ورود — شارژینو",
  description: "ورود به شارژینو",
});

export default async function LoginPage({ searchParams }) {
  await connection();
  const params = await searchParams;
  const nextPath = safeNextPath(params?.next);
  const user = await getSessionUser();
  if (user) redirect(nextPath);

  return (
    <div
      className="login-page grid min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[rgb(15,_27,_42)] bg-center bg-cover font-sans max-md:h-dvh max-md:overflow-hidden md:grid-rows-[auto_1fr_auto]"
      style={{ backgroundImage: `url("${LOGIN_BG}")` }}
    >
      <main className="flex w-full min-w-0 items-center justify-center px-4 py-6 sm:px-[81px] sm:py-[162px] max-md:h-full max-md:min-h-0 max-md:overflow-hidden">
        <LoginCard nextPath={nextPath} />
      </main>
    </div>
  );
}
