export function BlogHero() {
  return (
    <section
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20"
      style={{ background: "var(--green)" }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, var(--green-soft) 0%, transparent 50%), radial-gradient(circle at 80% 80%, var(--green-soft) 0%, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-[var(--content-width-wide)]">
        <span className="text-sm font-medium text-white/90">Blog</span>
        <h1 className="mt-2 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
          O Journal: SEO, Conteúdo e Marketing Digital
        </h1>
      </div>
    </section>
  );
}
