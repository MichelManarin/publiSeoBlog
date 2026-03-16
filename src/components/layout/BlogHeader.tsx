"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BlogInfo } from "@/lib/blog-api";
import { useTheme } from "@/contexts/ThemeContext";

const nav = [
  { href: "/", label: "Início" },
  { href: "/#artigos", label: "Artigos" },
];

interface BlogHeaderProps {
  blog: BlogInfo | null;
}

export function BlogHeader({ blog }: BlogHeaderProps) {
  const siteName = blog?.nome ?? "";
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled ? "border-[var(--border)] bg-[var(--bg)] shadow-[var(--shadow-sm)] backdrop-blur-md" : "bg-[var(--bg)]"
      }`}
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-[var(--content-width-wide)] items-center justify-between gap-4 px-4 py-4 sm:min-h-[5rem] sm:px-6">
        <h1 className="text-xl font-normal sm:text-2xl">
          <Link
            href="/"
            className="font-heading text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {siteName || "Blog"}
          </Link>
        </h1>
        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-6 md:flex" aria-label="Menu principal">
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
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--page)] text-[var(--soft-text)] shadow-sm hover:bg-[var(--card)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label={theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"}
          >
            {theme === "dark" ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 12.79A9 9 0 0 1 12.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
          <Link
            href="/#artigos"
            className="hidden shrink-0 rounded-[var(--radius)] bg-[var(--green)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none sm:inline-flex"
          >
            Ver artigos
          </Link>
        </div>
      </div>
    </header>
  );
}
