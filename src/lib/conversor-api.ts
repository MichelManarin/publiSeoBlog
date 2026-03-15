/**
 * API pública do conversor (widget de atendimento/leads) no blog.
 * Carregamento assíncrono; não bloqueia o site.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_PUBLISEO_API_URL ||
  "https://publiseobackend-production.up.railway.app";

export type TipoCampo = 0 | 1 | 2; // 0=Texto, 1=Telefone, 2=Email
export type TipoFinalizacao = 0 | 1; // 0=Mensagem, 1=WhatsApp

export interface ConversorPergunta {
  ordem: number;
  textoPergunta: string;
  tipoCampo: TipoCampo;
}

export interface ConversorConfig {
  ativo: boolean;
  textoBotaoInicial: string;
  tipoFinalizacao: TipoFinalizacao;
  mensagemFinalizacao: string | null;
  whatsAppNumero: string | null;
  whatsAppTextoPreDefinido: string | null;
  perguntas: ConversorPergunta[];
}

interface ConversorResponse {
  success: boolean;
  data: ConversorConfig | null;
  statusCode: number;
}

export interface LeadPayload {
  blogExternalId: string;
  nomeCompleto: string;
  telefone: string;
  respostas: string[];
  artigoId?: string | null;
}

/**
 * Busca a configuração do conversor do blog. Retorna null se 404 ou inativo.
 */
export async function getConversorConfig(
  blogExternalId: string
): Promise<ConversorConfig | null> {
  const url = `${API_BASE}/api/public/blog/${encodeURIComponent(blogExternalId)}/conversor`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) return null;
  const json: ConversorResponse = await res.json();
  if (!json.success || !json.data?.ativo) return null;
  return json.data;
}

/**
 * Registra o lead no conversor. Retorna true se 204.
 */
export async function postConversorLead(payload: LeadPayload): Promise<boolean> {
  const url = `${API_BASE}/api/public/conversor/lead`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.status === 204;
}
