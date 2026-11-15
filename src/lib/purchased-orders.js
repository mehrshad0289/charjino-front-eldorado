import { EMPTY_ORDER_STATUS_COUNTS, parseOrderListQuery } from "./order-list-query";

const PERIOD_DAYS = {
  recent: 90,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "180d": 180,
  all: null,
};

const CATALOG_BUCKET = {
  paid: "pending_delivery",
  submitting: "pending_delivery",
  submitted: "pending_delivery",
  processing: "pending_delivery",
  needs_review: "pending_delivery",
  completed: "completed",
  cancelled: "canceled",
  expired: "canceled",
  refunded: "canceled",
  refund_pending: "canceled",
  failed: "canceled",
};

export function catalogOrderBucket(status) {
  return CATALOG_BUCKET[String(status || "").toLowerCase()] || null;
}

export function catalogToOrderCard(order) {
  const title = String(order?.productTitle || "").trim();
  const sku = String(order?.skuName || "").trim();
  return {
    source: "catalog",
    order_no: order?.number,
    status: order?.status,
    statusLabelFa: order?.statusLabelFa || "",
    buyer_paid_amount: order?.amountToman,
    created_at: order?.createdAt,
    listing: {
      title: title || sku || order?.number || "سفارش",
      game_name: title && sku && sku !== title ? sku : "",
    },
  };
}

function inPeriod(iso, period) {
  const days = PERIOD_DAYS[period];
  if (days == null) return true;
  if (!iso) return true;
  const time = new Date(iso).getTime();
  if (Number.isNaN(time)) return true;
  return time >= Date.now() - days * 86400000;
}

function matchesQuery(order, query) {
  if (!query) return true;
  const hay = `${order?.number || ""} ${order?.productTitle || ""} ${order?.skuName || ""}`.toLowerCase();
  return hay.includes(query.toLowerCase());
}

export function catalogPurchasedSlice(catalogItems, filters) {
  const parsed = parseOrderListQuery(filters);
  const windowed = (Array.isArray(catalogItems) ? catalogItems : []).filter(
    (order) => inPeriod(order?.createdAt, parsed.period) && matchesQuery(order, parsed.q),
  );
  const counts = { ...EMPTY_ORDER_STATUS_COUNTS, all: windowed.length };
  for (const order of windowed) {
    const bucket = catalogOrderBucket(order?.status);
    if (bucket && counts[bucket] != null) counts[bucket] += 1;
  }
  const items = windowed
    .filter((order) => parsed.status === "all" || catalogOrderBucket(order?.status) === parsed.status)
    .map(catalogToOrderCard);
  return { items, counts };
}

export function mergeStatusCounts(marketCounts, catalogCounts) {
  const out = { ...EMPTY_ORDER_STATUS_COUNTS };
  for (const key of Object.keys(out)) {
    out[key] = (Number(marketCounts?.[key]) || 0) + (Number(catalogCounts?.[key]) || 0);
  }
  return out;
}

export function mergePurchasedItems(marketItems, catalogCards) {
  return [...(Array.isArray(marketItems) ? marketItems : []), ...(Array.isArray(catalogCards) ? catalogCards : [])].sort(
    (left, right) => {
      const a = new Date(left?.created_at || 0).getTime();
      const b = new Date(right?.created_at || 0).getTime();
      return (Number.isNaN(b) ? 0 : b) - (Number.isNaN(a) ? 0 : a);
    },
  );
}

export function isCatalogOrderNumber(number) {
  return /^CH/i.test(String(number || "").trim());
}
