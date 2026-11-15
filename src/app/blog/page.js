import ComingSoonPage, { comingSoonMetadata } from "../../components/eldorado/ComingSoonPage";

export const instant = false;
export const metadata = comingSoonMetadata("وبلاگ");

export default function BlogPage() {
  return <ComingSoonPage title="وبلاگ" />;
}
