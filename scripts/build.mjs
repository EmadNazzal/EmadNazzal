// Builds every image the profile README uses into ../assets.
// No dependencies. Run: GITHUB_TOKEN=... node scripts/build.mjs
// Without a token it still builds everything except fresh stats
// (it keeps the last stats.svg if one exists).
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LOGIN = "EmadNazzal";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

// 60 / 30 / 10: void (base), chrome (text and lines), volt (the one loud accent)
const C = {
  void: "#07080b",
  void2: "#0c0e13",
  void3: "#12151c",
  chrome: "#d3dae6",
  chrome2: "rgba(211,218,230,0.62)",
  chrome3: "rgba(211,218,230,0.36)",
  line: "rgba(211,218,230,0.12)",
  line2: "rgba(211,218,230,0.22)",
  volt: "#c6ff34",
};
const SANS = `'Segoe UI Variable Display','Segoe UI',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Inter,Arial,sans-serif`;
const MONO = `ui-monospace,'SF Mono','Cascadia Code',Consolas,'Liberation Mono',monospace`;
const EASE = "cubic-bezier(0.23,1,0.32,1)";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const fmt = (n) => n.toLocaleString("en-US");

const baseStyle = `
  .sans{font-family:${SANS}} .mono{font-family:${MONO}}
  .rise{opacity:0;transform:translateY(10px);animation:rise .9s ${EASE} forwards}
  @keyframes rise{to{opacity:1;transform:none}}
  .pulse{animation:pulse 2.4s ease-in-out infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important;transform:none!important}}
`;

