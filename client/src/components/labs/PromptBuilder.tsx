import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

const FIELDS = [
  { key: "role", label: "Role", ph: "You are a friendly maths tutor for Class 10 students.", tip: "Give the model a role to set expertise and tone." },
  { key: "task", label: "Task", ph: "Explain how to solve quadratic equations step by step.", tip: "State exactly what you want done." },
  { key: "context", label: "Context", ph: "The student knows basic algebra but finds factorisation hard.", tip: "Add background the model can't guess." },
  { key: "format", label: "Output format", ph: "Numbered steps, then one worked example and a 3-question quiz.", tip: "Say how the answer should look." },
  { key: "limits", label: "Constraints", ph: "Keep it under 200 words. Use simple English. Don't skip steps.", tip: "Set length, style and guardrails." },
] as const;
type Key = (typeof FIELDS)[number]["key"];

export default function PromptBuilder() {
  const [v, setV] = useState<Record<Key, string>>({ role: "", task: "", context: "", format: "", limits: "" });
  const [copied, setCopied] = useState(false);
  const filled = FIELDS.filter((f) => v[f.key].trim().length > 3).length;
  const prompt = useMemo(() => FIELDS.filter((f) => v[f.key].trim()).map((f) => `${f.label.toUpperCase()}: ${v[f.key].trim()}`).join("\n\n"), [v]);
  const label = ["Empty", "Vague", "Basic", "Good", "Strong", "Excellent"][filled];

  const copy = async () => {
    if (!prompt) return;
    try { await navigator.clipboard.writeText(prompt); setCopied(true); toast.success("Prompt copied"); setTimeout(() => setCopied(false), 1600); }
    catch { toast.error("Couldn't copy — select the text manually."); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2" data-testid="prompt-builder">
      <div className="glass card grid gap-5 !p-5 sm:!p-7">
        {FIELDS.map((f) => (
          <label key={f.key} className="field"><span className="flex justify-between"><span>{f.label}</span>{v[f.key].trim().length > 3 && <Check size={14} className="text-lime" />}</span>
            <textarea rows={2} value={v[f.key]} placeholder={f.ph} onChange={(e) => setV({ ...v, [f.key]: e.target.value })} aria-label={f.label} style={{ minHeight: 64 }} />
            <small className="text-[12px] normal-case tracking-normal text-white/55">{f.tip}</small>
          </label>
        ))}
      </div>
      <div className="grid content-start gap-5">
        <div className="glass card !p-5 sm:!p-7">
          <div className="flex items-end justify-between"><span className="mono text-[11px] uppercase tracking-[.14em] text-white/50">Prompt strength</span><span className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-lime" data-testid="prompt-strength">{label}</span></div>
          <div className="mt-4 grid grid-cols-5 gap-2">{FIELDS.map((f, i) => <div key={f.key} className={`h-2 rounded-full transition-all ${i < filled ? "bg-lime shadow-[0_0_10px_#d8fa32]" : "bg-white/10"}`} />)}</div>
          <p className="mt-4 text-sm text-white/55">{filled === 5 ? "All five building blocks are covered — this prompt is specific and easy to evaluate." : `Add ${5 - filled} more block${5 - filled === 1 ? "" : "s"} for a more reliable result.`}</p>
        </div>
        <div className="glass card !p-5 sm:!p-7">
          <div className="mb-3 flex items-center justify-between"><span className="mono text-[11px] uppercase tracking-[.14em] text-white/50">Assembled prompt</span><button className="btn btn-ghost btn-sm" onClick={copy} disabled={!prompt}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button></div>
          <pre className="mono min-h-[140px] whitespace-pre-wrap break-words text-[13px] leading-relaxed text-white/80">{prompt || "Fill in the blocks on the left and your prompt appears here."}</pre>
        </div>
      </div>
    </div>
  );
}
