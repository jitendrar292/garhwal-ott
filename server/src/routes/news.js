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

const REDIS_KEY = 'pahadi_news';
const MAX_NEWS = 200;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB (stored in Redis)
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

// In-memory fallback when Redis is down
let memNews = [];

async function loadNews() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY);
    if (data) return data;
  }
  return [...memNews];
}

async function saveNews(list) {
  memNews = list;
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
router.get('/', async (_req, res) => {
  try {
    const articles = await loadNews();
    // Return newest first, strip large fields for list view
    const list = articles
      .sort((a, b) => b.createdAt - a.createdAt)
      .map(({ id, title, summary, imageUrl, category, createdAt }) => ({
        id, title, summary, imageUrl, category, createdAt,
      }));
    res.json({ articles: list });
  } catch (err) {
    console.error('[news] list error:', err.message);
    res.status(500).json({ error: 'Failed to load news' });
  }
});

// ── Public: single article ──
router.get('/:id', async (req, res) => {
  try {
    const articles = await loadNews();
    const article = articles.find((a) => a.id === Number(req.params.id));
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ article });
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
    res.status(201).json({ article });
  } catch (err) {
    console.error('[news] create error:', err.message);
    res.status(500).json({ error: 'Failed to create article' });
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