const frame = (w, h, body, extraStyle = "", label = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>${baseStyle}${extraStyle}</style>
<defs>
  <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="${C.line}" stroke-width="1"/></pattern>
  <radialGradient id="glow" cx="80%" cy="20%" r="70%"><stop offset="0" stop-color="${C.volt}" stop-opacity=".10"/><stop offset="1" stop-color="${C.volt}" stop-opacity="0"/></radialGradient>
  <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${C.void}" stop-opacity="0"/><stop offset="1" stop-color="${C.void}" stop-opacity=".9"/></linearGradient>
  <clipPath id="round"><rect width="${w}" height="${h}" rx="22"/></clipPath>
</defs>
<g clip-path="url(#round)">
  <rect width="${w}" height="${h}" fill="${C.void}"/>
  <rect width="${w}" height="${h}" fill="url(#grid)" opacity=".55"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  ${body}
</g>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="21.5" fill="none" stroke="${C.line2}"/>
</svg>
`;

function wrap(text, max) {
  const lines = [];
  let cur = "";
  for (const word of text.split(" ")) {
    if ((cur + " " + word).trim().length > max) { lines.push(cur); cur = word; }
    else cur = (cur + " " + word).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- hero ----------
function hero() {
  const W = 880, H = 320;
  const cx = 700, cy = 160;
  const rings = [118, 86, 54].map((r, i) => `
    <g class="spin${i}" style="transform-origin:${cx}px ${cy}px">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.line2}" stroke-dasharray="${i === 1 ? "2 7" : "40 14"}"/>
      <circle cx="${cx + r}" cy="${cy}" r="${i === 0 ? 4.5 : 3}" fill="${i === 0 ? C.volt : C.chrome}"/>
    </g>`).join("");
  const body = `
  <!-- scanning beam -->
  <rect class="scan" x="-200" y="0" width="160" height="${H}" fill="url(#beam)"/>
  ${rings}
  <circle cx="${cx}" cy="${cy}" r="16" fill="${C.void3}" stroke="${C.volt}" stroke-width="1.5"/>
  <circle class="core" cx="${cx}" cy="${cy}" r="5" fill="${C.volt}" style="transform-origin:${cx}px ${cy}px"/>
  <text class="mono" x="${cx}" y="${cy + 150}" text-anchor="middle" font-size="10" letter-spacing="2" fill="${C.chrome3}">SOFTWARE · AI · CLOUD</text>

  <g class="rise" style="animation-delay:.1s">
    <circle class="pulse" cx="52" cy="78" r="4" fill="${C.volt}"/>
    <text class="mono" x="66" y="82" font-size="12" letter-spacing="2.2" fill="${C.chrome2}">SOFTWARE ENGINEER @ BOUNCE INSIGHTS · DUBLIN</text>
  </g>
  <g class="rise" style="animation-delay:.25s">
    <text class="sans" x="46" y="160" font-size="66" font-weight="700" letter-spacing="-2.5" fill="${C.chrome}">Emad Nazzal<tspan fill="${C.volt}">.</tspan></text>
  </g>
  <g class="rise" style="animation-delay:.45s">
    <text class="sans" x="48" y="205" font-size="19" fill="${C.chrome2}">I ship production software and build AI into it:</text>
    <text class="sans" x="48" y="231" font-size="19" fill="${C.chrome2}">RAG, agents and solid architecture on AWS.</text>
  </g>
  <g class="rise" style="animation-delay:.65s">
    ${["RAG", "Agents · ADK", "AWS", "Architecture"].map((t, i, a) => {
      const x = 48 + a.slice(0, i).reduce((s, v) => s + v.length * 7.4 + 34, 0);
      const w = t.length * 7.4 + 22;
      return `<rect x="${x}" y="258" width="${w}" height="26" rx="13" fill="${C.void2}" stroke="${i === 0 ? C.volt : C.line2}"/>
      <text class="mono" x="${x + w / 2}" y="275" text-anchor="middle" font-size="11.5" fill="${i === 0 ? C.volt : C.chrome}">${esc(t)}</text>`;
    }).join("")}
  </g>`;
  const style = `
  .spin0{animation:spin 28s linear infinite}
  .spin1{animation:spin 18s linear infinite reverse}
  .spin2{animation:spin 11s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .core{animation:beat 2.4s ease-in-out infinite}
  @keyframes beat{0%,100%{transform:scale(1)}50%{transform:scale(1.6)}}
  .scan{animation:scan 7s ${EASE} infinite}
  @keyframes scan{0%{transform:translateX(0)}60%,100%{transform:translateX(1260px)}}`;
  const svg = frame(W, H, body, style, "Emad Nazzal, software engineer at Bounce Insights, Dublin")
    .replace("</defs>", `<linearGradient id="beam" x1="0" x2="1"><stop offset="0" stop-color="${C.volt}" stop-opacity="0"/><stop offset=".5" stop-color="${C.volt}" stop-opacity=".07"/><stop offset="1" stop-color="${C.volt}" stop-opacity="0"/></linearGradient></defs>`);
  writeFileSync(join(OUT, "hero.svg"), svg);
}

// ---------- AI architecture diagram ----------
function architecture() {
  const W = 880, H = 250;
  const nodes = [
    { x: 30, t: "Sources", s: "docs · data" },
    { x: 200, t: "Retrieval", s: "embed · rank" },
    { x: 370, t: "Agent", s: "ADK · plans", hot: true },
    { x: 540, t: "Tools", s: "APIs · DB" },
    { x: 710, t: "Product", s: "AWS · observed" },
  ];
  const y = 100, w = 140, h = 64;
  const boxes = nodes.map((n, i) => `
  <g class="rise" style="animation-delay:${0.1 + i * 0.12}s">
    <rect x="${n.x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${n.hot ? "rgba(198,255,52,0.06)" : C.void2}" stroke="${n.hot ? C.volt : C.line2}"/>
    <text class="sans" x="${n.x + 16}" y="${y + 28}" font-size="16" font-weight="600" fill="${n.hot ? C.volt : C.chrome}">${n.t}</text>
    <text class="mono" x="${n.x + 16}" y="${y + 48}" font-size="10.5" fill="${C.chrome3}">${esc(n.s)}</text>
  </g>`).join("");
  const links = nodes.slice(0, -1).map((n, i) => {
    const x1 = n.x + w, x2 = nodes[i + 1].x;
    return `<line x1="${x1}" y1="${y + h / 2}" x2="${x2}" y2="${y + h / 2}" stroke="${C.line2}"/>
    <line class="flow" x1="${x1}" y1="${y + h / 2}" x2="${x2}" y2="${y + h / 2}" stroke="${C.volt}" stroke-width="2" stroke-dasharray="6 24" style="animation-delay:${i * 0.3}s"/>`;
  }).join("");
  // agent <-> tools loop
  const loop = `<path d="M ${610} ${y + h} C ${610} ${y + h + 48}, ${440} ${y + h + 48}, ${440} ${y + h}" fill="none" stroke="${C.line2}"/>
  <path class="flow" d="M ${610} ${y + h} C ${610} ${y + h + 48}, ${440} ${y + h + 48}, ${440} ${y + h}" fill="none" stroke="${C.volt}" stroke-width="2" stroke-dasharray="6 24"/>
  <text class="mono" x="525" y="${y + h + 56}" text-anchor="middle" font-size="10" letter-spacing="1.5" fill="${C.chrome3}">TOOL-CALL LOOP</text>`;
  const body = `
  <text class="mono rise" x="30" y="44" font-size="11" letter-spacing="2.2" fill="${C.volt}">FIG. 01</text>
  <text class="sans rise" x="94" y="45" font-size="15" fill="${C.chrome}">Retrieval feeding an agent loop, the kind of AI feature I build into products.</text>
  ${links}${loop}${boxes}`;
  const style = `.flow{animation:flow 1.6s linear infinite}@keyframes flow{to{stroke-dashoffset:-30}}`;
  writeFileSync(join(OUT, "architecture.svg"), frame(W, H, body, style, "Diagram: sources, retrieval, agent, tools, product"));
}

// ---------- focus cards ----------
function focus() {
  const W = 880, H = 300;
  const items = [
    ["A", "Product engineering", "Features from first ticket to production: APIs, data models, interfaces, tests and deploys."],
    ["B", "Applied AI", "RAG grounded in real data, and agents on ADK that plan and call tools. The model is one component; I engineer the rest."],
    ["C", "Architecture", "My favourite part. Boundaries, data flow, failure modes: the decisions that are expensive to change later."],
    ["D", "AWS & cloud", "Infrastructure sized for the workload, deployed so the team can ship without fear."],
  ];
  const cw = 400, ch = 118;
  const body = items.map(([k, t, d], i) => {
    const x = 30 + (i % 2) * (cw + 20), y = 22 + Math.floor(i / 2) * (ch + 20);
    const lines = wrap(d, 50).map((l, j) => `<text class="sans" x="${x + 64}" y="${y + 66 + j * 19}" font-size="13.5" fill="${C.chrome2}">${esc(l)}</text>`).join("");
    return `<g class="rise" style="animation-delay:${0.1 + i * 0.12}s">
      <rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="16" fill="${C.void2}" stroke="${C.line2}"/>
      <rect x="${x + 18}" y="${y + 20}" width="30" height="30" rx="9" fill="none" stroke="${i === 1 ? C.volt : C.line2}"/>
      <text class="mono" x="${x + 33}" y="${y + 40}" text-anchor="middle" font-size="13" fill="${i === 1 ? C.volt : C.chrome}">${k}</text>
      <text class="sans" x="${x + 64}" y="${y + 41}" font-size="17" font-weight="600" fill="${C.chrome}">${esc(t)}</text>
      ${lines}
    </g>`;
  }).join("");
  writeFileSync(join(OUT, "focus.svg"), frame(W, H, body, "", "What I bring: product engineering, applied AI, architecture, AWS"));
}

// ---------- project cards ----------
function projects() {
  const list = [
    ["aurify", "001", "2026", "Live", "Aurify", "A growth platform for local businesses: marketing site, client onboarding, staff dashboard, and a kit that ships a custom website per client.", "Next.js · TypeScript · Supabase · Astro · Workers"],
    ["playport", "002", "2026", "Building", "PlayPort", "A marketplace connecting gamers with games that studios host themselves. Solana sign-in, linked wallets, purchases verified on-chain.", "React · Express · Postgres · Drizzle · Solana"],
    ["nasa", "003", "2025", "Live", "NASA Explorer", "NASA's open data made browsable: picture of the day, Mars rover photos, near-earth objects, with an AI guide to explain it.", "React · Node.js · Express · Groq"],
    ["nibbler", "004", "2024", "UCD · Team", "Nibbler", "A Manhattan restaurant recommender that weighs your tastes, how busy an area is, and what reviews really say.", "React · Django · PostgreSQL · Sentiment ML"],
  ];
  const W = 430, H = 230;
  for (const [file, num, year, status, title, desc, tech] of list) {
    const live = status === "Live";
    const pw = status.length * 7 + 26;
    const lines = wrap(desc, 52).map((l, j) => `<text class="sans" x="26" y="${118 + j * 20}" font-size="13.5" fill="${C.chrome2}">${esc(l)}</text>`).join("");
    const body = `
    <g class="rise">
      <text class="mono" x="26" y="40" font-size="11" letter-spacing="2" fill="${C.chrome3}">${num} · ${year}</text>
      <rect x="${W - 26 - pw}" y="24" width="${pw}" height="24" rx="12" fill="${live ? "rgba(198,255,52,0.08)" : C.void2}" stroke="${live ? C.volt : C.line2}"/>
      ${live ? `<circle class="pulse" cx="${W - 26 - pw + 13}" cy="36" r="3" fill="${C.volt}"/>` : ""}
      <text class="mono" x="${W - 26 - pw / 2 + (live ? 5 : 0)}" y="40" text-anchor="middle" font-size="11" fill="${live ? C.volt : C.chrome}">${esc(status)}</text>
    </g>
    <g class="rise" style="animation-delay:.12s">
      <text class="sans" x="24" y="88" font-size="28" font-weight="700" letter-spacing="-.8" fill="${C.chrome}">${esc(title)}<tspan fill="${C.volt}"> ↗</tspan></text>
    </g>
    <g class="rise" style="animation-delay:.24s">${lines}</g>
    <line x1="26" y1="${H - 46}" x2="${W - 26}" y2="${H - 46}" stroke="${C.line}"/>
    <text class="mono rise" style="animation-delay:.36s" x="26" y="${H - 22}" font-size="11" fill="${C.chrome3}">${esc(tech)}</text>`;
    writeFileSync(join(OUT, `project-${file}.svg`), frame(W, H, body, "", `${title}: ${desc}`));
  }
}

// ---------- stack ----------
function stack() {
  const W = 880;
  const rows = [
    ["Applied AI", ["RAG", "Agents", "ADK", "LLM APIs", "Vector search"]],
    ["Cloud", ["AWS", "Cloudflare Workers", "Vercel", "Docker"]],
    ["Languages", ["Python", "TypeScript", "JavaScript", "Java", "SQL"]],
    ["Interface", ["React", "Next.js", "Astro", "Vite", "three.js"]],
    ["Server", ["Node.js", "Express", "Django", "Flask", "REST"]],
    ["Data", ["PostgreSQL", "Supabase", "MongoDB", "pandas", "scikit-learn"]],
  ];
  const H = 40 + rows.length * 44;
  const body = rows.map(([label, chips], r) => {
    const y = 26 + r * 44;
    let x = 190;
    const cs = chips.map((c, i) => {
      const w = c.length * 7.6 + 26;
      const hot = r === 0;
      const s = `<g class="rise" style="animation-delay:${0.08 * r + 0.04 * i}s"><rect x="${x}" y="${y}" width="${w}" height="30" rx="15" fill="${hot ? "rgba(198,255,52,0.06)" : C.void2}" stroke="${hot ? C.volt : C.line2}"/>
      <text class="mono" x="${x + w / 2}" y="${y + 19.5}" text-anchor="middle" font-size="12" fill="${hot ? C.volt : C.chrome}">${esc(c)}</text></g>`;
      x += w + 10;
      return s;
    }).join("");
    return `<text class="mono rise" style="animation-delay:${0.08 * r}s" x="32" y="${y + 20}" font-size="11" letter-spacing="2" fill="${C.chrome3}">${label.toUpperCase()}</text>${cs}`;
  }).join("") + `<rect class="shine" x="-260" y="0" width="200" height="${H}" fill="url(#shine)"/>`;
  const style = `.shine{animation:shine 6s ${EASE} infinite 1.2s}@keyframes shine{0%{transform:translateX(0)}50%,100%{transform:translateX(1400px)}}`;
  const svg = frame(W, H, body, style, "Tech stack")
    .replace("</defs>", `<linearGradient id="shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`);
  writeFileSync(join(OUT, "stack.svg"), svg);
}

