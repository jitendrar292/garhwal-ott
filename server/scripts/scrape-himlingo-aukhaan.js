#!/usr/bin/env node
/**
 * Scraper for Garhwali औखाण (proverbs/idioms) from Himlingo.
 *
 * Two-stage approach:
 *   1. Scrape https://himlingo.com/proverbs/?lang=garhwali (paginated)
 *      — parses <div class="culture-card culture-card--proverb"> entries.
 *   2. Also mine phrase collections for proverb-shaped entries: multi-word
 *      Garhwali sentences that contain a comma, OR whose Hindi translation
 *      looks like a saying (contains जो/वो/जैसी/वैसी/बिना/जितना/उतना…).
 *
 * Output: prints JS entries in garhwaliLearn.js format so you can paste them
 * into the muhavare section.  Also writes a raw JSON dump to stdout with -json flag.
 *
 * Run from server/:   node scripts/scrape-himlingo-aukhaan.js
 */

const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (compatible; PahadiTube-Scraper/1.0; +https://garhwali-stream.onrender.com)';
const PROVERBS_BASE  = 'https://himlingo.com/proverbs/';
const PROVERBS_PAGE  = (n) => `https://himlingo.com/proverbs/page/${n}/?lang=garhwali`;
const PHRASES_BASE   = 'https://himlingo.com/phrases/?lang=garhwali';
const PHRASES_PAGE   = (n) => `https://himlingo.com/phrases/page/${n}/?lang=garhwali`;

// ── helpers ──────────────────────────────────────────────────────────────────
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
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8216;|&#8217;/g, "'")
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Stage 1: Proverbs index ───────────────────────────────────────────────────
// Cards look like:
//   <a href="…/proverb/<slug>/" class="culture-card culture-card--proverb">
const PROVERB_CARD_RE = /<a\s+href="(https:\/\/himlingo\.com\/proverb\/[a-z0-9-]+\/)"\s+class="culture-card culture-card--proverb"/g;

async function listProverbUrls() {
  const all = new Set();
  for (let page = 1; page <= 50; page++) {
    const url = page === 1
      ? `${PROVERBS_BASE}?lang=garhwali`
      : PROVERBS_PAGE(page);
    let html;
    try { html = await fetchHtml(url); }
    catch (err) { if (err.status === 404) break; throw err; }
    const before = all.size;
    let m;
    while ((m = PROVERB_CARD_RE.exec(html)) !== null) all.add(m[1]);
    if (all.size === before) break;
  }
  return [...all];
}

// Individual proverb page — adjust these regexes once the site populates
const PROVERB_NATIVE_RE   = /<[^>]*class="[^"]*proverb[^"]*native[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i;
const PROVERB_HINDI_RE    = /<[^>]*class="[^"]*proverb[^"]*hindi[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i;
const PROVERB_ENGLISH_RE  = /<[^>]*class="[^"]*proverb[^"]*english[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i;
const PROVERB_MEANING_RE  = /<[^>]*class="[^"]*proverb[^"]*meaning[^"]*"[^>]*>([\s\S]*?)<\/[a-z]+>/i;
const HERO_TITLE_RE       = /<h1[^>]*class="culture-hero__title"[^>]*>([\s\S]*?)<\/h1>/i;

async function scrapeProverb(url) {
  const html = await fetchHtml(url);
  const garhwali    = decode((PROVERB_NATIVE_RE.exec(html)  || [])[1] || '');
  const hindi       = decode((PROVERB_HINDI_RE.exec(html)   || [])[1] || '');
  const english     = decode((PROVERB_ENGLISH_RE.exec(html) || [])[1] || '');
  const meaning     = decode((PROVERB_MEANING_RE.exec(html) || [])[1] || '');
  // fallback: use page title as garhwali text if specific element not found
  const title       = decode((HERO_TITLE_RE.exec(html)      || [])[1] || '');
  return {
    garhwali: garhwali || title,
    hindi,
    english,
    meaning,
    url,
  };
}

// ── Stage 2: Mine phrase collections ─────────────────────────────────────────
const COLLECTION_LINK_RE = /<a\s+href="(https:\/\/himlingo\.com\/phrase\/[a-z0-9%-]+\/)"\s+class="culture-card culture-card--phrase"/g;

async function listPhraseUrls() {
  const all = new Set();
  for (let page = 1; page <= 50; page++) {
    const url = page === 1 ? PHRASES_BASE : PHRASES_PAGE(page);
    let html;
    try { html = await fetchHtml(url); }
    catch (err) { if (err.status === 404) break; throw err; }
    const before = all.size;
    let m;
    while ((m = COLLECTION_LINK_RE.exec(html)) !== null) all.add(m[1]);
    if (all.size === before) break;
  }
  return [...all];
}

// Phrase item: native Garhwali + Hindi translation
const ITEM_RE = /<div class="collection-item collection-item--phrase"[\s\S]*?<p class="collection-item__native">([\s\S]*?)<\/p>[\s\S]*?<div class="collection-item__translation">[\s\S]*?<p>([\s\S]*?)<\/p>[\s\S]*?<\/div>\s*<\/div>/g;
const COLL_TITLE_RE = /<h1[^>]*class="culture-hero__title"[^>]*>([\s\S]*?)<\/h1>/i;

// Heuristic: looks like a proverb if:
//  - Garhwali is in Devanagari (not Roman script)
//  - Has a comma or conditional pattern ("त " suffix etc.)
//  - Longer than a simple word/phrase (≥ 3 Devanagari words)
const DEVANAGARI_RE  = /[\u0900-\u097F]{2}/;
const PROVERB_GW_RE  = /,|[,।]\s*|त$|त |नाई |बिणो|जितन|उतन/;
const PROVERB_HIN_RE = /जो.*वो|जैसी.*वैसी|बिना|जितना|उतना|नहीं.*तो|होती है[।.]?$|होता है[।.]?$/;

