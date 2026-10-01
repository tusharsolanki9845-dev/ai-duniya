import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Bot, Gamepad2, Pause, Play, RefreshCw } from "lucide-react";
import { prefersReducedMotion } from "@/lib/nav";

const W = 760, H = 440, R = 13;
type Rect = { x: number; y: number; w: number; h: number };
type Mode = "auto" | "manual";
type World = { obs: Rect[]; beacon: { x: number; y: number }; start: { x: number; y: number } };

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wrapAngle = (a: number) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const hitsRect = (cx: number, cy: number, r: number, q: Rect) => {
  const nx = clamp(cx, q.x, q.x + q.w), ny = clamp(cy, q.y, q.y + q.h);
  return (cx - nx) ** 2 + (cy - ny) ** 2 < r * r;
};
const blocked = (x: number, y: number, obs: Rect[]) => x < R || y < R || x > W - R || y > H - R || obs.some((o) => hitsRect(x, y, R, o));
const solid = (px: number, py: number, obs: Rect[]) => px < 0 || py < 0 || px > W || py > H || obs.some((o) => px >= o.x && px <= o.x + o.w && py >= o.y && py <= o.y + o.h);
const cast = (x: number, y: number, ang: number, range: number, obs: Rect[]) => {
  for (let d = 0; d <= range; d += 3) if (solid(x + Math.cos(ang) * d, y + Math.sin(ang) * d, obs)) return d;
  return range;
};
const grow = (o: Rect, m: number): Rect => ({ x: o.x - m, y: o.y - m, w: o.w + 2 * m, h: o.h + 2 * m });
const overlap = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function makeBeacon(obs: Rect[], from: { x: number; y: number }) {
  for (let i = 0; i < 300; i++) {
    const p = { x: rnd(50, W - 50), y: rnd(50, H - 50) };
    if (Math.hypot(p.x - from.x, p.y - from.y) < 220) continue;
    if (obs.some((o) => hitsRect(p.x, p.y, R + 22, o))) continue;
    return p;
  }
  return { x: W - 60, y: H / 2 };
}
function makeWorld(): World {
  const start = { x: 70, y: H / 2 };
  const obs: Rect[] = [];
  for (let tries = 0; tries < 600 && obs.length < 7; tries++) {
    const w = rnd(50, 120), h = rnd(34, 96);
    const r: Rect = { x: rnd(34, W - 34 - w), y: rnd(34, H - 34 - h), w, h };
    if (hitsRect(start.x, start.y, 95, r)) continue;
    if (obs.some((o) => overlap(grow(o, 34), r))) continue;
    obs.push(r);
  }
  return { obs, start, beacon: makeBeacon(obs, start) };
}

const SENSORS = [-1.05, -0.52, 0, 0.52, 1.05];

type Ui = { front: number; missions: number; collisions: number };

