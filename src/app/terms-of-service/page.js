import ComingSoonPage, { comingSoonMetadata } from "../../components/eldorado/ComingSoonPage";

export const instant = false;
export const metadata = comingSoonMetadata("شرایط استفاده");

export default function TermsOfServicePage() {
  return <ComingSoonPage title="شرایط استفاده" />;
}
