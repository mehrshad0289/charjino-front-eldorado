export const apiPaths = {
  authRequestOtp: "/auth/request-otp",
  authVerifyOtp: "/auth/verify-otp",
  authMe: "/auth/me",
  authLogout: "/auth/logout",
  marketSellerMe: "/market/seller/me",
  marketSellerAcceptTerms: "/market/seller/accept-terms",
  marketSellerBank: "/market/seller/bank",
  marketSellerListings: "/market/seller/listings",
  marketSellerListing: (id) => `/market/seller/listings/${encodeURIComponent(id)}`,
  marketListingsStore: "/market/listings",
  marketListingPlace: (id) => `/market/listings/${encodeURIComponent(id)}/place`,
  marketListingSubmit: (id) => `/market/listings/${encodeURIComponent(id)}/submit`,
  marketListingImages: (id) => `/market/seller/listings/${encodeURIComponent(id)}/images`,
  marketListingImage: (id, imageId) =>
    `/market/seller/listings/${encodeURIComponent(id)}/images/${encodeURIComponent(imageId)}`,
  marketListingVideos: (id) => `/market/seller/listings/${encodeURIComponent(id)}/videos`,
  marketListingVideo: (id, videoId) =>
    `/market/seller/listings/${encodeURIComponent(id)}/videos/${encodeURIComponent(videoId)}`,
  marketListingPause: (id) => `/market/listings/${encodeURIComponent(id)}/pause`,
  marketListingResume: (id) => `/market/listings/${encodeURIComponent(id)}/resume`,
  marketListingArchive: (id) => `/market/listings/${encodeURIComponent(id)}/archive`,
  marketGameSchema: (id) => `/market/games/${encodeURIComponent(id)}/attribute-schema`,
  marketKycMe: "/market/kyc/me",
  marketKycUpgrade: "/market/kyc/upgrade",
  marketKycDocuments: "/market/kyc/documents",
  catalogHome: "/catalog/home",
  catalogCategories: "/catalog/categories",
  catalogCategory: (slug) => `/catalog/categories/${encodeURIComponent(slug)}`,
  catalogProduct: (handle) => `/catalog/products/${encodeURIComponent(handle)}`,
  catalogGiftBrandPage: (platform) => `/catalog/gift-brand-pages/${encodeURIComponent(platform)}`,
  catalogProductHub: (hubKey) => `/catalog/product-hubs/${encodeURIComponent(hubKey)}`,
  catalogProductHubByMarketGame: (source) =>
    `/catalog/product-hubs/by-market-game/${encodeURIComponent(source)}`,
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
  marketListingFacets: (game) => `/market/listings/facets?game=${encodeURIComponent(game)}`,
  marketListing: (id) => `/market/listings/${encodeURIComponent(id)}`,
  marketOrders: "/market/orders",
  marketOrder: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}`,
  marketOrderPay: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/pay`,
  marketOrderSellerAck: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/seller-ack`,
  marketOrderDeliver: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/deliver`,
  marketOrderReveal: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/reveal`,
  marketOrderConfirm: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/confirm`,
  marketOrderMessages: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/messages`,
  marketPaymentVerify: (gateway) => `/market/payments/verify/${encodeURIComponent(gateway)}`,
  marketSellerOrders: "/market/seller/orders",
  marketSellerOrdersInvoice: "/market/seller/orders/invoice",
  marketSellerOrder: (orderNo) => `/market/seller/orders/${encodeURIComponent(orderNo)}`,
  marketSellerWallet: "/market/seller/wallet",
  marketSellerTransactions: "/market/seller/transactions",
  marketBoostForm: (gameId) => `/market/boost-forms/${encodeURIComponent(gameId)}`,
  marketBoostRequests: "/market/boost-requests",
  marketBoostImages: "/market/boost-forms/images",
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
