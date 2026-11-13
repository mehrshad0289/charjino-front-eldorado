"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout, updateProfile, uploadAvatar } from "@/actions/auth.actions";
import { accountAvatarUrl, accountInitials } from "@/lib/account-display";
import { toFaDigits } from "@/lib/fa-digits";
import { FA } from "./data/faCopy";
import { DASHBOARD_SETTINGS_PAGE } from "./data/dashboardData";

const CARD_SHADOW = "shadow-[rgba(9,9,11,0.05)_0px_2px_4px_0px,_rgba(9,9,11,0.02)_0px_12px_8px_0px]";
const LOCKED_INPUT =
  "block h-[42px] w-full rounded-lg border-[2px] border-[rgb(239,239,241)] bg-[rgb(239,239,241)] px-3 text-[14px] text-[rgb(198,198,204)]";
const LIVE_INPUT =
  "block h-[42px] w-full rounded-lg border-[2px] border-ink bg-white px-3 pe-16 text-[14px] text-ink";
const DARK_BTN =
  "min-h-9 rounded-lg bg-[rgb(34,33,39)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-white disabled:opacity-60";
const GRAY_BTN =
  "min-h-[42px] min-w-[70px] rounded-lg bg-[rgb(244,244,244)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-[rgb(20,20,26)] disabled:opacity-60";

