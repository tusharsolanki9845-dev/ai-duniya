import { ArrowRight, CalendarDays, Check, Clock3, Layers3, Signal } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useGoTo } from "@/lib/nav";
import { SITE, type Course } from "@/lib/site";

export default function CourseDrawer({ course, onClose }: { course: Course | null; onClose: () => void }) {
  const go = useGoTo();
  return (
    <Sheet open={!!course} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 overflow-y-auto border-white/10 bg-[#080b0a] p-0 text-white sm:max-w-xl">
        {course && (
          <div className={`hue-${course.hue}`}>
            <div className="relative overflow-hidden border-b border-white/10 p-7 pb-8 pt-10 sm:p-10 sm:pb-10">
              <div className="aurora -right-20 -top-20 h-64 w-64" style={{ background: "var(--h)" }} />
              <span className="mono relative text-[11px] uppercase tracking-[.16em] hue-dot">{course.tag}</span>
              <SheetTitle className="relative mt-4 text-4xl leading-[1.02] tracking-tight text-white sm:text-5xl">{course.title}</SheetTitle>
              <SheetDescription className="relative mt-4 max-w-md text-[15px] leading-relaxed text-white/70">{course.blurb}</SheetDescription>
              <div className="mono relative mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] uppercase tracking-[.1em] text-white/65">
                <span className="inline-flex items-center gap-2"><Clock3 size={14} /> {course.duration}</span>
                <span className="inline-flex items-center gap-2"><Layers3 size={14} /> {course.format}</span>
                <span className="inline-flex items-center gap-2"><Signal size={14} /> {course.level}</span>
                <span className="inline-flex items-center gap-2"><CalendarDays size={14} /> Next cohort · {SITE.nextCohort}</span>
              </div>
            </div>

            <div className="grid gap-9 p-7 sm:p-10">
              <section>
                <h3 className="mono mb-4 text-[11px] uppercase tracking-[.16em] text-white/50">You will be able to</h3>
                <ul className="grid gap-3">
                  {course.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-[15px] leading-snug text-white/85"><Check size={18} className="mt-[2px] shrink-0 hue-dot" />{o}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="mono mb-5 text-[11px] uppercase tracking-[.16em] text-white/50">Syllabus</h3>
                <ol className="relative grid gap-6 border-l border-white/12 pl-7">
                  {course.syllabus.map((s) => (
                    <li key={s.week + s.title} className="relative">
                      <span className="absolute -left-[34px] top-1.5 h-3 w-3 rounded-full border-2 border-[#080b0a]" style={{ background: "var(--h)", boxShadow: "0 0 12px var(--h)" }} />
                      <div className="mono text-[11px] uppercase tracking-[.12em] hue-dot">{s.week}</div>
                      <div className="mt-1 text-lg font-medium tracking-tight">{s.title}</div>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{s.detail}</p>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="sticky bottom-0 -mx-7 border-t border-white/10 bg-[#080b0a]/95 p-5 backdrop-blur sm:-mx-10 sm:px-10">
                <button className="btn btn-lime w-full" onClick={() => { const id = course.id; onClose(); go(`/contact?course=${id}`); }}>
                  Apply for this cohort <ArrowRight size={16} />
                </button>
                <p className="mono mt-3 text-center text-[10.5px] uppercase tracking-[.1em] text-white/60">Fees shared on enquiry</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
