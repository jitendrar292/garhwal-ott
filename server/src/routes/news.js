// Local News CRUD — stores articles + images in Redis (base64 data URIs).
//
// Endpoints:
//   GET    /api/news               → list published articles (public)
//   GET    /api/news/:id           → single article (public)
//   POST   /api/news               → create (admin, JSON with base64 image)
//   DELETE /api/news/:id            → delete (admin)
//
// Admin auth: ?key=<FEEDBACK_ADMIN_KEY>

const express = require('express');
const router = express.Router();
const { redisGetJSON, redisSetJSON, redisDelKey, isRedisEnabled } = require('../services/store');

// Each article's image is stored in its own Redis key to keep the main
// pahadi_news list key small (Upstash free tier caps per-command at ~1 MB).
const IMAGE_KEY_PREFIX = 'pahadi_news_img_';
const { sendNotificationToAll } = require('../services/push');

const REDIS_KEY = 'pahadi_news';
const MAX_NEWS = 200;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB (stored in Redis)
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// In-memory fallback when Redis is down
let memNews = [];

// In-memory image cache: id (number) → base64 data URI string.
// Populated on first image request; persists for the lifetime of the process.
// Saves a Redis round-trip (~50–200 ms) on every subsequent image load.
const memImages = new Map(); // Map<number, string>

// Short-lived cache for the public list endpoint. Avoids hitting Upstash on
// every visit (which can be slow from cold or geographically distant regions).
let listCache = null;       // { at: number, payload: { articles: [...] } }
const LIST_TTL_MS = 5 * 60 * 1000; // 5 minutes
function invalidateListCache() { listCache = null; }

// loadNews — uses memNews as a warm in-memory cache so that after the first
// Redis fetch (on cold start) all subsequent requests are served from memory
// without any network round-trip. This is safe because every write goes through
// saveNews, which keeps memNews in sync.
async function loadNews() {
  if (memNews.length > 0) return memNews; // in-memory hit
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY);
    if (data) {
      memNews = data; // warm the in-memory cache from Redis
      return memNews;
    }
  }
  return memNews;
}

async function saveNews(list) {
  memNews = list; // keep full data (including imageUrl) in memory
  invalidateListCache();
  if (isRedisEnabled()) {
    // Strip inline base64 images from the list before writing to Redis.
    // Each image is persisted in a separate key (pahadi_news_img_{id}) so
    // the main pahadi_news key stays well under Upstash's ~1 MB command limit.
    const forRedis = await Promise.all(list.map(async (a) => {
      if (a.imageUrl && a.imageUrl.startsWith('data:')) {
        // Warm the in-memory image cache immediately so the next request
        // doesn't need a Redis round-trip.
        memImages.set(a.id, a.imageUrl);
        await redisSetJSON(`${IMAGE_KEY_PREFIX}${a.id}`, a.imageUrl, 365 * 24 * 3600)
          .catch((e) => console.error(`[news] image key save error for ${a.id}:`, e.message));
        // Store a truthy marker so the list endpoint still generates /api/news/:id/image URLs.
        // An empty string would make the ternary skip the URL entirely.
        return { ...a, imageUrl: 'has_image' };
      }
      return a;
    }));
    const ok = await redisSetJSON(REDIS_KEY, forRedis, 365 * 24 * 3600);
    if (!ok) throw new Error('Redis save failed — article may not persist after a restart. Try again or reduce image size.');
  }
}

// ── Parse multipart body manually (no multer dependency) ──
// We read the raw body and extract fields. For production-grade multipart
// you'd use busboy/multer, but keeping deps minimal here.
// Actually, let's use Express raw buffer parsing with a size limit and
// expect the client to send JSON + base64 image, which is simpler.

