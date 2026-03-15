/**
 * API pública do backend Publiseo.
 * Fluxo: obter externalId pelo domínio de origem → listar artigos pelo externalId.
 * @see https://publiseobackend-production.up.railway.app
 */

const API_BASE =
  process.env.NEXT_PUBLIC_PUBLISEO_API_URL ||
  "https://publiseobackend-production.up.railway.app";

export interface BlogInfo {
  externalId: string;
  nome: string;
  nicho?: string;
  descricao?: string;
}

export interface ApiBlogPorDominioResponse {
  success: boolean;
  data: { externalId: string; nome?: string; nicho?: string; descricao?: string } | null;
  statusCode: number;
  message: string | null;
  errors: unknown;
}

export interface ApiArtigoItem {
  nome: string;
  descricao: string;
  dataPublicacao: string;
  conteudo: string;
  autor: string;
  imagemCapaUrl?: string | null;
  imagemCapaAttribution?: string | null;
}

export interface ApiArtigosResponse {
  success: boolean;
  data: ApiArtigoItem[] | null;
  statusCode: number;
  message: string | null;
  errors: unknown;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  category: string;
  readTimeMinutes: number;
  author?: string;
  imagemCapaUrl?: string | null;
  imagemCapaAttribution?: string | null;
}

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function estimateReadTimeMinutes(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function mapApiItemToArticle(item: ApiArtigoItem, index: number): Article {
  const slug = slugify(item.nome);
  return {
    id: `article-${index}-${slug}`,
    slug,
    title: item.nome,
    excerpt: item.descricao || "",
    content: item.conteudo || "",
    publishedAt: item.dataPublicacao,
    category: "Artigo",
    readTimeMinutes: estimateReadTimeMinutes(item.conteudo || ""),
    author: item.autor || undefined,
    imagemCapaUrl: item.imagemCapaUrl ?? null,
    imagemCapaAttribution: item.imagemCapaAttribution ?? null,
  };
}

/**
 * Obtém o domínio da requisição (host do cliente).
 * Em produção atrás de proxy, use x-forwarded-host se configurado.
 */
export function getRequestDominio(headers: Headers): string {
  const host =
    headers.get("x-forwarded-host") ||
    headers.get("host") ||
    "";
  return host.split(":")[0].trim().toLowerCase();
}

/**
 * URL absoluta do site (protocolo + host, sem barra final) para canonical, sitemap, etc.
 * Ex.: https://www.emcriciuma.com.br
 */
export function getBaseUrl(headers: Headers): string {
  const host =
    headers.get("x-forwarded-host") || headers.get("host") || "";
  const proto =
    headers.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "production" ? "https" : "http");
  const base = `${proto}://${host}`;
  return base.replace(/\/$/, "");
}

/**
 * Busca dados do blog pelo domínio de origem (externalId, nome, nicho).
 */
export async function getBlogPorDominio(
  dominio: string
): Promise<BlogInfo | null> {
  if (!dominio) return null;
  const url = `${API_BASE}/api/public/blog/por-dominio?dominio=${encodeURIComponent(dominio)}`;
  if (process.env.NODE_ENV === "development") {
    console.log("[blog-api] GET por-dominio:", url);
  }
  const res = await fetch(url, { cache: "no-store" });
  const json: ApiBlogPorDominioResponse = await res.json();
  if (json.success && json.data?.externalId) {
    if (process.env.NODE_ENV === "development") {
      console.log("[blog-api] blog:", json.data.externalId, json.data.nome);
    }
    return {
      externalId: json.data.externalId,
      nome: json.data.nome ?? "",
      nicho: json.data.nicho,
      descricao: json.data.descricao,
    };
  }
  if (process.env.NODE_ENV === "development") {
    console.log("[blog-api] por-dominio resposta:", json.statusCode, json.message);
  }
  return null;
}

/**
 * Lista artigos do blog pelo externalId.
 */
export async function getArtigosByExternalId(
  externalId: string
): Promise<Article[]> {
  const url = `${API_BASE}/api/public/blog/${encodeURIComponent(externalId)}/artigos`;
  const res = await fetch(url, { cache: "no-store" });
  const json: ApiArtigosResponse = await res.json();
  if (!json.success || !Array.isArray(json.data)) return [];
  return json.data.map((item, i) => mapApiItemToArticle(item, i));
}

/**
 * Obtém blog e artigos para o domínio da requisição.
 * Retorna blog: null e articles: [] se o domínio não tiver blog cadastrado.
 */
export async function getArtigosPorDominio(
  dominio: string
): Promise<{ articles: Article[]; blog: BlogInfo | null }> {
  const blog = await getBlogPorDominio(dominio);
  if (!blog) return { articles: [], blog: null };
  const articles = await getArtigosByExternalId(blog.externalId);
  return { articles, blog };
}

export function findArticleBySlug(
  articles: Article[],
  slug: string
): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
