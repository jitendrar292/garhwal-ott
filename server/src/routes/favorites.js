// Per-device favorites — anonymous, no auth.
// The client sends a UUID as ?deviceId=... ; we use it as the Redis key.
//
// Endpoints:
//   GET    /api/favorites?deviceId=<uuid>           → list
//   POST   /api/favorites?deviceId=<uuid>           → add { video } OR replace { videos: [...] }
//   DELETE /api/favorites/:videoId?deviceId=<uuid>  → remove one

const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, saveFavorites } = require('../services/store');

// Reject malformed device IDs early. Accepts any v1–v5 UUID-ish string
// (32 hex digits with optional dashes), 16–64 chars.
const DEVICE_ID_RE = /^[a-zA-Z0-9_-]{8,64}$/;

function getDeviceId(req) {
  const id = (req.query.deviceId || req.headers['x-device-id'] || '').toString().trim();
  if (!id || !DEVICE_ID_RE.test(id)) return null;
  return id;
}

router.get('/', async (req, res) => {
  const deviceId = getDeviceId(req);
  if (!deviceId) return res.status(400).json({ error: 'Missing or invalid deviceId' });
  try {
    const list = await getFavorites(deviceId);
    res.json({ favorites: list });
  } catch (err) {
    console.error('[favorites] GET error:', err.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

router.post('/', async (req, res) => {
  const deviceId = getDeviceId(req);
  if (!deviceId) return res.status(400).json({ error: 'Missing or invalid deviceId' });
  try {
    const { video, videos } = req.body || {};
    let list;
    if (Array.isArray(videos)) {
      // Bulk replace — used for first-sync of pre-existing localStorage favs
      list = await saveFavorites(deviceId, videos);
    } else if (video && video.id) {
      list = await addFavorite(deviceId, video);
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
  const deviceId = getDeviceId(req);
  if (!deviceId) return res.status(400).json({ error: 'Missing or invalid deviceId' });
  const videoId = (req.params.videoId || '').toString().trim();
  if (!videoId) return res.status(400).json({ error: 'Missing videoId' });
  try {
    const list = await removeFavorite(deviceId, videoId);
    res.json({ favorites: list });
  } catch (err) {
    console.error('[favorites] DELETE error:', err.message);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});

module.exports = router;
