import type { BlogInfo } from "@/lib/blog-api";

interface BlogHeroProps {
  blog: BlogInfo | null;
}

export function BlogHero({ blog }: BlogHeroProps) {
  const nome = blog?.nome ?? "";
  const nicho = blog?.nicho;

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
        {nome ? (
          <>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
              {nome}
            </h1>
            {nicho ? (
              <p className="mt-2 text-sm font-medium text-white/90">{nicho}</p>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
