import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";
import { COURSES } from "@/lib/site";
import { useGoTo } from "@/lib/nav";

const GOALS = [
  { id: "understand", label: "Understand AI", sub: "Make sense of the tools" },
  { id: "build", label: "Build products", sub: "Ship AI-powered apps" },
  { id: "lead", label: "Lead a team", sub: "Drive AI adoption" },
  { id: "robots", label: "Make robots", sub: "Code the physical world" },
] as const;
const LEVELS = [
  { id: "new", label: "New to tech" },
  { id: "some", label: "Some coding" },
  { id: "pro", label: "Comfortable coding" },
] as const;

function recommend(goal: string, level: string) {
  if (goal === "lead") return "ai-os";
  if (goal === "robots") return "robotics-101";
  if (goal === "understand") return level === "new" ? "ai-fluency" : "data-ml";
  return level === "new" ? "python-ai" : "build-genai";
}
const WHY: Record<string, string> = {
  "ai-fluency": "A jargon-free start that gives you confidence with modern AI tools.",
  "data-ml": "You already have some technical footing — go deeper into how models really learn.",
  "ai-os": "Built for leaders turning experiments into a plan the whole team can follow.",
  "robotics-101": "Learn by wiring and coding a machine that senses and moves.",
  "python-ai": "Solid Python and web foundations — the base every AI project stands on.",
  "build-genai": "You can code — so start shipping prototypes with models, agents and APIs.",
};

/** Two-question course recommender. */
export default function PathFinder() {
  const [goal, setGoal] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const go = useGoTo();
  const step = !goal ? 0 : goal && !level && goal !== "lead" && goal !== "robots" ? 1 : 2;
  const resultId = goal && (step === 2) ? recommend(goal, level ?? "some") : null;
  const course = COURSES.find((c) => c.id === resultId);
  const reset = () => { setGoal(null); setLevel(null); };

  return (
    <div className="glass card mx-auto max-w-4xl !p-0">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-9">
        <div className="mono flex items-center gap-3 text-[11px] uppercase tracking-[.14em] text-white/55">
          <span className="text-lime">●</span> Path finder
          <span className="text-white/30">/</span> {step === 2 ? "Result" : `Step ${step + 1} of ${goal === "lead" || goal === "robots" ? 1 : 2}`}
        </div>
        {goal && <button onClick={reset} className="mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[.12em] text-white/55 transition hover:text-lime"><RotateCcw size={13} /> Restart</button>}
      </div>
      <div className="min-h-[340px] p-6 sm:p-9">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="q1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
              <h3 className="text-3xl tracking-tight sm:text-4xl">What do you want to <em className="font-serif text-lime">do</em>?</h3>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {GOALS.map((g) => (
                  <button key={g.id} onClick={() => setGoal(g.id)} className="group rounded-2xl border border-white/12 bg-white/[.03] p-5 text-left transition hover:border-lime hover:bg-lime/[.06]">
                    <div className="flex items-center justify-between text-xl font-medium tracking-tight">{g.label}<ArrowRight size={18} className="text-lime opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" /></div>
                    <div className="mt-1 text-sm text-white/55">{g.sub}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {step === 1 && (
            <motion.div key="q2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
              <h3 className="text-3xl tracking-tight sm:text-4xl">How's your <em className="font-serif text-lime">coding</em>?</h3>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {LEVELS.map((l) => (
                  <button key={l.id} onClick={() => setLevel(l.id)} className="rounded-2xl border border-white/12 bg-white/[.03] p-5 text-left text-lg font-medium tracking-tight transition hover:border-lime hover:bg-lime/[.06]">{l.label}</button>
                ))}
              </div>
            </motion.div>
          )}
          {step === 2 && course && (
            <motion.div key="res" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} data-testid="path-result" className={`hue-${course.hue}`}>
              <div className="mono text-[11px] uppercase tracking-[.16em] hue-dot">Your best next step · {course.tag}</div>
              <h3 className="mt-3 text-4xl leading-[1.02] tracking-tight sm:text-5xl">{course.title}</h3>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/70">{WHY[course.id]}</p>
              <div className="mono mt-5 flex flex-wrap gap-3 text-[11px] uppercase tracking-[.1em] text-white/55"><span>{course.duration}</span><span>·</span><span>{course.format}</span><span>·</span><span>{course.level}</span></div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="btn btn-lime" onClick={() => go(`/courses?c=${course.id}`)}>See the syllabus <ArrowRight size={16} /></button>
                <button className="btn btn-ghost" onClick={() => go(`/contact?course=${course.id}`)}>Apply now</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
