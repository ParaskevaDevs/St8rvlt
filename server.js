// Production server for Hostinger Node.js hosting.
// Serves the statically exported Next.js site from the `out/` folder.
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const OUT_DIR = path.join(__dirname, "out");

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
