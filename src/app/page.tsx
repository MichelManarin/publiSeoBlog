import type { Metadata } from "next";
import { headers } from "next/headers";
// import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCard";
import { EmptyState } from "@/components/blog/EmptyState";
import {
  getRequestDominio,
  getBaseUrl,
  getArtigosPorDominio,
} from "@/lib/blog-api";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const dominio = getRequestDominio(headersList);
  const { blog } = await getArtigosPorDominio(dominio);
  const baseUrl = getBaseUrl(headersList);
  return {
    title: blog?.nome ? `${blog.nome}${blog.nicho ? ` — ${blog.nicho}` : ""}` : "Blog",
    description: blog?.descricao ?? blog?.nicho ?? undefined,
    alternates: {
      canonical: baseUrl,
    },
  };
}

export default async function Home() {
  const headersList = await headers();
  const dominio = getRequestDominio(headersList);
  const { articles, blog } = await getArtigosPorDominio(dominio);

  return (
    <>
      {/* Hero section desativado
      <BlogHero blog={blog} featuredArticle={articles[0] ?? null} />
      */}

      <section id="artigos" className="bg-[var(--bg)] py-20 sm:py-24">
        <div className="mx-auto max-w-[var(--content-width-wide)] px-4 sm:px-6">
          <h2 className="font-heading mb-10 text-xl font-normal tracking-tight text-[var(--text)] sm:text-2xl">
            Artigos recentes
          </h2>
          {articles.length === 0 ? (
            <EmptyState hasBlog={!!blog} />
          ) : (
            <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <li key={article.id}>
                  <BlogCard article={article} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
