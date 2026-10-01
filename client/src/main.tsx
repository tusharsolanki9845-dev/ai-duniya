import { createRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/manrope";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./index.css";

// Optional Umami analytics: only loaded when both env vars are set (no more broken placeholder script).
const analyticsUrl = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const analyticsId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined;
if (analyticsUrl && analyticsId) {
  const s = document.createElement("script");
  s.defer = true;
  s.src = `${analyticsUrl.replace(/\/$/, "")}/umami`;
  s.setAttribute("data-website-id", analyticsId);
  document.head.appendChild(s);
}

createRoot(document.getElementById("root")!).render(<App />);
