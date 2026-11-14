import { FA } from "./faCopy";

export const PROFILE_BANNER =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F85d513cb89885b578b89a08cd2b524bba50e910a.svg?generation=1793801447468662&alt=media";

export const PROFILE_LOYALTY_BADGE =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F38035918d9d8fdcf6bac9f12adef7d0a91b47c5d.svg?generation=1793801447494222&alt=media";

export const PROFILE_SHOP_CHIPS = [
  { id: "", icon: "item", label: "همه", offer: "" },
  { id: "Currency", icon: "coin", label: FA.currency, offer: "Currency" },
  { id: "Account", icon: "account", label: FA.accounts, offer: "Account" },
  { id: "CustomItem", icon: "item", label: FA.items, offer: "CustomItem" },
];

export const PROFILE_SHOP_GAME_FILTER = FA.allGames;

export const PROFILE_SHOP_EMPTY = {
  title: FA.nothingFound,
  text: "این فروشنده هنوز آگهی فعالی در این فیلتر ندارد.",
};

export const PROFILE_REVIEW_FILTERS = [
  { id: "", label: "همه" },
  { id: "positive", label: "مثبت", icon: "thumbup" },
  { id: "negative", label: "منفی", icon: "thumbdown" },
];

export const PROFILE_REVIEWS_EMPTY = { title: "هنوز نظری نیست", text: "بعد از تکمیل سفارش، نظر خریدار اینجا دیده می‌شود." };

export const PROFILE_ABOUT = {
  title: "درباره",
  descriptionLabel: "توضیح",
  description: "توضیحی نوشته نشده است.",
};

export const PROFILE_TABS = [
  { label: "فروشگاه", tab: "shop" },
  { label: "نظرات", tab: "reviews" },
  { label: "درباره", tab: "about" },
];
