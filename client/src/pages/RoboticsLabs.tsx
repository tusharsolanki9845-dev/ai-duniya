import { ArrowRight, CircuitBoard, Cpu, Gauge, Radio } from "lucide-react";
import { NavAnchor, PageHero } from "@/components/Chrome";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import RoverArt from "@/components/labs/RoverArt";
import RoverSim from "@/components/labs/RoverSim";

const SKILLS = [
  { icon: CircuitBoard, title: "Electronics", text: "Circuits, components, motors, sensors, and safe prototyping." },
  { icon: Cpu, title: "Embedded code", text: "Python, microcontrollers, control logic, and debugging." },
  { icon: Radio, title: "Connected machines", text: "Wireless signals, remote control, and intelligent responses." },
  { icon: Gauge, title: "Build challenges", text: "Guided missions that turn theory into working machines." },
];

export default function RoboticsLabs() {
  return (
    <>
      <PageHero eyebrow="Labs / 02 · Robotics Labs" back={{ href: "/labs", label: "Back to Labs" }} title={<>Make it<br /><em>move.</em></>} aside={<RoverArt className="mx-auto h-auto w-full max-w-[420px]" />}>
        A project-first robotics lab for builders who want to understand how software, electronics, and intelligent machines work together.
      </PageHero>

      <section id="simulator" className="section pt-4">
        <div className="wrap">
          <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6"><div><div className="eyebrow">Live simulator</div><h2 className="h-sec mt-6">Drive it <em>yourself.</em></h2></div><p className="lede max-w-sm">Let the autopilot hunt the beacon, or take over. It&apos;s the same sense → decide → act loop you&apos;ll program on a real kit.</p></Reveal>
          <Reveal><RoverSim /></Reveal>
        </div>
      </section>

      <section className="section panel-bg">
        <div className="wrap">
          <Reveal className="flex flex-wrap items-end justify-between gap-8"><div><div className="eyebrow">Inside the lab</div><h2 className="h-sec mt-6">Code the<br /><em>physical world.</em></h2></div><p className="lede max-w-sm">Start with a kit, learn by doing, and finish with a robot that responds to the world around it.</p></Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.08}><TiltCard className="glass card h-full"><Icon size={26} className="text-cyan-glow" /><h3 className="mt-8 text-2xl tracking-tight">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p></TiltCard></Reveal>
            ))}
          </div>
          <Reveal className="mt-14"><div className="glass card flex flex-wrap items-center justify-between gap-6 !border-cyan-glow/30 !p-8 sm:!p-10"><div><span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-lime shadow-[0_0_12px_#d8fa32]" /><h3 className="mt-4 text-3xl tracking-tight">Bring your curiosity. We&apos;ll bring the kit.</h3><p className="mt-2 text-white/60">Robotics Labs cohorts include guided builds and hardware access.</p></div><NavAnchor href="/contact?topic=robotics" className="btn btn-lime">Ask about robotics <ArrowRight size={16} /></NavAnchor></div></Reveal>
        </div>
      </section>
    </>
  );
}
