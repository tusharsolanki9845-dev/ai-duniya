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
