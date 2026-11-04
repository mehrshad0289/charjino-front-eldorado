import SupportSellerRulesPage from "../../../../components/eldorado/SupportSellerRulesPage";

/* support.eldorado.gg "Seller rules" help-center article (session 24/25;
   the user-pushed Seller rules capture —
   support_eldorado_gg_en_articles_8408997-seller-rules_…make →
   snapshots/sellerrules-1920px-light-{1,2}.tsx). The live article lives on
   the external help center; this internal route mirrors the capture 1:1
   (black 60px header, docs-nav accordion, article column, TOC). */

export const metadata = {
  title: "Seller rules - Eldorado Help Center",
  description:
    "Prepare to sell on Eldorado by learning about the seller rules. Breaking these rules or the Terms of Service can lead to canceled orders or account suspension.",
};

export default function SellerRulesArticlePage() {
  return <SupportSellerRulesPage />;
}
