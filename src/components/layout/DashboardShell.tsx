import type { BlogInfo } from "@/lib/blog-api";
import { BlogHeader } from "./BlogHeader";
import { Main } from "./Main";

interface DashboardShellProps {
  children: React.ReactNode;
  blog: BlogInfo | null;
}

export function DashboardShell({ children, blog }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <BlogHeader blog={blog} />
      <Main>{children}</Main>
    </div>
  );
}
