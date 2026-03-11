import { headers } from "next/headers";
import { getRequestDominio, getArtigosPorDominio } from "@/lib/blog-api";

function getBaseUrl(headersList: Headers): string {
  const host =
    headersList.get("x-forwarded-host") || headersList.get("host") || "";
  const proto =
    headersList.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  return `${proto}://${host}`;
}

export const dynamic = "force-dynamic";

export async function GET() {
  const headersList = await headers();
  const baseUrl = getBaseUrl(headersList);
  const dominio = getRequestDominio(headersList);
  const { blog, articles } = await getArtigosPorDominio(dominio);

  const lines: string[] = [];

  if (blog?.nome) {
    lines.push(`# ${blog.nome}`);
    if (blog.nicho) lines.push(blog.nicho);
    lines.push("");
  }

  lines.push(`URL: ${baseUrl}`);
  lines.push("");

  if (articles.length > 0) {
    lines.push("## Artigos");
    lines.push("");
    for (const article of articles) {
      lines.push(`- ${article.title}`);
      lines.push(`  ${baseUrl}/artigos/${article.slug}`);
      if (article.excerpt) lines.push(`  ${article.excerpt}`);
      lines.push("");
    }
  }

  const body = lines.join("\n").trimEnd() + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
