const express = require('express');
const { searchVideos, getVideosByCategory } = require('../services/youtubeService');

const router = express.Router();

// GET /api/youtube/search?q=query&pageToken=xxx&maxResults=10
//
// maxResults is clamped to the 1–10 range — keeps each YouTube quota unit
// cheap and matches the client's per-page rendering budget.
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
    const clamped = Math.min(Math.max(requested, 1), 10);
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
    const validCategories = ['movies', 'songs', 'comedy', 'devotional', 'trending', 'vlogs', 'shorts', 'reels', 'podcast', 'folkdance', 'jaagar', 'mela'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const requested = parseInt(maxResults, 10) || 10;
    const clamped = Math.min(Math.max(requested, 1), 10);
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

module.exports = router;
