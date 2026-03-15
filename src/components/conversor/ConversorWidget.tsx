"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getConversorConfig,
  postConversorLead,
  type ConversorConfig,
  type ConversorPergunta,
} from "@/lib/conversor-api";

// Avatar de atendente (Ana) – import estático para build
import avatarImg from "@/assets/avatar.png";

const avatarSrc = typeof avatarImg === "string" ? avatarImg : avatarImg.src;

const ATENDENTE_NOME = "Ana";

interface ConversorWidgetProps {
  blogExternalId: string | undefined;
}

export function ConversorWidget({ blogExternalId }: ConversorWidgetProps) {
  const [config, setConfig] = useState<ConversorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [respostas, setRespostas] = useState<string[]>([]);
  const [currentValue, setCurrentValue] = useState("");
  const [sending, setSending] = useState(false);
  const [finalMessage, setFinalMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const perguntasOrdenadas: ConversorPergunta[] = config?.perguntas
    ? [...config.perguntas].sort((a, b) => a.ordem - b.ordem)
    : [];
  const currentPergunta = perguntasOrdenadas[step];
  const isLastStep = step === perguntasOrdenadas.length - 1;

  useEffect(() => {
    if (!blogExternalId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    getConversorConfig(blogExternalId).then((data) => {
      if (!cancelled) {
        setConfig(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [blogExternalId]);

  const handleNext = useCallback(() => {
    const value = currentValue.trim();
    if (!value) return;
    const nextRespostas = [...respostas, value];
    setRespostas(nextRespostas);
    setCurrentValue("");
    if (isLastStep) {
      submitLead(nextRespostas);
    } else {
      setStep((s) => s + 1);
    }
  }, [currentValue, respostas, isLastStep]);

  const submitLead = async (todasRespostas: string[]) => {
    if (!config || !blogExternalId) return;
    setSending(true);
    setError(null);
    const nomeCompleto =
      todasRespostas[perguntasOrdenadas.findIndex((p) => p.tipoCampo === 0)] ?? "";
    const telefone =
      todasRespostas[perguntasOrdenadas.findIndex((p) => p.tipoCampo === 1)] ?? "";
    const ok = await postConversorLead({
      blogExternalId,
      nomeCompleto,
      telefone,
      respostas: todasRespostas,
    });
    setSending(false);
    if (!ok) {
      setError("Não foi possível enviar no momento. Tente novamente.");
      return;
    }
    if (config.tipoFinalizacao === 0 && config.mensagemFinalizacao) {
      setFinalMessage(config.mensagemFinalizacao);
    } else if (config.tipoFinalizacao === 1 && config.whatsAppNumero) {
      const base = `https://wa.me/${config.whatsAppNumero.replace(/\D/g, "")}`;
      const text = config.whatsAppTextoPreDefinido
        ? `?text=${encodeURIComponent(config.whatsAppTextoPreDefinido)}`
        : "";
      window.location.href = `${base}${text}`;
    } else {
      setFinalMessage("Obrigado! Entraremos em contato.");
    }
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setStep(0);
    setRespostas([]);
    setCurrentValue("");
    setFinalMessage(null);
    setError(null);
  }, []);

  if (loading || !config) return null;

  const inputType =
    currentPergunta?.tipoCampo === 1
      ? "tel"
      : currentPergunta?.tipoCampo === 2
        ? "email"
        : "text";

  return (
    <>
      {/* Botão flutuante - avatar Ana */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-1 rounded-full focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={config.textoBotaoInicial}
      >
        <span className="relative flex h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg sm:h-16 sm:w-16">
          <img
            src={avatarSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        </span>
        <span className="rounded-full bg-[var(--green)] px-2 py-0.5 text-xs font-medium text-white">
          {ATENDENTE_NOME}
        </span>
      </button>

      {/* Painel lateral direito */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/20 sm:bg-transparent"
          role="dialog"
          aria-label="Chat de atendimento"
          onClick={handleClose}
        >
          <div
            className="flex h-full max-h-[80vh] w-full max-w-md flex-col bg-white shadow-xl sm:rounded-l-xl sm:border-l sm:border-t sm:border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho - minimizar */}
            <div className="flex items-center justify-between border-b border-[var(--border)] p-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-9 w-9 overflow-hidden rounded-full">
                  <img
                    src={avatarSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="font-medium text-[var(--text)]">
                  {ATENDENTE_NOME}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded p-1 text-[var(--muted)] hover:bg-[var(--page)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:outline-none"
                aria-label="Minimizar"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conteúdo */}
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {error && (
                <p className="mb-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">
                  {error}
                </p>
              )}
              {finalMessage ? (
                <p className="text-[var(--soft-text)] leading-relaxed">
                  {finalMessage}
                </p>
              ) : (
                <>
                  <p className="mb-4 text-sm font-medium text-[var(--text)]">
                    {currentPergunta?.textoPergunta}
                  </p>
                  <input
                    type={inputType}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNext()}
                    placeholder={
                      currentPergunta?.tipoCampo === 1
                        ? "(00) 00000-0000"
                        : currentPergunta?.tipoCampo === 2
                          ? "seu@email.com"
                          : "Digite aqui..."
                    }
                    className="rounded-lg border border-[var(--border)] px-3 py-2 text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--green)] focus:outline-none focus:ring-1 focus:ring-[var(--green)]"
                    disabled={sending}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!currentValue.trim() || sending}
                    className="mt-4 rounded-lg bg-[var(--green)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--green-dark)] disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {sending
                      ? "Enviando..."
                      : isLastStep
                        ? "Enviar"
                        : "Próximo"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
