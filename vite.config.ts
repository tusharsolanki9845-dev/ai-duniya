import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

/**
 * After the build, copy index.html -> 404.html so that GitHub Pages (which has
 * no rewrite rules) also serves the single-page app on deep links like /labs/ai.
 * Vercel / Netlify use vercel.json / public/_redirects instead.
 */
function spaFallback404(): Plugin {
  let outDir = "";
  return {
    name: "spa-404-fallback",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const index = path.join(outDir, "index.html");
      if (fs.existsSync(index)) fs.copyFileSync(index, path.join(outDir, "404.html"));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallback404()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 900,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
  },
});
