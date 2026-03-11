interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Panel({ title, children, className = "" }: PanelProps) {
  return (
    <div className={className}>
      {title && (
        <h2 className="mb-6 text-2xl font-semibold text-[var(--text)]">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
}