function Toggle({ on, label, onClick, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      dir="ltr"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`relative inline-flex h-5 w-12 shrink-0 items-center rounded-2xl transition-colors disabled:opacity-60 ${
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

function formatPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits ? toFaDigits(digits) : "—";
}

function kycLabel(level, copy) {
  const key = String(Math.max(0, Number(level) || 0));
  return copy.kycLevels[key] || copy.kycLevels[0];
}

function prefsFromUser(user) {
  const saved = user?.notificationPrefs && typeof user.notificationPrefs === "object" ? user.notificationPrefs : {};
  return Object.fromEntries(
    DASHBOARD_SETTINGS_PAGE.notifications.map((row) => [row.key, saved[row.key] ?? row.on]),
  );
}

export default function DashboardSettings({ user, seller = null }) {
  const d = DASHBOARD_SETTINGS_PAGE;
  const router = useRouter();
  const fileRef = useRef(null);
  const prefsTimer = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [editingName, setEditingName] = useState(false);
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState("");

  const [bio, setBio] = useState(user?.bio || "");
  const [bioBusy, setBioBusy] = useState(false);
  const [bioMsg, setBioMsg] = useState("");

  const [toggles, setToggles] = useState(() => prefsFromUser(user));
  const [prefsBusy, setPrefsBusy] = useState(false);
  const [prefsMsg, setPrefsMsg] = useState("");

  const [avatarSrc, setAvatarSrc] = useState(accountAvatarUrl(user));
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");

  const [logoutBusy, setLogoutBusy] = useState(false);
  const [logoutMsg, setLogoutMsg] = useState("");

  useEffect(() => {
    if (!editingName) setName(user?.name || "");
    const nextAvatar = accountAvatarUrl(user);
    if (nextAvatar) setAvatarSrc(nextAvatar);
  }, [editingName, user?.name, user?.avatarUrl]);

  useEffect(() => () => clearTimeout(prefsTimer.current), []);

  const profile = seller?.profile || null;
  const kycLevel = Number(profile?.kyc_level ?? 0);
  const shebaMasked = profile?.sheba_masked ? String(profile.sheba_masked) : "";
  const master = d.notifications.find((row) => row.master);
  const rows = d.notifications.filter((row) => !row.master);

  function goLogin() {
    router.push("/login?next=/dashboard/settings");
  }

  async function saveName(event) {
    event.preventDefault();
    setNameBusy(true);
    setNameMsg("");
    const result = await updateProfile({ name: name.trim() });
    setNameBusy(false);
    if (result.unauthorized) {
      goLogin();
      return;
    }
    if (!result.ok) {
      setNameMsg(result.message || "ذخیره نشد.");
      return;
    }
    setEditingName(false);
    setNameMsg("نام نمایشی ذخیره شد.");
    router.refresh();
  }

  async function saveBio(event) {
    event.preventDefault();
    setBioBusy(true);
    setBioMsg("");
    const result = await updateProfile({ bio: bio.trim() });
    setBioBusy(false);
    if (result.unauthorized) {
      goLogin();
      return;
    }
    if (!result.ok) {
      setBioMsg(result.message || "ذخیره نشد.");
      return;
    }
    setBioMsg("توضیح ذخیره شد.");
    router.refresh();
  }

  function flipPref(key) {
    const next = { ...toggles, [key]: !toggles[key] };
    setToggles(next);
    setPrefsMsg("");
    clearTimeout(prefsTimer.current);
    prefsTimer.current = setTimeout(async () => {
      setPrefsBusy(true);
      const result = await updateProfile({ notificationPrefs: next });
      setPrefsBusy(false);
      if (result.unauthorized) {
        goLogin();
        return;
      }
      if (!result.ok) {
        setPrefsMsg(result.message || "ذخیره نشد.");
        return;
      }
      setPrefsMsg("اعلان‌ها ذخیره شد.");
    }, 400);
  }

  async function onAvatarFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setAvatarBusy(true);
    setAvatarMsg("");
    const body = new FormData();
    body.set("file", file);
    const result = await uploadAvatar(body);
    setAvatarBusy(false);
    if (result.unauthorized) {
      goLogin();
      return;
    }
    if (!result.ok) {
      setAvatarMsg(result.message || "بارگذاری نشد.");
      return;
    }
    const nextUrl = accountAvatarUrl(result.user);
    setAvatarSrc(nextUrl ? `${nextUrl}${nextUrl.includes("?") ? "&" : "?"}v=${Date.now()}` : "");
    setAvatarMsg("تصویر پروفایل ذخیره شد.");
    router.refresh();
  }

  async function logoutEverywhere() {
    setLogoutBusy(true);
    setLogoutMsg("");
    await logout();
    setLogoutBusy(false);
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mt-1 max-w-[1048px] px-6 pb-[50px]">
      <section className="mt-8">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">{d.profileTitle}</h4>
        <div className={`mb-[10px] bg-white ${CARD_SHADOW}`}>
          <div className="border-b-[0.8px] border-cardborder p-6">
            <div className="flex w-full flex-wrap items-baseline gap-y-2 sm:flex-nowrap">
              <div className="min-w-[151px] text-[14px] font-bold sm:me-6">{d.phoneLabel}</div>
              <div className="w-full sm:w-xs">
                <input
                  readOnly
                  dir="ltr"
                  value={formatPhone(user?.phoneNumber)}
                  aria-label={d.phoneLabel}
                  className={LOCKED_INPUT}
                />
                <small className="mt-[6px] block text-[14px] leading-[normal] text-[rgb(106,102,123)]">
                  {d.phoneNote}
                </small>
              </div>
            </div>
          </div>

          <div className="border-b-[0.8px] border-cardborder p-6">
            <form onSubmit={saveName} className="flex w-full flex-wrap items-baseline gap-y-2 sm:flex-nowrap">
              <div className="min-w-[151px] text-[14px] font-bold leading-[16.8px] sm:me-6">{d.nameLabel}</div>
              <div className="w-full sm:w-xs">
                <div className="relative flex items-center">
                  <input
                    value={name}
                    readOnly={!editingName}
                    maxLength={40}
                    onChange={(event) => setName(event.target.value)}
                    aria-label={d.nameLabel}
                    placeholder={d.namePlaceholder}
                    className={editingName ? LIVE_INPUT : `${LOCKED_INPUT} pe-16`}
                  />
                  {editingName ? (
                    <button
                      type="submit"
                      disabled={nameBusy || name.trim().length < 2}
                      className="absolute end-3 text-[12px] font-bold uppercase tracking-[0.36px] text-[rgb(71,131,255)] disabled:opacity-50"
                    >
                      {nameBusy ? d.saving : d.save}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingName(true);
                        setNameMsg("");
                      }}
                      className="absolute end-3 text-[12px] font-bold uppercase tracking-[0.36px] text-[rgb(71,131,255)]"
                    >
                      {d.edit}
                    </button>
                  )}
                </div>
                {nameMsg ? (
                  <small className="mt-[6px] block text-[14px] text-[rgb(106,102,123)]">{nameMsg}</small>
                ) : null}
              </div>
            </form>
          </div>

          <div className="p-6">
            <div className="mb-0 flex w-full flex-wrap items-baseline sm:flex-nowrap">
              <div className="w-[151px] text-[14px] font-bold leading-[16.8px] sm:me-6">{d.loginLabel}</div>
              <div className="flex flex-col items-start justify-center">
                <p className="mb-2 min-h-9 rounded-lg bg-[rgb(244,244,244)] px-4 py-[10px] text-[14px] font-bold leading-[21px] text-ink">
                  {d.loginTitle}
                </p>
                <small className="block text-[14px] leading-[21px] text-[rgb(106,102,123)]">{d.loginNote}</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">{d.pictureTitle}</h4>
        <div className={`mb-[10px] w-full bg-white p-6 ${CARD_SHADOW}`}>
          <div className="flex flex-wrap items-center gap-[5px] gap-y-4 lg:gap-x-[30px]">
            <div className="relative flex h-[125px] w-[125px] min-w-[125px] items-center justify-center overflow-hidden rounded-[50%] bg-badgebg text-[42px] font-bold">
              {avatarSrc ? (
                <img
                  alt={FA.profileAvatar}
                  src={avatarSrc}
                  className="block h-[125px] w-[125px] shrink-0 object-cover align-middle"
                />
              ) : (
                <span aria-hidden="true">{accountInitials(user)}</span>
              )}
            </div>
            <div className="w-full lg:w-[calc(100%-165px)]">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={onAvatarFile}
              />
              <button
                type="button"
                disabled={avatarBusy}
                onClick={() => fileRef.current?.click()}
                className={DARK_BTN}
              >
                {avatarBusy ? d.saving : d.uploadImage}
              </button>
              <div className="mt-[10px] text-[14px] text-[rgb(98,99,98)]">{d.pictureNote}</div>
              {avatarMsg ? <p className="mt-2 text-[14px] text-[rgb(106,102,123)]">{avatarMsg}</p> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">{d.securityTitle}</h4>
        <div className={`mb-[10px] bg-white ${CARD_SHADOW}`}>
          <div className="w-full border-b-[0.8px] border-cardborder p-6 leading-[16.8px]">
            <div className="flex w-full flex-wrap gap-y-4 lg:flex-nowrap">
              <div className="w-[150px] pt-0 pe-[5px] text-[14px] font-bold leading-[20px]">{d.kycLabel}</div>
              <div className="flex w-full flex-col justify-center">
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                  <div className="lg:basis-[70%]">
                    <Link href="/verify/status" className={`${GRAY_BTN} inline-flex items-center justify-center`}>
                      {d.kycCta}
                    </Link>
                    <p className="mb-1 mt-[10px] max-w-[620px] text-[14px] leading-[21px] text-[rgb(106,102,123)]">
                      {d.kycBody}
                    </p>
                    <small className="mt-[10px] block text-[12px] leading-[16px] text-[rgb(98,99,98)]">
                      {kycLabel(kycLevel, d)}
                      {shebaMasked ? ` · ${d.shebaLabel} ${shebaMasked}` : ` · ${d.shebaEmpty}`}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full p-6 leading-[16.8px]">
            <div className="flex w-full flex-wrap gap-y-4 lg:flex-nowrap">
              <div className="w-[150px] pt-0 pe-[5px] text-[14px] font-bold leading-[20px]">{d.logoutSessions}</div>
              <div className="flex w-full flex-col justify-center">
                <div className="flex w-full flex-col gap-4 lg:flex-row">
                  <div className="lg:basis-[70%]">
                    <button
                      type="button"
                      aria-label={d.logoutCta}
                      disabled={logoutBusy}
                      onClick={logoutEverywhere}
                      className={GRAY_BTN}
                    >
                      {logoutBusy ? d.saving : d.logoutCta}
                    </button>
                    <p className="mb-1 mt-[10px] max-w-[620px] text-[14px] leading-[21px] text-[rgb(106,102,123)]">
                      {d.logoutBody}
                    </p>
                    {logoutMsg ? (
                      <small className="mt-[10px] block text-[12px] leading-[16px] text-[rgb(98,99,98)]">
                        {logoutMsg}
                      </small>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">{d.notificationsTitle}</h4>
        <div className={`mb-[10px] bg-white ${CARD_SHADOW}`}>
          <div className="border-b-[0.8px] border-cardborder p-6 leading-[normal]">
            <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <h5 className="font-bold">{master.label}</h5>
                <small className="text-[14px] text-[rgb(106,102,123)]">{d.notificationsHint}</small>
              </div>
              <div className="flex h-10 w-16 items-center justify-center">
                <Toggle
                  on={toggles[master.key]}
                  label={master.label}
                  disabled={prefsBusy}
                  onClick={() => flipPref(master.key)}
                />
              </div>
            </div>
          </div>
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-1 items-center gap-2 border-b-[0.8px] border-cardborder p-6 leading-[normal] last:border-b-0 sm:grid-cols-[1fr_auto] sm:gap-4"
            >
              <div className="mb-0 sm:mb-6">
                <h6 className="text-[14px] font-bold">{row.label}</h6>
                <small className="text-[14px] text-[rgb(106,102,123)]">{row.desc}</small>
              </div>
              <div className="flex h-10 w-16 items-center justify-center">
                <Toggle
                  on={Boolean(toggles[row.key])}
                  label={row.label}
                  disabled={prefsBusy}
                  onClick={() => flipPref(row.key)}
                />
              </div>
            </div>
          ))}
        </div>
        {prefsMsg ? <p className="mb-2 text-[14px] text-[rgb(106,102,123)]">{prefsMsg}</p> : null}
      </section>

      <section className="mt-[30px]">
        <h4 className="mb-3 text-[24px] font-bold leading-[normal]">{d.descriptionTitle}</h4>
        <div className={`mb-[10px] w-full bg-white px-[30px] py-6 ${CARD_SHADOW}`}>
          <form onSubmit={saveBio} className="max-w-[540px]">
            <div className="mb-5">
              <textarea
                rows={3}
                value={bio}
                maxLength={400}
                onChange={(event) => setBio(event.target.value)}
                placeholder={d.descriptionPlaceholder}
                aria-label={d.descriptionTitle}
                className="block min-h-[58px] w-full resize-y rounded-lg bg-[rgb(239,239,241)] p-[10px] text-[14px] leading-[normal] text-ink placeholder:text-[rgb(98,99,98)]"
              />
            </div>
            <button type="submit" disabled={bioBusy} className={`${DARK_BTN} min-h-[42px] min-w-[70px]`}>
              {bioBusy ? d.saving : d.changeDescription}
            </button>
            {bioMsg ? <p className="mt-3 text-[14px] text-[rgb(106,102,123)]">{bioMsg}</p> : null}
          </form>
        </div>
      </section>
    </div>
  );
}
