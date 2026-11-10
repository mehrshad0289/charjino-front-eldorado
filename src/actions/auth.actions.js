"use server";

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
    return await serverFetch(apiPaths.authMe, {
      headers: bearerHeaders(accessToken),
    });
  } catch {
    return null;
  }
}
