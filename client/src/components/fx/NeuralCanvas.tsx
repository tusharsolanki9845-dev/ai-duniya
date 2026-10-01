import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/nav";

type Node = { x: number; y: number; vx: number; vy: number; r: number };
type Pulse = { a: number; b: number; t: number; speed: number };

/**
 * Interactive neural-network background. Nodes drift, link when close, react to the
 * pointer, and lime "signals" travel along the links. Pauses off-screen / hidden tab,
 * caps DPR, scales node count to area, and draws a single static frame for reduced motion.
 */
export default function NeuralCanvas({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0, h = 0, raf = 0, running = false, visible = true;
    const reduced = prefersReducedMotion();
    const pointer = { x: -9999, y: -9999, active: false };
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const LINK = 150;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(24, (w * h) / 15000)) * density);
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8,
      }));
      pulses = [];
      if (!running) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            const alpha = (1 - Math.sqrt(d2) / LINK) * 0.28;
            ctx.strokeStyle = `rgba(216,250,50,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        // pointer links
        if (pointer.active) {
          const dx = a.x - pointer.x, dy = a.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 190) {
            ctx.strokeStyle = `rgba(94,240,255,${(1 - d / 190) * 0.5})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
          }
        }
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = "rgba(243,240,233,.78)";
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      // pulses
      for (const p of pulses) {
        const a = nodes[p.a], b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 10);
        g.addColorStop(0, "rgba(216,250,50,.95)"); g.addColorStop(1, "rgba(216,250,50,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        if (pointer.active) {
          const dx = n.x - pointer.x, dy = n.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 0.1) { n.vx += (dx / d) * 0.05; n.vy += (dy / d) * 0.05; }
        }
        n.vx *= 0.995; n.vy *= 0.995;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -10) n.x = w + 10; else if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10; else if (n.y > h + 10) n.y = -10;
      }
      // spawn a signal along a random near link
      if (pulses.length < 14 && Math.random() < 0.05 && nodes.length > 2) {
        const a = Math.floor(Math.random() * nodes.length);
        let best = -1, bd = LINK * LINK;
        for (let j = 0; j < nodes.length; j++) {
          if (j === a) continue;
          const d2 = (nodes[a].x - nodes[j].x) ** 2 + (nodes[a].y - nodes[j].y) ** 2;
          if (d2 < bd && Math.random() < 0.4) { bd = d2; best = j; }
        }
        if (best >= 0) pulses.push({ a, b: best, t: 0, speed: 0.012 + Math.random() * 0.015 });
      }
      pulses = pulses.filter((p) => (p.t += p.speed) < 1);
    };

    const loop = () => {
      if (!running) return;
      step(); draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!running && visible && !document.hidden && !reduced) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
      pointer.active = pointer.x >= 0 && pointer.y >= 0 && pointer.x <= r.width && pointer.y <= r.height;
    };
    const onLeave = () => { pointer.active = false; };
    const onVis = () => (document.hidden ? stop() : start());

    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); });
    io.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop(); ro.disconnect(); io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [density]);

  return <canvas ref={ref} className={`absolute inset-0 h-full w-full ${className}`} aria-hidden="true" />;
}
