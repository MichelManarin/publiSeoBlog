import React from "react";
import type { IntegracaoHead } from "@/lib/blog-api";
import { parseHeadSnippet } from "@/lib/parse-head-snippet";

interface HeadIntegrationsProps {
  integracoes: IntegracaoHead[];
}

/**
 * Renderiza os snippets de integração (ex.: Google Site Verification) no <head>.
 * Cada item.valor é um HTML de uma tag (meta, script, etc.); parseamos e injetamos.
 */
export function HeadIntegrations({ integracoes }: HeadIntegrationsProps) {
  if (!integracoes?.length) return null;

  return (
    <>
      {integracoes.map((item, i) => {
        const parsed = parseHeadSnippet(item.valor);
        if (!parsed) return null;
        const { tag, attrs, content } = parsed;
        const props: Record<string, string> = { key: `int-${i}-${item.tipo}`, ...attrs };
        if (content != null && content !== "") {
          return React.createElement(tag, props, content);
        }
        return React.createElement(tag, props);
      })}
    </>
  );
}
