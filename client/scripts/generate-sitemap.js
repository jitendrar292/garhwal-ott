// Auto-generates client/public/sitemap.xml from data files + static routes.
// Run via `npm run sitemap` (also chained into `prebuild`).
//
// To add new dynamic routes (e.g. news articles, music tracks), import the
// data module here and push entries into `urls`.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { folkStories } from '../src/data/folkStories.js';
import PAHADI_HEROES from '../src/data/pahadiHeroes.js';
import GARHWALI_INSTRUMENTS from '../src/data/garhwaliInstruments.js';
import SACRED_PLACES from '../src/data/sacredPlaces.js';
import CHAR_DHAM, {
  PANCH_KEDAR,
  BADRINATH_NEARBY_ATTRACTIONS,
  GANGOTRI_NEARBY_ATTRACTIONS,
  YAMUNOTRI_NEARBY_ATTRACTIONS,
} from '../src/data/charDham.js';
import PAHADI_DISHES from '../src/data/pahadiDishes.js';

const SITE = process.env.SITE_URL || 'https://pahaditube.in';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/music', changefreq: 'daily', priority: '0.9' },
  { path: '/shorts', changefreq: 'daily', priority: '0.8' },
  { path: '/news', changefreq: 'daily', priority: '0.8' },
  { path: '/jobs', changefreq: 'daily', priority: '0.8' },
  { path: '/yojana', changefreq: 'weekly', priority: '0.8' },
  { path: '/podcast', changefreq: 'weekly', priority: '0.7' },
  { path: '/folk-stories', changefreq: 'weekly', priority: '0.7' },
  { path: '/category/movies', changefreq: 'daily', priority: '0.7' },
  { path: '/category/songs', changefreq: 'daily', priority: '0.7' },
  { path: '/category/comedy', changefreq: 'weekly', priority: '0.6' },
  { path: '/category/devotional', changefreq: 'weekly', priority: '0.6' },
  { path: '/category/folkdance', changefreq: 'weekly', priority: '0.6' },
  { path: '/category/mela', changefreq: 'weekly', priority: '0.6' },
  { path: '/category/theatre', changefreq: 'weekly', priority: '0.6' },
  { path: '/garhwali-sikha', changefreq: 'weekly', priority: '0.7' },
  { path: '/pahadi-khano', changefreq: 'weekly', priority: '0.7' },
  { path: '/pahadi-fal', changefreq: 'weekly', priority: '0.7' },
  { path: '/pahadi-store', changefreq: 'weekly', priority: '0.6' },
  { path: '/pahadi-pehnawa', changefreq: 'monthly', priority: '0.6' },
  { path: '/pahadi-heroes', changefreq: 'monthly', priority: '0.7' },
  { path: '/pahadi-khel', changefreq: 'monthly', priority: '0.6' },
  { path: '/pahadi-hastakala', changefreq: 'monthly', priority: '0.6' },
  { path: '/pahadi-vichar', changefreq: 'monthly', priority: '0.5' },
  { path: '/pahadi-prakriti', changefreq: 'monthly', priority: '0.5' },
  { path: '/culture', changefreq: 'weekly', priority: '0.7' },
  { path: '/muhavare', changefreq: 'monthly', priority: '0.7' },
  { path: '/instruments', changefreq: 'monthly', priority: '0.7' },
  { path: '/sacred-places', changefreq: 'monthly', priority: '0.7' },
  { path: '/chardham-yatra', changefreq: 'monthly', priority: '0.8' },
  { path: '/sarkari-dastavej', changefreq: 'monthly', priority: '0.8' },
  { path: '/tyohar', changefreq: 'monthly', priority: '0.7' },
  { path: '/about', changefreq: 'monthly', priority: '0.6' },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms-of-service', changefreq: 'yearly', priority: '0.3' },
  { path: '/feedback', changefreq: 'monthly', priority: '0.3' },
];

const folkStoryRoutes = folkStories.map((s) => ({
  path: `/folk-story/${s.slug}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const heroRoutes = PAHADI_HEROES.map((h) => ({
  path: `/pahadi-heroes/${h.id}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const instrumentRoutes = GARHWALI_INSTRUMENTS.map((i) => ({
  path: `/instruments/${i.id}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const sacredPlaceRoutes = SACRED_PLACES.map((p) => ({
  path: `/sacred-places/${p.id}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const charDhamRoutes = [
  ...CHAR_DHAM,
  ...PANCH_KEDAR,
  ...BADRINATH_NEARBY_ATTRACTIONS,
  ...GANGOTRI_NEARBY_ATTRACTIONS,
  ...YAMUNOTRI_NEARBY_ATTRACTIONS,
].map((d) => ({
  path: `/chardham-yatra/${d.id}`,
  changefreq: 'monthly',
  priority: '0.7',
}));

const recipeRoutes = PAHADI_DISHES.map((d) => ({
  path: `/pahadi-khano/recipe/${d.id}`,
  changefreq: 'monthly',
  priority: '0.6',
}));

const urls = [
  ...staticRoutes,
  ...folkStoryRoutes,
  ...heroRoutes,
  ...instrumentRoutes,
  ...sacredPlaceRoutes,
  ...charDhamRoutes,
  ...recipeRoutes,
];

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
