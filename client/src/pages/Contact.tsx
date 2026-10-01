import { Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { useSearch } from "wouter";
import { openAssistant, PageHero } from "@/components/Chrome";
import ContactForm, { TOPIC_MAP } from "@/components/ContactForm";
import Reveal from "@/components/fx/Reveal";
import { COURSES, EXAMS, SITE } from "@/lib/site";

export default function Contact() {
  const params = new URLSearchParams(useSearch());
  const course = COURSES.find((c) => c.id === params.get("course"));
  const track = EXAMS.find((e) => e.id === params.get("track"));
  const topic = params.get("topic") ?? "";

  let interest = TOPIC_MAP[topic] ?? "";
  let message = "";
  if (course) { interest = "Course enrolment"; message = `I'd like to apply for "${course.title}" (next cohort ${SITE.nextCohort}). Please share cohort dates and fees.`; }
  else if (track) { interest = "Examination"; message = `I'd like to register for the full "${track.title}" examination. Please share the next available date.`; }

  const rows = [
    { i: Mail, k: "Email", v: <a href={`mailto:${SITE.email}`} className="transition hover:text-lime">{SITE.email}</a> },
    { i: Phone, k: "Phone", v: <a href={SITE.phoneHref} className="transition hover:text-lime">{SITE.phone}</a> },
    { i: MapPin, k: "Studio", v: <>AI DUNIYA Studio<br />{SITE.city}</> },
    { i: Clock3, k: "Working hours", v: SITE.hours },
  ];

  return (
    <>
      <PageHero eyebrow="05 / Contact us" title={<>Let&apos;s make<br /><em>something useful.</em></>}>Have a question, an idea, or a team that wants to build with AI? Send a signal. We&apos;d love to hear from you.</PageHero>
      <section className="section pt-2">
        <div className="wrap grid gap-14 lg:grid-cols-[.85fr_1.15fr]">
          <Reveal>
            <div className="eyebrow">Contact details</div>
            <h2 className="h-sec mt-6">Find us<br /><em>where ideas happen.</em></h2>
            <ul className="mt-10 grid gap-3">
              {rows.map(({ i: Icon, k, v }) => (
                <li key={k} className="glass flex items-start gap-4 rounded-2xl p-5"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime/10 text-lime"><Icon size={19} /></span><span><small className="mono block text-[10.5px] uppercase tracking-[.14em] text-white/60">{k}</small><span className="mt-1 block text-[15px] leading-snug text-white/90">{v}</span></span></li>
              ))}
            </ul>
            <button className="btn btn-ghost btn-sm mt-6" onClick={openAssistant}><Sparkles size={14} /> Quick question? Ask the site guide</button>
          </Reveal>
          <Reveal delay={0.1}>
            {course && <div className="mono mb-4 rounded-2xl border border-lime/30 bg-lime/[.06] px-5 py-3 text-[11px] uppercase tracking-[.12em] text-lime" role="status">Applying for · {course.title}</div>}
            <ContactForm initialInterest={interest} initialMessage={message} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
