import { useMemo, useState } from "react";
import { ArrowUpRight, Clock3, Search, SearchX } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { PageHero } from "@/components/Chrome";
import CourseDrawer from "@/components/CourseDrawer";
import Reveal from "@/components/fx/Reveal";
import TiltCard from "@/components/fx/TiltCard";
import { CATEGORIES, COURSES, LEVELS, SITE } from "@/lib/site";

export default function Courses() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("Any level");
  const [query, setQuery] = useState("");
  const [, navigate] = useLocation();
  const search = useSearch();
  const openId = new URLSearchParams(search).get("c");
  const open = COURSES.find((c) => c.id === openId) ?? null;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COURSES.filter((c) => (category === "All" || c.category === category) && (level === "Any level" || c.level === level) && (!q || `${c.title} ${c.blurb} ${c.tag} ${c.category}`.toLowerCase().includes(q)));
  }, [category, level, query]);

  const reset = () => { setCategory("All"); setLevel("Any level"); setQuery(""); };

  return (
    <>
      <PageHero eyebrow="03 / Courses" title={<>Learn loudly.<br /><em>Build bravely.</em></>}>Live cohorts and studios that move you from “I should learn AI” to “I just shipped it.” Next cohort starts {SITE.nextCohort}.</PageHero>

      <section className="section pt-2">
        <div className="wrap">
          <div className="glass mb-10 grid gap-5 rounded-3xl p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {CATEGORIES.map((c) => <button key={c} className={`chip ${category === c ? "active" : ""}`} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={level} onChange={(e) => setLevel(e.target.value as (typeof LEVELS)[number])} aria-label="Filter by level" className="mono rounded-full border border-white/15 bg-white/[.04] px-4 py-2.5 text-[12px] text-white">
                {LEVELS.map((l) => <option key={l} className="bg-[#0f1412]">{l}</option>)}
              </select>
              <label className="relative"><Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses" aria-label="Search courses" className="w-full rounded-full border border-white/15 bg-white/[.04] py-2.5 pl-10 pr-4 text-[13px] text-white placeholder:text-white/35 focus:border-lime focus:outline-none md:w-56" /></label>
            </div>
          </div>

          <div className="mono mb-6 text-[11px] uppercase tracking-[.14em] text-white/60" aria-live="polite" data-testid="course-count">{list.length} course{list.length === 1 ? "" : "s"}</div>

          {list.length === 0 ? (
            <div className="glass card grid place-items-center gap-4 py-20 text-center"><SearchX size={36} className="text-white/40" /><p className="text-lg">No courses match those filters.</p><button className="btn btn-ghost btn-sm" onClick={reset}>Clear filters</button></div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.08}>
                  <TiltCard as="button" className={`glass card hue-${c.hue} flex h-full w-full min-h-[330px] flex-col justify-between text-left`} onClick={() => navigate(`/courses?c=${c.id}`)} aria-label={`${c.title} — view syllabus`} data-testid={`course-${c.id}`}>
                    <div className="flex items-center justify-between"><span className="mono text-[11px] uppercase tracking-[.16em] hue-dot">{c.tag}</span><span className="chip !py-1 !text-[10.5px]">{c.level}</span></div>
                    <div><h3 className="mt-10 text-[28px] leading-[1.08] tracking-tight">{c.title}</h3><p className="mt-3 text-[14.5px] leading-relaxed text-white/60">{c.blurb}</p></div>
                    <div className="mono mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] uppercase tracking-[.1em] text-white/55"><span className="inline-flex items-center gap-2"><Clock3 size={13} /> {c.duration} · {c.format}</span><ArrowUpRight size={16} className="hue-dot" /></div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
      <CourseDrawer course={open} onClose={() => navigate("/courses", { replace: true })} />
    </>
  );
}
