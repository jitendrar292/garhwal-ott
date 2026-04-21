// Auto-generates client/public/sitemap.xml from data files + static routes.
// Run via `npm run sitemap` (also chained into `prebuild`).
//
// To add new dynamic routes (e.g. news articles, music tracks), import the
// data module here and push entries into `urls`.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { folkStories } from '../src/data/folkStories.js';

const SITE = process.env.SITE_URL || 'https://pahaditube.in';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/music', changefreq: 'daily', priority: '0.9' },
  { path: '/shorts', changefreq: 'daily', priority: '0.8' },
  { path: '/news', changefreq: 'daily', priority: '0.8' },
  { path: '/podcast', changefreq: 'weekly', priority: '0.7' },
  { path: '/folk-stories', changefreq: 'weekly', priority: '0.7' },
  { path: '/pahadi-ai', changefreq: 'weekly', priority: '0.7' },
  { path: '/favorites', changefreq: 'monthly', priority: '0.4' },
  { path: '/feedback', changefreq: 'monthly', priority: '0.3' },
];

const folkStoryRoutes = folkStories.map((s) => ({
  path: `/folk-story/${s.slug}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const urls = [...staticRoutes, ...folkStoryRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

writeFileSync(OUT, xml, 'utf8');
console.log(`✓ sitemap.xml written (${urls.length} URLs) -> ${OUT}`);
