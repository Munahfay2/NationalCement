// Tiny static server with clean URLs (/about -> about.html), like Netlify Pretty URLs.
const http = require("http"), fs = require("fs"), path = require("path");
const DIST = path.join(__dirname, "dist"), PORT = process.env.PORT || 3000;
const T = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(/\/+$/, "") || "/index";
  let f = path.normalize(path.join(DIST, p));
  if (!f.startsWith(DIST)) { res.writeHead(400); return res.end(); }
  if (!path.extname(f)) f += ".html";
  if (p.endsWith(".html") && !p.endsWith("index.html")) { res.writeHead(301, { Location: p.slice(0, -5) }); return res.end(); }
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404, { "Content-Type": T[".html"] }); return res.end(fs.readFileSync(path.join(DIST, "404.html"))); }
    res.writeHead(200, { "Content-Type": T[path.extname(f)] || "application/octet-stream" }); res.end(d);
  });
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
