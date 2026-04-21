#!/usr/bin/env node
/**
 * Scraper for Himlingo Garhwali folk stories.
 * Source: https://himlingo.com/folk-stories/?lang=garhwali
 *
 * Extracts the full Devanagari Garhwali story text (and optional summary)
 * for each folk story listed on the index page. These are cultural
 * touchstones (Jagdev Panwar, Jeetu Bagdwal, Kalu Bhandari, Ranu Rout, …)
 * that the AI should be able to recognise and summarise when asked.
 *
 * Output: src/data/himlingo-folkstories.js — `[{ slug, title, body, url }]`.
 *
 * Run from server/:   node scripts/scrape-himlingo-folkstories.js
 */

const fs = require('fs');
const path = require('path');

const INDEX_URL = 'https://himlingo.com/folk-stories/?lang=garhwali';
const UA = 'Mozilla/5.0 (compatible; PahadiTube-Scraper/1.0; +https://garhwali-stream.onrender.com)';
const OUT_PATH = path.resolve(__dirname, '..', 'src', 'data', 'himlingo-folkstories.js');

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.text();
}

function decodeKeepNewlines(html) {
  // Convert <p>/<br> to newlines, then strip tags.
  return String(html || '')
    .replace(/<\/p>\s*<p[^>]*>/g, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&#038;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function decodeInline(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
    .replace(/&#8220;|&#8221;/g, '"').replace(/&#8216;|&#8217;/g, "'")
    .replace(/&#8230;/g, '…').replace(/&hellip;/g, '…')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

const STORY_LINK_RE = /<a\s+href="(https:\/\/himlingo\.com\/folk-story\/([a-z0-9-]+)\/)"\s+class="culture-card culture-card--folk-story"/g;
const TITLE_RE = /<h1[^>]*class="culture-hero__title"[^>]*>([\s\S]*?)<\/h1>/i;
// Story body sits in <div class="story-body story-body--native"> … </div>
// terminated by the opening of the next sibling section. Greedy-match up to
// the next </div>\s*</div>\s*</section> is fragile; instead, walk by depth.
const BODY_START_RE = /<div\s+class="story-body story-body--native"[^>]*>/;

function extractBalancedDiv(html, startIdx) {
  let depth = 1;
  let i = startIdx;
  while (i < html.length && depth > 0) {
    const open = html.indexOf('<div', i);
    const close = html.indexOf('</div>', i);
    if (close === -1) return null;
    if (open !== -1 && open < close) {
      depth += 1;
      i = open + 4;
    } else {
      depth -= 1;
      i = close + 6;
      if (depth === 0) return html.slice(startIdx, close);
    }
  }
  return null;
}

async function listStoryUrls() {
  const html = await fetchHtml(INDEX_URL);
  const out = new Map();
  let m;
  while ((m = STORY_LINK_RE.exec(html)) !== null) {
    out.set(m[2], m[1]); // slug -> url, dedupe
  }
  return [...out.entries()].map(([slug, url]) => ({ slug, url }));
}

async function scrapeStory({ slug, url }) {
  const html = await fetchHtml(url);
  const titleMatch = TITLE_RE.exec(html);
  const title = titleMatch ? decodeInline(titleMatch[1]) : slug;
  const startMatch = BODY_START_RE.exec(html);
  let body = '';
  if (startMatch) {
    const inner = extractBalancedDiv(html, startMatch.index + startMatch[0].length);
    if (inner) body = decodeKeepNewlines(inner);
  }
  return { slug, title, body, url };
}

async function main() {
  console.log('[folkstories] listing…');
  const items = await listStoryUrls();
  console.log(`[folkstories] ${items.length} stories`);

  const out = [];
  for (const it of items) {
    try {
      const story = await scrapeStory(it);
      out.push(story);
      console.log(`  ✓ ${story.title} (${story.body.length} chars)`);
    } catch (err) {
      console.warn(`  ✗ ${it.slug}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 200));
  }

  out.sort((a, b) => a.title.localeCompare(b.title));

  const header = `// Auto-generated from https://himlingo.com/folk-stories/?lang=garhwali — do not hand-edit.
// Re-run: \`node scripts/scrape-himlingo-folkstories.js\` from the server/ directory.
//
// Each entry: { slug, title, body, url }. \`body\` is the full Devanagari
// Garhwali narrative. Consumed by aiCache.js so the AI can recognise &
// summarise these cultural touchstones (Jagdev Panwar, Jeetu Bagdwal, …).
`;
  const body = `module.exports = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(OUT_PATH, header + body);
  console.log(`[folkstories] wrote ${OUT_PATH} (${(fs.statSync(OUT_PATH).size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
  console.error('[folkstories] fatal:', err);
  process.exit(1);
});
