import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Send, Sparkles, X } from "lucide-react";
import { guideAnswer, type GuideReply } from "@/lib/site";
import { useGoTo } from "@/lib/nav";

type Msg = { id: number; from: "bot" | "me"; reply?: GuideReply; text?: string };

/** Rule-based site guide. Honest about being simple: no external AI service is called. */
export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: "bot", reply: guideAnswer("hello") }]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);
  const go = useGoTo();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("open-assistant", onOpen);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("open-assistant", onOpen); window.removeEventListener("keydown", onKey); };
  }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [msgs, typing, open]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 250); }, [open]);

  const send = (text: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setInput("");
    setMsgs((m) => [...m, { id: idRef.current++, from: "me", text: q }]);
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: idRef.current++, from: "bot", reply: guideAnswer(q) }]);
      setTyping(false);
    }, 550);
  };

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)} aria-label="Open the AI DUNIYA site guide"
            className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-lime text-[#0b0d0c] shadow-[0_0_0_0_rgba(216,250,50,.5),0_10px_40px_rgba(216,250,50,.35)] transition hover:scale-105"
          >
            <span className="pulse-ring" /><Sparkles size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog" aria-label="AI DUNIYA site guide"
            initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="glass fixed inset-x-3 bottom-3 z-50 flex max-h-[min(640px,calc(100dvh-24px))] flex-col overflow-hidden rounded-3xl bg-[#080b0a]/95 shadow-[0_30px_90px_rgba(0,0,0,.6)] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[390px]"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-[#0b0d0c]"><Sparkles size={17} /></span>
                <div><div className="text-[15px] font-semibold leading-none">Site guide</div><div className="mono mt-1.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[.12em] text-white/60"><span className="h-1.5 w-1.5 rounded-full bg-lime" /> Instant answers · not a chatbot AI</div></div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close guide" className="grid h-9 w-9 place-items-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"><X size={18} /></button>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
              {msgs.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={m.from === "me" ? "flex justify-end" : "flex"}>
                  {m.from === "me" ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-md bg-lime px-4 py-2.5 text-[14px] font-medium text-[#0b0d0c]">{m.text}</div>
                  ) : (
                    <div className="max-w-[92%] space-y-3">
                      <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[.045] px-4 py-3 text-[14px] leading-relaxed text-white/85">{m.reply?.text}</div>
                      {m.reply?.links && (
                        <div className="flex flex-wrap gap-2">
                          {m.reply.links.map((l) => (
                            <button key={l.href} className="chip" onClick={() => { setOpen(false); go(l.href); }}>{l.label}<ArrowUpRight size={13} /></button>
                          ))}
                        </div>
                      )}
                      {m.reply?.chips && (
                        <div className="flex flex-wrap gap-2">{m.reply.chips.map((c) => <button key={c} className="chip" onClick={() => send(c)}>{c}</button>)}</div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex w-16 items-center justify-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[.045] py-3.5" aria-label="Guide is typing">
                  {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-lime" style={{ animation: `typing-dot 1s ${i * 0.15}s infinite` }} />)}
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border-t border-white/10 p-3">
              <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about courses, exams, labs…" aria-label="Your question" className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/[.04] px-5 py-3 text-[14px] text-white placeholder:text-white/35 focus:border-lime focus:outline-none" />
              <button type="submit" aria-label="Send" disabled={!input.trim() || typing} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-[#0b0d0c] transition disabled:opacity-40"><Send size={17} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
