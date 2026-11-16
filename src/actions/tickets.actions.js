"use server";

import { revalidatePath } from "next/cache";
import { ApiError, serverFetch } from "@/lib/server-fetcher";
import { ensureAccessToken } from "@/lib/ensure-access-token";
import { apiPaths } from "@/lib/api-paths";

function toActionMessage(error) {
  if (error instanceof ApiError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "درخواست انجام نشد";
}

function bearerHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function fromAuthError(error) {
  if (error instanceof ApiError && error.statusCode === 401) {
    return { ok: false, unauthorized: true, message: error.message };
  }
  if (error instanceof ApiError && error.statusCode === 404) {
    return { ok: false, notFound: true, message: error.message };
  }
  return { ok: false, message: toActionMessage(error) };
}

function revalidateTickets(id) {
  revalidatePath("/dashboard/tickets");
  revalidatePath("/dashboard/tickets/new");
  revalidatePath("/contact-us");
  if (id) {
    revalidatePath(`/dashboard/tickets/${id}`);
    revalidatePath(`/contact-us/${id}`);
  }
}

function appendImages(body, files) {
  for (const file of files || []) {
    if (file && typeof file === "object" && "size" in file && file.size > 0) {
      body.append("images[]", file);
    }
  }
}

export async function listTickets() {
  const accessToken = await ensureAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید.", items: [] };
  try {
    const data = await serverFetch(apiPaths.tickets({ page: 1, perPage: 30 }), {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, items: Array.isArray(data?.items) ? data.items : [], meta: data?.meta || null };
  } catch (error) {
    return { ...fromAuthError(error), items: [] };
  }
}

export async function getTicket(id) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  const key = String(id || "").trim();
  if (!key) return { ok: false, notFound: true, message: "تیکت پیدا نشد." };
  try {
    const ticket = await serverFetch(apiPaths.ticket(key), {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, ticket };
  } catch (error) {
    return fromAuthError(error);
  }
}

export async function createTicket(formData) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  const body = new FormData();
  body.set("subject", String(formData.get("subject") || "").trim());
  body.set("body", String(formData.get("body") || "").trim());
  const category = String(formData.get("category") || "").trim();
  if (category) body.set("category", category);
  const orderNumber = String(formData.get("orderNumber") || "").trim();
  if (orderNumber) body.set("orderNumber", orderNumber);
  appendImages(body, formData.getAll("images"));
  try {
    const ticket = await serverFetch(apiPaths.tickets(), {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body,
    });
    revalidateTickets(ticket?.id);
    return { ok: true, ticket };
  } catch (error) {
    return fromAuthError(error);
  }
}

export async function replyTicket(id, formData) {
  const accessToken = await ensureAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  const key = String(id || "").trim();
  if (!key) return { ok: false, notFound: true, message: "تیکت پیدا نشد." };
  const body = new FormData();
  body.set("body", String(formData.get("body") || "").trim());
  appendImages(body, formData.getAll("images"));
  try {
    const ticket = await serverFetch(apiPaths.ticketMessages(key), {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body,
    });
    revalidateTickets(ticket?.id || key);
    return { ok: true, ticket };
  } catch (error) {
    return fromAuthError(error);
  }
}
