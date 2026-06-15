"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useIdioma } from "@/lib/i18n/IdiomaContext";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const MENSAJE_ELECCION: Message = {
  role: "assistant",
  content: "Hola, ¿en qué idioma prefieres que te acompañe?\n\nRimaykullayki, ¿ima simipi rimanayki munawanki?\n\nEspañol  ·  Quechua",
};

export default function ChatBot() {
  const { t } = useIdioma();
  const [open, setOpen] = useState(false);
  const [chatIdioma, setChatIdioma] = useState<"es" | "qu" | null>(null);
  const [messages, setMessages] = useState<Message[]>([MENSAJE_ELECCION]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open && chatIdioma !== null) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, chatIdioma]);

  function seleccionarIdioma(lang: "es" | "qu") {
    setChatIdioma(lang);
    const bienvenida: Message = lang === "es"
      ? { role: "assistant", content: t.chatBienvenida }
      : { role: "assistant", content: "Allinllachu kashanki. Imaynallataq yanapasunki atini? Tapukuyniykikunata nin — kaypim kachkani." };
    setMessages((prev) => [...prev, bienvenida]);
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, chatIdioma }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? (chatIdioma === "qu" ? "Mana atinimi. Kutimuytaq." : "No pude procesar tu mensaje.") },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: chatIdioma === "qu"
            ? "Conexión pantam. Kutimuytaq."
            : "Hubo un error al conectar. Por favor intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
          style={{ width: 380, height: 540 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a56db]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">{t.chatNombreAsistente}</p>
                <p className="text-xs text-blue-200 leading-tight">{t.chatEnLinea}</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Cerrar chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-gray-50 dark:bg-slate-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-snug whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-[#1a56db] text-white rounded-br-sm"
                      : "bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-600 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area — language picker o input normal */}
          {chatIdioma === null ? (
            <div className="flex gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={() => seleccionarIdioma("es")}
                className="flex-1 py-2 rounded-full border border-[#1a56db] text-[#1a56db] text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
              >
                Español
              </button>
              <button
                onClick={() => seleccionarIdioma("qu")}
                className="flex-1 py-2 rounded-full border border-[#1a56db] text-[#1a56db] text-sm font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
              >
                Quechua
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.chatPlaceholder}
                disabled={loading}
                className="flex-1 text-sm bg-gray-100 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-full px-4 py-2 outline-none placeholder:text-gray-400 disabled:opacity-60"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-[#1a56db] flex items-center justify-center text-white disabled:opacity-40 hover:bg-[#1648c4] transition-colors flex-shrink-0"
                aria-label="Enviar"
              >
                <Send size={15} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botón flotante */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full bg-[#1a56db] hover:bg-[#1648c4] text-white shadow-lg flex items-center justify-center transition-all active:scale-95"
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
