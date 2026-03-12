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
      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-4px_rgba(17,24,39,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
    >
      <div
        className="aspect-[16/10] w-full shrink-0"
        style={{
          background: `linear-gradient(135deg, var(--green-soft) 0%, var(--page) 100%)`,
        }}
      />
      <div className="flex flex-1 flex-col p-6">
        <span
          className="inline-block w-fit rounded-full bg-[var(--green-soft)] px-3 py-1 text-xs font-medium text-[var(--green-dark)]"
        >
          {article.category}
        </span>
        <h2 className="font-heading mt-3 text-lg font-normal leading-snug text-[var(--text)] line-clamp-2 group-hover:text-[var(--green)]">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--soft-text)]">
          {article.excerpt}
        </p>
        <p className="mt-4 text-xs text-[var(--muted)]">
          {article.author ? `${article.author} · ` : ""}
          {formatDate(article.publishedAt)} · {article.readTimeMinutes} min
        </p>
      </div>
    </Link>
  );
}
