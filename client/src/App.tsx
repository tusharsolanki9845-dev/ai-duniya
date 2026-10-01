import { useEffect } from "react";
import { MotionConfig, motion } from "framer-motion";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SiteFooter, SiteHeader } from "./components/Chrome";
import Assistant from "./components/Assistant";
import CommandMenu from "./components/CommandMenu";
import CursorGlow from "./components/fx/CursorGlow";
import ScrollProgress from "./components/fx/ScrollProgress";
import { scrollToHash } from "./lib/nav";
import Home from "./pages/Home";
import About from "./pages/About";
import Labs from "./pages/Labs";
import AiLabs from "./pages/AiLabs";
import RoboticsLabs from "./pages/RoboticsLabs";
import Courses from "./pages/Courses";
import Examination from "./pages/Examination";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const SEO_BY_PATH: Record<string, { title: string; description: string }> = {
  "/": { title: "AI DUNIYA — Make the future make sense.", description: "AI DUNIYA is a learning and innovation studio for AI courses, hands-on labs, robotics, examinations and practical products." },
  "/about": { title: "About AI DUNIYA | Learn, Build, Lead", description: "Meet the people behind AI DUNIYA and explore the practical, human approach behind our AI learning studio." },
  "/labs": { title: "AI Labs | Experiments, Simulators and Tools | AI DUNIYA", description: "Explore interactive AI labs, prompt tools, neural sandboxes, tokenizers and robotics simulations from AI DUNIYA." },
  "/labs/ai": { title: "AI Learning Labs | Build by Doing | AI DUNIYA", description: "Practice AI concepts through interactive tools and guided experiments designed for curious builders." },
  "/labs/robotics": { title: "Robotics Labs and Simulator | AI DUNIYA", description: "Experiment with robotics concepts and interactive simulations while learning how AI moves through the physical world." },
  "/courses": { title: "AI Courses for Modern Teams and Builders | AI DUNIYA", description: "Browse practical AI, coding, data and robotics courses for beginners, teams and people building what's next." },
  "/examination": { title: "AI Examinations and Practice Tests | AI DUNIYA", description: "Test your AI knowledge with practical examinations designed to show what you can do, not just what you can recall." },
  "/contact": { title: "Contact AI DUNIYA | Start a Conversation", description: "Talk to AI DUNIYA about courses, labs, workshops, business learning and practical AI products." },
};

function SeoManager() {
  const [location] = useLocation();

  useEffect(() => {
    const path = location.split("?")[0] || "/";
    const seo = SEO_BY_PATH[path] ?? { title: "Page not found | AI DUNIYA", description: "The requested AI DUNIYA page could not be found." };
    const canonicalUrl = `https://ai-duniya.vercel.app${path === "/" ? "/" : path}`;
    document.title = seo.title;

    const setMeta = (attribute: "name" | "property", key: string, content: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta("name", "description", seo.description);
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [location]);

  return null;
}

/** Scrolls to top on route change, or to the #hash target when one is present. */
function ScrollManager() {
  const [location] = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const hash = window.location.hash;
    if (hash) scrollToHash(hash);
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Routes() {
  const [location] = useLocation();
  return (
    <motion.div key={location} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/labs" component={Labs} />
        <Route path="/labs/ai" component={AiLabs} />
        <Route path="/labs/robotics" component={RoboticsLabs} />
        <Route path="/courses" component={Courses} />
        <Route path="/examination" component={Examination} />
        <Route path="/contact" component={Contact} />
        <Route component={NotFound} />
      </Switch>
    </motion.div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <MotionConfig reducedMotion="user">
          <TooltipProvider>
            <Toaster theme="dark" position="top-center" />
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-[#0b0d0c]">Skip to content</a>
            <ScrollManager />
            <SeoManager />
            <ScrollProgress />
            <CursorGlow />
            <SiteHeader />
            <main id="main" className="relative min-h-screen overflow-x-clip"><Routes /></main>
            <SiteFooter />
            <CommandMenu />
            <Assistant />
          </TooltipProvider>
        </MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
