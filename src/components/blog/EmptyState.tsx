import Link from "next/link";

interface EmptyStateProps {
  hasBlog: boolean;
}

export function EmptyState({ hasBlog }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--page)] px-6 py-16 text-center sm:px-10 sm:py-20">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full sm:h-24 sm:w-24"
        style={{ background: "var(--green-soft)" }}
        aria-hidden
      >
        <svg
          className="h-10 w-10 text-[var(--green)] sm:h-12 sm:w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
      <h3 className="font-heading text-xl font-normal text-[var(--text)] sm:text-2xl">
        {hasBlog ? "Em breve" : "Nenhum blog neste domínio"}
      </h3>
      <p className="mt-3 max-w-md text-[var(--soft-text)] leading-relaxed">
        {hasBlog
          ? "Os primeiros artigos deste blog estão sendo publicados. Volte em breve para conferir novos conteúdos."
          : "Nenhum blog encontrado para este domínio. Configure o domínio no painel ou acesse por um domínio já cadastrado."}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-[var(--radius)] bg-[var(--green)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
