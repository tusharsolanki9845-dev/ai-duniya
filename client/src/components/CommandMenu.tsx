import { useEffect, useState } from "react";
import { BookOpen, Bot, Cpu, FileCheck2, Home, Mail, MessagesSquare, Sparkles, User } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { COURSES } from "@/lib/site";
import { useGoTo } from "@/lib/nav";
import { openAssistant } from "./Chrome";

const PAGES = [
  { label: "Home", href: "/", icon: Home },
  { label: "About us", href: "/about", icon: User },
  { label: "Labs", href: "/labs", icon: Sparkles },
  { label: "AI Labs — neural sandbox, tokenizer, prompt builder", href: "/labs/ai", icon: Bot },
  { label: "Robotics Labs — drive the rover", href: "/labs/robotics", icon: Cpu },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Examination — practice rounds", href: "/examination", icon: FileCheck2 },
  { label: "Contact us", href: "/contact", icon: Mail },
];

/** Ctrl/Cmd + K command palette to jump anywhere or open a course. */
export default function CommandMenu() {
  const [open, setOpen] = useState(false);
  const go = useGoTo();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command", onOpen);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("open-command", onOpen); };
  }, []);

  const run = (fn: () => void) => { setOpen(false); setTimeout(fn, 60); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search AI DUNIYA" description="Jump to a page or course" className="border-white/10 bg-[#0a0e0c] text-white">
      <CommandInput placeholder="Search pages, courses, labs…" />
      <CommandList>
        <CommandEmpty>Nothing found. Try “robotics” or “exam”.</CommandEmpty>
        <CommandGroup heading="Pages">
          {PAGES.map(({ label, href, icon: Icon }) => (
            <CommandItem key={href} value={label} onSelect={() => run(() => go(href))}><Icon className="text-lime" />{label}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Courses">
          {COURSES.map((c) => (
            <CommandItem key={c.id} value={`${c.title} ${c.tag} ${c.category}`} onSelect={() => run(() => go(`/courses?c=${c.id}`))}><BookOpen className="text-cyan-glow" />{c.title}</CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem value="ask the site guide assistant help" onSelect={() => run(openAssistant)}><MessagesSquare className="text-lime" />Ask the site guide</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
