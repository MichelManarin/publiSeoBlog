import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  getRequestDominio,
  getArtigosPorDominio,
  findArticleBySlug,
} from "@/lib/blog-api";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const headersList = await headers();
  const dominio = getRequestDominio(headersList);
  const { articles, blog } = await getArtigosPorDominio(dominio);
  const article = findArticleBySlug(articles, slug);
  if (!article)
    return { title: "Artigo não encontrado" };
  const title = blog?.nome ? `${article.title} | ${blog.nome}` : article.title;
  return {
    title,
    description: article.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const headersList = await headers();
  const dominio = getRequestDominio(headersList);
  const { articles } = await getArtigosPorDominio(dominio);
  const article = findArticleBySlug(articles, slug);

  if (!article) notFound();

  return (
    <article className="mx-auto max-w-[var(--content-width)] px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--soft-text)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <ArrowLeftIcon className="h-4 w-4" aria-hidden />
        Voltar ao blog
      </Link>

      <header className="mb-10">
        <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
          {article.category}
        </span>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--text)] sm:text-3xl">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          {article.author && <span>{article.author} · </span>}
          {formatDate(article.publishedAt)} · {article.readTimeMinutes} min de
          leitura
        </p>
      </header>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.content.trim() }}
      />
    </article>
  );
}
