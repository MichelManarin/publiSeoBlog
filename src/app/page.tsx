import type { Metadata } from "next";
import { headers } from "next/headers";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCard } from "@/components/blog/BlogCard";
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
    description: blog?.nicho ?? undefined,
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
      <BlogHero blog={blog} />

      <section id="artigos" className="bg-[var(--bg)]">
        <div className="mx-auto max-w-[var(--content-width-wide)] px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="mb-8 text-base font-semibold uppercase tracking-wider text-[var(--muted)]">
            Artigos recentes
          </h2>
          {articles.length === 0 ? (
            <p className="text-[var(--soft-text)]">
              Nenhum blog encontrado para este domínio.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
