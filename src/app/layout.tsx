import type { Metadata } from "next";
import { Inter, DM_Serif_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeadIntegrations } from "@/components/layout/HeadIntegrations";
import { getRequestDominio, getBlogPorDominio } from "@/lib/blog-api";
import { ThemeProviderRoot } from "@/components/theme/ThemeProviderRoot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const dominio = getRequestDominio(headersList);
  const blog = await getBlogPorDominio(dominio);

  return (
    <html lang="pt-BR">
      <head>
        <HeadIntegrations integracoes={blog?.integracoes ?? []} />
      </head>
      <body className={`${inter.variable} ${dmSerif.variable} font-sans antialiased`}>
        <ThemeProviderRoot>
          <DashboardShell blog={blog}>{children}</DashboardShell>
        </ThemeProviderRoot>
      </body>
    </html>
  );
}
