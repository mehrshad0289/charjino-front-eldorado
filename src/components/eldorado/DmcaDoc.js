import { DASHBOARD_USER } from "./data/dashboardData";

/* DMCA page content from the user-pushed capture
   `ui ux/DMCA/…dmca…make` (session 18, decoded snapshots/
   dmca-1920px-light-1.tsx, 1920-only): full-width 128px preview-photo
   banner, max-w-3xl column (mt-30 mb-80) with the 48px title pulled up
   over the banner (relative top-[-67px] mt-[-30px], w-[870px] per
   capture), an 18px lede with a blue mailto link, two gray role=status
   info boxes (bg rgb(239,239,241), border rgb(231,231,231), rounded-lg,
   24px icon + bold lead + ul pl-5) and the 18px "Where possible" section.
   The capture's icomoon info glyphs decode empty — inline SVG circle-i
   replacements (documented assumption, project pattern). */

const BANNER =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fb7ca8a720db0d893e8464e5b0ef627431a7346b4.png?generation=1793803303629559&alt=media";

const INFO_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="7.8" r="1.1" fill="currentColor" />
  </svg>
);

function InfoBox({ lead, items }) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-lg border-[0.8px] border-[rgb(231,231,231)] bg-[rgb(239,239,241)] px-4 pb-3 pt-3 text-ink"
    >
      <div className="shrink-0 text-ink">{INFO_ICON}</div>
      <div className="flex flex-col gap-2">
        <span className="block font-bold">{lead}</span>
        <div className="text-[14px] leading-[19.6px]">
          <ul className="list-disc pl-5">
            {items.map((li) => (
              <li key={li.slice(0, 32)}>{li}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function DmcaDoc() {
  return (
    <div>
      <div className="mb-[50px] h-32 overflow-hidden">
        <img
          alt="Preview photo"
          src={BANNER}
          className="block h-32 w-full object-cover align-middle"
        />
      </div>
      <div className="mx-auto mb-[80px] mt-[30px] w-full max-w-3xl px-6">
        <h2 className="relative top-[-67px] -mt-[30px] text-[48px] font-bold leading-[normal]">
          DMCA Copyright Notice
        </h2>
        <div className="w-full">
          <p className="mb-[30px] text-[18px] leading-[21px]">
            Have your copyrighted works been posted on Eldorado without your
            permission? Please email{" "}
            <a href="mailto:ip-dmca@eldorado.gg" className="text-[rgb(45,94,173)]">
              ip- dmca@eldorado.gg
            </a>{" "}
            with the subject line &quot;Copyright Claim&quot; and we will
            investigate.
          </p>
        </div>
        <InfoBox
          lead="In your email, please include the following information:"
          items={[
            "URL of infringing material on Eldorado.gg",
            "Description of the infringement",
            "Documentation proving either a) you are the copyright holder OR b) that you are acting as an authorized agent of the copyright holder",
            "Your full legal name",
            "Your company name",
            "Your address",
          ]}
        />
        <div className="mt-[30px] w-full">
          <p className="mb-[30px] text-[18px] leading-[21px]">
            Where possible, please use your official company email. For
            example, we would submit the request from an @eldorado.gg email
            address.
          </p>
        </div>
        <InfoBox
          lead="By submitting a DMCA claim, you confirm that:"
          items={[
            "You have good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.",
            "UNDER PENALTY OF PERJURY, you declare that the information in your request is accurate and that you are authorized to act on behalf of the copyright owner.",
            "You understand that under 17 U.S.C. 512(f), you may be liable for any damages, including costs and attorneys' fees, if you knowingly materially misrepresent that reported material or activity is infringing.",
          ]}
        />
      </div>
    </div>
  );
}
