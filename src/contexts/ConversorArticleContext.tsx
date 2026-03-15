"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const ConversorArticleContext = createContext<{
  articleId: string | null;
  setArticleId: (id: string | null) => void;
}>({ articleId: null, setArticleId: () => {} });

export function ConversorArticleProvider({ children }: { children: ReactNode }) {
  const [articleId, setArticleId] = useState<string | null>(null);
  return (
    <ConversorArticleContext.Provider value={{ articleId, setArticleId }}>
      {children}
    </ConversorArticleContext.Provider>
  );
}

export function useConversorArticleId() {
  return useContext(ConversorArticleContext).articleId;
}

/** Define o ID do artigo atual para o conversor (lead). Usar na página do artigo. */
export function useSetConversorArticleId() {
  return useContext(ConversorArticleContext).setArticleId;
}
