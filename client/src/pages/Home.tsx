import { useState } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BrainCircuit, Check, Clock3, Code2, Cpu, Network, Play, Quote, Sparkles, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import NeuralCanvas from "@/components/fx/NeuralCanvas";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import CountUp from "@/components/fx/CountUp";
import Typewriter from "@/components/fx/Typewriter";
import PathFinder from "@/components/PathFinder";
import ContactForm from "@/components/ContactForm";
import RoverArt from "@/components/labs/RoverArt";
import { NavAnchor, openAssistant } from "@/components/Chrome";
import { COURSES, EXAMS, PRODUCTS, SITE } from "@/lib/site";
import { useGoTo } from "@/lib/nav";

const ICONS = { copilots: BrainCircuit, workflow: Network, labs: Code2 } as const;
const TICKER = ["Generative AI", "AI agents", "Robotics", "Python", "Data + ML", "Prompt design", "Computer vision", "Automation", "Responsible AI", "Build · Ship · Learn"];
const PHRASES = ["understand AI without the jargon.", "build agents that do real work.", "code robots that sense and move.", "lead your team through change."];

export default function Home() {
  const go = useGoTo();
  const [active, setActive] = useState(0);
  const [product, setProduct] = useState<(typeof PRODUCTS)[number] | null>(null);
  const featured = COURSES.slice(0, 3);
  const course = featured[active];

  return (
    <>
      {/* ------------------------------ HERO ------------------------------ */}
      <section id="home" className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-32">
        <NeuralCanvas />
        <div className="grid-bg" />
        <div className="aurora -left-40 top-10 h-[460px] w-[460px] bg-lime/30" />
        <div className="aurora -right-32 bottom-0 h-[420px] w-[420px] bg-violet-glow/25" />
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(6,8,10,.86),rgba(6,8,10,.2)_60%,transparent)]" aria-hidden="true" />
        <div className="scanline" aria-hidden="true" />

        <div className="wrap relative z-10">
          <div className="eyebrow">AI education · products · community</div>
          <h1 className="h-hero mt-8 max-w-[11ch]">Make the future <em>make sense.</em></h1>
          <p className="mono mt-8 min-h-[3.2em] max-w-xl text-[15px] leading-relaxed text-white/80 sm:text-base"><span className="text-lime">&gt;</span> We help you <Typewriter phrases={PHRASES} /></p>
          <p className="lede mt-5">AI DUNIYA is a learning and innovation studio for people building what&apos;s next — with clarity, craft and a little more courage.</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <button className="btn btn-lime" onClick={() => go("/#path")}>Explore the world of AI <ArrowRight size={16} /></button>
            <button className="inline-flex items-center gap-3 font-[family-name:var(--font-display)] text-[12px] font-bold uppercase tracking-[.1em] text-white/80 transition hover:text-lime" onClick={() => go("/about")}>
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/40"><Play size={12} fill="currentColor" /></span> Our story
            </button>
          </div>
        </div>

        <aside className="glass absolute bottom-24 right-[max(24px,calc((100vw-1180px)/2))] z-10 hidden w-[300px] rounded-3xl p-6 lg:block" aria-label="At a glance">
          <div className="mono flex items-center gap-2 text-[10.5px] uppercase tracking-[.16em] text-white/50"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> At a glance</div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[{ n: COURSES.length, l: "Courses" }, { n: EXAMS.length, l: "Exams" }, { n: 2, l: "Labs" }].map((s) => (
              <div key={s.l}><div className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-lime">{s.n}</div><div className="mono mt-1 text-[10px] uppercase tracking-[.12em] text-white/50">{s.l}</div></div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-[13px] text-white/70"><span className="inline-flex items-center gap-2"><Sparkles size={14} className="text-lime" /> Next cohort</span><b className="text-white">{SITE.nextCohort}</b></div>
        </aside>

        <div className="mono absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[.16em] text-white/60"><span>Scroll to explore</span><ArrowDownRight size={16} className="animate-bounce" /></div>
      </section>

      {/* ------------------------------ TICKER ------------------------------ */}
      <div className="border-y border-white/10 bg-white/[.02] py-5" aria-hidden="true">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="marquee-track">{TICKER.map((t) => <span key={t + k} className="mono flex items-center gap-11 whitespace-nowrap text-[13px] uppercase tracking-[.2em] text-white/55">{t}<span className="text-lime">✦</span></span>)}</div>
          ))}
        </div>
      </div>

      {/* ------------------------------ ABOUT ------------------------------ */}
      <section id="about" className="section">
        <div className="wrap grid gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-[8vw]">
          <Reveal>
            <div className="eyebrow">01 / About us</div>
            <h2 className="h-sec mt-7">AI is not the destination. <span className="text-white/60">It&apos;s the new terrain.</span></h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:pt-12">
            <p className="max-w-md font-[family-name:var(--font-serif)] text-[26px] leading-[1.22] tracking-tight">We started AI DUNIYA because the smartest people we knew were still guessing their way into the AI era.</p>
            <p className="lede mt-6 !text-[14px]">Our work sits at the intersection of education, technology and possibility. We make the complex feel clear, the intimidating feel doable, and the future feel like something you can actively shape.</p>
            <NavAnchor href="/about" className="link-arrow mt-8">Meet the people behind the signal <ArrowUpRight size={14} /></NavAnchor>
          </Reveal>
        </div>
        <div className="wrap mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { v: 12, s: "k+", l: "curious minds in our community" },
            { v: 38, s: "", l: "teams we've helped move forward" },
            { v: 7, s: "", l: "countries learning with us", pad: 2 },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <TiltCard className="glass card h-full"><div className="font-[family-name:var(--font-display)] text-6xl tracking-tighter"><CountUp value={s.v} suffix={s.s} pad={s.pad} /></div><p className="mt-3 text-sm text-white/60">{s.l}</p></TiltCard>
            </Reveal>
          ))}
          <Reveal delay={0.24}><TiltCard className="card flex h-full flex-col justify-between bg-lime text-[#0b0d0c]"><Zap size={26} /><p className="mt-8 font-[family-name:var(--font-display)] text-xl leading-tight tracking-tight">Built for the<br />brave + curious</p></TiltCard></Reveal>
        </div>
      </section>

      {/* ------------------------------ PRODUCTS ------------------------------ */}
      <section id="products" className="section panel-bg">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-8">
            <div><div className="eyebrow">02 / Products</div><h2 className="h-sec mt-7">Tools for the <em>in-between.</em></h2></div>
            <p className="lede max-w-xs">Good technology doesn&apos;t replace your point of view. It gives it more reach.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {PRODUCTS.map((p, i) => {
              const Icon = ICONS[p.id];
              return (
                <Reveal key={p.id} delay={i * 0.1}>
                  <TiltCard className={`glass card hue-${p.hue} flex h-full min-h-[340px] flex-col justify-between`}>
                    <div className="flex items-center justify-between"><span className="mono text-xs tracking-[.14em] hue-dot">{p.number}</span><Icon size={30} strokeWidth={1.4} className="hue-dot" /></div>
                    <div><h3 className="text-3xl tracking-tight">{p.title}</h3><p className="mt-4 text-[15px] leading-relaxed text-white/65">{p.description}</p></div>
                    <button className="btn btn-ghost btn-sm mt-8 self-start" onClick={() => setProduct(p)} aria-label={`Learn more about ${p.title}`}>Learn more <ArrowUpRight size={14} /></button>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      <Dialog open={!!product} onOpenChange={(o) => !o && setProduct(null)}>
        <DialogContent className="max-w-lg border-white/12 bg-[#0a0e0c] p-8 text-white">
          {product && (
            <div className={`hue-${product.hue}`}>
              <div className="mono text-[11px] uppercase tracking-[.16em] hue-dot">Product {product.number}</div>
              <DialogTitle className="mt-3 text-4xl tracking-tight text-white">{product.title}</DialogTitle>
              <DialogDescription className="mt-3 text-[15px] leading-relaxed text-white/65">{product.description}</DialogDescription>
              <ul className="mt-6 grid gap-3">{product.points.map((pt) => <li key={pt} className="flex gap-3 text-[15px] text-white/85"><Check size={18} className="mt-0.5 shrink-0 hue-dot" />{pt}</li>)}</ul>
              <button className="btn btn-lime mt-8" onClick={() => { setProduct(null); go("/contact?topic=products"); }}>Talk to us about this <ArrowRight size={15} /></button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ------------------------------ PATH FINDER ------------------------------ */}
      <section id="path" className="section">
        <div className="wrap">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center"><div className="eyebrow">Find your path</div><h2 className="h-sec mt-6">Not sure where to <em>start?</em></h2><p className="lede mx-auto mt-5">Answer a couple of quick questions and we&apos;ll point you to the course that fits your goal.</p></Reveal>
          <Reveal delay={0.1}><PathFinder /></Reveal>
        </div>
      </section>

      {/* ------------------------------ ROBOTICS ------------------------------ */}
      <section id="robotics" className="section panel-bg overflow-hidden">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="eyebrow">Robotics lab · New</div>
            <h2 className="h-sec mt-7">Build it.<br /><em>Make it move.</em></h2>
            <p className="lede mt-6">Step out of the screen and into the physical world. Our robotics kits help curious builders understand sensors, circuits, code and intelligent machines by making something real.</p>
            <div className="mono mt-7 grid gap-3 text-[12px] uppercase tracking-[.1em] text-white/75">{["Hands-on hardware", "Python + electronics", "Guided build challenges"].map((t) => <span key={t} className="inline-flex items-center gap-3"><Check size={15} className="text-lime" />{t}</span>)}</div>
            <div className="mt-9 flex flex-wrap gap-3"><button className="btn btn-lime" onClick={() => go("/labs/robotics")}>Drive the simulator <ArrowRight size={16} /></button><button className="btn btn-ghost" onClick={() => go("/contact?topic=robotics")}>Ask about kits</button></div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="glass card relative !p-4 sm:!p-8">
              <div className="mono absolute left-5 top-5 flex items-center gap-2 text-[10.5px] uppercase tracking-[.14em] text-white/55"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> AI DUNIYA / ROBOTICS-01</div>
              <RoverArt className="mx-auto mt-6 h-auto w-full max-w-[440px]" />
              <div className="mono flex justify-between border-t border-white/10 pt-4 text-[10.5px] uppercase tracking-[.12em] text-white/60"><span>Build kit / 01</span><span>Sensors online</span></div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ COURSES ------------------------------ */}
      <section id="courses" className="section">
        <div className="wrap grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <div className="eyebrow">03 / Courses</div>
            <h2 className="h-sec mt-7">Learn loudly.<br /><em>Build bravely.</em></h2>
            <p className="lede mt-6">Less passive watching. More active making. Our courses help you move from &ldquo;I should learn AI&rdquo; to &ldquo;I just shipped it.&rdquo;</p>
            <div className="mt-8 grid gap-2" role="tablist" aria-label="Featured courses">
              {featured.map((c, i) => (
                <button key={c.id} role="tab" aria-selected={active === i} onClick={() => setActive(i)} className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left transition ${active === i ? "border-lime bg-lime/[.07]" : "border-white/12 hover:border-white/30"}`}>
                  <span className="flex items-center gap-4"><span className="mono text-xs text-lime">0{i + 1}</span><span className="font-[family-name:var(--font-display)] text-[13px] font-bold uppercase tracking-[.1em]">{c.tag}</span></span>
                  <span className="text-sm text-white/55">{c.duration}</span>
                </button>
              ))}
            </div>
            <NavAnchor href="/courses" className="link-arrow mt-8">Browse all {COURSES.length} courses <ArrowUpRight size={14} /></NavAnchor>
          </Reveal>
          <Reveal delay={0.1}>
            <div key={course.id} className={`glass card hue-${course.hue} relative flex min-h-[420px] flex-col justify-between !p-8 sm:!p-10`}>
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-dashed opacity-30" style={{ borderColor: "var(--h)", animation: "spin-slow 40s linear infinite" }} />
              <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full border opacity-25" style={{ borderColor: "var(--h)", animation: "spin-slow 26s linear infinite reverse" }} />
              <div className="mono relative flex justify-between text-[11px] uppercase tracking-[.14em] text-white/55"><span>Next cohort · {SITE.nextCohort}</span><span>0{active + 1} / 0{featured.length}</span></div>
              <Cpu size={34} className="relative mt-10 hue-dot" />
              <div className="relative mt-auto pt-10">
                <span className="mono text-[11px] uppercase tracking-[.16em] hue-dot">{course.tag}</span>
                <h3 className="mt-3 text-4xl leading-[1.02] tracking-tight sm:text-5xl">{course.title}</h3>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/65">{course.blurb}</p>
                <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><span className="mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[.1em] text-white/60"><Clock3 size={14} /> {course.duration} · {course.format}</span><button className="btn btn-lime btn-sm" onClick={() => go(`/courses?c=${course.id}`)}>View course <ArrowRight size={14} /></button></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ BUSINESS ------------------------------ */}
      <section id="business" className="section panel-bg">
        <div className="wrap grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="glass card relative flex min-h-[420px] flex-col justify-between overflow-hidden">
              <div className="mono flex items-center gap-2 text-[10.5px] uppercase tracking-[.14em] text-white/55"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> AI DUNIYA / BUSINESS</div>
              <div className="relative z-10"><Quote size={30} className="text-lime" /><p className="mt-5 font-[family-name:var(--font-display)] text-3xl leading-tight tracking-tight sm:text-4xl">Every business has an AI story.<br /><em className="font-[family-name:var(--font-serif)] text-lime">Let&apos;s make yours useful.</em></p></div>
              <div className="mono text-[11px] leading-relaxed tracking-[.1em] text-white/60">28.6139° N<br />77.2090° E</div>
              <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">{[0, 1, 2, 3].map((k) => <span key={k} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime/40 to-transparent" style={{ top: `${20 + k * 20}%`, transform: `rotate(${-6 + k * 3}deg)` }} />)}</div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="eyebrow">04 / For business</div>
            <h2 className="h-sec mt-7">Move from AI curious to <em>AI capable.</em></h2>
            <p className="lede mt-6">Strategy is only useful when it changes what happens on Monday morning. We partner with ambitious teams to find the right problems, build the right muscle and create an AI practice that lasts.</p>
            <ul className="mt-7 grid gap-3">{["AI strategy & opportunity mapping", "Bespoke team enablement", "Prototypes that earn their next step"].map((t) => <li key={t} className="flex items-center gap-3 text-[15px] text-white/85"><Check size={18} className="text-lime" />{t}</li>)}</ul>
            <button className="btn btn-lime mt-9" onClick={() => go("/contact?topic=business")}>Start a conversation <ArrowRight size={16} /></button>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ CONTACT ------------------------------ */}
      <section id="contact" className="section">
        <div className="aurora -left-40 bottom-0 h-[420px] w-[420px] bg-lime/20" />
        <div className="wrap relative grid gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <Reveal>
            <div className="eyebrow">05 / Contact</div>
            <h2 className="h-sec mt-7">Got a big<br /><em>what if?</em></h2>
            <p className="lede mt-6">Tell us what you&apos;re thinking. The early, messy version is usually the most interesting.</p>
            <div className="mt-8 grid gap-2"><a href={`mailto:${SITE.email}`} className="link-arrow !text-base normal-case tracking-normal">{SITE.email}</a><span className="mono text-[11px] uppercase tracking-[.12em] text-white/60">New Delhi · Bengaluru · Everywhere</span></div>
            <button className="btn btn-ghost btn-sm mt-8" onClick={openAssistant}><Sparkles size={14} /> Or ask the site guide</button>
          </Reveal>
          <Reveal delay={0.1}><ContactForm compact /></Reveal>
        </div>
      </section>
    </>
  );
}
