import GameShopPage from "../../components/eldorado/GameShopPage";
import { GAME_PAGES } from "../../components/eldorado/data/gamePagesData";

/* /roblox-gift-card — session 26 template instance of the capture-built shop page
   (see GameShopPage.js + gamePagesData.js for the data provenance: no
   user-pushed capture for this route; seller pool capture-verbatim,
   amounts follow official store tiers where public). */

export const metadata = {
  title: "Roblox Gift Card - Eldorado",
  description:
    "Buy Roblox Gift Card from verified sellers on Eldorado — fast delivery, TradeShield buyer protection and 24/7 support.",
};

export default function Page() {
  return <GameShopPage game={GAME_PAGES["roblox-gift-card"]} />;
}
