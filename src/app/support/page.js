import ComingSoonPage, { comingSoonMetadata } from "../../components/eldorado/ComingSoonPage";

export const instant = false;
export const metadata = comingSoonMetadata("مرکز راهنما");

export default function SupportHomePage() {
  return <ComingSoonPage title="مرکز راهنما" />;
}
