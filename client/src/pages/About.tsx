import { useState } from "react";
import { ArrowRight, Globe2, Heart, Lightbulb } from "lucide-react";
import { NavAnchor, PageHero } from "@/components/Chrome";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { FOUNDERS, type Founder } from "@/lib/site";

/**
 * Founder photo. Drop real images at  client/public/images/founder-<slug>.jpg
 * (slug = lowercased first name, e.g. founder-tushar.jpg, founder-piyush.jpg).
 * Until one exists for a given founder, an initials monogram is shown instead
 * so the page never has a broken image.
 */
function FounderPhoto({ founder }: { founder: Founder }) {
  const [failed, setFailed] = useState(false);
  const slug = founder.name.split(" ")[0].toLowerCase();
  return (
    <div className="glass relative aspect-[4/5] w-full overflow-hidden rounded-[28px]">
      {!failed ? (
        <img src={`/images/founder-${slug}.jpg`} alt={`${founder.name}, ${founder.role} of AI DUNIYA`} className="h-full w-full object-cover" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[radial-gradient(circle_at_30%_20%,rgba(216,250,50,.18),transparent_60%)]" role="img" aria-label={`${founder.name}, ${founder.role}`}>
          <span className="font-[family-name:var(--font-display)] text-[9rem] font-medium leading-none tracking-tighter text-lime/90">{founder.initials}</span>
        </div>
      )}
      <div className="scanline" aria-hidden="true" />
      <div className="mono absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/85 to-transparent p-5 pt-14 text-[10.5px] uppercase tracking-[.14em] text-white/70"><span>{founder.role}</span><span>AI DUNIYA · 2026</span></div>
    </div>
  );
}

function FounderBlock({ founder, reverse = false }: { founder: Founder; reverse?: boolean }) {
  return (
    <div className={`grid items-start gap-14 lg:grid-cols-[.8fr_1.2fr] ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <Reveal className="lg:sticky lg:top-28"><FounderPhoto founder={founder} /></Reveal>
      <Reveal delay={0.1}>
        <div className="eyebrow">{founder.role}</div>
        <h3 className="mt-6 text-4xl tracking-tight sm:text-5xl">{founder.name}</h3>
        <div className="lede mt-8 grid gap-5 !max-w-none !text-[15px]">
          {founder.bio.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Reveal>
    </div>
  );
}

export default function About() {
  return (
    <>
      <PageHero eyebrow="01 / About us" back={{ href: "/", label: "Back to home" }} title={<>We make AI feel<br /><em>human again.</em></>}>
        AI DUNIYA is a learning and innovation studio for people who want to understand the future — and have a hand in shaping it.
      </PageHero>

      <section className="section pt-8">
        <div className="wrap">
          <Reveal className="mb-16"><div className="eyebrow">The founders&apos; story</div><h2 className="h-sec mt-7">Learn. Build.<br /><em>Improve.</em></h2></Reveal>
          <div className="grid gap-20">
            {FOUNDERS.map((f, i) => <FounderBlock key={f.name} founder={f} reverse={i % 2 === 1} />)}
          </div>
          <Reveal delay={0.1}>
            <div className="glass card mt-16 !border-lime/30">
              <div className="mono text-[11px] uppercase tracking-[.16em] text-lime">Our vision</div>
              <p className="mt-4 text-[15px] leading-relaxed text-white/80">We want to grow as technologists who combine <strong className="text-white">AI, software development, and creative problem-solving</strong> to build meaningful digital solutions.</p>
              <p className="mt-5 font-[family-name:var(--font-display)] text-2xl tracking-tight text-lime">Learn. Build. Improve. Repeat.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section panel-bg">
        <div className="wrap">
          <Reveal className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div><div className="eyebrow">What we believe</div><h2 className="h-sec mt-7">Make it clear.<br /><em>Make it matter.</em></h2></div>
            <p className="lede">We believe the best AI work is not the loudest or most complicated. It is the work that makes someone&apos;s day lighter, a team&apos;s thinking sharper, or a difficult problem finally feel possible.</p>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[{ i: Lightbulb, t: "Clarity over hype", d: "We turn the intimidating into the understandable." }, { i: Heart, t: "People first", d: "Technology is only useful when it serves real lives." }, { i: Globe2, t: "Access for all", d: "The future gets better when more people can shape it." }].map(({ i: Icon, t, d }, k) => (
              <Reveal key={t} delay={k * 0.1}><TiltCard className="glass card h-full"><Icon size={26} className="text-lime" /><h3 className="mt-7 text-2xl tracking-tight">{t}</h3><p className="mt-3 text-[15px] leading-relaxed text-white/60">{d}</p></TiltCard></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <Reveal className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div><div className="eyebrow">Come build with us</div><h2 className="h-sec mt-7">There&apos;s room<br />for <em>your idea.</em></h2></div>
          <div><p className="lede">Whether you&apos;re learning your first AI concept, building a product or leading a team through change, we&apos;d love to hear what you&apos;re working on.</p><NavAnchor href="/contact" className="btn btn-lime mt-8">Start a conversation <ArrowRight size={16} /></NavAnchor></div>
        </Reveal>
      </section>
    </>
  );
}
