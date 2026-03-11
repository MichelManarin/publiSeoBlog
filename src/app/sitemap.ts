import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import {
  getRequestDominio,
  getBaseUrl,
  getArtigosPorDominio,
} from "@/lib/blog-api";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const baseUrl = getBaseUrl(headersList);
  const dominio = getRequestDominio(headersList);
  const { articles } = await getArtigosPorDominio(dominio);

  const entries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/artigos/${article.slug}`,
      lastModified: new Date(article.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];

  return entries;
}
