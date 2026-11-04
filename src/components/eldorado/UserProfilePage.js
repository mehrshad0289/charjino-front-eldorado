import HeaderBar from "./HeaderBar";
import CategoryNav from "./CategoryNav";
import Footer from "./Footer";
import ChatBubble from "./ChatBubble";
import { DASHBOARD_USER } from "./data/dashboardData";
import {
  PROFILE_BANNER,
  PROFILE_LOYALTY_BADGE,
  PROFILE_USER,
  PROFILE_SHOP_CHIPS,
  PROFILE_SHOP_GAME_FILTER,
  PROFILE_SHOP_EMPTY,
  PROFILE_REVIEW_FILTERS,
  PROFILE_REVIEWS_EMPTY,
  PROFILE_ABOUT,
  PROFILE_TABS,
} from "./data/profileData";

/* Session 18 — public user profile pages (/users/NewFloat-0una[/tab]),
   verbatim from the user-pushed View Profile captures (About + Shop;
   Reviews live-first, see profileData.js). Frame: logged-in HeaderBar +
   CategoryNav, 120px cover banner with a fade-to-page gradient, white
   profile card (-mt-80 overlap: 100px avatar ring w/ 84px photo + loyalty
   badge, 24px bold name, teal Online dot, gray flag button top-right,
   Shop/Reviews/About tabs with a blue active underline), then the per-tab
   content. Capture is 1920-only — below lg the rows stack (documented
   approximation, project-wide convention). */

const CARD_SHADOW = "shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]";

const stroke = { stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

/* Chip icons (empty icomoon glyphs in the capture — documented assumptions). */
const CHIP_ICONS = {
  coin: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M12 8.5v7M9.8 10.2h3.4a1.6 1.6 0 0 1 0 3.2H9.8" {...stroke} />
    </svg>
  ),
  account: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.5" {...stroke} />
      <path d="M5 19.5c1.2-3.2 3.8-4.8 7-4.8s5.8 1.6 7 4.8" {...stroke} />
    </svg>
  ),
  item: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 8l8-4 8 4v8l-8 4-8-4V8Z" {...stroke} />
      <path d="M4 8l8 4 8-4M12 12v8" {...stroke} />
    </svg>
  ),
  topup: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path d="M12 15.5v-7M8.8 11.2 12 8l3.2 3.2" {...stroke} />
    </svg>
  ),
  giftcard: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="6.5" width="17" height="12" rx="2" {...stroke} />
      <path d="M3.5 10.5h17M12 10.5V18" {...stroke} />
    </svg>
  ),
  thumbup: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 10.5v9H4.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1H7Zm0 0 4-6.5a2 2 0 0 1 2 2v3.5h5.2a1.5 1.5 0 0 1 1.5 1.7l-1 6.5a1.5 1.5 0 0 1-1.5 1.3H7" {...stroke} />
    </svg>
  ),
  thumbdown: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M17 13.5v-9h2.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H17Zm0 0-4 6.5a2 2 0 0 1-2-2v-3.5H5.8a1.5 1.5 0 0 1-1.5-1.7l1-6.5A1.5 1.5 0 0 1 6.8 5H17" {...stroke} />
    </svg>
  ),
};

const FLAG = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 21V4m0 0h11.5l-2.5 4 2.5 4H6" {...stroke} />
  </svg>
);

