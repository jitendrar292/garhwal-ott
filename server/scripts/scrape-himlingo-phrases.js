#!/usr/bin/env node
/**
 * Scraper for Himlingo Garhwali phrase collections.
 * Source: https://himlingo.com/phrases/?lang=garhwali
 *
 * Two-stage crawl:
 *   1. Walk every paginated index page (page/N/?lang=garhwali) and collect
 *      all collection URLs (https://himlingo.com/phrase/<slug>/).
 *   2. Fetch each collection page, parse all <div class="collection-item">
 *      blocks for the Romanized Garhwali line + English translation.
 *
 * Note: Himlingo phrases are stored in **Roman script** (not Devanagari).
 * The consuming code labels them clearly so the LLM converts to Devanagari
 * when emitting answers.
 *
 * Output: src/data/himlingo-phrases.js — `[{ en, gwRoman, collection }]`.
 *
 * Run from server/:   node scripts/scrape-himlingo-phrases.js
 */

const fs = require('fs');
const path = require('path');

const BASE = 'https://himlingo.com/phrases/?lang=garhwali';
const PAGE_BASE = (n) => `https://himlingo.com/phrases/page/${n}/?lang=garhwali`;
const UA = 'Mozilla/5.0 (compatible; PahadiTube-Scraper/1.0; +https://garhwali-stream.onrender.com)';
const OUT_PATH = path.resolve(__dirname, '..', 'src', 'data', 'himlingo-phrases.js');

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) {
    const err = new Error(`${url} → HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.text();
}

function decode(html) {
  return String(html || '')
    .replace(/&amp;/g, '&').replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const COLLECTION_LINK_RE = /<a\s+href="(https:\/\/himlingo\.com\/phrase\/[a-z0-9-]+\/)"\s+class="culture-card culture-card--phrase"/g;
const COLLECTION_TITLE_RE = /<h1[^>]*class="culture-hero__title"[^>]*>([\s\S]*?)<\/h1>/i;
const ITEM_RE = /<div class="collection-item collection-item--phrase"[\s\S]*?<p class="collection-item__native">([\s\S]*?)<\/p>[\s\S]*?<div class="collection-item__translation">[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>\s*<\/div>/g;

async function listCollectionUrls() {
  const all = new Set();
  for (let page = 1; page <= 50; page++) {
    const url = page === 1 ? BASE : PAGE_BASE(page);
    let html;
    try {
      html = await fetchHtml(url);
    } catch (err) {
      if (err.status === 404) break;
      throw err;
    }
    let m;
    const before = all.size;
    while ((m = COLLECTION_LINK_RE.exec(html)) !== null) all.add(m[1]);
    if (all.size === before) break; // no new links → stop
  }
  return [...all];
}

async function scrapeCollection(url) {
  const html = await fetchHtml(url);
  const titleMatch = COLLECTION_TITLE_RE.exec(html);
  const collection = titleMatch ? decode(titleMatch[1]) : url.split('/').filter(Boolean).pop();
  const items = [];
  let m;
  while ((m = ITEM_RE.exec(html)) !== null) {
    const gwRoman = decode(m[1]);
    const en = decode(m[2]);
    if (!gwRoman || !en) continue;
    items.push({ en, gwRoman, collection });
  }
  return items;
}

async function main() {
  console.log('[himlingo-phrases] listing collections…');
  const urls = await listCollectionUrls();
  console.log(`[himlingo-phrases] ${urls.length} collections`);

  const all = [];
  for (let i = 0; i < urls.length; i += 4) {
    const batch = urls.slice(i, i + 4).map((u) =>
      scrapeCollection(u).catch((err) => {
        console.warn(`  failed ${u}: ${err.message}`);
        return [];
      })
    );
    const results = await Promise.all(batch);
    for (const r of results) all.push(...r);
    process.stdout.write(`\r[himlingo-phrases] processed ${Math.min(i + 4, urls.length)}/${urls.length}, ${all.length} phrases`);
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log('');

  // Dedupe on (en|gwRoman)
  const seen = new Set();
  const unique = [];
  for (const p of all) {
    const key = `${p.en.toLowerCase()}|${p.gwRoman.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  console.log(`[himlingo-phrases] ${unique.length} unique phrases (from ${all.length} raw)`);

  unique.sort((a, b) => a.en.localeCompare(b.en));

  const header = `// Auto-generated from https://himlingo.com/phrases/?lang=garhwali — do not hand-edit.
// Re-run: \`node scripts/scrape-himlingo-phrases.js\` from the server/ directory.
//
// IMPORTANT: \`gwRoman\` is in Roman/Latin script (Himlingo's source format),
// not Devanagari. Consumers must clearly label this for the LLM so output
// stays in Devanagari Garhwali.
//
// Each entry: { en, gwRoman, collection }.
`;
  const body = `module.exports = ${JSON.stringify(unique, null, 2)};\n`;
  fs.writeFileSync(OUT_PATH, header + body);
  console.log(`[himlingo-phrases] wrote ${OUT_PATH} (${(fs.statSync(OUT_PATH).size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('[himlingo-phrases] fatal:', err);
  process.exit(1);
});
