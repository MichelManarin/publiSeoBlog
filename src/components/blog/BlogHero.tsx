import Link from "next/link";
import type { BlogInfo, Article } from "@/lib/blog-api";

interface BlogHeroProps {
  blog: BlogInfo | null;
  featuredArticle: Article | null;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogHero({ blog, featuredArticle }: BlogHeroProps) {
  const nome = blog?.nome ?? "";
  const descricao = blog?.descricao;

  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-24"
      style={{ background: "var(--green)" }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, var(--green-soft) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--green-soft) 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto grid max-w-[var(--content-width-wide)] grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
        <div>
          {nome ? (
            <>
              <h1 className="font-heading text-3xl font-normal leading-tight text-white sm:text-4xl">
                {nome}
              </h1>
              {descricao ? (
                <p className="mt-2 text-base leading-relaxed text-white/90">
                  {descricao}
                </p>
              ) : null}
            </>
          ) : null}
        </div>

        {featuredArticle ? (
          <Link
            href={`/artigos/${featuredArticle.slug}`}
            className="block rounded-[var(--radius)] border border-white/20 bg-white/10 p-5 backdrop-blur-sm transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--green)] focus-visible:outline-none"
          >
            <span className="text-xs font-medium uppercase tracking-wider text-white/70">
              Destaque
            </span>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-white">
              {featuredArticle.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm text-white/85">
              {featuredArticle.excerpt}
            </p>
            <p className="mt-3 text-xs text-white/70">
              {formatDate(featuredArticle.publishedAt)} ·{" "}
              {featuredArticle.readTimeMinutes} min de leitura
            </p>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
