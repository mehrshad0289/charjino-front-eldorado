import { connection } from "next/server";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/auth.actions";
import { getKycMe, getSellerMe } from "@/actions/market.actions";
import HeaderBar from "../../../components/eldorado/HeaderBar";
import CategoryNav from "../../../components/eldorado/CategoryNav";
import Footer from "../../../components/eldorado/Footer";
import ChatBubble from "../../../components/eldorado/ChatBubble";
import VerifyStatusActions from "../../../components/eldorado/VerifyStatusActions";
import VerifyShebaForm from "../../../components/eldorado/VerifyShebaForm";
import { VERIFY_BANNER, VERIFY_KYC, VERIFY_STATUS } from "../../../components/eldorado/data/verifyData";

export const instant = false;

export const metadata = {
  title: "احراز فروشنده — شارژینو",
  description: "برای فروش اکانت، احراز هویت را شروع کن.",
};

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="rgb(20,19,26)" strokeWidth="1.8" />
      <path d="M12 11v5" stroke="rgb(20,19,26)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.2" fill="rgb(20,19,26)" />
    </svg>
  );
}

function attemptList(kyc) {
  const raw = kyc.ok ? kyc.data?.attempts : null;
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return Object.values(raw);
  return [];
}

function latestLevelTwo(attempts, status) {
  return (
    attempts
      .filter((row) => Number(row.level) === 2 && row.status === status)
      .sort((left, right) => {
        const idDelta = Number(right.id || 0) - Number(left.id || 0);
        if (idDelta !== 0) return idDelta;
        return String(right.requested_at || "").localeCompare(String(left.requested_at || ""));
      })[0] ?? null
  );
}

function kycPhase(seller, kyc) {
  const profile = seller.ok ? seller.data?.profile : null;
  const currentLevel = kyc.ok ? Number(kyc.data?.current_level ?? 0) : Number(profile?.kyc_level ?? 0);
  const attempts = attemptList(kyc);
  const pending = latestLevelTwo(attempts, "pending");
  const rejected = latestLevelTwo(attempts, "rejected");
  const uploadedKinds = Array.isArray(pending?.documents)
    ? pending.documents.map((doc) => doc.kind).filter(Boolean)
    : [];
  const hasCard = uploadedKinds.includes("national_card");
  const hasSelfie = uploadedKinds.includes("selfie");

  const shebaSet = Boolean(profile?.sheba_set);
  const shebaMasked = profile?.sheba_masked ? String(profile.sheba_masked) : "";
  const holderName = profile?.sheba_holder_name ? String(profile.sheba_holder_name) : "";

  if (currentLevel >= 2) {
    return {
      phase: shebaSet ? "ready" : "sheba",
      uploadedKinds,
      rejectionReason: "",
      shebaMasked,
      holderName,
    };
  }
  if (pending && hasCard && hasSelfie) {
    return { phase: "pending", uploadedKinds, rejectionReason: "", shebaMasked, holderName };
  }
  if (pending) return { phase: "docs", uploadedKinds, rejectionReason: "", shebaMasked, holderName };
  if (rejected) {
    return {
      phase: "rejected",
      uploadedKinds: [],
      rejectionReason: String(rejected.rejection_reason || "").trim(),
      shebaMasked,
      holderName,
    };
  }
  return { phase: "form", uploadedKinds: [], rejectionReason: "", shebaMasked, holderName };
}

