import Link from "next/link";
import type { Article } from "@/data/articles";

interface BlogCardProps {
  article: Article;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogCard({ article }: BlogCardProps) {
  return (
    <Link
      href={`/artigos/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-[0_8px_24px_rgba(26,25,24,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div
        className="aspect-[16/10] w-full shrink-0"
        style={{
          background: `linear-gradient(135deg, var(--green-soft) 0%, var(--page) 100%)`,
        }}
      />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs text-[var(--muted)]">
          {article.author ? `${article.author} · ` : ""}
          {formatDate(article.publishedAt)}
        </p>
        <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--text)] group-hover:text-[var(--green)]">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--soft-text)]">
          {article.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span
            className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--soft-text)]"
            style={{ borderColor: "var(--border)" }}
          >
            {article.category}
          </span>
        </div>
      </div>
    </Link>
  );
}
