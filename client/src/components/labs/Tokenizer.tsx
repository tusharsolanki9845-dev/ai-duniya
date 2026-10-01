import { useMemo, useState } from "react";

const SUFFIXES = ["ization", "isation", "ation", "tion", "ment", "ness", "able", "ing", "ers", "er", "ed", "ly", "es", "s"];

/** Illustrative sub-word splitter (real tokenizers such as BPE learn their vocabulary from data). */
export function tokenize(text: string): string[] {
  const parts = text.match(/\s+|[A-Za-z]+|\d+|[^\sA-Za-z\d]/g) ?? [];
  const out: string[] = [];
  for (const p of parts) {
    if (/^[A-Za-z]+$/.test(p) && p.length > 5) {
      const suffix = SUFFIXES.find((s) => p.toLowerCase().endsWith(s) && p.length - s.length >= 3);
      let stem = suffix ? p.slice(0, p.length - suffix.length) : p;
      const pieces: string[] = [];
      while (stem.length > 8) { pieces.push(stem.slice(0, 5)); stem = stem.slice(5); }
      pieces.push(stem);
      if (suffix) pieces.push(p.slice(p.length - suffix.length));
      out.push(...pieces);
    } else out.push(p);
  }
  return out;
}

const COLORS = ["rgba(216,250,50,.2)", "rgba(94,240,255,.2)", "rgba(164,149,255,.24)", "rgba(255,181,71,.2)"];

export default function Tokenizer() {
  const [text, setText] = useState("AI DUNIYA teaches understanding, not just tools. Tokenization turns 2026 sentences into pieces!");
  const tokens = useMemo(() => tokenize(text), [text]);
  const visible = tokens.filter((t) => !/^\s+$/.test(t));
  const words = (text.match(/[A-Za-z0-9']+/g) ?? []).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]" data-testid="tokenizer">
      <div className="glass card !p-5 sm:!p-7">
        <label className="field"><span>Type or paste text</span><textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} maxLength={600} aria-label="Text to tokenize" /></label>
        <div className="mono mb-3 mt-7 text-[11px] uppercase tracking-[.14em] text-white/50">Tokens</div>
        <div className="flex min-h-[80px] flex-wrap gap-1.5" aria-live="polite">
          {visible.length === 0 && <span className="text-white/35">Start typing…</span>}
          {visible.map((t, i) => (
            <span key={i} className="mono rounded-md border border-white/10 px-2 py-1 text-[13px]" style={{ background: COLORS[i % COLORS.length] }}>{t}</span>
          ))}
        </div>
        <p className="mono mt-5 text-[11px] leading-relaxed text-white/55">Illustrative split: words are broken at common endings and long stems are chunked. Real LLM tokenizers (BPE) learn their splits from data, so counts will differ.</p>
      </div>
      <div className="grid content-start gap-4">
        {[{ k: "Characters", v: text.length }, { k: "Words", v: words }, { k: "Tokens (demo)", v: visible.length }].map((s) => (
          <div key={s.k} className="glass card flex items-end justify-between !p-5"><span className="mono text-[11px] uppercase tracking-[.12em] text-white/55">{s.k}</span><span className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-lime" data-testid={`tok-${s.k.split(" ")[0].toLowerCase()}`}>{s.v}</span></div>
        ))}
        <div className="glass card !p-5 text-sm leading-relaxed text-white/60">Models read tokens, not letters. Context windows, speed and cost are all measured in tokens — which is why concise prompts matter.</div>
      </div>
    </div>
  );
}
