export const apiPaths = {
  catalogHome: "/catalog/home",
  catalogCategories: "/catalog/categories",
  catalogCategory: (slug) => `/catalog/categories/${encodeURIComponent(slug)}`,
  catalogProduct: (handle) => `/catalog/products/${encodeURIComponent(handle)}`,
  catalogProducts: (params = {}) => {
    const search = new URLSearchParams();
    if (params.category) search.set("category", String(params.category));
    if (params.popular) search.set("popular", "1");
    if (params.platform) search.set("platform", String(params.platform));
    if (params.region) search.set("region", String(params.region));
    if (params.withSkus) search.set("withSkus", "1");
    if (params.q) search.set("q", String(params.q).slice(0, 100));
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/catalog/products?${qs}` : "/catalog/products";
  },
  marketGames: (offer) =>
    offer ? `/market/games?offer=${encodeURIComponent(offer)}` : "/market/games",
  smartSearch: (params) => {
    const search = new URLSearchParams();
    search.set("q", String(params.q ?? "").slice(0, 100));
    search.set("mode", params.mode ?? "auto");
    if (params.page && params.page > 1) search.set("page", String(params.page));
    if (params.perPage) search.set("per_page", String(params.perPage));
    return `/catalog/smart-search?${search.toString()}`;
  },
};