// ── Public: list news ──
// Strips the (potentially multi-MB) base64 image data URI from each entry
// and replaces it with a thin URL that the browser fetches separately and
// caches for a year. Cuts list-response size from MBs to KBs.
// Supports pagination: ?limit=10&offset=0
router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);
    // ?recent=true → only today + yesterday (last 48 h); used for initial page load
    const recentOnly = req.query.recent === 'true';
    // ?all=true&key=<adminKey> → return every article (admin use only)
    const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
    const fetchAll = req.query.all === 'true' && req.query.key === adminKey;

    // Only cache the recent-only request (what every first load hits)
    const isCacheable = recentOnly && !req.query.offset && !fetchAll;
    if (isCacheable && listCache && Date.now() - listCache.at < LIST_TTL_MS) {
      res.set('Cache-Control', 'private, no-store');
      return res.json(listCache.payload);
    }

    const articles = await loadNews();
    // Return newest first
    const sorted = articles.sort((a, b) => b.createdAt - a.createdAt);

    let pool;
    if (fetchAll) {
      // Admin: return all articles regardless of age
      pool = sorted;
    } else if (recentOnly) {
      // Articles from the last 48 hours (today + yesterday)
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      pool = sorted.filter((a) => a.createdAt >= cutoff);
    } else {
      // Older articles only (everything outside the recent 48 h window)
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      pool = sorted.filter((a) => a.createdAt < cutoff);
    }

    const total = pool.length;
    const paginated = (recentOnly || fetchAll) ? pool : pool.slice(offset, offset + limit);

    const list = paginated.map(({ id, title, summary, imageUrl, category, createdAt, updatedAt }) => ({
      id,
      title,
      summary,
      // Always generate the image URL. Articles whose images are stored in a
      // separate Redis key (pahadi_news_img_{id}) have imageUrl='' or 'has_image'
      // in the list — both are falsy/truthy edge cases. Generating the URL
      // unconditionally lets the image endpoint serve the image (or 404 silently).
      // The client already skips rendering when the img src returns 404.
      imageUrl: `/api/news/${id}/image?v=${updatedAt || createdAt}`,
      category,
      createdAt,
    }));

    const payload = {
      articles: list,
      total,
      offset,
      limit,
      hasMore: (recentOnly || fetchAll) ? false : offset + limit < total,
    };

    if (isCacheable) {
      listCache = { at: Date.now(), payload };
    }

    // recent=true: use private so browsers/CDNs don't cache the list. The
    // server-side listCache already absorbs repeated Redis reads. Stale browser
    // caches are what cause newly-posted articles to be invisible for minutes.
    res.set('Cache-Control', fetchAll ? 'no-store' : 'private, no-store');
    res.json(payload);
  } catch (err) {
    console.error('[news] list error:', err.message);
    res.status(500).json({ error: 'Failed to load news' });
  }
});

// ── Public: article image (binary, long-cached) ──
// 1. Check in-memory cache (data URI is there during current server session).
// 2. Fall back to the separate Redis key pahadi_news_img_{id} (cold start,
//    or articles posted in a previous server instance).
router.get('/:id/image', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) return res.status(400).send('Bad id');

    // Warm memNews if cold, but don't overwrite it if already populated.
    await loadNews();

    // 1. In-memory image cache (fastest — no Redis round-trip)
    let dataUri = memImages.get(id) || null;

    // 2. Try memNews for articles created/updated in this server session
    //    (imageUrl holds the full data URI only during the same session).
    if (!dataUri) {
      const memArticle = memNews.find((a) => a.id === id);
      if ((memArticle?.imageUrl || '').startsWith('data:')) {
        dataUri = memArticle.imageUrl;
        memImages.set(id, dataUri); // warm cache
      }
    }

    // 3. Fall back to the separate Redis image key (cold start / cross-session).
    if (!dataUri) {
      dataUri = await redisGetJSON(`${IMAGE_KEY_PREFIX}${id}`);
      if (dataUri) memImages.set(id, dataUri); // warm cache for next request
    }

    if (!dataUri || !dataUri.startsWith('data:')) return res.status(404).send('Not found');

    const m = dataUri.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
    if (!m) return res.status(404).send('Not found');

    const buf = Buffer.from(m[2], 'base64');
    res.set('Content-Type', m[1]);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(buf);
  } catch (err) {
    console.error('[news] image error:', err.message);
    res.status(500).send('Server error');
  }
});

// ── Public: single article ──
router.get('/:id', async (req, res) => {
  try {
    const articles = await loadNews();
    const article = articles.find((a) => a.id === Number(req.params.id));
    if (!article) return res.status(404).json({ error: 'Article not found' });
    // Same trick as the list endpoint: send a thin URL instead of the full
    // base64 data URI so the browser can cache the image independently.
    // Include a version param so edits bust the browser's image cache.
    const safe = {
      ...article,
      imageUrl: article.imageUrl ? `/api/news/${article.id}/image?v=${article.updatedAt || article.createdAt}` : '',
    };
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({ article: safe });
  } catch (err) {
    console.error('[news] get error:', err.message);
    res.status(500).json({ error: 'Failed to load article' });
  }
});

