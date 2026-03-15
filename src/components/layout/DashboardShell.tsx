import type { BlogInfo } from "@/lib/blog-api";
import { BlogHeader } from "./BlogHeader";
import { Main } from "./Main";
import { Footer } from "./Footer";
import { ConversorWidgetLoader } from "@/components/conversor/ConversorWidgetLoader";

interface DashboardShellProps {
  children: React.ReactNode;
  blog: BlogInfo | null;
}

export function DashboardShell({ children, blog }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--page)]">
      <BlogHeader blog={blog} />
      <Main>{children}</Main>
      <Footer blog={blog} />
      <ConversorWidgetLoader blogExternalId={blog?.externalId} />
    </div>
  );
}
