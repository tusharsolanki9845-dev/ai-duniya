import { useState } from "react";
import { ArrowRight, Database, MessageSquareCode, Network, Sparkles } from "lucide-react";
import { NavAnchor, PageHero } from "@/components/Chrome";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import NeuralCanvas from "@/components/fx/NeuralCanvas";
import NeuralSandbox from "@/components/labs/NeuralSandbox";
import Tokenizer from "@/components/labs/Tokenizer";
import PromptBuilder from "@/components/labs/PromptBuilder";

const MODULES = [
  { icon: MessageSquareCode, title: "Generative AI", text: "Prompt design, LLM thinking, multimodal tools, and useful copilots." },
  { icon: Network, title: "AI agents", text: "Design systems that plan, call tools, and complete meaningful workflows." },
  { icon: Database, title: "Data + ML", text: "Understand data, models, evaluation, and the logic behind intelligent products." },
];
const TOOLS = [
  { id: "neural", label: "Neural sandbox", hint: "See how layers, weights and activations turn inputs into predictions." },
  { id: "tokens", label: "Tokenizer", hint: "Models read tokens, not letters. Watch text break into pieces." },
  { id: "prompt", label: "Prompt builder", hint: "Assemble a prompt from the five building blocks of a reliable request." },
] as const;

export default function AiLabs() {
  const [tool, setTool] = useState<(typeof TOOLS)[number]["id"]>("neural");
  const current = TOOLS.find((t) => t.id === tool)!;
  return (
    <>
      <PageHero eyebrow="Labs / 01 · AI Labs" back={{ href: "/labs", label: "Back to Labs" }} title={<>Think in<br /><em>systems.</em></>}
        aside={<div className="relative hidden h-[340px] overflow-hidden rounded-[28px] border border-white/10 lg:block"><NeuralCanvas density={0.7} /></div>}>
        Build practical AI projects with a guided studio format, modern tools, and a community that keeps asking better questions.
      </PageHero>

      <section id="playground" className="section pt-4">
        <div className="wrap">
          <Reveal className="mb-10"><div className="eyebrow">Interactive playground</div><h2 className="h-sec mt-6">Play with <em>the ideas.</em></h2></Reveal>
          <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="AI Lab tools">
            {TOOLS.map((t) => <button key={t.id} role="tab" aria-selected={tool === t.id} className={`chip !px-5 !py-3 ${tool === t.id ? "active" : ""}`} onClick={() => setTool(t.id)}>{t.label}</button>)}
          </div>
          <p className="lede mb-8">{current.hint}</p>
          {tool === "neural" && <NeuralSandbox />}
          {tool === "tokens" && <Tokenizer />}
          {tool === "prompt" && <PromptBuilder />}
        </div>
      </section>

      <section className="section panel-bg">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-8"><div><div className="eyebrow">What you&apos;ll explore</div><h2 className="h-sec mt-6">From first<br /><em>prompt to prototype.</em></h2></div><p className="lede max-w-sm">Every module is anchored in a real problem and ends with something you can show, test, and improve.</p></Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {MODULES.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.1}><TiltCard className="glass card h-full"><div className="flex justify-between"><span className="mono text-xs text-lime">0{i + 1}</span><Icon size={26} className="text-lime" /></div><h3 className="mt-10 text-3xl tracking-tight">{title}</h3><p className="mt-3 text-[15px] leading-relaxed text-white/60">{text}</p></TiltCard></Reveal>
            ))}
          </div>
          <Reveal className="mt-14"><div className="glass card flex flex-wrap items-center justify-between gap-6 !border-lime/30 !p-8 sm:!p-10"><div><Sparkles size={22} className="text-lime" /><h3 className="mt-4 text-3xl tracking-tight">Ready to build your first AI system?</h3><p className="mt-2 text-white/60">Join the next guided AI Labs cohort.</p></div><NavAnchor href="/contact?topic=ai" className="btn btn-lime">Talk to the lab <ArrowRight size={16} /></NavAnchor></div></Reveal>
        </div>
      </section>
    </>
  );
}
