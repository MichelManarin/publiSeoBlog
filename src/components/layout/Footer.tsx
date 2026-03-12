import Link from "next/link";
import type { BlogInfo } from "@/lib/blog-api";

interface FooterProps {
  blog: BlogInfo | null;
}

const links = [
  { href: "/", label: "Início" },
  { href: "/#artigos", label: "Artigos" },
];

export function Footer({ blog }: FooterProps) {
  const description = blog?.descricao ?? null;
  const siteName = blog?.nome ?? "Blog";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto max-w-[var(--content-width-wide)] px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="font-heading text-lg font-normal text-[var(--text)]">
              {siteName}
            </p>
            {description ? (
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[var(--soft-text)]">
                {description}
              </p>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
              Links
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-[var(--soft-text)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-[var(--border)] pt-8 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
