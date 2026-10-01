import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { SITE } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";
const INTERESTS = ["General question", "Course enrolment", "Examination", "Robotics Labs", "AI Labs", "Products & applied labs", "Business / team training", "Fees"];

const TOPIC_MAP: Record<string, string> = {
  fees: "Fees", business: "Business / team training", exam: "Examination", products: "Products & applied labs", robotics: "Robotics Labs", ai: "AI Labs",
};

/**
 * Real submit path, zero-budget friendly:
 *  - If VITE_FORM_ENDPOINT is set (e.g. a free Formspree/Getform/Web3Forms URL) the form POSTs JSON there.
 *  - Otherwise it opens the visitor's email app with everything pre-filled (mailto:), so no message is lost.
 */
export default function ContactForm({ compact = false, initialInterest = "", initialMessage = "" }: { compact?: boolean; initialInterest?: string; initialMessage?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [interest, setInterest] = useState(INTERESTS.includes(initialInterest) ? initialInterest : INTERESTS[0]);
  const [message, setMessage] = useState(initialMessage);
  const [error, setError] = useState("");

  useEffect(() => { if (initialMessage) setMessage(initialMessage); }, [initialMessage]);
  useEffect(() => { if (INTERESTS.includes(initialInterest)) setInterest(initialInterest); }, [initialInterest]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // honeypot
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const body = message.trim();
    if (name.length < 2) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Please enter a valid email address.");
    if (body.length < 10) return setError("Tell us a little more (at least a sentence).");
    setError("");

    const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;
    if (endpoint) {
      setStatus("sending");
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, interest, message: body, _subject: `AI DUNIYA enquiry — ${interest}` }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setStatus("sent"); form.reset(); setMessage("");
      } catch {
        setStatus("error");
        toast.error("Couldn't send right now. Please try again or email us directly.");
      }
      return;
    }
    const subject = encodeURIComponent(`AI DUNIYA enquiry — ${interest}`);
    const text = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInterest: ${interest}\n\n${body}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${text}`;
    setStatus("sent");
    toast.success("Opening your email app with the message ready to send.");
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div key="ok" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass card grid place-items-center gap-4 py-16 text-center" role="status">
            <div className="relative grid h-20 w-20 place-items-center"><span className="pulse-ring" /><CheckCircle2 size={44} className="text-lime" /></div>
            <h3 className="text-3xl tracking-tight">Signal sent.</h3>
            <p className="max-w-sm text-white/65">Thanks — the AI DUNIYA team will get back to you soon. If your email app opened, press send to complete the message.</p>
            <button className="btn btn-ghost btn-sm mt-2" onClick={() => setStatus("idle")}>Send another</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate className={`glass card grid gap-5 ${compact ? "" : "sm:p-9"}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="field"><span>Your name</span><input name="name" autoComplete="name" placeholder="Jane Doe" required /></label>
              <label className="field"><span>Email</span><input name="email" type="email" autoComplete="email" placeholder="jane@company.com" required /></label>
            </div>
            <label className="field"><span>I'm interested in</span>
              <select value={interest} onChange={(e) => setInterest(e.target.value)} name="interest">{INTERESTS.map((i) => <option key={i}>{i}</option>)}</select>
            </label>
            <label className="field"><span>Message</span><textarea name="message" rows={compact ? 3 : 5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A sentence or two is perfect…" required /></label>
            <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 opacity-0" />
            {error && <p role="alert" className="flex items-center gap-2 text-sm text-[#ff8a8a]"><AlertCircle size={16} /> {error}</p>}
            <button className="btn btn-lime justify-self-start" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send the signal"} <Send size={15} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export { TOPIC_MAP, INTERESTS };
