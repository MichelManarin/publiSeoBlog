"use client";

import dynamic from "next/dynamic";

const ConversorWidget = dynamic(
  () =>
    import("@/components/conversor/ConversorWidget").then((m) => m.ConversorWidget),
  { ssr: false }
);

interface ConversorWidgetLoaderProps {
  blogExternalId: string | undefined;
}

export function ConversorWidgetLoader({ blogExternalId }: ConversorWidgetLoaderProps) {
  return <ConversorWidget blogExternalId={blogExternalId} />;
}
