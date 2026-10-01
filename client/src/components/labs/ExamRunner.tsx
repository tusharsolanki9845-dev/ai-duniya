import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Award, CheckCircle2, Clock3, RotateCcw, Timer, Trophy, XCircle } from "lucide-react";
import { EXAMS, type ExamTrack } from "@/lib/site";
import { safeStore, useGoTo } from "@/lib/nav";
import TiltCard from "../fx/TiltCard";

const SECONDS = 30;
const bestKey = (id: string) => `aiduniya:best:${id}`;
const tier = (pct: number) => (pct >= 80 ? { name: "Distinction", note: "Excellent — you're ready for the full examination." } : pct >= 60 ? { name: "Proficient", note: "Solid foundation. A little more practice and you'll be exam-ready." } : { name: "Keep building", note: "Good start — review the explanations below and try again." });

export default function ExamRunner() {
  const [track, setTrack] = useState<ExamTrack | null>(null);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null); // -1 = timed out
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [left, setLeft] = useState(SECONDS);
  const [done, setDone] = useState(false);
  const [best, setBest] = useState<Record<string, number>>({});
  const go = useGoTo();
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const b: Record<string, number> = {};
    EXAMS.forEach((e) => { const v = safeStore.get(bestKey(e.id)); if (v !== null && !isNaN(+v)) b[e.id] = +v; });
    setBest(b);
  }, []);

  const q = track?.questions[i];
  const score = track ? answers.reduce<number>((s, a, k) => s + (a === track.questions[k].answer ? 1 : 0), 0) : 0;

  const start = (t: ExamTrack) => { setTrack(t); setI(0); setPicked(null); setAnswers([]); setLeft(SECONDS); setDone(false); setTimeout(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50); };
  const choose = useCallback((idx: number) => { if (picked !== null) return; setPicked(idx); setAnswers((a) => [...a, idx === -1 ? null : idx]); }, [picked]);
  const next = useCallback(() => {
    if (!track || picked === null) return;
    if (i + 1 >= track.questions.length) {
      const finalScore = answers.reduce<number>((s, a, k) => s + (a === track.questions[k].answer ? 1 : 0), 0);
      if (finalScore > (best[track.id] ?? -1)) { safeStore.set(bestKey(track.id), String(finalScore)); setBest((b) => ({ ...b, [track.id]: finalScore })); }
      setDone(true);
    } else { setI(i + 1); setPicked(null); setLeft(SECONDS); }
  }, [track, picked, i, answers, best]);

  useEffect(() => {
    if (!track || done || picked !== null) return;
    if (left <= 0) { choose(-1); return; }
    const t = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(t);
  }, [track, done, picked, left, choose]);

  useEffect(() => {
    if (!track || done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      if (/^[1-4]$/.test(e.key)) choose(+e.key - 1);
      else if ((e.key === "Enter" || e.key === "ArrowRight") && picked !== null) { e.preventDefault(); next(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [track, done, picked, choose, next]);

  /* ---------------- track picker ---------------- */
  if (!track) {
    return (
      <div className="grid gap-5 md:grid-cols-3" data-testid="exam-picker">
        {EXAMS.map((t, idx) => (
          <TiltCard key={t.id} className="glass card flex flex-col">
            <div className="flex items-center justify-between"><span className="mono text-[11px] tracking-[.14em] text-lime">0{idx + 1}</span><Award size={24} className="text-lime" /></div>
            <h3 className="mt-6 text-3xl tracking-tight">{t.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/65">{t.detail}</p>
            <div className="mono mt-5 grid gap-2 text-[11px] uppercase tracking-[.1em] text-white/55">
              <span className="inline-flex items-center gap-2"><Clock3 size={14} /> Full exam · {t.duration}</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} className="text-lime" /> Certificate included</span>
            </div>
            <div className="mt-6 flex flex-1 items-end justify-between gap-3 border-t border-white/10 pt-5">
              <span className="mono text-[11px] uppercase tracking-[.1em] text-white/60">{best[t.id] !== undefined ? <>Best · <b className="text-lime">{best[t.id]}/{t.questions.length}</b></> : "5-Q practice"}</span>
              <button className="btn btn-lime btn-sm" onClick={() => start(t)} aria-label={`Start ${t.title} practice round`}>Practice <ArrowRight size={14} /></button>
            </div>
          </TiltCard>
        ))}
      </div>
    );
  }

  /* ---------------- results ---------------- */
  if (done) {
    const pct = Math.round((score / track.questions.length) * 100);
    const t = tier(pct);
    return (
      <div ref={topRef} className="glass card !p-6 sm:!p-10" data-testid="exam-result">
        <div className="grid items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="relative grid h-40 w-40 place-items-center justify-self-center">
            <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(243,240,233,.1)" strokeWidth="8" /><motion.circle cx="60" cy="60" r="52" fill="none" stroke="#d8fa32" strokeWidth="8" strokeLinecap="round" strokeDasharray={2 * Math.PI * 52} initial={{ strokeDashoffset: 2 * Math.PI * 52 }} animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - pct / 100) }} transition={{ duration: 1.2, ease: "easeOut" }} style={{ filter: "drop-shadow(0 0 8px #d8fa32)" }} /></svg>
            <div className="text-center"><div className="font-[family-name:var(--font-display)] text-5xl tracking-tight" data-testid="exam-score">{score}/{track.questions.length}</div><div className="mono text-[11px] text-white/50">{pct}%</div></div>
          </div>
          <div>
            <div className="mono flex items-center gap-2 text-[11px] uppercase tracking-[.16em] text-lime"><Trophy size={14} /> {track.title} · practice result</div>
            <h3 className="mt-3 text-4xl tracking-tight sm:text-5xl">{t.name}</h3>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-white/70">{t.note}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="btn btn-lime" onClick={() => start(track)}><RotateCcw size={15} /> Retake</button>
              <button className="btn btn-ghost" onClick={() => setTrack(null)}>Choose another track</button>
              <button className="btn btn-ghost" onClick={() => go(`/contact?topic=exam&track=${track.id}`)}>Register for the full exam <ArrowRight size={15} /></button>
            </div>
            <p className="mono mt-4 text-[10.5px] uppercase tracking-[.1em] text-white/35">Practice rounds are for learning — certificates are awarded for the full examination.</p>
          </div>
        </div>
        <div className="mt-10 grid gap-3 border-t border-white/10 pt-8">
          <h4 className="mono text-[11px] uppercase tracking-[.16em] text-white/50">Review</h4>
          {track.questions.map((qq, k) => {
            const ok = answers[k] === qq.answer;
            return (
              <div key={k} className="rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5">
                <div className="flex gap-3"><span className="mt-0.5 shrink-0">{ok ? <CheckCircle2 size={19} className="text-lime" /> : <XCircle size={19} className="text-[#ff7b7b]" />}</span>
                  <div><div className="text-[15px] font-medium">{qq.q}</div>
                    <div className="mt-1 text-sm text-white/60">Answer: <span className="text-white/85">{qq.options[qq.answer]}</span>{!ok && <> · You: <span className="text-[#ff9a9a]">{answers[k] === null || answers[k] === undefined ? "Timed out" : qq.options[answers[k] as number]}</span></>}</div>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">{qq.why}</p></div></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------- question ---------------- */
  const C = 2 * Math.PI * 20;
  return (
    <div ref={topRef} className="glass card !p-6 sm:!p-10" data-testid="exam-question">
      <div className="flex items-center justify-between gap-4">
        <div className="mono text-[11px] uppercase tracking-[.14em] text-white/55"><span className="text-lime">{track.title}</span> · Question {i + 1}/{track.questions.length}</div>
        <div className={`relative grid h-14 w-14 place-items-center ${left <= 8 && picked === null ? "text-[#ff8a8a]" : "text-lime"}`} role="timer" aria-label={`${left} seconds left`}>
          <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90"><circle cx="24" cy="24" r="20" fill="none" stroke="rgba(243,240,233,.1)" strokeWidth="3" /><circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - left / SECONDS)} style={{ transition: "stroke-dashoffset 1s linear" }} /></svg>
          <span className="mono text-sm" data-testid="exam-timer">{left}</span>
        </div>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime transition-all duration-500" style={{ width: `${((i + (picked !== null ? 1 : 0)) / track.questions.length) * 100}%` }} /></div>

      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>
          <h3 className="mt-8 text-2xl leading-snug tracking-tight sm:text-3xl">{q!.q}</h3>
          <div className="mt-7 grid gap-3" role="radiogroup" aria-label="Answer options">
            {q!.options.map((o, k) => {
              const reveal = picked !== null;
              const correct = k === q!.answer, mine = picked === k;
              const cls = !reveal ? "border-white/12 bg-white/[.03] hover:border-lime hover:bg-lime/[.06]" : correct ? "border-lime bg-lime/15" : mine ? "border-[#ff7b7b] bg-[#ff7b7b]/12" : "border-white/8 bg-white/[.02] opacity-55";
              return (
                <button key={k} role="radio" aria-checked={mine} disabled={reveal} onClick={() => choose(k)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left text-[15px] transition sm:p-5 ${cls}`}>
                  <span className="mono grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-white/20 text-xs">{k + 1}</span>
                  <span className="flex-1">{o}</span>
                  {reveal && correct && <CheckCircle2 size={20} className="text-lime" />}{reveal && mine && !correct && <XCircle size={20} className="text-[#ff7b7b]" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {picked !== null && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 rounded-2xl border border-white/10 bg-white/[.035] p-5" role="status">
            <div className="mono mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[.14em]">{picked === -1 ? <><Timer size={14} className="text-[#ffb547]" /> Time's up</> : picked === q!.answer ? <><CheckCircle2 size={14} className="text-lime" /> Correct</> : <><XCircle size={14} className="text-[#ff7b7b]" /> Not quite</>}</div>
            <p className="text-sm leading-relaxed text-white/70">{q!.why}</p>
            <button className="btn btn-lime mt-5" onClick={next} data-testid="exam-next">{i + 1 >= track.questions.length ? "See results" : "Next question"} <ArrowRight size={15} /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-6 flex items-center justify-between"><button className="mono text-[11px] uppercase tracking-[.12em] text-white/60 transition hover:text-lime" onClick={() => setTrack(null)}>← Exit practice</button><span className="mono hidden text-[10.5px] uppercase tracking-[.1em] text-white/50 sm:block">Keys 1–4 answer · Enter next</span></div>
    </div>
  );
}
