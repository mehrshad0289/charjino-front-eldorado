import { notFound } from "next/navigation";
import HelpCenterCollection from "../../../../components/eldorado/HelpCenterCollection";
import { flattenCollections, getCollection, getParentCollection } from "../../../../components/eldorado/data/helpCenterData";

export function generateStaticParams() {
  return flattenCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "مرکز راهنما" };
  return {
    title: `${collection.title} | مرکز راهنما`,
    description: collection.summary,
  };
}

export default async function SupportCollectionPage({ params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  return <HelpCenterCollection collection={collection} parent={getParentCollection(slug)} />;
}