export default async function VerifyStatusPage() {
  await connection();
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/verify/status");

  const [seller, kyc] = await Promise.all([getSellerMe(), getKycMe()]);
  const { phase, uploadedKinds, rejectionReason, shebaMasked, holderName } = kycPhase(seller, kyc);
  const { next, why, help, cardShadow, infoPillBg } = VERIFY_STATUS;

  const headline =
    phase === "pending"
      ? {
          badge: VERIFY_KYC.pendingBadge,
          badgeBg: VERIFY_KYC.pendingBadgeBg,
          title: VERIFY_KYC.pendingTitle,
          subtitle: VERIFY_KYC.pendingSubtitle,
          cta: "",
          reason: false,
        }
      : phase === "sheba"
        ? {
            badge: VERIFY_STATUS.badge,
            badgeBg: VERIFY_STATUS.badgeBg,
            title: VERIFY_KYC.shebaTitle,
            subtitle: VERIFY_KYC.shebaSubtitle,
            cta: VERIFY_KYC.shebaSubmit,
            reason: false,
          }
        : phase === "ready"
          ? {
              badge: VERIFY_KYC.verifiedBadge,
              badgeBg: VERIFY_KYC.verifiedBadgeBg,
              title: VERIFY_KYC.shebaSavedTitle,
              subtitle: shebaMasked
                ? `تسویه به ${shebaMasked} می‌رود. شماره کامل اینجا نشان داده نمی‌شود.`
                : VERIFY_KYC.shebaSavedSubtitle,
              cta: VERIFY_KYC.shebaReplace,
              reason: false,
            }
        : phase === "docs"
          ? {
              badge: VERIFY_STATUS.badge,
              badgeBg: VERIFY_STATUS.badgeBg,
              title: VERIFY_KYC.docsTitle,
              subtitle: VERIFY_KYC.docsSubtitle,
              cta: VERIFY_KYC.docsCta,
              reason: false,
            }
          : phase === "rejected"
            ? {
                badge: VERIFY_KYC.rejectedBadge,
                badgeBg: VERIFY_STATUS.badgeBg,
                title: VERIFY_KYC.rejectedTitle,
                subtitle: rejectionReason || VERIFY_KYC.rejectedFallback,
                cta: VERIFY_KYC.rejectedCta,
                reason: true,
              }
            : {
                badge: VERIFY_STATUS.badge,
                badgeBg: VERIFY_STATUS.badgeBg,
                title: VERIFY_STATUS.title,
                subtitle: VERIFY_STATUS.subtitle,
                cta: VERIFY_KYC.submit,
                reason: false,
              };

  const showForm = phase === "form" || phase === "docs" || phase === "rejected";
  const showSheba = phase === "sheba" || phase === "ready";

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar user={user} />
      <CategoryNav />
      <main className="isolate relative min-h-[1200px]">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[465px] overflow-hidden">
          <img
            alt=""
            src={VERIFY_BANNER}
            className="block h-[465px] w-full object-cover align-middle"
            style={{ objectPosition: "50% 15%" }}
          />
          <div
            className="absolute inset-x-0 -bottom-px h-[340px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)",
            }}
          />
        </div>

        <div className="relative z-[1] flex flex-col items-center gap-8 px-4 pb-10 pt-10">
          <div className="flex w-full max-w-[648px] flex-col gap-6">
            <div
              className="flex w-full flex-col items-end gap-6 rounded-xl bg-white p-6"
              style={{ boxShadow: cardShadow }}
            >
              <div className="flex flex-grow items-center justify-between self-stretch">
                <div
                  role="status"
                  aria-label={headline.badge}
                  className="flex max-w-fit items-center justify-center rounded-lg px-3 pb-[6px] pt-[5px] text-[14px] leading-[normal] text-white"
                  style={{ backgroundColor: headline.badgeBg }}
                >
                  <span className="block">{headline.badge}</span>
                </div>
                <div
                  className="flex items-center rounded-full p-1"
                  style={{ backgroundColor: infoPillBg }}
                >
                  <InfoIcon />
                </div>
              </div>
              <div className="flex flex-col items-start self-stretch">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-start gap-2">
                    <p className="text-[24px] font-bold leading-[28.8px]">{headline.title}</p>
                    <p
                      className={`text-[18px] leading-[27px] ${headline.reason ? "text-[rgb(232,27,22)]" : "text-graytext"}`}
                    >
                      {headline.subtitle}
                    </p>
                  </div>
                </div>
              </div>
              {showForm ? (
                <div className="flex items-center justify-start gap-2 self-stretch">
                  <VerifyStatusActions
                    phase={phase}
                    cta={headline.cta}
                    uploadedKinds={uploadedKinds}
                  />
                </div>
              ) : null}
              {showSheba ? (
                <div className="flex w-full flex-col items-start gap-4 self-stretch">
                  {phase === "ready" ? (
                    <a
                      href="/dashboard/offers/Account/new"
                      className="inline-flex min-h-[42px] items-center rounded-lg bg-[rgb(34,33,39)] px-4 text-[14px] font-bold text-white"
                    >
                      {VERIFY_KYC.listingCta}
                    </a>
                  ) : null}
                  <VerifyShebaForm
                    cta={headline.cta}
                    shebaMasked={shebaMasked}
                    holderName={holderName}
                  />
                </div>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-3">
              <div
                className="flex flex-col items-start justify-center gap-2 rounded-lg bg-white px-6 pb-4 pt-4"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-[18px] font-bold leading-[27px]">{next.title}</p>
                <ul className="list-disc ps-5 text-graytext">
                  {next.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div
                className="flex flex-col items-start justify-center gap-2 rounded-lg bg-white px-6 pb-4 pt-4"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-[18px] font-bold leading-[27px]">{why.title}</p>
                <p className="text-graytext">{why.body}</p>
              </div>
              <div
                className="flex flex-col items-start justify-center gap-2 rounded-lg bg-white px-6 pb-4 pt-4"
                style={{ boxShadow: cardShadow }}
              >
                <p className="text-[18px] font-bold leading-[27px]">{help.title}</p>
                <div className="flex items-start gap-4">
                  {help.links.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      {...(link.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="block text-[14px] leading-[19.6px] text-linkblue"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
