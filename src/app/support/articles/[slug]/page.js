import { notFound } from "next/navigation";
import HelpCenterArticle from "../../../../components/eldorado/HelpCenterArticle";
import { flattenCollections, getArticle } from "../../../../components/eldorado/data/helpCenterData";

export function generateStaticParams() {
  const slugs = new Set();
  for (const col of flattenCollections()) {
    for (const a of col.articles || []) slugs.add(a.slug);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "مرکز راهنما" };
  return {
    title: `${article.title} | مرکز راهنما`,
    description: article.description || article.summary || article.title,
  };
}

export default async function SupportArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  return <HelpCenterArticle article={article} />;
}
