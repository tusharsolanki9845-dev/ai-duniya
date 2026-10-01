import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/nav";

/** Animates 0 -> value when scrolled into view. Shows the final value immediately if motion is reduced. */
export default function CountUp({ value, suffix = "", pad = 0, duration = 1600 }: { value: number; suffix?: string; pad?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(prefersReducedMotion() ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return <span ref={ref}>{String(n).padStart(pad, "0")}{suffix}</span>;
}
