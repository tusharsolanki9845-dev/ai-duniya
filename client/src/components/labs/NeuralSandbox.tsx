import { useEffect, useMemo, useRef, useState } from "react";
import { Dices, Zap } from "lucide-react";

/** Deterministic PRNG so a given seed always yields the same network. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Number of trainable parameters (weights + biases) for the given layer sizes. */
export function countParams(sizes: number[]) {
  let total = 0;
  for (let i = 0; i < sizes.length - 1; i++) total += sizes[i] * sizes[i + 1] + sizes[i + 1];
  return total;
}

type Net = { sizes: number[]; w: number[][][]; b: number[][] };
export function buildNet(sizes: number[], seed: number): Net {
  const rand = mulberry32(seed);
  const w: number[][][] = [], b: number[][] = [];
  for (let l = 0; l < sizes.length - 1; l++) {
    const scale = 1.4 / Math.sqrt(sizes[l]);
    w.push(Array.from({ length: sizes[l + 1] }, () => Array.from({ length: sizes[l] }, () => (rand() * 2 - 1) * scale * 1.6)));
    b.push(Array.from({ length: sizes[l + 1] }, () => (rand() * 2 - 1) * 0.2));
  }
  return { sizes, w, b };
}
export function forward(net: Net, input: number[]) {
  const acts: number[][] = [input];
  for (let l = 0; l < net.w.length; l++) {
    const prev = acts[l];
    const last = l === net.w.length - 1;
    const z = net.w[l].map((row, j) => row.reduce((s, wv, i) => s + wv * prev[i], net.b[l][j]));
    acts.push(last ? z : z.map(Math.tanh));
  }
  const out = acts[acts.length - 1];
  const m = Math.max(...out);
  const ex = out.map((v) => Math.exp(v - m));
  const sum = ex.reduce((a, b) => a + b, 0);
  return { acts, probs: ex.map((e) => e / sum) };
}

const VW = 760, VH = 360;

