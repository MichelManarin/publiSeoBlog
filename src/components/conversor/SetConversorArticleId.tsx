"use client";

import { useEffect } from "react";
import { useSetConversorArticleId } from "@/contexts/ConversorArticleContext";

export function SetConversorArticleId({ articleId }: { articleId: string }) {
  const setArticleId = useSetConversorArticleId();
  useEffect(() => {
    setArticleId(articleId);
    return () => setArticleId(null);
  }, [articleId, setArticleId]);
  return null;
}
