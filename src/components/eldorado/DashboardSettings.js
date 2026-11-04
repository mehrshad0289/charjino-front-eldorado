"use client";

import { useState } from "react";
import { DASHBOARD_USER, DASHBOARD_SETTINGS_PAGE } from "./data/dashboardData";

/* Session 18 — /dashboard/settings page content, verbatim from the user
   capture (settings-1920px-light-1.tsx, 1920-only). Five white shadow
   cards under the h1: Profile (disabled Email/Username inputs + blue
   uppercase "Edit", dark Change password), Profile picture (125px avatar,
   dark Upload image), Security (gray Set Up 2FA + Log out rows),
   Email notifications (1 master + 8 toggles, capture states: All OFF,
   Boosting OFF, rest ON) and Your description (empty "Type here..."
   textarea + dark Change description). Capture is 1920-only — below lg
   the rows stack (documented approximation, dashboard-wide convention). */

const CARD_SHADOW = "shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]";

function Toggle({ on, label, onClick }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onClick}
      className={`relative inline-flex h-5 w-12 shrink-0 items-center rounded-2xl transition-colors ${
        on ? "bg-[rgba(71,131,255,0.2)]" : "bg-[rgb(231,231,231)]"
      }`}
    >
      <span
        className={`absolute top-[-2px] h-6 w-6 rounded-full shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px] transition-transform ${
          on ? "translate-x-6 bg-[rgb(71,131,255)]" : "translate-x-0 bg-white"
        }`}
      />
    </button>
  );
}

function BodyParts({ parts }) {
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <strong key={i} className="font-bold">
            {p.bold}
          </strong>
        )
      )}
    </>
  );
}

