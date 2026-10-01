import { ArrowRight, BrainCircuit, Cpu } from "lucide-react";
import { NavAnchor, PageHero } from "@/components/Chrome";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";

const LABS = [
  { href: "/labs/ai", n: "01", icon: BrainCircuit, title: "AI Labs", text: "Experiment with machine learning, generative AI, agents, and data-driven ideas.", tools: ["Neural sandbox", "Tokenizer", "Prompt builder"], hue: "lime" },
  { href: "/labs/robotics", n: "02", icon: Cpu, title: "Robotics Labs", text: "Move from code to the physical world with sensors, circuits, and intelligent machines.", tools: ["Rover simulator", "Autonomy", "Build kits"], hue: "cyan" },
];

export default function Labs() {
  return (
    <>
      <PageHero eyebrow="02 / Labs" title={<>Where ideas<br /><em>come alive.</em></>}>AI DUNIYA Labs are hands-on spaces for testing, building, and learning through real projects.</PageHero>
      <section className="section pt-4">
        <div className="wrap">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6"><div><div className="eyebrow">Choose your track</div><h2 className="h-sec mt-6">Two ways to<br /><em>start building.</em></h2></div><p className="lede max-w-sm">Pick the environment that matches your curiosity. Both labs are designed around making, not just watching.</p></Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {LABS.map(({ href, n, icon: Icon, title, text, tools, hue }, i) => (
              <Reveal key={href} delay={i * 0.1}>
                <NavAnchor href={href} className="block h-full">
                  <TiltCard className={`glass card hue-${hue} group flex h-full min-h-[380px] flex-col justify-between !p-9`}>
                    <div className="flex items-center justify-between"><span className="mono text-xs tracking-[.14em] hue-dot">{n}</span><Icon size={44} strokeWidth={1.2} className="hue-dot transition group-hover:scale-110" /></div>
                    <div><h3 className="text-5xl tracking-tight">{title}</h3><p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/65">{text}</p><div className="mt-6 flex flex-wrap gap-2">{tools.map((t) => <span key={t} className="chip !py-1.5 !text-[11px]">{t}</span>)}</div></div>
                    <span className="link-arrow mt-8 hue-dot">Explore {title} <ArrowRight size={15} /></span>
                  </TiltCard>
                </NavAnchor>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
