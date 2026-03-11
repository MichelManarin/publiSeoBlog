import Link from "next/link";

export function Topbar() {
  return (
    <header
      className="sticky top-0 z-10 flex h-14 items-center border-b border-[#f1ece6] bg-white/70 px-5 backdrop-blur-sm md:px-7"
      style={{ borderColor: "#f1ece6" }}
    >
      <Link
        href="/"
        className="font-bold tracking-[0.14em] text-[#1e1e1b] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Publiseo
      </Link>
    </header>
  );
}
