"use server";

import { revalidatePath } from "next/cache";
import { ApiError, serverFetch } from "@/lib/server-fetcher";
import { getAccessToken } from "@/lib/auth-cookies";
import { apiPaths } from "@/lib/api-paths";
import { onlyDigits } from "@/lib/fa-digits";
import { iranianNationalIdError } from "@/lib/national-id";
import { iranianShebaError, normalizeSheba, SHEBA_HOLDER } from "@/lib/sheba";

function extraErrorText(error) {
  if (!(error instanceof ApiError)) return "";
  if (!Array.isArray(error.data)) return "";
  return error.data.filter((item) => typeof item === "string" && item.trim()).join(" ");
}

function toActionMessage(error) {
  if (error instanceof ApiError && error.message) {
    const extra = extraErrorText(error);
    return extra ? `${error.message} ${extra}` : error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "درخواست انجام نشد";
}

function bearerHeaders(accessToken) {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

function fromMarketError(error) {
  if (error instanceof ApiError && error.statusCode === 401) {
    return { ok: false, unauthorized: true, message: error.message };
  }
  if (error instanceof ApiError && error.statusCode === 404) {
    return { ok: false, marketOff: true, message: error.message };
  }
  if (error instanceof ApiError && error.statusCode === 403) {
    return {
      ok: false,
      blocked: true,
      message: toActionMessage(error),
      blockers: Array.isArray(error.data) ? error.data : [],
    };
  }
  return { ok: false, message: toActionMessage(error) };
}

function revalidateSellerPaths() {
  revalidatePath("/verify/status");
  revalidatePath("/become-seller");
  revalidatePath("/dashboard/offers/Account");
}

export async function getSellerMe() {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true };
  try {
    const data = await serverFetch(apiPaths.marketSellerMe, {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function getKycMe() {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true };
  try {
    const data = await serverFetch(apiPaths.marketKycMe, {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function acceptSellerTerms() {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketSellerAcceptTerms, {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    revalidatePath("/verify/status");
    revalidatePath("/become-seller");
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

function asUploadFile(value) {
  if (!value || typeof value !== "object") return null;
  if (typeof value.size !== "number" || value.size <= 0) return null;
  return value;
}

function isKycPendingConflict(error) {
  if (!(error instanceof ApiError)) return false;
  if (error.errorCode === "MARKET_KYC_PENDING") return true;
  return error.statusCode === 409 && String(error.message).includes("در حال بررسی");
}

function isKycAlreadyHigher(error) {
  return error instanceof ApiError && error.errorCode === "MARKET_KYC_LEVEL_NOT_HIGHER";
}

async function uploadKycDocument(accessToken, kind, file) {
  const body = new FormData();
  body.append("kind", kind);
  const filename = typeof file.name === "string" && file.name.trim() ? file.name : `${kind}.jpg`;
  body.append("file", file, filename);
  await serverFetch(apiPaths.marketKycDocuments, {
    method: "POST",
    headers: bearerHeaders(accessToken),
    body,
  });
}

export async function submitKycLevel2(formData) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };

  const fullName = String(formData.get("full_name") || "").trim();
  const nationalId = onlyDigits(String(formData.get("national_id") || ""));
  const nationalCard = asUploadFile(formData.get("national_card"));
  const selfie = asUploadFile(formData.get("selfie"));
  const skipIdentity = String(formData.get("docs_only") || "") === "1";

  if (!skipIdentity) {
    if (fullName.length < 3) return { ok: false, message: "نام را کامل بنویس." };
    const nationalIdError = iranianNationalIdError(nationalId);
    if (nationalIdError) return { ok: false, message: nationalIdError };
  }

  try {
    await serverFetch(apiPaths.marketSellerAcceptTerms, {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
  } catch (error) {
    if (!(error instanceof ApiError && error.statusCode === 409)) {
      return fromMarketError(error);
    }
  }

  if (!skipIdentity) {
    try {
      await serverFetch(apiPaths.marketKycUpgrade, {
        method: "POST",
        headers: bearerHeaders(accessToken),
        body: JSON.stringify({
          targetLevel: 2,
          input: { national_id: nationalId, full_name: fullName },
        }),
      });
    } catch (error) {
      if (!isKycPendingConflict(error) && !isKycAlreadyHigher(error)) {
        return fromMarketError(error);
      }
    }
  }

  try {
    if (nationalCard) await uploadKycDocument(accessToken, "national_card", nationalCard);
    if (selfie) await uploadKycDocument(accessToken, "selfie", selfie);
  } catch (error) {
    return fromMarketError(error);
  }

  revalidatePath("/verify/status");
  revalidatePath("/become-seller");
  return { ok: true };
}

export async function saveSellerBank(formData) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };

  const holderName = String(formData.get("holder_name") || "").trim();
  const sheba = normalizeSheba(String(formData.get("sheba") || ""));
  if (holderName.length < 3) return { ok: false, message: SHEBA_HOLDER };
  const shebaError = iranianShebaError(sheba);
  if (shebaError) return { ok: false, message: shebaError };

  try {
    await serverFetch(apiPaths.marketSellerAcceptTerms, {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
  } catch (error) {
    if (!(error instanceof ApiError && error.statusCode === 409)) {
      return fromMarketError(error);
    }
  }

  try {
    const data = await serverFetch(apiPaths.marketSellerBank, {
      method: "PUT",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify({ sheba, holderName }),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function getMarketGames() {
  try {
    const account = await serverFetch(apiPaths.marketGames("Account"));
    const accountItems = Array.isArray(account?.items) ? account.items : [];
    if (accountItems.length > 0) return { ok: true, items: accountItems };
    const all = await serverFetch(apiPaths.marketGames());
    return { ok: true, items: Array.isArray(all?.items) ? all.items : [] };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function getGameSchema(gameId) {
  if (!gameId) return { ok: true, fields: [] };
  try {
    const data = await serverFetch(apiPaths.marketGameSchema(gameId));
    const fields = Array.isArray(data) ? data : Array.isArray(data?.fields) ? data.fields : [];
    return { ok: true, fields };
  } catch (error) {
    if (error instanceof ApiError && (error.statusCode === 404 || error.statusCode === 422)) {
      return { ok: true, fields: [] };
    }
    return fromMarketError(error);
  }
}

export async function getSellerListings() {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true };
  try {
    const data = await serverFetch(`${apiPaths.marketSellerListings}?perPage=60`, {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, items: Array.isArray(data?.items) ? data.items : [], meta: data?.meta || null };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function getSellerListing(id) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true };
  try {
    const data = await serverFetch(apiPaths.marketSellerListing(id), {
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

function listingPayload(formData) {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const gameName = String(formData.get("game_name") || "").trim();
  const publisher = String(formData.get("publisher") || "").trim();
  const priceAmount = Number(onlyDigits(String(formData.get("price_amount") || "")));
  let attributes = {};
  const rawAttributes = String(formData.get("attributes") || "");
  if (rawAttributes) {
    try {
      const parsed = JSON.parse(rawAttributes);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) attributes = parsed;
    } catch {
      attributes = {};
    }
  }
  const cleanAttributes = {};
  for (const [key, value] of Object.entries(attributes)) {
    const trimmed = String(value ?? "").trim();
    if (key && trimmed) cleanAttributes[key] = trimmed;
  }
  return {
    title,
    description: description || null,
    game_name: gameName,
    publisher: publisher || null,
    price_amount: priceAmount,
    attributes: Object.keys(cleanAttributes).length ? cleanAttributes : null,
  };
}

export async function createListing(formData) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  const body = listingPayload(formData);
  try {
    const data = await serverFetch(apiPaths.marketListingsStore, {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify(body),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function updateListing(id, formData) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  const body = listingPayload(formData);
  try {
    const data = await serverFetch(apiPaths.marketListing(id), {
      method: "PATCH",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify(body),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

async function uploadMedia(path, formData) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(path, {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body: formData,
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function uploadListingImage(formData) {
  const id = String(formData.get("listing_id") || "").trim();
  const body = new FormData();
  body.set("slot", String(formData.get("slot") || ""));
  const file = formData.get("file");
  if (file) body.set("file", file);
  return uploadMedia(apiPaths.marketListingImages(id), body);
}

export async function deleteListingImage(listingId, imageId) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketListingImage(listingId, imageId), {
      method: "DELETE",
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function uploadListingVideo(formData) {
  const id = String(formData.get("listing_id") || "").trim();
  const body = new FormData();
  const file = formData.get("file");
  if (file) body.set("file", file);
  return uploadMedia(apiPaths.marketListingVideos(id), body);
}

export async function deleteListingVideo(listingId, videoId) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketListingVideo(listingId, videoId), {
      method: "DELETE",
      headers: bearerHeaders(accessToken),
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function placeListing(id) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketListingPlace(id), {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function submitListing(id) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketListingSubmit(id), {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function saveAndSubmitListing(formData) {
  const listingId = String(formData.get("listing_id") || "").trim();
  const saved = listingId ? await updateListing(listingId, formData) : await createListing(formData);
  if (!saved.ok) return saved;
  const id = saved.data?.id || listingId;
  const submitted = await submitListing(id);
  if (!submitted.ok) {
    return { ...submitted, data: saved.data, draftId: id };
  }
  return submitted;
}

export async function pauseListing(id) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketListingPause(id), {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function submitBoostRequest(gameId, answers) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای ثبت درخواست وارد شو." };
  try {
    const data = await serverFetch(apiPaths.marketBoostRequests, {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify({ gameId: Number(gameId), answers }),
    });
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function uploadBoostImage(file) {
  const body = new FormData();
  body.append("file", file);
  return uploadMedia(apiPaths.marketBoostImages, body);
}

export async function createMarketOrder(listingId) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "برای خرید وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketOrders, {
      method: "POST",
      headers: bearerHeaders(accessToken),
      body: JSON.stringify({ listingId: Number(listingId), termsAccepted: true }),
    });
    revalidatePath("/dashboard/orders/purchased");
    return { ok: true, orderNo: data?.order_no || "" };
  } catch (error) {
    return fromMarketError(error);
  }
}

export async function resumeListing(id) {
  const accessToken = await getAccessToken();
  if (!accessToken) return { ok: false, unauthorized: true, message: "وارد شوید." };
  try {
    const data = await serverFetch(apiPaths.marketListingResume(id), {
      method: "POST",
      headers: bearerHeaders(accessToken),
    });
    revalidateSellerPaths();
    return { ok: true, data };
  } catch (error) {
    return fromMarketError(error);
  }
}