export default function DashboardSettings() {
  const d = DASHBOARD_SETTINGS_PAGE;
  const [toggles, setToggles] = useState(
    () => Object.fromEntries(d.notifications.map((n) => [n.label, n.on]))
  );
  const flip = (label) =>
    setToggles((t) => ({ ...t, [label]: !t[label] }));

  const master = d.notifications.find((n) => n.master);
  const rows = d.notifications.filter((n) => !n.master);

  return (
    <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
      {/* Profile */}
      <section className="mt-8">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">Profile</h4>
        <div className={`mb-[10px] bg-white ${CARD_SHADOW}`}>
          <div className="border-b-[0.8px] border-cardborder p-6">
            <div className="flex w-full flex-wrap items-baseline gap-y-2 sm:flex-nowrap">
              <div className="min-w-[151px] text-[14px] font-bold sm:mr-6">Email:</div>
              <div className="w-full sm:w-xs">
                <div className="relative flex items-center">
                  <input
                    readOnly
                    value={d.email}
                    aria-label="Email"
                    className="block h-[42px] w-full rounded-lg border-[2px] border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-[rgb(198,198,204)]"
                  />
                  <p className="absolute right-3 text-[12px] font-bold uppercase tracking-[0.36px] text-[rgb(71,131,255)]">
                    Edit
                  </p>
                </div>
                <small className="mt-[6px] block text-[14px] leading-[normal] text-[rgb(106,102,123)]">
                  {d.emailNote}
                </small>
              </div>
            </div>
          </div>
          <div className="border-b-[0.8px] border-cardborder p-6">
            <div className="flex w-full flex-wrap items-baseline gap-y-2 sm:flex-nowrap">
              <div className="min-w-[151px] text-[14px] font-bold leading-[16.8px] sm:mr-6">Username:</div>
              <div className="w-full sm:w-xs">
                <div className="relative flex items-center">
                  <input
                    readOnly
                    value={d.username}
                    aria-label="Username"
                    className="block h-[42px] w-full rounded-lg border-[2px] border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-[rgb(198,198,204)]"
                  />
                  <p className="absolute right-3 text-[12px] font-bold uppercase tracking-[0.36px] text-[rgb(71,131,255)]">
                    Edit
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="mb-6 flex w-full flex-wrap items-baseline sm:flex-nowrap">
              <div className="w-[151px] text-[14px] font-bold leading-[16.8px] sm:mr-6">Password:</div>
              <div className="flex flex-col items-start justify-center">
                <div className="mb-2">
                  <button
                    type="button"
                    className="min-h-9 rounded-lg bg-[rgb(34,33,39)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-white"
                  >
                    {d.changePassword}
                  </button>
                </div>
                <small className="block text-[14px] leading-[21px] text-[rgb(106,102,123)]">
                  {d.passwordNote}
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile picture */}
      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">Profile picture</h4>
        <div className={`mb-[10px] w-full bg-white p-6 ${CARD_SHADOW}`}>
          <div className="flex flex-wrap items-center gap-[5px] gap-y-4 lg:gap-x-[30px]">
            <div className="relative flex h-[125px] w-[125px] min-w-[125px] items-center justify-center overflow-hidden rounded-[50%]">
              <img
                alt="Profile avatar"
                src={DASHBOARD_USER.avatar}
                className="block h-[125px] w-[125px] shrink-0 object-cover align-middle"
              />
            </div>
            <form className="w-full lg:w-[calc(100%-165px)]">
              <div className="inline max-w-full leading-[normal]">
                <div className="flex">
                  <div className="flex flex-col justify-center">
                    <div className="flex">
                      <div className="min-w-fit">
                        <button
                          type="button"
                          className="min-h-9 rounded-lg bg-[rgb(34,33,39)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-white"
                        >
                          Upload image
                        </button>
                      </div>
                    </div>
                    <div className="mt-[10px] text-[14px] text-[rgb(98,99,98)]">{d.pictureNote}</div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">Security</h4>
        <div className={`mb-[10px] bg-white ${CARD_SHADOW}`}>
          <div className="w-full border-b-[0.8px] border-cardborder p-6 leading-[16.8px]">
            <div className="flex w-full flex-wrap gap-y-4 lg:flex-nowrap">
              <div className="w-[150px] pt-0 pr-[5px] text-[14px] font-bold leading-[20px]">Payment Lock</div>
              <div className="flex w-full flex-col justify-center lg:w-full">
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                  <div className="lg:basis-[70%]">
                    <div className="inline">
                      <button
                        type="button"
                        aria-label={d.twoFa.label}
                        className="min-h-[42px] min-w-[70px] rounded-lg bg-[rgb(244,244,244)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-[rgb(20,20,26)]"
                      >
                        {d.twoFa.label}
                      </button>
                    </div>
                    <p className="mb-1 mt-[10px] max-w-[620px] text-[14px] leading-[21px] text-[rgb(106,102,123)]">
                      <BodyParts parts={d.twoFa.bodyParts} />
                    </p>
                  </div>
                  <div className="flex justify-end lg:basis-[30%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-6 leading-[16.8px]">
            <div className="flex w-full flex-wrap gap-y-4 lg:flex-nowrap">
              <div className="w-[150px] pt-0 pr-[5px] text-[14px] font-bold leading-[20px]">
                Log out from all sessions
              </div>
              <div className="flex w-full flex-col justify-center">
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                  <div className="lg:basis-[70%]">
                    <div className="inline">
                      <button
                        type="button"
                        aria-label={d.logout.label}
                        className="min-h-[42px] min-w-[70px] rounded-lg bg-[rgb(244,244,244)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-[rgb(20,20,26)]"
                      >
                        {d.logout.label}
                      </button>
                    </div>
                    <p className="mb-1 mt-[10px] max-w-[620px] text-[14px] leading-[21px] text-[rgb(106,102,123)]">
                      {d.logout.body}
                    </p>
                    <small className="mt-[10px] block text-[12px] leading-[16px] text-[rgb(98,99,98)]">
                      {d.logout.footnote}
                    </small>
                  </div>
                  <div className="flex justify-end lg:basis-[30%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email notifications */}
      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">Email notifications</h4>
        <div className={`mb-[10px] bg-white ${CARD_SHADOW}`}>
          <div className="border-b-[0.8px] border-cardborder p-6 leading-[normal]">
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
              <h5 className="font-bold">{master.label}</h5>
              <div className="inline">
                <div className="flex h-10 w-16 items-center justify-center">
                  <Toggle on={toggles[master.label]} label={master.label} onClick={() => flip(master.label)} />
                </div>
              </div>
            </div>
          </div>
          {rows.map((n) => (
            <div
              key={n.label}
              className="grid grid-cols-1 items-center gap-2 border-b-[0.8px] border-cardborder p-6 leading-[normal] last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-4"
            >
              <div className="mb-0 sm:mb-6">
                <h6 className="text-[14px] font-bold">{n.label}</h6>
                <small className="text-[14px] text-[rgb(106,102,123)]">{n.desc}</small>
              </div>
              <div className="inline">
                <div className="flex h-10 w-16 items-center justify-center">
                  <Toggle on={toggles[n.label]} label={n.label} onClick={() => flip(n.label)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Your description */}
      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">Your description</h4>
        <div className={`mb-[10px] w-full bg-white px-[30px] py-6 ${CARD_SHADOW}`}>
          <div className="max-w-[540px]">
            <form>
              <div className="mb-5">
                <textarea
                  rows={2}
                  placeholder={d.descriptionPlaceholder}
                  aria-label="Your description"
                  className="block h-[58px] w-full resize-none rounded-lg bg-[rgb(239,239,241)] p-[10px] text-[14px] leading-[normal] text-[rgb(98,99,98)] placeholder:text-[rgb(98,99,98)]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="max-w-max">
                  <button
                    type="button"
                    aria-label={d.changeDescription}
                    className="min-h-[42px] min-w-[70px] rounded-lg bg-[rgb(34,33,39)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-white"
                  >
                    {d.changeDescription}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
