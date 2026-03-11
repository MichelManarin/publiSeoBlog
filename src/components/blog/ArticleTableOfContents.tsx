"use client";

import { useEffect, useRef, useState } from "react";

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

interface TocEntry {
  id: string;
  text: string;
}

interface ArticleTableOfContentsProps {
  html: string;
}

export function ArticleTableOfContents({ html }: ArticleTableOfContentsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocEntry[]>([]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const h2s = el.querySelectorAll<HTMLHeadingElement>("h2");
    const entries: TocEntry[] = [];
    const usedIds = new Set<string>();

    h2s.forEach((h2) => {
      const text = h2.textContent?.trim() ?? "";
      if (!text) return;

      let id = slugify(text);
      if (usedIds.has(id)) {
        let n = 2;
        while (usedIds.has(`${id}-${n}`)) n++;
        id = `${id}-${n}`;
      }
      usedIds.add(id);

      h2.id = id;
      entries.push({ id, text });
    });

    if (entries.length > 0) setToc(entries);
  }, [html]);

  return (
    <>
      {toc.length > 0 && (
        <nav
          className="mb-10 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--page)] p-5"
          aria-label="Neste artigo"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
            Neste artigo
          </h2>
          <ul className="flex flex-col gap-2">
            {toc.map(({ id, text }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = contentRef.current?.querySelector(`#${CSS.escape(id)}`);
                    target?.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.pushState(null, "", `#${id}`);
                  }}
                  className="text-sm text-[var(--soft-text)] underline underline-offset-2 hover:text-[var(--green)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div
        ref={contentRef}
        className="article-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
