import Link from "next/link";

const nav = [
  { href: "/", label: "Início" },
  { href: "/#artigos", label: "Artigos" },
];

export function BlogHeader() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto flex h-16 max-w-[var(--content-width-wide)] items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-semibold text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Publiseo
        </Link>
        <nav className="flex items-center gap-6" aria-label="Menu principal">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-[var(--soft-text)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#artigos"
          className="shrink-0 rounded-[var(--radius)] bg-[var(--green)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Ver artigos
        </Link>
      </div>
    </header>
  );
}
