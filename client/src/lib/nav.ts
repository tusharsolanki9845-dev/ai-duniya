import { useCallback } from "react";
import { useLocation } from "wouter";

/** Scroll to an element id, retrying briefly so it works right after a route change. */
export function scrollToHash(hash: string, tries = 40) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (tries > 0) requestAnimationFrame(() => scrollToHash(hash, tries - 1));
}

/**
 * Client-side navigation that understands `/path#hash` and `/path?query`.
 * Replaces the old `window.location.href = ...` which reloaded the whole app.
 */
export function useGoTo() {
  const [location, navigate] = useLocation();
  return useCallback(
    (href: string) => {
      if (/^(https?:|mailto:|tel:)/.test(href)) {
        window.location.href = href;
        return;
      }
      const hashIndex = href.indexOf("#");
      const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
      const beforeHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
      const path = beforeHash.split("?")[0];
      const samePath = !path || path === location;

      if (path && (!samePath || beforeHash.includes("?"))) navigate(href);

      if (hash) {
        if (samePath) scrollToHash(hash);
        else requestAnimationFrame(() => scrollToHash(hash));
      } else if (!samePath) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    },
    [location, navigate]
  );
}

/** True for a plain left-click that the router should handle. */
export function isPlainClick(e: React.MouseEvent) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

/** Tiny safe wrapper around localStorage (private mode / disabled storage safe). */
export const safeStore = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
};

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
