#!/usr/bin/env node
/**
 * One-shot scraper for the Himlingo Garhwali dictionary.
 * Source: https://himlingo.com/dictionary/garhwali/ (4,200+ words across ~141 pages)
 *
 * Pulls every word card from each paginated index, parses the Garhwali term,
 * English headword, and English gloss, dedupes, then writes a CommonJS module
 * to ../src/data/himlingo-dictionary.js. The module is consumed by aiCache.js
 * to enrich glossary RAG with bulk EN↔GW lookup (curated entries still rank
 * higher because they carry richer Hindi + tag metadata).
 *
 * Run from the server/ directory:   node scripts/scrape-himlingo.js
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://himlingo.com/dictionary/garhwali/';
const UA = 'Mozilla/5.0 (compatible; PahadiTube-Scraper/1.0; +https://garhwali-stream.onrender.com)';
const OUT_PATH = path.resolve(__dirname, '..', 'src', 'data', 'himlingo-dictionary.js');
const BATCH_SIZE = 8;       // concurrent page fetches
const DELAY_BETWEEN_BATCH_MS = 250;

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

// Each card on the listing page looks like:
//   <div class="word-list-item">
//     <a href="…/word/" class="word-list-link">
//       <div class="word-list-main">
//         <div class="word-list-word">
//           <span class="word-list-title">गढ़वाली शब्द</span>
//           <span class="word-list-english">english</span>
//         </div>
//         <p class="word-list-meaning">gloss…</p>
// We pull each <div class="word-list-item"> chunk, then regex out the three fields.
const CARD_RE = /<div class="word-list-item">([\s\S]*?)<\/div>\s*<\/a>\s*<\/div>/g;
const TITLE_RE = /<span class="word-list-title">([\s\S]*?)<\/span>/;
const ENGLISH_RE = /<span class="word-list-english">([\s\S]*?)<\/span>/;
const MEANING_RE = /<p class="word-list-meaning">([\s\S]*?)<\/p>/;
const DIALECT_RE = /<span class="word-list-dialect">([\s\S]*?)<\/span>/;

function decode(html) {
  return String(html || '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePage(html) {
  const out = [];
  let m;
  while ((m = CARD_RE.exec(html)) !== null) {
    const chunk = m[1];
    const t = TITLE_RE.exec(chunk);
    const e = ENGLISH_RE.exec(chunk);
    const g = MEANING_RE.exec(chunk);
    const d = DIALECT_RE.exec(chunk);
    if (!t || !e) continue;
    const gw = decode(t[1]);
    const en = decode(e[1]);
    const gloss = g ? decode(g[1]) : '';
    const dialect = d ? decode(d[1]) : '';
    if (!gw || !en) continue;
    out.push({ gw, en, gloss, dialect });
  }
  return out;
}

async function detectPageCount() {
  const html = await fetchHtml(BASE);
  // Pagination footer carries last page number, e.g. "/page/141/".
  const matches = [...html.matchAll(/\/dictionary\/garhwali\/page\/(\d+)\//g)];
  const max = matches.reduce((acc, m) => Math.max(acc, parseInt(m[1], 10) || 0), 1);
  return Math.max(max, 1);
}

async function main() {
  console.log('[himlingo] detecting page count…');
  const totalPages = await detectPageCount();
  console.log(`[himlingo] ${totalPages} pages`);

  const all = [];
  for (let start = 1; start <= totalPages; start += BATCH_SIZE) {
    const batch = [];
    for (let i = start; i < start + BATCH_SIZE && i <= totalPages; i++) {
      const url = i === 1 ? BASE : `${BASE}page/${i}/`;
      batch.push(
        fetchHtml(url)
          .then((html) => ({ i, entries: parsePage(html) }))
          .catch((err) => ({ i, error: err.message, entries: [] }))
      );
    }
    const results = await Promise.all(batch);
    for (const r of results) {
      if (r.error) console.warn(`[himlingo] page ${r.i} failed: ${r.error}`);
      else all.push(...r.entries);
    }
    process.stdout.write(`\r[himlingo] scraped ${Math.min(start + BATCH_SIZE - 1, totalPages)}/${totalPages} pages, ${all.length} entries…`);
    await new Promise((r) => setTimeout(r, DELAY_BETWEEN_BATCH_MS));
  }
  console.log('');

  // Dedupe on (gw|en) pair — same Garhwali word can appear under multiple
  // English headwords; keep both, but drop exact duplicates.
  const seen = new Set();
  const unique = [];
  for (const e of all) {
    const key = `${e.gw}|${e.en}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(e);
  }
  console.log(`[himlingo] ${unique.length} unique entries (from ${all.length} raw)`);

  unique.sort((a, b) => a.en.localeCompare(b.en));

  const header = `// Auto-generated from https://himlingo.com/dictionary/garhwali/ — do not hand-edit.
// Re-run: \`node scripts/scrape-himlingo.js\` from the server/ directory.
// Each entry: { gw, en, gloss?, dialect? }. Consumed by aiCache.js for RAG lookup.
`;
  const body = `module.exports = ${JSON.stringify(unique, null, 2)};\n`;
  fs.writeFileSync(OUT_PATH, header + body);
  console.log(`[himlingo] wrote ${OUT_PATH} (${(fs.statSync(OUT_PATH).size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('[himlingo] fatal:', err);
  process.exit(1);
});
