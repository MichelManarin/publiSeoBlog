"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BlogInfo } from "@/lib/blog-api";

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-[var(--border)] transition-[background-color,border-color,box-shadow] duration-200 ${
        scrolled ? "border-[var(--border)] bg-white/80 shadow-[var(--shadow-sm)] backdrop-blur-md" : "bg-[var(--bg)]"
      }`}
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-[var(--content-width-wide)] items-center justify-between gap-4 px-4 py-4 sm:min-h-[5rem] sm:px-6">
        <Link
          href="/"
          className="font-heading text-xl font-normal text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none sm:text-2xl"
        >
          {siteName || "Blog"}
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
          className="shrink-0 rounded-[var(--radius)] bg-[var(--green)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          Ver artigos
        </Link>
      </div>
    </header>
  );
}
