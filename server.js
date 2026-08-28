// Production server for Hostinger Node.js hosting.
// Serves the statically exported Next.js site from the `out/` folder.
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, "out");

// Next's static export puts each route's RSC prefetch payload in a
// directory named after the route (e.g. `out/drop/`), alongside the
// actual page as a sibling `drop.html`. Without this, express.static
// sees the `drop/` directory first, redirects to `/drop/` looking for
// an index file, and 404s since only `drop.html` exists. So: resolve
// `<route>.html` explicitly before static/directory handling kicks in.
app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const routePath = req.path.replace(/\/+$/, "");
  if (routePath === "" || path.extname(routePath)) return next();
  const htmlPath = path.join(OUT_DIR, `${routePath}.html`);
  fs.stat(htmlPath, (err, stats) => {
    if (!err && stats.isFile()) return res.sendFile(htmlPath);
    next();
  });
});

// Serve static files; `extensions: ["html"]` lets /about resolve to /about.html
app.use(express.static(OUT_DIR, { extensions: ["html"] }));

// Anything not found falls back to the exported 404 page.
app.use((req, res) => {
  res.status(404).sendFile(path.join(OUT_DIR, "404.html"), (err) => {
    if (err) res.status(404).send("Not Found");
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