const CHEVRON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Chip({ icon, label, count = null, active = false }) {
  return (
    <div className={`flex min-w-[105px] flex-col items-center gap-2 text-[12px] leading-[16.8px] ${active ? "" : "text-[rgb(106,102,123)]"}`}>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full ${
          active ? "bg-[rgb(255,201,80)] text-ink" : "bg-white text-[rgb(106,102,123)]"
        }`}
      >
        <div className="h-8 w-8 overflow-hidden">{CHIP_ICONS[icon] ?? CHIP_ICONS.item}</div>
      </div>
      <div className="flex gap-1 text-center text-[14px] font-normal leading-[19.6px]">
        <span className="block text-center">{label}</span>
        {count !== null && <span className="block text-center">({count})</span>}
      </div>
    </div>
  );
}

function EmptyState({ image, title, text }) {
  return (
    <div className="flex justify-center px-[30px] pt-10">
      <div className="flex max-w-[600px] flex-col items-center gap-3">
        <div className="h-[100px] shrink-0 overflow-hidden">
          <img alt="No results found" src={image} className="block h-[100px] w-[100px] object-cover align-middle" />
        </div>
        <div className="text-center text-[24px] font-bold leading-[36px]">{title}</div>
        {text ? <div className="pt-1 text-center text-[rgb(106,102,123)]">{text}</div> : null}
      </div>
    </div>
  );
}

const EMPTY_IMAGE =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F91671a13bded2708951c70c98c7f9d8f11e1ed60.svg?generation=1793785993043728&alt=media";

function ShopTab() {
  return (
    <>
      <h1 className="mb-6 mt-8 border-b-[0.8px] border-cardborder pb-2 text-[24px] font-bold leading-[28.8px]">Shop</h1>
      <div className="mb-5 flex flex-wrap gap-y-6 border-b-[0.8px] border-cardborder pb-6">
        {PROFILE_SHOP_CHIPS.map((c) => (
          <Chip key={c.label} {...c} />
        ))}
      </div>
      <div className="relative">
        <div className="flex items-end justify-between">
          <form className="mb-[10px] mr-[15px] flex flex-wrap items-center gap-[10px]">
            <div className="w-[200px]">
              <div
                role="combobox"
                aria-haspopup="listbox"
                aria-label="Single-select searchable dropdown"
                className="flex min-h-[42px] items-center justify-between overflow-hidden rounded-lg bg-[rgb(239,239,241)] px-[14px] py-2 leading-[19.6px] shadow-[rgba(0,0,0,0)_0px_0px_0px_1px_inset]"
              >
                <span className="block grow basis-0 truncate">{PROFILE_SHOP_GAME_FILTER}</span>
                <span className="ml-2 block shrink-0 text-[rgb(98,99,98)]">{CHEVRON}</span>
              </div>
            </div>
          </form>
        </div>
        <EmptyState image={EMPTY_IMAGE} title={PROFILE_SHOP_EMPTY.title} text={PROFILE_SHOP_EMPTY.text} />
      </div>
    </>
  );
}

function ReviewsTab() {
  return (
    <>
      <h1 className="mb-6 mt-8 border-b-[0.8px] border-cardborder pb-2 text-[24px] font-bold leading-[28.8px]">Reviews</h1>
      <div className="mb-5 flex flex-wrap gap-[10px] border-b-[0.8px] border-cardborder pb-6">
        {PROFILE_REVIEW_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            className={`flex min-h-[38px] items-center gap-2 rounded-lg px-5 text-[14px] font-bold ${
              f.active
                ? "bg-[rgb(34,33,39)] text-white"
                : "border border-cardborder bg-white text-ink"
            }`}
          >
            {f.label}
            {f.icon ? <span className="text-current">{CHIP_ICONS[f.icon]}</span> : null}
          </button>
        ))}
      </div>
      <EmptyState image={EMPTY_IMAGE} title={PROFILE_REVIEWS_EMPTY.title} text="" />
    </>
  );
}

function AboutTab() {
  return (
    <>
      <h1 className="mb-6 mt-8 border-b-[0.8px] border-cardborder pb-2 text-[24px] font-bold leading-[28.8px]">{PROFILE_ABOUT.title}</h1>
      <div className={`min-h-[153px] max-w-[528px] rounded-sm bg-white ${CARD_SHADOW}`}>
        <div className="px-6 pb-6 pt-4">
          <div className="mb-[10px] text-[14px] font-bold uppercase leading-[19.6px] tracking-[0.42px]">
            {PROFILE_ABOUT.descriptionLabel}
          </div>
          <div className="text-[14px] leading-[17px] text-[rgb(106,102,123)]">{PROFILE_ABOUT.description}</div>
        </div>
        <div className="border-t-[0.8px] border-[rgb(244,244,244)] p-6 text-[14px] leading-[17px] text-[rgb(106,102,123)]">
          <span>Registered:</span>&nbsp;{PROFILE_USER.registered}
        </div>
      </div>
    </>
  );
}

export default function UserProfilePage({ username, tab }) {
  const activeTab = tab ?? "shop";
  /* Tab hrefs verbatim from the capture: /users/X/{shop,reviews,about}.
     The bare /users/X renders the Shop tab (live defaults to shop too). */
  const href = (t) => `/users/${username}/${t}`;

  return (
    <div className="min-h-screen bg-page text-ink">
      <HeaderBar loggedIn user={DASHBOARD_USER} />
      <CategoryNav />
      <main className="relative z-[1] isolate grow">
        <div className="relative isolate h-[120px]">
          <img
            alt="User page banner"
            src={PROFILE_BANNER}
            className="pointer-events-none absolute left-0 top-0 block size-full max-w-full object-cover object-top align-middle"
          />
          <div
            className="absolute size-full z-[1]"
            style={{ backgroundImage: "linear-gradient(rgba(246, 246, 246, 0) 0%, rgb(246, 246, 246) 100%)" }}
          />
        </div>
        <section className="pb-[50px]">
          <div className="relative mx-auto mt-[-80px] w-[1080px] max-w-full px-6">
            <div className={`relative mb-[32px] w-full rounded-sm bg-white ${CARD_SHADOW}`}>
              <div className="px-6 pb-4 pt-[6px]">
                <div className="flex items-center gap-[10px] pr-12 lg:pr-0">
                  <div className="relative flex h-[100px] w-[100px] items-center justify-center">
                    <div className="absolute bottom-[5px] right-[5px] z-[3] h-6 overflow-hidden">
                      <img
                        alt="Loyalty badge"
                        src={PROFILE_LOYALTY_BADGE}
                        className="block h-6 w-[25px] object-cover align-middle"
                      />
                    </div>
                    <div className="absolute left-1/2 top-1/2 z-[2] h-[84px] w-[84px] -translate-x-1/2 -translate-y-1/2">
                      <div className="relative overflow-hidden rounded-[50%]">
                        <img
                          alt="Profile avatar"
                          src={DASHBOARD_USER.avatar}
                          className="block h-[84px] w-[84px] object-cover align-middle"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center gap-[7px]">
                    <div className="flex items-center text-[24px] font-bold leading-[28.8px]">{PROFILE_USER.name}</div>
                    <div className="flex items-center gap-1">
                      <span className="block h-[10px] w-[10px] rounded-[50%] border-[0.8px] border-[rgb(0,228,201)] bg-[rgb(0,228,201)]" />
                      <span className="block text-[14px] leading-[17px]">
                        {PROFILE_USER.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute right-4 top-3 rounded-sm bg-[rgb(246,246,246)] p-1 text-[rgb(106,102,123)]">
                {FLAG}
              </div>
              <div className="flex border-t-[0.8px] border-cardborder">
                {PROFILE_TABS.map((t) => {
                  const isActive = activeTab === t.tab;
                  return (
                    <a
                      key={t.tab}
                      href={href(t.tab)}
                      className={`block border-b-2 px-[19px] pb-3 pt-4 leading-[19px] ${
                        isActive
                          ? "border-b-[rgb(71,131,255)] text-ink"
                          : "border-b-white text-[rgb(106,102,123)]"
                      }`}
                    >
                      {t.label}
                    </a>
                  );
                })}
              </div>
            </div>
            {activeTab === "shop" && <ShopTab />}
            {activeTab === "reviews" && <ReviewsTab />}
            {activeTab === "about" && <AboutTab />}
          </div>
        </section>
      </main>
      <Footer />
      <ChatBubble />
    </div>
  );
}