// ---------- contact pills ----------
function contact() {
  const items = [["website", "↗", "emadnazzal.com"], ["linkedin", "in", "LinkedIn"], ["email", "@", "Email"]];
  for (const [file, glyph, label] of items) {
    const w = 64 + label.length * 8.4, h = 44;
    writeFileSync(join(OUT, `contact-${file}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">
<style>${baseStyle}</style>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="21.5" fill="${C.void}" stroke="${C.line2}"/>
<circle cx="22" cy="22" r="12" fill="rgba(198,255,52,0.08)" stroke="${C.volt}"/>
<text class="sans" x="22" y="26.5" text-anchor="middle" font-size="12" font-weight="700" fill="${C.volt}">${esc(glyph)}</text>
<text class="sans" x="44" y="27" font-size="14" font-weight="500" fill="${C.chrome}">${esc(label)}</text>
</svg>
`);
  }
}

// ---------- footer ----------
function footer() {
  const W = 880, H = 120;
  const pts = Array.from({ length: 45 }, (_, i) => `${i * 20},${60 + Math.sin(i / 3) * 16}`).join(" ");
  const body = `
  <polyline class="wave" points="${pts}" fill="none" stroke="${C.volt}" stroke-width="1.5" stroke-opacity=".7"/>
  <polyline class="wave2" points="${pts}" fill="none" stroke="${C.chrome}" stroke-width="1" stroke-opacity=".18" transform="translate(0 10)"/>
  <rect x="290" y="38" width="300" height="44" rx="22" fill="${C.void}" stroke="${C.line2}"/>
  <text class="sans" x="440" y="66" text-anchor="middle" font-size="15" fill="${C.chrome}">Let's build something dependable<tspan fill="${C.volt}">.</tspan></text>`;
  const style = `.wave{stroke-dasharray:900;animation:draw 5s ${EASE} infinite alternate}
  .wave2{animation:drift 6s ease-in-out infinite alternate}
  @keyframes draw{from{stroke-dashoffset:900}to{stroke-dashoffset:0}}
  @keyframes drift{to{transform:translate(-40px,10px)}}`;
  writeFileSync(join(OUT, "footer.svg"), frame(W, H, body, style, "Let's build something dependable"));
}

// ---------- live stats (public contribution calendar) ----------
async function gql(query, variables) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) return null;
  const r = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "profile-readme-build" },
    body: JSON.stringify({ query, variables }),
  });
  const j = await r.json();
  if (j.errors) throw new Error(JSON.stringify(j.errors));
  return j.data;
}

