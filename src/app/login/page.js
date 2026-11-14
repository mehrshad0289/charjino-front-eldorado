import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import LoginCard from "../../components/eldorado/LoginCard";
import { LOGIN_BG } from "../../components/eldorado/data/dashboardData";
import { safeNextPath } from "@/lib/safe-path";

export const instant = false;

export const metadata = {
  title: "ورود — شارژینو",
  description: "ورود به شارژینو",
};

export default async function LoginPage({ searchParams }) {
  await connection();
  const params = await searchParams;
  const nextPath = safeNextPath(params?.next);
  const user = await getSessionUser();
  if (user) redirect(nextPath);

  return (
    <div
      className="grid min-h-screen w-full max-w-[100vw] grid-rows-[auto_1fr_auto] overflow-x-hidden bg-[rgb(15,_27,_42)] bg-center bg-cover font-sans"
      style={{ backgroundImage: `url("${LOGIN_BG}")` }}
    >
      <main className="flex w-full min-w-0 items-center justify-center px-4 py-16 sm:px-[81px] sm:py-[162px]">
        <LoginCard nextPath={nextPath} />
      </main>
    </div>
  );
}
