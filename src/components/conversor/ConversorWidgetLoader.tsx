"use client";

import dynamic from "next/dynamic";
import { useConversorArticleId } from "@/contexts/ConversorArticleContext";

const ConversorWidget = dynamic(
  () =>
    import("@/components/conversor/ConversorWidget").then((m) => m.ConversorWidget),
  { ssr: false }
);

interface ConversorWidgetLoaderProps {
  blogExternalId: string | undefined;
}

export function ConversorWidgetLoader({ blogExternalId }: ConversorWidgetLoaderProps) {
  const articleId = useConversorArticleId();
  return (
    <ConversorWidget blogExternalId={blogExternalId} articleId={articleId} />
  );
}
