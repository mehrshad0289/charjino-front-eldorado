"use client";

import { useEffect } from "react";
import { FA } from "./data/faCopy";
import { pushHomeRecent, pushRecentGame, verticalForCatalog } from "./nav-recent";

function badgeForVertical(vertical) {
  if (vertical === "Top ups") return FA.topUps;
  if (vertical === "Gift cards") return FA.giftCards;
  if (vertical === "Currency") return FA.currency;
  return "";
}

export default function RecordRecentView({ product, href, card, price, badge, item, game }) {
  useEffect(() => {
    const link = String(href || card?.href || "").trim();
    const title = String(product?.title || card?.item || "").trim();
    const img = String(product?.thumbnail || card?.gameImg || card?.gameIcon || "");
    const vertical = verticalForCatalog(product);
    if (vertical && title && link) {
      pushRecentGame(vertical, { name: title, href: link, img });
    }
    const home =
      card ||
      (link && title
        ? {
            href: link,
            game: game || title,
            gameIcon: img,
            gameImg: img,
            item: item || title,
            price: price || "",
            unit: "",
            badge: badge || badgeForVertical(vertical),
          }
        : null);
    if (home) pushHomeRecent(home);
  }, [product, href, card, price, badge, item, game]);
  return null;
}
