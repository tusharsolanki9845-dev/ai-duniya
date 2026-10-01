import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/nav";

/** Types and deletes through phrases. Renders the first phrase statically for reduced motion. */
export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [i, setI] = useState(0);
  const [text, setText] = useState(prefersReducedMotion() ? phrases[0] : "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const full = phrases[i % phrases.length];
    const done = !deleting && text === full;
    const empty = deleting && text === "";
    const delay = done ? 1500 : empty ? 300 : deleting ? 32 : 62;
    const t = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) { setDeleting(false); setI((v) => v + 1); }
      else setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [text, deleting, i, phrases]);

  return <span className="caret">{text}</span>;
}
