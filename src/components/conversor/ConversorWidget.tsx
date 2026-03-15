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
  const [showWhatsAppChoice, setShowWhatsAppChoice] = useState(false);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
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
      setShowWhatsAppChoice(true);
    } else {
      setFinalMessage("Obrigado! Entraremos em contato.");
    }
  };

  const openWhatsApp = useCallback(() => {
    if (!config?.whatsAppNumero) return;
    const base = `https://wa.me/${config.whatsAppNumero.replace(/\D/g, "")}`;
    const text = config.whatsAppTextoPreDefinido
      ? `?text=${encodeURIComponent(config.whatsAppTextoPreDefinido)}`
      : "";
    window.open(`${base}${text}`, "_blank", "noopener,noreferrer");
    setShowWhatsAppChoice(false);
    setFinalMessage("Pronto! Verifique a nova guia do WhatsApp.");
  }, [config]);

  const chooseContactLater = useCallback(() => {
    setShowWhatsAppChoice(false);
    setFinalMessage("Certo! Entraremos em contato em breve.");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setStep(0);
    setRespostas([]);
    setCurrentValue("");
    setFinalMessage(null);
    setShowWhatsAppChoice(false);
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
      {/* Widget flutuante: mensagem à esquerda (com X) + avatar à direita */}
      <div className="fixed bottom-6 right-6 z-40 flex items-end gap-0">
        {!bubbleDismissed && (
          <span
            className="conversor-bubble order-1 relative max-w-[260px] rounded-2xl bg-white px-4 py-3 pr-8 text-left text-sm leading-relaxed text-[var(--text)] shadow-lg ring-1 ring-[var(--border)] sm:max-w-[280px]"
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
            aria-label={config.textoBotaoInicial}
          >
            {config.textoBotaoInicial}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setBubbleDismissed(true);
              }}
              className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-[var(--muted)] hover:bg-[var(--page)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:outline-none"
              aria-label="Fechar mensagem"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative order-2 flex shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:ring-offset-2 focus-visible:outline-none sm:ml-1"
          aria-label={config.textoBotaoInicial}
        >
          <span className="relative flex h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg sm:h-16 sm:w-16">
            <img
              src={avatarSrc}
              alt=""
              className="h-full w-full object-cover"
            />
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[var(--green)]"
              aria-hidden
            />
          </span>
        </button>
      </div>

      {/* Caixa de chat pequena - flutuante no canto */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-4 pb-24 sm:p-6 sm:pb-28"
          role="dialog"
          aria-label="Chat de atendimento"
          onClick={handleClose}
        >
          {/* Overlay suave */}
          <div className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" aria-hidden />

          <div
            className="conversor-chat-box relative flex h-[420px] w-full max-w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all duration-200 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div
              className="flex shrink-0 items-center gap-3 px-4 py-3 text-white"
              style={{ background: "var(--green)" }}
            >
              <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white/30">
                <img
                  src={avatarSrc}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{ATENDENTE_NOME}</p>
                <p className="text-xs text-white/85">Online agora</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                aria-label="Fechar"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Área de conversa */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-3">
                {error && (
                  <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                  </p>
                )}
                {showWhatsAppChoice ? (
                  <>
                    <div className="mb-3 flex gap-2">
                      <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                      </span>
                      <p className="rounded-2xl rounded-bl-md bg-[var(--page)] px-3 py-2 text-sm text-[var(--text)]">
                        Obrigado! Como prefere seguir?
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 pl-9">
                      <button
                        type="button"
                        onClick={openWhatsApp}
                        className="w-full rounded-xl bg-[var(--green)] px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-[var(--green-dark)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:outline-none"
                      >
                        Redirecionar para WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={chooseContactLater}
                        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2.5 text-center text-sm font-medium text-[var(--text)] hover:bg-[var(--page)] focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:outline-none"
                      >
                        Prefiro que entrem em contato
                      </button>
                    </div>
                  </>
                ) : finalMessage ? (
                  <div className="flex gap-2">
                    <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full">
                      <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                    </span>
                    <p className="rounded-2xl rounded-bl-md bg-[var(--page)] px-3 py-2 text-sm text-[var(--text)]">
                      {finalMessage}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Mensagem inicial (Ana) */}
                    <div className="mb-3 flex gap-2">
                      <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                      </span>
                      <p className="rounded-2xl rounded-bl-md bg-[var(--page)] px-3 py-2 text-sm text-[var(--text)]">
                        {config.textoBotaoInicial}
                      </p>
                    </div>
                    {/* Respostas já dadas (usuário) */}
                    {respostas.map((r, i) => (
                      <div key={i} className="mb-2 flex justify-end">
                        <span className="rounded-2xl rounded-br-md bg-[var(--green)] px-3 py-2 text-sm text-white">
                          {r}
                        </span>
                      </div>
                    ))}
                    {/* Pergunta atual (Ana) */}
                    <div className="mb-3 flex gap-2">
                      <span className="flex h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                      </span>
                      <p className="rounded-2xl rounded-bl-md bg-[var(--page)] px-3 py-2 text-sm font-medium text-[var(--text)]">
                        {currentPergunta?.textoPergunta}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Input fixo no rodapé */}
              {!finalMessage && !showWhatsAppChoice && (
                <div className="shrink-0 border-t border-[var(--border)] p-3">
                  <div className="flex gap-2">
                    <input
                      type={inputType}
                      value={currentValue}
                      onChange={(e) => setCurrentValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNext()}
                      placeholder="Sua resposta..."
                      className="min-w-0 flex-1 rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--green)] focus:outline-none focus:ring-1 focus:ring-[var(--green)]"
                      disabled={sending}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!currentValue.trim() || sending}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white hover:bg-[var(--green-dark)] disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--green)] focus-visible:outline-none"
                      aria-label="Enviar"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9 2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
