import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Command, Menu, Sparkles, X } from "lucide-react";
import { useLocation } from "wouter";
import { NAV, SITE } from "@/lib/site";
import { isPlainClick, useGoTo } from "@/lib/nav";

export function LogoMark() {
  return <div className="logo-mark" aria-hidden="true"><span /><span /><span /></div>;
}

/** Anchor that keeps a real href (open in new tab, SEO) but navigates client-side on click. */
export function NavAnchor({ href, className, children, onNavigate, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; onNavigate?: () => void }) {
  const go = useGoTo();
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (!isPlainClick(e) || rest.target === "_blank") return;
        e.preventDefault();
        onNavigate?.();
        go(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Brand() {
  return <NavAnchor href="/" className="brand" aria-label="AI DUNIYA home"><LogoMark /><span>AI <b>DUNIYA</b></span></NavAnchor>;
}

export const openAssistant = () => window.dispatchEvent(new Event("open-assistant"));
export const openCommand = () => window.dispatchEvent(new Event("open-command"));

export function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  const isActive = (href: string) => !href.includes("#") && (href === "/" ? location === "/" : location === href || location.startsWith(`${href}/`));

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap flex items-center justify-between gap-6">
        <Brand />
        <nav className="hidden items-center gap-7 xl:flex" aria-label="Main navigation">
          {NAV.map((item) => (
            <NavAnchor key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? "active" : ""}`} aria-current={isActive(item.href) ? "page" : undefined}>
              {item.label}
            </NavAnchor>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-sm hidden md:inline-flex" onClick={openCommand} aria-label="Open command menu">
            <Command size={14} /> Search <span className="kbd">Ctrl K</span>
          </button>
          <button className="btn btn-lime btn-sm hidden sm:inline-flex" onClick={openAssistant}>
            <Sparkles size={14} /> Ask the guide
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full border border-white/15 xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Portal to <body>: keeps this fixed overlay measured against the real viewport, not the
          header (which can gain a backdrop-filter and become its own containing block). */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="fixed inset-x-0 bottom-0 top-[64px] z-50 overflow-y-auto bg-[#06080a]/95 backdrop-blur-xl xl:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            >
              <nav className="wrap flex flex-col py-6" aria-label="Mobile navigation">
                {NAV.map((item, i) => (
                  <motion.div key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                    <NavAnchor href={item.href} onNavigate={() => setOpen(false)} className="flex items-center justify-between border-b border-white/10 py-5 font-[family-name:var(--font-display)] text-3xl tracking-tight">
                      <span className={isActive(item.href) ? "text-lime" : ""}>{item.label}</span><ArrowRight size={20} className="text-lime" />
                    </NavAnchor>
                  </motion.div>
                ))}
                <button className="btn btn-lime mt-8" onClick={() => { setOpen(false); openAssistant(); }}><Sparkles size={15} /> Ask the guide</button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-[#040607] pt-16">
      <div className="wrap grid gap-10 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/60">For the people who want to understand the future — and make it better.</p>
          <a href={`mailto:${SITE.email}`} className="link-arrow mt-6">{SITE.email} <ArrowUpRight size={14} /></a>
        </div>
        <div>
          <h4 className="mono mb-4 text-[11px] uppercase tracking-[.16em] text-white/55">Explore</h4>
          <ul className="grid gap-3 text-[15px]">
            {NAV.slice(0, 4).map((n) => <li key={n.href}><NavAnchor href={n.href} className="text-white/75 transition hover:text-lime">{n.label}</NavAnchor></li>)}
          </ul>
        </div>
        <div>
          <h4 className="mono mb-4 text-[11px] uppercase tracking-[.16em] text-white/55">Company</h4>
          <ul className="grid gap-3 text-[15px]">
            {NAV.slice(4).map((n) => <li key={n.href}><NavAnchor href={n.href} className="text-white/75 transition hover:text-lime">{n.label}</NavAnchor></li>)}
            <li><NavAnchor href="/labs/robotics" className="text-white/75 transition hover:text-lime">Robotics Labs</NavAnchor></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="wrap mono flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[.12em] text-white/60">
          <span>© {new Date().getFullYear()} AI DUNIYA</span>
          <span>Made with curiosity in India</span>
          <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_10px_#d8fa32]" /> All systems online</span>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({ eyebrow, title, children, back, aside }: { eyebrow: string; title: React.ReactNode; children?: React.ReactNode; back?: { href: string; label: string }; aside?: React.ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44">
      <div className="grid-bg" /><div className="aurora -right-32 -top-24 h-[420px] w-[420px] bg-lime/40" /><div className="aurora -left-40 top-40 h-[380px] w-[380px] bg-cyan-glow/20" />
      <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          {back && (
            <div className="mb-8">
              <NavAnchor href={back.href} className="mono inline-flex items-center gap-2 text-[11px] uppercase tracking-[.14em] text-white/55 transition hover:text-lime">← {back.label}</NavAnchor>
            </div>
          )}
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="h-page mt-6">{title}</h1>
          {children && <p className="lede mt-7">{children}</p>}
        </div>
        {aside && <div className="relative">{aside}</div>}
      </div>
    </section>
  );
}
