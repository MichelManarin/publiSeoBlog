"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";

export function ThemeProviderRoot({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

