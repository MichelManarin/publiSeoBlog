"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

const navItems = [
  { href: "/", label: "Início", icon: HomeIcon, match: (p: string) => p === "/" },
  {
    href: "/#artigos",
    label: "Artigos",
    icon: DocumentTextIcon,
    match: (p: string) => p.startsWith("/artigos/"),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden border-r border-[#f1ece6] md:block"
      style={{
        background: "linear-gradient(180deg, #fffefa 0%, #fffaf4 100%)",
      }}
    >
      <div className="flex flex-col gap-2.5 p-4 pt-6">
        <span className="px-4 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8d877f]">
          Menu
        </span>
        <nav className="flex flex-col gap-2.5">
          {navItems.map(({ href, label, icon: Icon, match }) => {
            const isNavActive = match(pathname);

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-[14px] px-4 py-3.5 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isNavActive
                    ? "bg-gradient-to-b from-[#2fc684] to-[#24b574] text-white shadow-[0_12px_24px_rgba(36,181,116,0.28)]"
                    : "text-[#7c7872] hover:bg-[#f7f2eb] hover:text-[#201d1a]"
                }`}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
