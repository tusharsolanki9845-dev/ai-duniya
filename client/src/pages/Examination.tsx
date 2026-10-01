import { ArrowRight, BadgeCheck, ListChecks, Timer } from "lucide-react";
import { NavAnchor, PageHero } from "@/components/Chrome";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import ExamRunner from "@/components/labs/ExamRunner";

const STEPS = [
  { icon: ListChecks, t: "Practise", d: "Try a free 5-question round in any track to see where you stand." },
  { icon: Timer, t: "Register", d: "Tell us your level and we'll recommend the right full examination." },
  { icon: BadgeCheck, t: "Get certified", d: "Full examinations include a certificate that shows what you can actually do." },
];

export default function Examination() {
  return (
    <>
      <PageHero eyebrow="04 / Examination" title={<>Know what<br /><em>you can do.</em></>}>AI DUNIYA examinations turn learning into a clear signal of practical ability — not just a score on a page.</PageHero>

      <section id="practice" className="section pt-2">
        <div className="wrap">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><div className="eyebrow">Assessment tracks</div><h2 className="h-sec mt-6">Proof of<br /><em>progress.</em></h2></div><p className="lede max-w-sm">Choose the level that matches your journey. Start with a timed practice round — 5 questions, 30 seconds each, instant explanations.</p></Reveal>
          <Reveal><ExamRunner /></Reveal>
        </div>
      </section>

      <section className="section panel-bg">
        <div className="wrap">
          <Reveal className="mb-12"><div className="eyebrow">How it works</div><h2 className="h-sec mt-6">Three steps to <em>proof.</em></h2></Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.1}><TiltCard className="glass card h-full"><div className="flex justify-between"><span className="mono text-xs text-lime">0{i + 1}</span><Icon size={26} className="text-lime" /></div><h3 className="mt-10 text-3xl tracking-tight">{t}</h3><p className="mt-3 text-[15px] leading-relaxed text-white/60">{d}</p></TiltCard></Reveal>
            ))}
          </div>
          <Reveal className="mt-14"><div className="glass card flex flex-wrap items-center justify-between gap-6 !border-lime/30 !p-8 sm:!p-10"><div><h3 className="text-3xl tracking-tight">Ready to test your next level?</h3><p className="mt-2 text-white/60">Tell us where you are starting from and we&apos;ll recommend the right track.</p></div><NavAnchor href="/contact?topic=exam" className="btn btn-lime">Register interest <ArrowRight size={16} /></NavAnchor></div></Reveal>
        </div>
      </section>
    </>
  );
}
