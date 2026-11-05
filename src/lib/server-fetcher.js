import { getBackendUrl } from "./env";

export class ApiError extends Error {
  constructor(message, statusCode, errorCode, data) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.data = data;
  }
}

function resolveBackendUrl(path) {
  return `${getBackendUrl()}/${path.replace(/^\//, "")}`;
}

function toErrorMessage(payload, fallback) {
  if (!payload || typeof payload !== "object") return fallback;
  const message = payload.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message)) {
    const parts = message.filter((item) => typeof item === "string" && item.trim());
    if (parts.length > 0) return parts.join("، ");
  }
  return fallback;
}

async function readPayload(response) {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

export async function serverFetch(path, init = {}) {
  const { headers: initHeaders, ...requestInit } = init;
  const headers = new Headers(initHeaders);
  if (requestInit.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(resolveBackendUrl(path), {
      ...requestInit,
      headers,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("اتصال به سرور برقرار نشد", 503);
  }

  const payload = await readPayload(response);
  const errorMessage = toErrorMessage(payload, "درخواست انجام نشد");
  if (!response.ok || payload?.success === false) {
    throw new ApiError(errorMessage, response.status, undefined, payload?.data);
  }
  return payload?.data ?? payload;
}
