// Post-build prerender: visit each route in dist/ with a headless browser,
// wait for react-helmet-async to populate <head>, then save the rendered
// HTML as dist/<route>/index.html. Crawlers (and users on slow networks)
// now see real per-route titles and meta tags without waiting for JS.
//
// The SPA shell still works — BrowserRouter takes over on client navigation
// because each generated index.html still loads the same JS bundle.

import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:http';
import puppeteer from 'puppeteer';
import { folkStories } from '../src/data/folkStories.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');

const STATIC_ROUTES = [
  '/',
  '/music',
  '/shorts',
  '/news',
  '/podcast',
  '/folk-stories',
  '/ghughuti-ai',
  '/favorites',
  '/feedback',
  '/jobs',
  '/yojana',
  '/category/movies',
  '/category/songs',
  '/category/comedy',
  '/category/devotional',
  '/category/folkdance',
  '/category/jaagar',
  '/category/mela',
  '/category/theatre',
];

const FOLK_ROUTES = folkStories.map((s) => `/folk-story/${s.slug}`);
const ROUTES = [...STATIC_ROUTES, ...FOLK_ROUTES];

// Minimal static file server for the dist/ folder.
function startServer(port) {
  const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg':  'image/svg+xml',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico':  'image/x-icon',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.txt':  'text/plain; charset=utf-8',
    '.xml':  'application/xml; charset=utf-8',
  };
  const server = createServer((req, res) => {
    try {
      let urlPath = decodeURIComponent(req.url.split('?')[0]);
      if (urlPath.endsWith('/')) urlPath += 'index.html';
      let filePath = resolve(DIST, '.' + urlPath);
      let body;
      try {
        body = readFileSync(filePath);
      } catch {
        // SPA fallback
        filePath = resolve(DIST, 'index.html');
        body = readFileSync(filePath);
      }
      const ext = filePath.slice(filePath.lastIndexOf('.'));
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(body);
    } catch (err) {
      res.writeHead(500); res.end(String(err));
    }
  });
  return new Promise((resolveP) => server.listen(port, () => resolveP(server)));
}

function launchBrowser() {
  return puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--single-process',
    ],
  });
}

async function prerender() {
  const PORT = 4321;
  const server = await startServer(PORT);
  let browser = await launchBrowser();

  let ok = 0;
  let fail = 0;

  for (const route of ROUTES) {
    let page;
    try {
      // Relaunch browser if previous session was lost (e.g. OOM crash)
      if (!browser.connected) {
        console.warn('Browser disconnected — relaunching…');
        try { await browser.close(); } catch {}
        browser = await launchBrowser();
      }

      page = await browser.newPage();

      // Block API + any third-party requests so prerender doesn't hang waiting
      // for the backend (it isn't running during build) or YouTube/Instagram
      // embeds. We only need the React shell + Helmet head tags.
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const u = req.url();
        const isLocalAsset =
          u.startsWith(`http://localhost:${PORT}/`) &&
          !u.startsWith(`http://localhost:${PORT}/api/`);
        if (isLocalAsset) {
          req.continue();
        } else {
          req.abort();
        }
      });
      page.on('pageerror', () => {}); // ignore SPA runtime errors during prerender

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });
      // Helmet writes to <head> in an effect after hydration — give React
      // time to mount and Helmet to flush. 800ms is plenty for SPA boot.
      await page.evaluate(() => new Promise((r) => setTimeout(r, 800)));

      const html = await page.content();
      const outDir = resolve(DIST, '.' + (route === '/' ? '' : route));
      mkdirSync(outDir, { recursive: true });
      writeFileSync(resolve(outDir, 'index.html'), html, 'utf8');
      ok++;
      console.log(`✓ prerendered ${route}`);
    } catch (err) {
      fail++;
      console.warn(`✗ failed ${route}: ${err.message}`);
    } finally {
      if (page) {
        try { await page.close(); } catch {}
      }
    }
  }

  try { await browser.close(); } catch {}
  server.close();
  console.log(`\nPrerender complete: ${ok} ok, ${fail} failed (${ROUTES.length} total)`);
  if (fail > 0) process.exit(1);
}

prerender().catch((err) => {
  console.error('Prerender crashed:', err);
  process.exit(1);
});
