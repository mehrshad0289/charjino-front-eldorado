import { FA } from "@/components/eldorado/data/faCopy";
import { toFaDigits } from "@/lib/fa-digits";

export function accountDisplayName(user) {
  const name = typeof user?.name === "string" ? user.name.trim() : "";
  if (name) return name;
  const phone = typeof user?.phoneNumber === "string" ? user.phoneNumber.replace(/\D/g, "") : "";
  if (phone.length >= 10) {
    return toFaDigits(`${phone.slice(0, 4)}***${phone.slice(-2)}`);
  }
  return FA.dashboard;
}

export function accountInitials(user) {
  const name = typeof user?.name === "string" ? user.name.trim() : "";
  if (name) return name.slice(0, 1);
  const phone = typeof user?.phoneNumber === "string" ? user.phoneNumber.replace(/\D/g, "") : "";
  if (phone.length >= 2) return toFaDigits(phone.slice(-2));
  return "ک";
}

export function accountRegisteredLabel(user) {
  const raw = user?.createdAt || user?.created_at;
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  const formatted = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).format(date);
  return `${FA.registered}: ${formatted}`;
}

export const NO_SET_PROFILE_SRC = "/icons/no-set-profile.svg";

export function accountAvatarUrl(user) {
  return user?.avatarUrl || user?.avatar || "";
}

export function accountAvatarSrc(user) {
  return accountAvatarUrl(user) || NO_SET_PROFILE_SRC;
}

export function publicProfileSlug(user) {
  const slug = typeof user?.profileSlug === "string" ? user.profileSlug.trim() : "";
  if (slug) return slug;
  const id = typeof user?.id === "string" ? user.id.trim() : "";
  return id;
}

export function publicProfileHref(user, tab = "") {
  const slug = publicProfileSlug(user);
  if (!slug) return "/dashboard/settings";
  const base = `/users/${encodeURIComponent(slug)}`;
  if (!tab || tab === "shop") return base;
  return `${base}/${tab}`;
}

export function isDashboardNavActive(active, item) {
  if (!active) return false;
  return active === item.id || active === item.label;
}
