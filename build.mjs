import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, "content", "poems");
const PUBLIC = path.join(ROOT, "public");
const POEMS_OUT = path.join(PUBLIC, "poems");
const INDEX = path.join(PUBLIC, "index.html");

const esc = (s="") => String(s)
  .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");

function parseScalar(v) {
  v = v.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+$/.test(v)) return Number(v);
  return v.replace(/^["']|["']$/g, "");
}

function parsePoem(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g,"\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Missing front matter: ${file}`);
  const meta = {topics: []};
  let listKey = null;
  for (const line of m[1].split("\n")) {
    const item = line.match(/^\s*-\s*(.+)$/);
    if (item && listKey) {
      meta[listKey].push(parseScalar(item[1]));
      continue;
    }
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    if (value === "") {
      meta[key] = [];
      listKey = key;
    } else {
      meta[key] = parseScalar(value);
      listKey = null;
    }
  }
  return {
    ...meta,
    slug: path.basename(file, ".md"),
    body: m[2].trim()
  };
}

function topicsHtml(p) {
  return (p.topics || []).map(t => `<span>${esc(t)}</span>`).join("");
}

function poemListItem(p, prefix="") {
  return `<a href="${prefix}poems/${encodeURIComponent(p.slug)}.html"><div><h3>${esc(p.title)}</h3><div class="topics">${topicsHtml(p)}</div></div><b>↗</b></a>`;
}

function poemPage(p) {
  const audio = p.audio
    ? `<section class="poem-audio"><p class="kicker">Аудіо</p><audio controls controlsList="nodownload noplaybackrate" disableRemotePlayback preload="none"><source src="../audio/${esc(p.audio)}" type="audio/mpeg"></audio></section>`
    : "";
  const displayDate = p.date || p.year || "";
  const dateHtml = displayDate ? `<p class="poem-date-end">${esc(displayDate)}</p>` : "";

  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(p.title)} — В. Роман-Римський | Українська поезія</title>
<meta name="description" content="«${esc(p.title)}» — вірш В. Романа-Римського. Сучасна українська поезія.">
<link rel="canonical" href="https://roman-roman.com/poems/${encodeURIComponent(p.slug)}.html">
<link rel="stylesheet" href="../style.css?v=12">
</head>
<body class="poem-page poem-page-reading">
<header>
  <button class="menu" aria-label="Меню">☰</button>
  <nav><a href="../index.html#about">Про автора</a><a href="../index.html#audio">Аудіо</a><a href="../index.html#contact">Контакти</a></nav>
</header>

<main class="poem-reading-shell">
  <a class="back-link" href="../poems.html">← Усі вірші</a>

  <article class="poem-reading">
    <p class="poem-author">В. Роман-Римський</p>
    <h1>${esc(p.title)}</h1>
    <div class="topics">${topicsHtml(p)}</div>

    <pre class="poem-text">${esc(p.body)}</pre>

    ${dateHtml}
    ${audio}
  </article>
</main>

<footer class="site-footer"><span>© <span id="year"></span> · Усі тексти та аудіоматеріали захищені авторським правом. Використання та публікація можливі лише з дозволу автора.</span><a href="../index.html">На головну ↑</a></footer>
<script>
document.getElementById("year").textContent=new Date().getFullYear();
const menu=document.querySelector(".menu"),nav=document.querySelector("nav");
if(menu&&nav) menu.addEventListener("click",()=>{nav.style.display=nav.style.display==="grid"?"none":"grid"});
</script>
</body></html>`;
}

function archivePage(poems) {
  const rows = poems.map(p => poemListItem(p, "")).join("\n");
  return `<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Вірші В. Романа-Римського — сучасна українська поезія</title>
<meta name="description" content="Усі опубліковані вірші В. Романа-Римського. Сучасна українська поезія про людину, суспільство, свободу і час.">
<link rel="canonical" href="https://roman-roman.com/poems.html">
<link rel="stylesheet" href="style.css?v=12">
</head>
<body class="archive-page">
<header>
  <button class="menu" aria-label="Меню">☰</button>
  <nav><a href="index.html#about">Про автора</a><a href="index.html#audio">Аудіо</a><a href="index.html#contact">Контакти</a></nav>
</header>
<main class="archive-shell">
  <p class="kicker">В. Роман-Римський</p>
  <h1>Усі <i>вірші</i></h1>
  <p class="archive-intro">Вірші В. Романа-Римського — сучасна українська поезія про людину, суспільство і час.</p>
  <div class="poems archive-poems">${rows}</div>
</main>
<footer class="site-footer"><span>© <span id="year"></span> · Усі тексти та аудіоматеріали захищені авторським правом. Використання та публікація можливі лише з дозволу автора.</span><a href="index.html">На головну ↑</a></footer>
<script>
document.getElementById("year").textContent=new Date().getFullYear();
const menu=document.querySelector(".menu"),nav=document.querySelector("nav");
if(menu&&nav) menu.addEventListener("click",()=>{nav.style.display=nav.style.display==="grid"?"none":"grid"});
</script>
</body></html>`;
}

fs.mkdirSync(POEMS_OUT, {recursive:true});
const poems = fs.readdirSync(CONTENT)
  .filter(f => f.endsWith(".md"))
  .map(f => parsePoem(path.join(CONTENT,f)))
  .sort((a,b) => (Number(a.order ?? 9999)-Number(b.order ?? 9999)) || String(b.year??"").localeCompare(String(a.year??"")) || a.title.localeCompare(b.title,"uk"));

for (const p of poems) {
  fs.writeFileSync(path.join(POEMS_OUT, `${p.slug}.html`), poemPage(p));
}
fs.writeFileSync(path.join(PUBLIC, "poems.html"), archivePage(poems));

let index = fs.readFileSync(INDEX, "utf8");
const featured = poems.filter(p => p.featured === true).slice(0, 8);
const featuredHtml = featured.map(p => poemListItem(p, "")).join("\n");
const block = `<div class="poems" data-generated="featured">\n${featuredHtml}\n</div>\n<div class="all-poems-link"><a class="text-link" href="poems.html">Усі вірші →</a></div>`;
index = index.replace(
  /<div class="poems"(?:\s+data-generated="featured")?>[\s\S]*?<\/div>\s*(?:<div class="all-poems-link">[\s\S]*?<\/div>)?(?=\s*<\/section>)/,
  block
);
fs.writeFileSync(INDEX, index);

// Generate search-engine discovery files automatically.
const SITE = "https://roman-roman.com";
const sitemapUrls = [
  `${SITE}/`,
  `${SITE}/poems.html`,
  ...poems.map(p => `${SITE}/poems/${encodeURIComponent(p.slug)}.html`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(url => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), sitemap);

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;
fs.writeFileSync(path.join(PUBLIC, "robots.txt"), robots);

console.log(`Built ${poems.length} poem(s); ${featured.length} featured; sitemap.xml and robots.txt generated.`);
