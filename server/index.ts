import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = "production";
  }

  const app = express();
  const server = createServer(app);

  // Built files live in dist/public. The bundled server sits in dist/, so "public" is next to it.
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.disable("x-powered-by");
  app.get("/healthz", (_req, res) => res.json({ ok: true }));

  // Hashed build assets can be cached forever; everything else revalidates.
  app.use("/assets", express.static(path.join(staticPath, "assets"), { immutable: true, maxAge: "1y", fallthrough: false }));
  app.use(express.static(staticPath, { maxAge: "1h", index: false }));

  // Single-page app: any other *page* request gets index.html. Missing files (with an extension) stay 404.
  app.get("*", (req, res) => {
    if (path.extname(req.path)) return res.status(404).type("text").send("Not found");
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const requestedPort = Number(process.env.PORT) || 3000;

  const startListening = (port: number) => {
    server.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        const fallbackPort = port + 1;
        console.warn(`Port ${port} is busy, retrying on http://localhost:${fallbackPort}/`);
        startListening(fallbackPort);
        return;
      }

      console.error(error);
      process.exit(1);
    });

    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}/`);
    });
  };

  startListening(requestedPort);
}

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
