// Per-IP favorites — anonymous, no auth.
//
// Endpoints:
//   GET    /api/favorites           → list (key = caller IP)
//   POST   /api/favorites           → add { video } OR replace { videos: [...] }
//   DELETE /api/favorites/:videoId  → remove one
//
// NOTE: IP-based identity has known caveats:
//   - Users behind the same NAT/router share one list.
//   - The same user on different networks (wifi vs cellular) sees different lists.
// We accept these tradeoffs in exchange for zero-friction sync (no UUID stored
// on the client, survives storage clearing on the same network).

const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, saveFavorites } = require('../services/store');

// Normalize req.ip — strip IPv6 ::ffff: prefix and reject obviously bad values.
function getKey(req) {
  let ip = (req.ip || req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim();
  if (!ip) return null;
  if (ip.startsWith('::ffff:')) ip = ip.slice(7);
  // Sanity check — must look like an IPv4 or IPv6 address
  if (!/^[0-9a-fA-F:.]{3,45}$/.test(ip)) return null;
  return `ip:${ip}`;
}

router.get('/', async (req, res) => {
  const key = getKey(req);
  if (!key) return res.status(400).json({ error: 'Unable to identify client' });
  try {
    const list = await getFavorites(key);
    res.json({ favorites: list });
  } catch (err) {
    console.error('[favorites] GET error:', err.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', async (req, res) => {
  const key = getKey(req);
  if (!key) return res.status(400).json({ error: 'Unable to identify client' });
  try {
    const { video, videos } = req.body || {};
    let list;
    if (Array.isArray(videos)) {
      // Bulk replace — used for first-sync of pre-existing localStorage favs
      list = await saveFavorites(key, videos);
    } else if (video && video.id) {
      list = await addFavorite(key, video);
    } else {
      return res.status(400).json({ error: 'Provide { video } or { videos: [...] }' });
    }
    res.json({ favorites: list });
  } catch (err) {
    console.error('[favorites] POST error:', err.message);
    res.status(500).json({ error: 'Failed to save favorite' });
  }
});

router.delete('/:videoId', async (req, res) => {
  const key = getKey(req);
  if (!key) return res.status(400).json({ error: 'Unable to identify client' });
  const videoId = (req.params.videoId || '').toString().trim();
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });
  try {
    const list = await removeFavorite(key, videoId);
    res.json({ favorites: list });
  } catch (err) {
    console.error('[favorites] DELETE error:', err.message);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