function isProverbShaped(garhwali, hindi) {
  if (!DEVANAGARI_RE.test(garhwali)) return false; // skip Roman-script phrases
  const words = garhwali.trim().split(/\s+/);
  if (words.length < 4) return false;              // too short
  return PROVERB_GW_RE.test(garhwali) || PROVERB_HIN_RE.test(hindi);
}

async function mineProverbsFromPhrases(url) {
  const html = await fetchHtml(url);
  const title = decode((COLL_TITLE_RE.exec(html) || [])[1] || url.split('/').filter(Boolean).pop());
  const out = [];
  let m;
  while ((m = ITEM_RE.exec(html)) !== null) {
    const garhwali = decode(m[1]);
    const hindi    = decode(m[2]);
    if (!garhwali || !hindi) continue;
    // Only keep entries that look proverb-shaped
    if (isProverbShaped(garhwali, hindi)) {
      out.push({ garhwali, hindi, english: '', meaning: '', source: title });
    }
  }
  return out;
}

// ── Simple romanisation (approximation for pronunciation field) ───────────────
// Maps common Devanagari blocks to Roman; good enough for a pronunciation hint.
function toRoman(text) {
  const MAP = [
    ['ओ','o'],['औ','au'],['अ','a'],['आ','aa'],['इ','i'],['ई','ee'],
    ['उ','u'],['ऊ','oo'],['ऐ','ai'],['ा','aa'],['ि','i'],['ी','ee'],
    ['ु','u'],['ू','oo'],['े','e'],['ै','ai'],['ो','o'],['ौ','au'],
    ['ं','n'],['ँ','n'],['ः','h'],['्',''],['ण','n'],['ञ','n'],
    ['क','k'],['ख','kh'],['ग','g'],['घ','gh'],['ङ','ng'],
    ['च','ch'],['छ','chh'],['ज','j'],['झ','jh'],
    ['ट','t'],['ठ','th'],['ड','d'],['ढ','dh'],['ड़','d'],['ढ़','dh'],
    ['त','t'],['थ','th'],['द','d'],['ध','dh'],['न','n'],
    ['प','p'],['फ','ph'],['ब','b'],['भ','bh'],['म','m'],
    ['य','y'],['र','r'],['ल','l'],['ळ','l'],['व','v'],
    ['श','sh'],['ष','sh'],['स','s'],['ह','h'],
    ['ऩ','n'],['क्ष','ksh'],['ज्ञ','gya'],['त्र','tr'],
  ];
  let r = text;
  for (const [d, e] of MAP) r = r.split(d).join(e);
  // collapse stray punctuation
  return r.replace(/[^\x00-\x7Fa-zA-Z\s,।?!'-]/g, '').replace(/\s+/g, ' ').trim();
}

// ── format as JS entry ────────────────────────────────────────────────────────
function toJsEntry(item, id) {
  const esc = (s) => (s || '').replace(/'/g, "\\'");
  const pronunciation = toRoman(item.garhwali);
  const parts = [
    `id: ${id}`,
    `category: 'muhavare'`,
    `garhwali: '${esc(item.garhwali)}'`,
    `hindi: '${esc(item.hindi)}'`,
    `english: '${esc(item.english || '')}'`,
    `pronunciation: '${esc(pronunciation)}'`,
  ];
  if (item.meaning) parts.push(`meaning: '${esc(item.meaning)}'`);
  return `  { ${parts.join(', ')} },`;
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const results = [];

  // Stage 1 — dedicated proverbs pages
  console.error('[aukhaan] Checking himlingo proverbs index…');
  const proverbUrls = await listProverbUrls();
  if (proverbUrls.length === 0) {
    console.error('[aukhaan] Proverbs index empty (himlingo has not added proverbs yet).');
  } else {
    console.error(`[aukhaan] ${proverbUrls.length} proverb pages found — scraping…`);
    for (const url of proverbUrls) {
      try {
        const p = await scrapeProverb(url);
        if (p.garhwali) results.push(p);
      } catch (err) {
        console.error(`  WARN: ${url} — ${err.message}`);
      }
    }
  }

  // Stage 2 — mine phrase collections
  console.error('[aukhaan] Mining phrase collections for proverb-shaped entries…');
  const phraseUrls = await listPhraseUrls();
  console.error(`[aukhaan] ${phraseUrls.length} phrase collections`);

  for (let i = 0; i < phraseUrls.length; i += 4) {
    const batch = phraseUrls.slice(i, i + 4).map((u) =>
      mineProverbsFromPhrases(u).catch((err) => {
        console.error(`  WARN: ${u} — ${err.message}`);
        return [];
      })
    );
    const groups = await Promise.all(batch);
    for (const g of groups) results.push(...g);
    await new Promise((r) => setTimeout(r, 150));
  }

  // Dedupe on Garhwali text
  const seen = new Set();
  const unique = [];
  for (const p of results) {
    const key = p.garhwali.toLowerCase().replace(/\s+/g, ' ');
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(p);
  }
  console.error(`[aukhaan] ${unique.length} unique entries after dedup`);

  if (process.argv.includes('-json')) {
    process.stdout.write(JSON.stringify(unique, null, 2) + '\n');
    return;
  }

  // Print as JS entries starting from id 161 (ids 121-160 already used)
  console.log('  // ── औखाण scraped from himlingo ──');
  unique.forEach((item, idx) => {
    console.log(toJsEntry(item, 161 + idx));
  });
  console.error(`\n[aukhaan] Done — paste the above entries into garhwaliLearn.js before the closing ];`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
