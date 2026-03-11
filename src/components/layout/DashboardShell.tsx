import { BlogHeader } from "./BlogHeader";
import { Main } from "./Main";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--page)]">
      <BlogHeader />
      <Main>{children}</Main>
    </div>
  );
}
