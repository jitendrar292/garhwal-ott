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
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');
const { sendNotificationToAll } = require('../services/push');

const REDIS_KEY = 'pahadi_news';
const MAX_NEWS = 200;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB (stored in Redis)
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// In-memory fallback when Redis is down
let memNews = [];

// Short-lived cache for the public list endpoint. Avoids hitting Upstash on
// every visit (which can be slow from cold or geographically distant regions).
let listCache = null;       // { at: number, payload: { articles: [...] } }
const LIST_TTL_MS = 60 * 1000; // 60 seconds
function invalidateListCache() { listCache = null; }

async function loadNews() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY);
    if (data) return data;
  }
  return [...memNews];
}

async function saveNews(list) {
  memNews = list;
  invalidateListCache();
  if (isRedisEnabled()) {
    // TTL 0 = no expiry (SETEX with huge TTL)
    await redisSetJSON(REDIS_KEY, list, 365 * 24 * 3600);
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

    // Only cache the recent-only request (what every first load hits)
    const isCacheable = recentOnly && !req.query.offset;
    if (isCacheable && listCache && Date.now() - listCache.at < LIST_TTL_MS) {
      res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      return res.json(listCache.payload);
    }

    const articles = await loadNews();
    // Return newest first
    const sorted = articles.sort((a, b) => b.createdAt - a.createdAt);

    let pool;
    if (recentOnly) {
      // Articles from the last 48 hours (today + yesterday)
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      pool = sorted.filter((a) => a.createdAt >= cutoff);
    } else {
      // Older articles only (everything outside the recent 48 h window)
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      pool = sorted.filter((a) => a.createdAt < cutoff);
    }

    const total = pool.length;
    const paginated = recentOnly ? pool : pool.slice(offset, offset + limit);

    const list = paginated.map(({ id, title, summary, imageUrl, category, createdAt }) => ({
      id,
      title,
      summary,
      imageUrl: imageUrl ? `/api/news/${id}/image` : '',
      category,
      createdAt,
    }));

    const payload = {
      articles: list,
      total,
      offset,
      limit,
      hasMore: recentOnly ? false : offset + limit < total,
    };

    if (isCacheable) {
      listCache = { at: Date.now(), payload };
    }

    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(payload);
  } catch (err) {
    console.error('[news] list error:', err.message);
    res.status(500).json({ error: 'Failed to load news' });
  }
});

// ── Public: article image (binary, long-cached) ──
// Decodes the base64 data URI stored with the article and serves the raw
// bytes with a 1-year immutable cache header. The browser then never
// re-downloads it, and the JSON list payload stays tiny.
router.get('/:id/image', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id || isNaN(id)) return res.status(400).send('Bad id');
    const articles = await loadNews();
    const article = articles.find((a) => a.id === id);
    if (!article || !article.imageUrl) return res.status(404).send('Not found');

    const m = article.imageUrl.match(/^data:(image\/[\w+.-]+);base64,(.+)$/);
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
    const safe = {
      ...article,
      imageUrl: article.imageUrl ? `/api/news/${article.id}/image` : '',
    };
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
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
    const safe = {
      ...updated,
      imageUrl: updated.imageUrl ? `/api/news/${updated.id}/image` : '',
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
