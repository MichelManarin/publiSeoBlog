interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
}: SectionHeaderProps) {
  return (
    <header className="mb-8 flex min-h-[2.25rem] flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold uppercase tracking-wider text-[var(--muted)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--soft-text)]">{subtitle}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="text-sm text-[var(--green)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {actionLabel} →
        </a>
      )}
    </header>
  );
}
