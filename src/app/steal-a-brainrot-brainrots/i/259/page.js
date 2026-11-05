import GameShopPage from "../../../../components/eldorado/GameShopPage";
import { GAME_PAGES } from "../../../../components/eldorado/data/gamePagesData";

/* /steal-a-brainrot-brainrots/i/259 — session 26 template instance of the capture-built shop page
   (see GameShopPage.js + gamePagesData.js for the data provenance: no
   user-pushed capture for this route; seller pool capture-verbatim,
   amounts follow official store tiers where public). */

export const metadata = {
  title: "Steal A Brainrot Brainrots - Eldorado",
  description:
    "Buy Steal A Brainrot Brainrots from verified sellers on Eldorado — fast delivery, TradeShield buyer protection and 24/7 support.",
};

export default function Page() {
  return <GameShopPage game={GAME_PAGES["steal-a-brainrot-brainrots"]} />;
}
