const express = require('express');
const {
  searchVideos,
  getVideosByCategory,
  refreshCategory,
  refreshTrending,
  listRefreshableCategories,
} = require('../services/youtubeService');

const router = express.Router();

// GET /api/youtube/search?q=query&pageToken=xxx&maxResults=10
//
// maxResults is clamped to the 1–50 range.
router.get('/search', async (req, res) => {
  try {
    const { q, pageToken, maxResults } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    if (q.length > 200) {
      return res.status(400).json({ error: 'Query too long' });
    }
    const requested = parseInt(maxResults, 10) || 10;
    const clamped = Math.min(Math.max(requested, 1), 50);
    const data = await searchVideos(
      q.trim(),
      pageToken || '',
      clamped
    );
    res.json(data);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(502).json({ error: 'Failed to fetch videos' });
  }
});

// GET /api/youtube/category/:category?pageToken=xxx
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { pageToken, maxResults } = req.query;
    const validCategories = ['movies', 'songs', 'comedy', 'devotional', 'trending', 'vlogs', 'shorts', 'reels', 'podcast', 'folkdance', 'jaagar', 'mela', 'theatre'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const requested = parseInt(maxResults, 10) || 10;
    const clamped = Math.min(Math.max(requested, 1), 50);
    const data = await getVideosByCategory(
      category,
      pageToken || '',
      clamped
    );
    res.json(data);
  } catch (err) {
    console.error('Category error:', err.message);
    res.status(502).json({ error: 'Failed to fetch videos' });
  }
});

// =====================================================================
// Admin: manual content refresh
// =====================================================================
// Auth via ?key=<FEEDBACK_ADMIN_KEY> (same key used for news/feedback admin).
function requireAdmin(req, res) {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// GET /api/youtube/admin/categories?key=...
// Returns the list of categories the admin can refresh.
router.get('/admin/categories', (req, res) => {
  if (!requireAdmin(req, res)) return;
  res.json({ categories: listRefreshableCategories() });
});

// POST /api/youtube/admin/refresh?key=...&category=movies
// POST /api/youtube/admin/refresh?key=...&category=all  → refresh trending bundle
router.post('/admin/refresh', async (req, res) => {
  if (!requireAdmin(req, res)) return;
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'category is required' });
  }
  try {
    if (category === 'all') {
      await refreshTrending();
      return res.json({ ok: true, refreshed: 'all' });
    }
    const result = await refreshCategory(category);
    res.json({
      ok: true,
      refreshed: category,
      count: result.videos?.length || 0,
    });
  } catch (err) {
    console.error('[admin] refresh error:', err.message);
    if (err.code === 'UNKNOWN_CATEGORY') {
      return res.status(400).json({ error: 'Unknown category' });
    }
    if (err.code === 'NO_API_KEY') {
      return res.status(503).json({ error: 'YouTube API key not configured' });
    }
    if (err.message === 'QUOTA_EXCEEDED') {
      return res.status(429).json({ error: 'YouTube quota exceeded — try again later' });
    }
    res.status(502).json({ error: 'Failed to refresh category' });
  }
});

module.exports = router;
