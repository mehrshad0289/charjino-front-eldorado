"use server";

import { revalidatePath } from "next/cache";
import { ApiError, serverFetch } from "@/lib/server-fetcher";
import { clearAuthCookies, getAccessToken, setAuthTokens } from "@/lib/auth-cookies";
import { apiPaths } from "@/lib/api-paths";
import { isIranianMobile, normalizeIranianMobile } from "@/lib/phone";

function toActionMessage(error) {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "درخواست انجام نشد";
}

function bearerHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

export async function requestOtp(rawPhone) {
  try {
    const phoneNumber = normalizeIranianMobile(rawPhone);
    if (!isIranianMobile(phoneNumber)) {
      return { ok: false, message: "شماره همراه معتبر نیست." };
    }
    const data = await serverFetch(apiPaths.authRequestOtp, {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
    return { ok: true, message: data.message };
  } catch (error) {
    return { ok: false, message: toActionMessage(error) };
  }
}

export async function verifyOtp(rawPhone, code) {
  try {
    const phoneNumber = normalizeIranianMobile(rawPhone);
    if (!isIranianMobile(phoneNumber)) {
      return { ok: false, message: "شماره همراه معتبر نیست." };
    }
    const data = await serverFetch(apiPaths.authVerifyOtp, {
      method: "POST",
      body: JSON.stringify({ phoneNumber, code }),
    });
    if (!data.access_token || !data.refresh_token) {
      return { ok: false, message: "درخواست انجام نشد" };
    }
    await setAuthTokens(data.access_token, data.refresh_token);
    return { ok: true, user: data.user };
  } catch (error) {
    return { ok: false, message: toActionMessage(error) };
  }
}

export async function logout() {
  const accessToken = await getAccessToken();
  try {
    await serverFetch(apiPaths.authLogout, {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
  } catch {
    // Cookieهای محلی حتی اگر بک‌اند خطا بدهد باید پاک شوند.
  } finally {
    await clearAuthCookies();
  }
}

export async function getSessionUser() {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  try {
    const user = await serverFetch(apiPaths.authMe, {
      headers: bearerHeaders(accessToken),
    });
    if (user?.role === "admin") return null;
    return user;
  } catch {
    return null;
  }
}

function revalidateAccountPaths() {
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard", "layout");
}

export async function updateProfile(payload) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const user = await serverFetch(apiPaths.authProfile, {
      method: "PATCH",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify(payload),
    });
    revalidateAccountPaths();
    return { ok: true, user };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return { ok: false, unauthorized: true, message: error.message };
    }
    return { ok: false, message: toActionMessage(error) };
  }
}

export async function uploadAvatar(formData) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  const body = new FormData();
  const file = formData.get("file");
  if (file) body.set("file", file);
  try {
    const user = await serverFetch(apiPaths.authProfileAvatar, {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body,
    });
    revalidateAccountPaths();
    return { ok: true, user };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return { ok: false, unauthorized: true, message: error.message };
    }
    return { ok: false, message: toActionMessage(error) };
  }
}
