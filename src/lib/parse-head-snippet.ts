/**
 * Parseia um snippet de HTML para o <head> (ex.: meta, script) e retorna
 * tag, atributos e opcionalmente conteúdo interno, para renderização em React.
 */

export interface ParsedHeadTag {
  tag: string;
  attrs: Record<string, string>;
  content?: string;
}

const ATTR_REGEX = /(\w+)=["']([^"']*)["']/g;

function parseAttributes(attrString: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  let m: RegExpExecArray | null;
  ATTR_REGEX.lastIndex = 0;
  while ((m = ATTR_REGEX.exec(attrString)) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

/**
 * Parseia uma string de um único elemento (ex.: <meta name="..." content="..." />).
 * Suporta self-closing e tags com conteúdo (ex.: <script>...</script>).
 */
export function parseHeadSnippet(html: string): ParsedHeadTag | null {
  const trimmed = html.trim();
  if (!trimmed) return null;

  // Self-closing ou tag vazia: <meta ... /> ou <link ... />
  const selfClosing = trimmed.match(/<(\w+)\s+([^>]+)\s*\/?\s*>/);
  if (selfClosing) {
    const [, tag, attrString] = selfClosing;
    return { tag: tag.toLowerCase(), attrs: parseAttributes(attrString) };
  }

  // Tag com conteúdo: <script ...>...</script>
  const withContent = trimmed.match(/<(\w+)(\s+[^>]*)?>([\s\S]*?)<\/\1\s*>/i);
  if (withContent) {
    const [, tag, attrPart, content] = withContent;
    const attrString = (attrPart || "").trim();
    return {
      tag: tag.toLowerCase(),
      attrs: attrString ? parseAttributes(attrString) : {},
      content: content?.trim() || undefined,
    };
  }

  // Fallback: tag simples com apenas atributos, sem />
  const openOnly = trimmed.match(/<(\w+)\s+([^>]+)>\s*$/);
  if (openOnly) {
    const [, tag, attrString] = openOnly;
    return { tag: tag.toLowerCase(), attrs: parseAttributes(attrString) };
  }

  return null;
}
