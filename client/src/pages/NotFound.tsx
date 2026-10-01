import { Compass } from "lucide-react";
import { NavAnchor } from "@/components/Chrome";
import NeuralCanvas from "@/components/fx/NeuralCanvas";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[100svh] place-items-center overflow-hidden px-6 py-32 text-center">
      <NeuralCanvas density={0.6} /><div className="grid-bg" />
      <div className="relative z-10">
        <div className="eyebrow justify-center">Signal lost</div>
        <div className="glitch mt-6 font-[family-name:var(--font-display)] text-[clamp(7rem,26vw,16rem)] font-medium leading-[.85] tracking-tighter" data-text="404">404</div>
        <p className="lede mx-auto mt-6">This page drifted out of range. It may have moved, or the link may be mistyped.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <NavAnchor href="/" className="btn btn-lime"><Compass size={16} /> Back to home</NavAnchor>
          <NavAnchor href="/courses" className="btn btn-ghost">Browse courses</NavAnchor>
        </div>
      </div>
    </section>
  );
}
