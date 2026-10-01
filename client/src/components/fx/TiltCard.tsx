import { useRef } from "react";
import { prefersReducedMotion } from "@/lib/nav";

/** Card that tilts toward the pointer and tracks a soft spotlight. Touch-safe. */
export default function TiltCard({
  children, className = "", as: Tag = "div", max = 7, ...rest
}: React.HTMLAttributes<HTMLElement> & { as?: "div" | "article" | "button" | "a"; max?: number; href?: string }) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch" || prefersReducedMotion()) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * max * 2}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * max * 2}deg`);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg");
  };

  const Component = Tag as React.ElementType;
  return (
    <Component ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </Component>
  );
}
