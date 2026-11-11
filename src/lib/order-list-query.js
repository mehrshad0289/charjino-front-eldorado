export const EMPTY_ORDER_STATUS_COUNTS = {
  all: 0,
  pending_delivery: 0,
  disputed: 0,
  delivered: 0,
  received: 0,
  completed: 0,
  canceled: 0,
};

const STATUS_VALUES = new Set(Object.keys(EMPTY_ORDER_STATUS_COUNTS));
const PERIOD_VALUES = new Set(["recent", "7d", "30d", "90d", "180d", "all"]);

export function parseOrderListQuery(query = {}) {
  const status = String(query.status ?? "all");
  const period = String(query.period ?? "recent");
  const q = String(query.q ?? "").trim().slice(0, 50);

  return {
    status: STATUS_VALUES.has(status) ? status : "all",
    period: PERIOD_VALUES.has(period) ? period : "recent",
    q,
  };
}

export function orderListApiQuery(filters = {}) {
  const parsed = parseOrderListQuery(filters);
  const params = new URLSearchParams();
  params.set("perPage", "40");
  params.set("status", parsed.status);
  params.set("period", parsed.period);
  if (parsed.q) params.set("q", parsed.q);
  return params.toString();
}

export function soldInvoiceHref(filters = {}) {
  const parsed = parseOrderListQuery(filters);
  const params = new URLSearchParams();
  if (parsed.status !== "all") params.set("status", parsed.status);
  if (parsed.period !== "recent") params.set("period", parsed.period);
  if (parsed.q) params.set("q", parsed.q);
  const qs = params.toString();
  return qs ? `/dashboard/orders/sold/invoice?${qs}` : "/dashboard/orders/sold/invoice";
}