export default function RoverSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>(prefersReducedMotion() ? "manual" : "auto");
  const [paused, setPaused] = useState(prefersReducedMotion());
  const [speed, setSpeed] = useState(1);
  const [range, setRange] = useState(190);
  const [rays, setRays] = useState(true);
  const [trail, setTrail] = useState(true);
  const [ui, setUi] = useState<Ui>({ front: 0, missions: 0, collisions: 0 });

  const cfg = useRef({ mode, paused, speed, range, rays, trail });
  cfg.current = { mode, paused, speed, range, rays, trail };
  const world = useRef<World>(makeWorld());
  const rover = useRef({ x: world.current.start.x, y: world.current.start.y, a: 0 });
  const keys = useRef(new Set<string>());
  const stats = useRef({ missions: 0, collisions: 0 });
  const trailPts = useRef<{ x: number; y: number }[]>([]);
  const resetSignal = useRef(0);

  const newMap = useCallback(() => {
    const w = makeWorld();
    world.current = w;
    rover.current = { x: w.start.x, y: w.start.y, a: 0 };
    trailPts.current = [];
    resetSignal.current++;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let raf = 0, last = performance.now(), frame = 0, visible = true;
    let cooldown = 0, recover = 0, recoverDir = 1, lastCheck = { x: rover.current.x, y: rover.current.y }, seenReset = resetSignal.current;
    let lastUi: Ui = { front: -1, missions: -1, collisions: -1 };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) { last = now; return; }
      const dt = clamp((now - last) / 16.667, 0.2, 2.5);
      last = now;
      frame++;
      if (seenReset !== resetSignal.current) { seenReset = resetSignal.current; recover = 0; lastCheck = { x: rover.current.x, y: rover.current.y }; }
      const c = cfg.current, r = rover.current, wd = world.current;
      const reading = SENSORS.map((s) => cast(r.x, r.y, r.a + s, c.range, wd.obs) / c.range);

      if (!c.paused) {
        let fwd = 0, turn = 0;
        const base = 2.1 * c.speed;
        if (c.mode === "manual") {
          const k = keys.current;
          if (k.has("up")) fwd = base; if (k.has("down")) fwd = -base * 0.6;
          if (k.has("left")) turn -= 0.055; if (k.has("right")) turn += 0.055;
          if (fwd < 0) turn = -turn;
        } else if (recover > 0) {
          recover--; fwd = -base * 0.7; turn = 0.07 * recoverDir;
        } else {
          const toB = Math.atan2(wd.beacon.y - r.y, wd.beacon.x - r.x);
          const d = wrapAngle(toB - r.a);
          const leftOpen = reading[0] + reading[1], rightOpen = reading[3] + reading[4];
          let avoid = (1 - reading[0]) * 1.0 + (1 - reading[1]) * 1.2 - (1 - reading[3]) * 1.2 - (1 - reading[4]) * 1.0;
          const openSide = rightOpen >= leftOpen ? 1 : -1;
          avoid += (1 - reading[2]) * openSide * 1.4;
          const goal = clamp(d * 1.5, -1, 1) * (0.25 + 0.75 * reading[2]);
          turn = clamp(goal + avoid * 1.1, -1, 1) * 0.07;
          fwd = base * (0.22 + 0.78 * Math.min(1, reading[2] * 1.6));
          if (reading[2] < 0.2) { fwd = base * 0.12; turn = 0.075 * openSide; }
          if (frame % 90 === 0) {
            if (Math.hypot(r.x - lastCheck.x, r.y - lastCheck.y) < 14) { recover = 38; recoverDir = Math.random() < 0.5 ? 1 : -1; }
            lastCheck = { x: r.x, y: r.y };
          }
        }
        r.a = wrapAngle(r.a + turn * dt);
        const nx = r.x + Math.cos(r.a) * fwd * dt, ny = r.y + Math.sin(r.a) * fwd * dt;
        if (!blocked(nx, ny, wd.obs)) {
          r.x = nx; r.y = ny;
        } else {
          // slide along the surface if one axis is free, and count one bump per cooldown window
          if (!blocked(nx, r.y, wd.obs)) r.x = nx;
          else if (!blocked(r.x, ny, wd.obs)) r.y = ny;
          if (cooldown <= 0 && Math.abs(fwd) > 0.01) { stats.current.collisions++; cooldown = 40; }
        }
        if (cooldown > 0) cooldown--;

        if (Math.hypot(wd.beacon.x - r.x, wd.beacon.y - r.y) < R + 12) {
          stats.current.missions++;
          wd.beacon = makeBeacon(wd.obs, { x: r.x, y: r.y });
        }
        if (c.trail && frame % 3 === 0 && (fwd !== 0)) { trailPts.current.push({ x: r.x, y: r.y }); if (trailPts.current.length > 240) trailPts.current.shift(); }
      }

      /* ---------- draw ---------- */
      ctx.fillStyle = "#050706"; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(243,240,233,.05)"; ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      ctx.strokeStyle = "rgba(216,250,50,.25)"; ctx.strokeRect(1, 1, W - 2, H - 2);

      for (const o of wd.obs) {
        ctx.fillStyle = "rgba(94,240,255,.07)"; ctx.fillRect(o.x, o.y, o.w, o.h);
        ctx.strokeStyle = "rgba(94,240,255,.7)"; ctx.lineWidth = 1.5; ctx.strokeRect(o.x + .5, o.y + .5, o.w - 1, o.h - 1);
        ctx.save(); ctx.beginPath(); ctx.rect(o.x, o.y, o.w, o.h); ctx.clip();
        ctx.strokeStyle = "rgba(94,240,255,.16)"; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = -o.h; i < o.w; i += 12) { ctx.moveTo(o.x + i, o.y + o.h); ctx.lineTo(o.x + i + o.h, o.y); }
        ctx.stroke(); ctx.restore();
      }
      const pulse = 0.5 + 0.5 * Math.sin(now / 260);
      const g = ctx.createRadialGradient(wd.beacon.x, wd.beacon.y, 0, wd.beacon.x, wd.beacon.y, 34);
      g.addColorStop(0, `rgba(216,250,50,${0.5 + pulse * 0.3})`); g.addColorStop(1, "rgba(216,250,50,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wd.beacon.x, wd.beacon.y, 34, 0, 7); ctx.fill();
      ctx.fillStyle = "#d8fa32"; ctx.beginPath(); ctx.arc(wd.beacon.x, wd.beacon.y, 5, 0, 7); ctx.fill();
      ctx.strokeStyle = "rgba(216,250,50,.7)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wd.beacon.x, wd.beacon.y, 12 + pulse * 5, 0, 7); ctx.stroke();

      if (c.trail && trailPts.current.length > 1) {
        for (let i = 1; i < trailPts.current.length; i++) {
          ctx.strokeStyle = `rgba(216,250,50,${(i / trailPts.current.length) * 0.5})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(trailPts.current[i - 1].x, trailPts.current[i - 1].y); ctx.lineTo(trailPts.current[i].x, trailPts.current[i].y); ctx.stroke();
        }
      }
      if (c.rays) {
        SENSORS.forEach((s, i) => {
          const d = reading[i] * c.range, a = r.a + s;
          ctx.strokeStyle = reading[i] < 0.999 ? "rgba(255,181,71,.55)" : "rgba(94,240,255,.28)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x + Math.cos(a) * d, r.y + Math.sin(a) * d); ctx.stroke();
          if (reading[i] < 0.999) { ctx.fillStyle = "#ffb547"; ctx.beginPath(); ctx.arc(r.x + Math.cos(a) * d, r.y + Math.sin(a) * d, 3, 0, 7); ctx.fill(); }
        });
      }
      ctx.save(); ctx.translate(r.x, r.y); ctx.rotate(r.a);
      ctx.shadowColor = "rgba(216,250,50,.6)"; ctx.shadowBlur = 16;
      ctx.fillStyle = "#d8fa32"; ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-14, -10, 28, 20, 5); else ctx.rect(-14, -10, 28, 20);
      ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = "#0b0d0c"; ctx.fillRect(-13, -14, 10, 4); ctx.fillRect(-13, 10, 10, 4); ctx.fillRect(4, -14, 10, 4); ctx.fillRect(4, 10, 10, 4);
      ctx.fillStyle = "#06080a"; ctx.beginPath(); ctx.arc(10, -4, 2.6, 0, 7); ctx.arc(10, 4, 2.6, 0, 7); ctx.fill();
      ctx.restore();

      if (frame % 8 === 0) {
        const next: Ui = { front: Math.round((reading[2] * c.range) / 2), missions: stats.current.missions, collisions: stats.current.collisions };
        if (next.front !== lastUi.front || next.missions !== lastUi.missions || next.collisions !== lastUi.collisions) { lastUi = next; setUi(next); }
      }
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  /* keyboard (only while the simulator has focus) */
  const keyMap: Record<string, string> = { ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down", ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right" };
  const onKey = (down: boolean) => (e: React.KeyboardEvent) => {
    const k = keyMap[e.key];
    if (!k) return;
    e.preventDefault();
    if (mode === "auto" && down) setMode("manual");
    down ? keys.current.add(k) : keys.current.delete(k);
  };
  const hold = (k: string) => ({
    onPointerDown: (e: React.PointerEvent) => { e.preventDefault(); if (mode === "auto") setMode("manual"); keys.current.add(k); (e.target as Element).setPointerCapture?.(e.pointerId); },
    onPointerUp: () => keys.current.delete(k),
    onPointerCancel: () => keys.current.delete(k),
    onPointerLeave: () => keys.current.delete(k),
  });

  const Toggle = ({ on, set, label }: { on: boolean; set: (v: boolean) => void; label: string }) => (
    <button role="switch" aria-checked={on} onClick={() => set(!on)} className="flex items-center gap-3 text-[13px] text-white/75">
      <span className={`relative h-6 w-11 rounded-full border transition ${on ? "border-lime bg-lime/25" : "border-white/20 bg-white/5"}`}>
        <span className={`absolute top-[2px] h-4 w-4 rounded-full transition-all ${on ? "left-[22px] bg-lime" : "left-[3px] bg-white/60"}`} />
      </span>{label}
    </button>
  );

  return (
    <div ref={boxRef} className="glass card !p-4 sm:!p-6" data-testid="rover-sim" data-mode={mode} data-missions={ui.missions} data-collisions={ui.collisions}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="mono flex items-center gap-2 text-[11px] uppercase tracking-[.14em] text-white/55"><span className="h-2 w-2 animate-pulse rounded-full bg-lime" /> Rover-01 · simulator</div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-full border border-white/15 p-1" role="group" aria-label="Drive mode">
            {(["auto", "manual"] as Mode[]).map((m) => (
              <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-[family-name:var(--font-display)] text-[11px] font-bold uppercase tracking-[.1em] transition ${mode === m ? "bg-lime text-[#0b0d0c]" : "text-white/65 hover:text-white"}`}>
                {m === "auto" ? <Bot size={14} /> : <Gamepad2 size={14} />}{m === "auto" ? "Autonomous" : "Manual"}
              </button>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused(!paused)} aria-label={paused ? "Resume simulation" : "Pause simulation"}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? "Run" : "Pause"}</button>
          <button className="btn btn-ghost btn-sm" onClick={newMap}><RefreshCw size={14} /> New map</button>
        </div>
      </div>

      <div tabIndex={0} onKeyDown={onKey(true)} onKeyUp={onKey(false)} onBlur={() => keys.current.clear()} aria-label="Rover simulator. Focus here and use arrow keys or W A S D to drive." className="relative rounded-[20px] outline-offset-4">
        <canvas ref={canvasRef} className="sim-canvas" aria-hidden="true" />
        <div className="pointer-events-none absolute left-3 top-3 grid gap-1 rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur">
          <div className="mono text-[10px] uppercase tracking-[.12em] text-white/60">Front sensor</div>
          <div className="mono text-lg text-lime" data-testid="front-cm">{ui.front} cm</div>
        </div>
        <div className="pointer-events-none absolute right-3 top-3 grid grid-cols-2 gap-x-5 gap-y-1 rounded-xl border border-white/10 bg-black/55 px-3 py-2 backdrop-blur">
          <div className="mono text-[10px] uppercase tracking-[.12em] text-white/60">Missions</div><div className="mono text-[10px] uppercase tracking-[.12em] text-white/60">Bumps</div>
          <div className="mono text-lg text-lime" data-testid="missions">{ui.missions}</div><div className="mono text-lg text-[#ffb547]" data-testid="collisions">{ui.collisions}</div>
        </div>
        {mode === "auto" && <div className="mono pointer-events-none absolute bottom-3 left-3 rounded-full border border-lime/40 bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[.12em] text-lime backdrop-blur">Autopilot · seeking beacon</div>}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto]">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-3 text-[13px] text-white/70"><span className="mono flex justify-between text-[11px] uppercase tracking-[.12em]">Speed <b className="text-lime">{speed.toFixed(1)}×</b></span><input type="range" min={0.5} max={2} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} aria-label="Rover speed" /></label>
          <label className="grid gap-3 text-[13px] text-white/70"><span className="mono flex justify-between text-[11px] uppercase tracking-[.12em]">Sensor range <b className="text-lime">{Math.round(range / 2)} cm</b></span><input type="range" min={100} max={260} step={10} value={range} onChange={(e) => setRange(+e.target.value)} aria-label="Sensor range" /></label>
          <Toggle on={rays} set={setRays} label="Show sensor rays" />
          <Toggle on={trail} set={setTrail} label="Show path trail" />
        </div>
        <div className="grid grid-cols-3 gap-2 place-self-center" aria-label="On-screen controls">
          <span /><button className="btn btn-ghost !min-h-12 !w-12 !p-0 touch-none" aria-label="Forward" {...hold("up")}><ArrowUp size={18} /></button><span />
          <button className="btn btn-ghost !min-h-12 !w-12 !p-0 touch-none" aria-label="Turn left" {...hold("left")}><ArrowLeft size={18} /></button>
          <button className="btn btn-ghost !min-h-12 !w-12 !p-0 touch-none" aria-label="Reverse" {...hold("down")}><ArrowDown size={18} /></button>
          <button className="btn btn-ghost !min-h-12 !w-12 !p-0 touch-none" aria-label="Turn right" {...hold("right")}><ArrowRight size={18} /></button>
        </div>
      </div>
      <p className="mono mt-5 text-[11px] leading-relaxed text-white/55">Five ray-cast ultrasonic sensors feed a simple reactive controller: steer toward the beacon, veer away from close obstacles, and back out if stuck. Click the arena and use arrow keys / WASD, or switch to Manual.</p>
    </div>
  );
}
