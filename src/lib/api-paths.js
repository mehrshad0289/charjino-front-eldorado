export const apiPaths = {
  authRequestOtp: "/auth/request-otp",
  authVerifyOtp: "/auth/verify-otp",
  authRefresh: "/auth/refresh",
  authMe: "/auth/me",
  authLogout: "/auth/logout",
  authProfile: "/auth/profile",
  authProfileAvatar: "/auth/profile/avatar",
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
  marketConsoles: "/market/consoles",
  marketConsoleSchema: (platform) => `/market/consoles/${encodeURIComponent(platform)}/attribute-schema`,
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
  orders: "/orders",
  ordersQuery: (page = 1, perPage) => {
    const search = new URLSearchParams();
    if (page > 1) search.set("page", String(page));
    if (perPage) search.set("perPage", String(perPage));
    const qs = search.toString();
    return qs ? `/orders?${qs}` : "/orders";
  },
  order: (number) => `/orders/${encodeURIComponent(number)}`,
  payOrder: (number) => `/orders/${encodeURIComponent(number)}/pay`,
  revealOrder: (number) => `/orders/${encodeURIComponent(number)}/reveal`,
  refreshOrder: (number) => `/orders/${encodeURIComponent(number)}/refresh`,
  paymentVerifyZibal: "/payments/verify/zibal",
  paymentVerifyZarinpal: "/payments/verify/zarinpal",
  paymentCallbackMock: "/payments/callback/mock",
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
  marketItemOfferGames: "/market/item-offer-games",
  marketCurrencyOfferGames: "/market/currency-offer-games",
  marketListings: (params = {}) => {
    const search = new URLSearchParams();
    if (params.game) search.set("game", String(params.game));
    if (params.offer) search.set("offer", String(params.offer));
    if (params.platform) search.set("platform", String(params.platform));
    if (params.format) search.set("format", String(params.format));
    if (params.q) search.set("q", String(params.q));
    if (params.sort) search.set("sort", String(params.sort));
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/market/listings?${qs}` : "/market/listings";
  },
  marketListingFacets: (game) => `/market/listings/facets?game=${encodeURIComponent(game)}`,
  marketListing: (id) => `/market/listings/${encodeURIComponent(id)}`,
  marketRecentlyViewed: "/market/recently-viewed",
  marketPublicProfile: (slug) => `/market/profiles/${encodeURIComponent(slug)}`,
  marketSellerPublicListings: (sellerId, params = {}) => {
    const search = new URLSearchParams();
    if (params.offer) search.set("offer", String(params.offer));
    if (params.game) search.set("game", String(params.game));
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    const path = `/market/sellers/${encodeURIComponent(sellerId)}/listings`;
    return qs ? `${path}?${qs}` : path;
  },
  marketSellerPublicReviews: (sellerId, params = {}) => {
    const search = new URLSearchParams();
    if (params.sentiment) search.set("sentiment", String(params.sentiment));
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    const path = `/market/sellers/${encodeURIComponent(sellerId)}/reviews`;
    return qs ? `${path}?${qs}` : path;
  },
  marketQuote: (listingId, quantity) => {
    const search = new URLSearchParams();
    search.set("listingId", String(listingId));
    if (quantity) search.set("quantity", String(quantity));
    return `/market/quote?${search.toString()}`;
  },
  marketOrders: "/market/orders",
  marketOrder: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}`,
  marketOrderPay: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/pay`,
  marketOrderSellerAck: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/seller-ack`,
  marketOrderDeliver: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/deliver`,
  marketOrderReveal: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/reveal`,
  marketOrderConfirm: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/confirm`,
  marketOrderMessages: (orderNo) => `/market/orders/${encodeURIComponent(orderNo)}/messages`,
  marketChats: (params = {}) => {
    const search = new URLSearchParams();
    if (params.side) search.set("side", String(params.side));
    if (params.unread) search.set("unread", "1");
    const qs = search.toString();
    return qs ? `/market/chats?${qs}` : "/market/chats";
  },
  marketPaymentVerify: (gateway) => `/market/payments/verify/${encodeURIComponent(gateway)}`,
  marketSellerOrders: "/market/seller/orders",
  marketSellerOrdersInvoice: "/market/seller/orders/invoice",
  marketSellerOrder: (orderNo) => `/market/seller/orders/${encodeURIComponent(orderNo)}`,
  marketNotifications: "/market/notifications",
  marketNotificationsUnread: "/market/notifications/unread",
  marketNotificationsReadAll: "/market/notifications/read-all",
  marketNotificationRead: (id) => `/market/notifications/${encodeURIComponent(id)}/read`,
  marketSellerWallet: "/market/seller/wallet",
  marketSellerTransactions: "/market/seller/transactions",
  marketBoostForm: (gameId) => `/market/boost-forms/${encodeURIComponent(gameId)}`,
  marketBoostRequests: "/market/boost-requests",
  marketBoostImages: "/market/boost-forms/images",
  tickets: (params = {}) => {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/tickets?${qs}` : "/tickets";
  },
  ticket: (id) => `/tickets/${encodeURIComponent(id)}`,
  ticketMessages: (id) => `/tickets/${encodeURIComponent(id)}/messages`,
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
  blogHub: (params = {}) => {
    const search = new URLSearchParams();
    if (params.page && params.page > 1) search.set("page", String(params.page));
    if (params.perPage) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/blog?${qs}` : "/blog";
  },
  blogPosts: (params = {}) => {
    const search = new URLSearchParams();
    if (params.q?.trim()) search.set("q", String(params.q).trim().slice(0, 100));
    if (params.category?.trim()) search.set("category", String(params.category).trim());
    if (params.page && params.page > 1) search.set("page", String(params.page));
    if (params.perPage && params.perPage > 0) search.set("perPage", String(params.perPage));
    const qs = search.toString();
    return qs ? `/blog/posts?${qs}` : "/blog/posts";
  },
  blogPost: (slug) => `/blog/posts/${encodeURIComponent(slug)}`,
  blogCategories: "/blog/categories",
  blogCategory: (slug, params = {}) => {
    const search = new URLSearchParams();
    if (params.page && params.page > 1) search.set("page", String(params.page));
    if (params.perPage && params.perPage > 0) search.set("perPage", String(params.perPage));
    if (params.offset != null && Number(params.offset) >= 0) search.set("offset", String(params.offset));
    const qs = search.toString();
    return `/blog/categories/${encodeURIComponent(slug)}${qs ? `?${qs}` : ""}`;
  },
};