async function stats() {
  const now = new Date();
  const yearAgo = new Date(now); yearAgo.setUTCFullYear(now.getUTCFullYear() - 1);
  const twoAgo = new Date(now); twoAgo.setUTCFullYear(now.getUTCFullYear() - 2);
  const data = await gql(`query($login:String!,$a:DateTime!,$b:DateTime!){
    user(login:$login){
      cur: contributionsCollection{ contributionCalendar{ totalContributions weeks{ contributionDays{ date contributionCount } } } }
      prev: contributionsCollection(from:$a,to:$b){ contributionCalendar{ totalContributions } }
    }}`, { login: LOGIN, a: twoAgo.toISOString(), b: yearAgo.toISOString() });
  if (!data) {
    if (existsSync(join(OUT, "stats.svg"))) { console.log("no token: kept existing stats.svg"); return; }
    throw new Error("GITHUB_TOKEN is required to build stats.svg the first time");
  }
  const days = data.user.cur.contributionCalendar.weeks.flatMap((w) => w.contributionDays);
  const total = data.user.cur.contributionCalendar.totalContributions;
  const prev = data.user.prev.contributionCalendar.totalContributions;
  const active = days.filter((d) => d.contributionCount > 0).length;
  let best = 0, run = 0;
  for (const d of days) { run = d.contributionCount ? run + 1 : 0; best = Math.max(best, run); }
  const peak = Math.max(...days.map((d) => d.contributionCount));
  const months = {};
  for (const d of days) { const k = d.date.slice(0, 7); months[k] = (months[k] || 0) + d.contributionCount; }
  const keys = Object.keys(months).sort().slice(-12);
  const growth = prev > 0 ? total / prev : 0;

  // Only show numbers that tell the real story well.
  const headline = growth >= 1.5 ? `${growth.toFixed(1)}× the year before` : `${fmt(active)} active days`;
  const minis = [
    [fmt(active), "active days"],
    [`${best}`, "day best streak"],
    [`${peak}`, "on the busiest day"],
  ];

  const W = 880, H = 270;
  const bx = 440, bw = 410, bh = 150, by = 200;
  const max = Math.max(...keys.map((k) => months[k]), 1);
  const gap = 8, barW = (bw - gap * (keys.length - 1)) / keys.length;
  const MON = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const bars = keys.map((k, i) => {
    const v = months[k], h = Math.max(3, (v / max) * bh), x = bx + i * (barW + gap);
    const last = i === keys.length - 1;
    return `<rect class="bar" style="animation-delay:${0.3 + i * 0.06}s;transform-origin:${x}px ${by}px" x="${x}" y="${by - h}" width="${barW}" height="${h}" rx="5" fill="${last ? C.volt : C.chrome}" fill-opacity="${last ? 1 : 0.18 + 0.5 * (v / max)}"/>
    <text class="mono" x="${x + barW / 2}" y="${by + 20}" text-anchor="middle" font-size="10" fill="${last ? C.volt : C.chrome3}">${MON[+k.slice(5) - 1]}</text>`;
  }).join("");

  const body = `
  <text class="mono rise" x="34" y="48" font-size="11" letter-spacing="2.2" fill="${C.chrome3}">LAST 12 MONTHS ON GITHUB</text>
  <g class="rise" style="animation-delay:.1s">
    <text class="sans" x="30" y="124" font-size="72" font-weight="700" letter-spacing="-3" fill="${C.chrome}">${fmt(total)}</text>
    <text class="sans" x="34" y="152" font-size="16" fill="${C.chrome2}">contributions, most of them in private product repos</text>
  </g>
  <g class="rise" style="animation-delay:.2s">
    <rect x="34" y="166" width="${headline.length * 7.6 + 40}" height="26" rx="13" fill="rgba(198,255,52,0.08)" stroke="${C.volt}"/>
    <text class="mono" x="50" y="183.5" font-size="12" fill="${C.volt}">↑ ${esc(headline)}</text>
  </g>
  ${minis.map(([v, l], i) => `<g class="rise" style="animation-delay:${0.3 + i * 0.1}s">
    <text class="sans" x="${34 + i * 130}" y="232" font-size="22" font-weight="600" fill="${C.chrome}">${esc(v)}</text>
    <text class="mono" x="${34 + i * 130}" y="250" font-size="10.5" fill="${C.chrome3}">${esc(l)}</text></g>`).join("")}
  <line x1="${bx}" y1="${by}" x2="${bx + bw}" y2="${by}" stroke="${C.line2}"/>
  ${bars}
  <text class="mono" x="${bx + bw}" y="${by + 48}" text-anchor="end" font-size="9.5" fill="${C.chrome3}">updated ${now.toISOString().slice(0, 10)}</text>`;
  const style = `.bar{transform:scaleY(0);animation:grow 1.1s ${EASE} forwards}@keyframes grow{to{transform:scaleY(1)}}
  @media (prefers-reduced-motion:reduce){.bar{transform:none}}`;
  writeFileSync(join(OUT, "stats.svg"), frame(W, H, body, style, `${fmt(total)} GitHub contributions in the last 12 months`));
  console.log({ total, prev, growth: growth.toFixed(2), active, best, peak });
}

hero(); architecture(); focus(); projects(); stack(); contact(); footer();
await stats();
console.log("built into", OUT);
