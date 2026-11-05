export const FA = {
  login: "ورود",
  menu: "منو",
  close: "بستن",
  cancel: "انصراف",
  search: "جستجوی اکانت، بازی، سرور…",
  support: "پشتیبانی",
  language: "فارسی",
  toman: "تومان",
  giftCards: "گیفت کارت",
  topUps: "شارژ بازی",
  accounts: "اکانت",
  currency: "ارز",
  items: "آیتم",
  boosting: "بوستینگ",
  popular: "محبوب",
  popularGames: "بازی‌های محبوب",
  recentlyViewedGames: "بازی‌های اخیراً دیده‌شده",
  allGames: "همهٔ بازی‌ها",
  searchForGame: "جستجوی بازی",
  robloxPriceHistory: "تاریخچه قیمت روبلاکس",
  robloxPriceHistoryHint: "ببینید قیمت آیتم‌های روبلاکس چطور عوض می‌شود.",
  priceHistory: "تاریخچه قیمت",
  popularCategories: "دسته‌های محبوب",
  buyNow: "خرید",
  chatNow: "گفتگو",
  learnMore: "بیشتر بدانید",
};

export const SHOP_ACCOUNTS_HREF = "/efootball-accounts";
export const SHOP_GIFT_CARDS_HREF = "/catalog/category/gift-card";
export const SHOP_TOPUPS_HREF = "/cod-points";
export const SHOP_ITEMS_HREF = "/roblox-items";
export const SHOP_BOOSTING_HREF = "/ea-fc-boosting/b/142-4";
export const CONTACT_HREF = "/contact-us";
export const TERMS_HREF = "/terms-of-service";

export const CATEGORY_NAV = [
  { key: "Currency", label: FA.currency, href: "/catalog/category/steam-wallet", mega: true },
  { key: "Accounts", label: FA.accounts, href: SHOP_ACCOUNTS_HREF, mega: true },
  { key: "Top ups", label: FA.topUps, href: "/catalog/category/game-topup", mega: true },
  { key: "Items", label: FA.items, href: SHOP_ITEMS_HREF, mega: true },
  { key: "Boosting", label: FA.boosting, href: SHOP_BOOSTING_HREF, mega: true },
  { key: "Gift cards", label: FA.giftCards, href: "/catalog/category/gift-card", mega: true },
];
