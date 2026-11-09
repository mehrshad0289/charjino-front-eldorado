export const apiPaths = {
  catalogHome: "/catalog/home",
  catalogCategories: "/catalog/categories",
  catalogCategory: (slug) => `/catalog/categories/${encodeURIComponent(slug)}`,
  catalogProduct: (handle) => `/catalog/products/${encodeURIComponent(handle)}`,
  catalogGiftBrandPage: (platform) => `/catalog/gift-brand-pages/${encodeURIComponent(platform)}`,
  catalogProductHub: (hubKey) => `/catalog/product-hubs/${encodeURIComponent(hubKey)}`,
  catalogStoreCategories: "/catalog/store-categories",
  catalogStoreCategory: (key) => `/catalog/store-categories/${encodeURIComponent(key)}`,
  catalogCheckoutPreview: "/catalog/checkout-preview",
  checkoutCoupon: "/checkout/coupon",
  catalogProducts: (params = {}) => {
    const search = new URLSearchParams();
    if (params.category) search.set("category", String(params.category));
    if (params.popular) search.set("popular", "1");
    if (params.platform) search.set("platform", String(params.platform));
    if (params.region) search.set("region", String(params.region));
    if (params.withSkus) search.set("withSkus", "1");
    if (params.giftDelivery) search.set("giftDelivery", String(params.giftDelivery));
    if (params.q) search.set("q", String(params.q).slice(0, 100));
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/catalog/products?${qs}` : "/catalog/products";
  },
  marketGames: (offer) =>
    offer ? `/market/games?offer=${encodeURIComponent(offer)}` : "/market/games",
  marketListings: (params = {}) => {
    const search = new URLSearchParams();
    if (params.game) search.set("game", String(params.game));
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/market/listings?${qs}` : "/market/listings";
  },
  marketListing: (id) => `/market/listings/${encodeURIComponent(id)}`,
  smartSearch: (params) => {
    const search = new URLSearchParams();
    search.set("q", String(params.q ?? "").slice(0, 100));
    search.set("mode", params.mode ?? "auto");
    if (params.page && params.page > 1) search.set("page", String(params.page));
    if (params.perPage) search.set("per_page", String(params.perPage));
    if (params.group) search.set("group", String(params.group));
    if (params.platform) search.set("platform", String(params.platform));
    if (params.region) search.set("region", String(params.region));
    return `/catalog/smart-search?${search.toString()}`;
  },
};
