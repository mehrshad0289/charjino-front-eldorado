"use client";

import { useEffect } from "react";
import { pushRecentGame, verticalForCatalog } from "./nav-recent";

export default function RecordRecentView({ product, href }) {
  useEffect(() => {
    const vertical = verticalForCatalog(product);
    if (!vertical) return;
    pushRecentGame(vertical, {
      name: product?.title,
      href,
      img: product?.thumbnail || "",
    });
  }, [product, href]);
  return null;
}
