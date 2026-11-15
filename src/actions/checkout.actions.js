"use server";

import { revalidatePath } from "next/cache";
import { ApiError, serverFetch } from "@/lib/server-fetcher";
import { getAccessToken } from "@/lib/auth-cookies";
import { apiPaths } from "@/lib/api-paths";

function toActionMessage(error) {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "درخواست انجام نشد";
}

function bearerHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function fromAuthError(error, message) {
  if (error instanceof ApiError && error.statusCode === 401) {
    return { ok: false, unauthorized: true, message };
  }
  return { ok: false, message: toActionMessage(error), errorCode: error instanceof ApiError ? error.errorCode : undefined };
}

function revalidateCatalogOrder(number) {
  revalidatePath("/orders");
  revalidatePath("/dashboard/orders/purchased");
  if (number) {
    revalidatePath(`/orders/${number}`);
    revalidatePath(`/dashboard/orders/purchased/${number}`);
  }
}

export async function createCheckoutOrder(skuId, requirements, idempotencyKey, quantity = 1, extra = {}) {
  const id = Number(skuId);
  if (!Number.isInteger(id) || id < 1) {
    return { ok: false, message: "بسته انتخاب نشده است" };
  }
  const key = String(idempotencyKey || "").trim().slice(0, 80);
  if (!key) return { ok: false, message: "کلید سفارش نامعتبر است" };
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای ثبت سفارش وارد شوید" };
  const qty = Math.max(1, Math.min(100, Math.trunc(Number(quantity) || 1)));
  try {
    const data = await serverFetch(apiPaths.orders, {
      method: "POST",
      headers: { ...bearerHeaders(accessToken), "Idempotency-Key": key },
      body: JSON.stringify({
        skuId: id,
        quantity: qty,
        requirements: requirements && typeof requirements === "object" ? requirements : {},
        ...(extra.couponCode ? { couponCode: String(extra.couponCode).trim() } : {}),
        ...(extra.amount ? { amount: extra.amount } : {}),
        ...(extra.currency ? { currency: extra.currency } : {}),
      }),
    });
    revalidateCatalogOrder(data?.number);
    return { ok: true, data };
  } catch (error) {
    return fromAuthError(error, "برای ثبت سفارش وارد شوید");
  }
}

export async function startOrderPayment(number, returnOrigin) {
  const normalized = String(number || "").trim();
  if (!normalized) return { ok: false, message: "شماره سفارش نامعتبر است" };
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای پرداخت وارد شوید" };
  try {
    const data = await serverFetch(apiPaths.payOrder(normalized), {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify(returnOrigin ? { returnOrigin } : {}),
    });
    revalidateCatalogOrder(normalized);
    return { ok: true, data };
  } catch (error) {
    return fromAuthError(error, "برای پرداخت وارد شوید");
  }
}

export async function completeMockPayment(authority) {
  const token = String(authority || "").trim();
  if (!token) return { ok: false, message: "پرداخت پیدا نشد." };
  try {
    const data = await serverFetch(apiPaths.paymentCallbackMock, {
      method: "POST",
      body: JSON.stringify({ authority: token, status: "OK" }),
    });
    revalidateCatalogOrder(data?.number);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: toActionMessage(error) };
  }
}

export async function verifyZibalPayment(input) {
  const trackId = String(input?.trackId || "").trim();
  if (!trackId) return { ok: false, message: "شناسه تراکنش نامعتبر است." };
  try {
    const data = await serverFetch(apiPaths.paymentVerifyZibal, {
      method: "POST",
      body: JSON.stringify({
        trackId,
        success: input?.success ?? "",
        status: input?.status ?? "",
        orderId: input?.orderId ?? "",
      }),
    });
    revalidateCatalogOrder(data?.number);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, message: toActionMessage(error) };
  }
}

export async function listMyCatalogOrders(page = 1, perPage = 20) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای دیدن سفارش‌ها وارد شوید" };
  const safePage = Math.max(1, Math.trunc(Number(page) || 1));
  const safePerPage = Math.max(1, Math.min(100, Math.trunc(Number(perPage) || 20)));
  try {
    const data = await serverFetch(apiPaths.ordersQuery(safePage, safePerPage), {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromAuthError(error, "برای دیدن سفارش‌ها وارد شوید");
  }
}

export async function listMyCatalogOrdersForDashboard() {
  const first = await listMyCatalogOrders(1, 100);
  if (!first.ok) return first;
  const items = Array.isArray(first.data?.items) ? [...first.data.items] : [];
  const totalPages = Math.min(5, Math.max(1, Number(first.data?.meta?.totalPages) || 1));
  for (let page = 2; page <= totalPages; page += 1) {
    const next = await listMyCatalogOrders(page, 100);
    if (!next.ok) return { ok: true, items };
    items.push(...(Array.isArray(next.data?.items) ? next.data.items : []));
  }
  return { ok: true, items };
}

export async function getMyCatalogOrder(number) {
  const normalized = String(number || "").trim();
  if (!normalized) return { ok: false, message: "شماره سفارش نامعتبر است", notFound: true };
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای دیدن این سفارش وارد شوید" };
  try {
    const data = await serverFetch(apiPaths.order(normalized), {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      return { ok: false, notFound: true, message: error.message };
    }
    return fromAuthError(error, "برای دیدن این سفارش وارد شوید");
  }
}

export async function revealOrderCodes(number) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای دیدن کد وارد شوید" };
  try {
    const data = await serverFetch(apiPaths.revealOrder(String(number || "").trim()), {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromAuthError(error, "برای دیدن کد وارد شوید");
  }
}