export default function NeuralSandbox() {
  const [hidden, setHidden] = useState(2);
  const [neurons, setNeurons] = useState(5);
  const [seed, setSeed] = useState(7);
  const [inputs, setInputs] = useState([0.6, -0.3, 0.8]);
  const [fire, setFire] = useState(-1);
  const timers = useRef<number[]>([]);

  const sizes = useMemo(() => [3, ...Array(hidden).fill(neurons), 2], [hidden, neurons]);
  const net = useMemo(() => buildNet(sizes, seed), [sizes, seed]);
  const { acts, probs } = useMemo(() => forward(net, inputs), [net, inputs]);
  const params = countParams(sizes);

  const xs = sizes.map((_, i) => 60 + (i * (VW - 120)) / (sizes.length - 1));
  const pos = (l: number, i: number) => ({ x: xs[l], y: VH / 2 + (i - (sizes[l] - 1) / 2) * Math.min(46, (VH - 60) / Math.max(sizes[l], 1)) });

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const shoot = () => {
    timers.current.forEach(clearTimeout); timers.current = [];
    sizes.forEach((_, l) => timers.current.push(window.setTimeout(() => setFire(l), l * 260)));
    timers.current.push(window.setTimeout(() => setFire(-1), sizes.length * 260 + 500));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_290px]" data-testid="neural-sandbox">
      <div className="glass card !p-3 sm:!p-5">
        <svg viewBox={`0 0 ${VW} ${VH}`} className="h-auto w-full" role="img" aria-label={`Neural network with ${sizes.join(", ")} neurons per layer`}>
          {net.w.map((layer, l) => layer.map((row, j) => row.map((wv, i) => {
            const a = pos(l, i), b = pos(l + 1, j);
            const on = fire === l + 1;
            return <line key={`${l}-${j}-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={wv >= 0 ? "#d8fa32" : "#a495ff"} strokeOpacity={on ? 0.85 : Math.min(0.55, 0.08 + Math.abs(wv) * 0.4)} strokeWidth={0.4 + Math.abs(wv) * 1.6} style={{ transition: "stroke-opacity .25s" }} />;
          })))}
          {sizes.map((n, l) => Array.from({ length: n }, (_, i) => {
            const p = pos(l, i), v = acts[l][i], mag = Math.min(1, Math.abs(v));
            const on = fire === l;
            return (
              <g key={`${l}-${i}`}>
                {on && <circle cx={p.x} cy={p.y} r={22} fill="none" stroke="#d8fa32" strokeOpacity=".7" style={{ animation: "ring .8s ease-out", transformOrigin: `${p.x}px ${p.y}px` }} />}
                <circle cx={p.x} cy={p.y} r={on ? 14 : 11} fill={v >= 0 ? `rgba(216,250,50,${0.15 + mag * 0.85})` : `rgba(94,240,255,${0.15 + mag * 0.85})`} stroke={v >= 0 ? "#d8fa32" : "#5ef0ff"} strokeWidth="1.5" style={{ transition: "r .2s, fill .3s" }}>
                  <title>{`Layer ${l} · neuron ${i + 1} · activation ${v.toFixed(3)}`}</title>
                </circle>
              </g>
            );
          }))}
          {sizes.map((_, l) => (
            <text key={l} x={xs[l]} y={VH - 8} textAnchor="middle" className="mono" fill="rgba(243,240,233,.45)" fontSize="11" letterSpacing="1.5">
              {l === 0 ? "INPUT" : l === sizes.length - 1 ? "OUTPUT" : `HIDDEN ${l}`}
            </text>
          ))}
        </svg>
        <p className="mono mt-2 px-2 text-[11px] leading-relaxed text-white/55">Lime = positive weight / activation · violet & cyan = negative. Hidden layers use tanh; outputs pass through softmax.</p>
      </div>

      <div className="grid content-start gap-5">
        <div className="glass card !p-5">
          <div className="mono text-[11px] uppercase tracking-[.14em] text-white/50">Architecture</div>
          <div className="mt-4 grid gap-5">
            <label className="grid gap-3"><span className="mono flex justify-between text-[11px] uppercase tracking-[.12em] text-white/70">Hidden layers <b className="text-lime">{hidden}</b></span><input type="range" min={1} max={4} value={hidden} onChange={(e) => setHidden(+e.target.value)} aria-label="Hidden layers" /></label>
            <label className="grid gap-3"><span className="mono flex justify-between text-[11px] uppercase tracking-[.12em] text-white/70">Neurons / layer <b className="text-lime">{neurons}</b></span><input type="range" min={2} max={8} value={neurons} onChange={(e) => setNeurons(+e.target.value)} aria-label="Neurons per layer" /></label>
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
            <span className="mono text-[11px] uppercase tracking-[.12em] text-white/50">Parameters</span>
            <span className="font-[family-name:var(--font-display)] text-4xl tracking-tight text-lime" data-testid="param-count">{params}</span>
          </div>
        </div>

        <div className="glass card !p-5">
          <div className="mono text-[11px] uppercase tracking-[.14em] text-white/50">Input signal</div>
          <div className="mt-4 grid gap-4">
            {inputs.map((v, i) => (
              <label key={i} className="grid gap-2"><span className="mono flex justify-between text-[11px] uppercase tracking-[.12em] text-white/70">x{i + 1}<b className="text-lime">{v.toFixed(2)}</b></span>
                <input type="range" min={-1} max={1} step={0.05} value={v} aria-label={`Input ${i + 1}`} onChange={(e) => setInputs((prev) => prev.map((p, k) => (k === i ? +e.target.value : p)))} />
              </label>
            ))}
          </div>
          <div className="mt-5 grid gap-3 border-t border-white/10 pt-4">
            {["Class A", "Class B"].map((label, i) => (
              <div key={label}>
                <div className="mono mb-1.5 flex justify-between text-[11px] uppercase tracking-[.12em] text-white/70"><span>{label}</span><b className="text-lime">{(probs[i] * 100).toFixed(1)}%</b></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-lime to-cyan-glow transition-all duration-300" style={{ width: `${probs[i] * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn btn-lime flex-1" onClick={shoot}><Zap size={15} /> Fire signal</button>
          <button className="btn btn-ghost" onClick={() => setSeed((s) => s + 1)} aria-label="Randomize weights"><Dices size={16} /></button>
        </div>
      </div>
    </div>
  );
}