// ── Admin: create article ──
// Body: JSON { title, summary, body, category, image (base64 data URI) }
router.post('/', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { title, summary, body: articleBody, category, image } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!articleBody || typeof articleBody !== 'string' || articleBody.trim().length === 0) {
    return res.status(400).json({ error: 'Body is required' });
  }
  if (title.length > 300 || (summary && summary.length > 1000) || articleBody.length > 20000) {
    return res.status(400).json({ error: 'Input too long' });
  }

  let imageUrl = '';

  // Store image as base64 data URI directly in Redis
  if (image && typeof image === 'string' && image.startsWith('data:')) {
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match || !ALLOWED_MIME.has(match[1])) {
      return res.status(400).json({ error: 'Invalid image format. Use JPEG, PNG, GIF, or WebP.' });
    }
    const buf = Buffer.from(match[2], 'base64');
    if (buf.length > MAX_IMAGE_SIZE) {
      return res.status(400).json({ error: 'Image too large (max 2 MB)' });
    }
    imageUrl = image; // store the data URI as-is
  }

  try {
    const articles = await loadNews();
    const article = {
      id: Date.now(),
      title: title.trim(),
      summary: (summary || '').trim(),
      body: articleBody.trim(),
      category: (category || 'general').trim().toLowerCase(),
      imageUrl,
      createdAt: Date.now(),
    };
    articles.unshift(article);
    if (articles.length > MAX_NEWS) articles.length = MAX_NEWS;
    await saveNews(articles);

    // Fire-and-forget push notification to all subscribed browsers.
    //
    // IMPORTANT (Android): use the static app icon for `icon` — Android Chrome
    // silently drops the entire notification if the icon URL is slow to load,
    // and `/api/news/:id/image` streams from Redis/disk which is too slow.
    // The article image goes into `image` instead (rich preview), which is
    // optional and won't block display if it fails.
    sendNotificationToAll({
      title: article.title.slice(0, 80),
      body: (article.summary || article.body).slice(0, 160),
      url: '/news',
      tag: `news-${article.id}`,
      icon: '/icons/icon-192-v2.png',
      image: article.imageUrl ? `/api/news/${article.id}/image` : undefined,
    }).catch((e) => console.error('[news] push error:', e.message));

    res.status(201).json({ article });
  } catch (err) {
    console.error('[news] create error:', err.message);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// ── Admin: update article ──
// Body: JSON { title, summary, body, category, image }
//   - image: omit/undefined → keep existing image
//             ''/null         → remove image
//             data:image/...  → replace image
router.put('/:id', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = Number(req.params.id);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  const { title, summary, body: articleBody, category, image } = req.body || {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!articleBody || typeof articleBody !== 'string' || articleBody.trim().length === 0) {
    return res.status(400).json({ error: 'Body is required' });
  }
  if (title.length > 300 || (summary && summary.length > 1000) || articleBody.length > 20000) {
    return res.status(400).json({ error: 'Input too long' });
  }

  try {
    const articles = await loadNews();
    const idx = articles.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Article not found' });

    const existing = articles[idx];

    // Resolve image: undefined = keep, '' / null = remove, data: = replace
    let nextImageUrl = existing.imageUrl || '';
    if (image === null || image === '') {
      nextImageUrl = '';
      // Remove stale image key from Redis and in-memory cache
      memImages.delete(id);
      await redisDelKey(`${IMAGE_KEY_PREFIX}${id}`).catch(() => {});
    } else if (typeof image === 'string' && image.startsWith('data:')) {
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!match || !ALLOWED_MIME.has(match[1])) {
        return res.status(400).json({ error: 'Invalid image format. Use JPEG, PNG, GIF, or WebP.' });
      }
      const buf = Buffer.from(match[2], 'base64');
      if (buf.length > MAX_IMAGE_SIZE) {
        return res.status(400).json({ error: 'Image too large (max 2 MB)' });
      }
      nextImageUrl = image;
    }

    const updated = {
      ...existing,
      title: title.trim(),
      summary: (summary || '').trim(),
      body: articleBody.trim(),
      category: (category || 'general').trim().toLowerCase(),
      imageUrl: nextImageUrl,
      updatedAt: Date.now(),
    };
    articles[idx] = updated;
    await saveNews(articles);

    // Return the article with the URL-style image (matches GET /:id shape).
    // Version param ensures the browser re-fetches the updated image.
    const safe = {
      ...updated,
      imageUrl: updated.imageUrl ? `/api/news/${updated.id}/image?v=${updated.updatedAt || updated.createdAt}` : '',
    };
    res.json({ article: safe });
  } catch (err) {
    console.error('[news] update error:', err.message);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

// ── Admin: delete article ──
router.delete('/:id', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = Number(req.params.id);
  if (!id || isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const articles = await loadNews();
    const idx = articles.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Article not found' });

    articles.splice(idx, 1);
    await saveNews(articles);
    // Clean up separate image key and in-memory cache (best-effort)
    memImages.delete(id);
    await redisDelKey(`${IMAGE_KEY_PREFIX}${id}`).catch(() => {});
    res.json({ success: true, remaining: articles.length });
  } catch (err) {
    console.error('[news] delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

module.exports = router;
// Also expose loadNews so other modules (e.g. chat RAG) can read articles
// without going through HTTP.
module.exports.loadNews = loadNews;
