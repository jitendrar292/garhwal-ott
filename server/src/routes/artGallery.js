const express = require('express');
const multer = require('multer');
const { redisGetJSON, redisSetJSON } = require('../services/store');

const router = express.Router();
const ADMIN_KEY = () => process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
const GALLERY_REDIS_KEY = 'pahadi_art_gallery';

// Multer: in-memory for R2 upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PNG, JPEG, WebP, GIF images are allowed'));
  },
});

// Default gallery (seeded if Redis is empty)
const DEFAULT_GALLERY = [
  { id: 1, src: '/art/khelo.png', label: 'खेलो पहाड़ी 🏃' },
  { id: 2, src: '/art/fun.png', label: 'हँसी-ठट्ठा 😄' },
  { id: 3, src: '/art/diwali.png', label: 'दिवाळी 🪔' },
  { id: 4, src: '/art/narendra-singh-negi.png', label: 'गढ़ गौरव — नरेन्द्र सिंह नेगी 🎶' },
  { id: 5, src: '/art/run-char.png', label: 'पहाड़ी दौड़ 🏔️' },
];

async function getGallery() {
  const cached = await redisGetJSON(GALLERY_REDIS_KEY);
  if (cached && Array.isArray(cached) && cached.length > 0) return cached;
  // Seed with defaults
  await redisSetJSON(GALLERY_REDIS_KEY, DEFAULT_GALLERY, 0);
  return DEFAULT_GALLERY;
}

async function saveGallery(gallery) {
  // TTL 0 = no expiry; use a very large TTL since SETEX requires one
  await redisSetJSON(GALLERY_REDIS_KEY, gallery, 60 * 60 * 24 * 365 * 5); // 5 years
  return gallery;
}

// GET /api/art-gallery — public, returns gallery items
router.get('/', async (_req, res) => {
  try {
    const gallery = await getGallery();
    res.json({ gallery });
  } catch (err) {
    console.error('[art-gallery] GET error:', err.message);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// POST /api/art-gallery — admin upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const label = (req.body.label || '').trim();
    if (!label) {
      return res.status(400).json({ error: 'Label is required' });
    }
    if (label.length > 200) {
      return res.status(400).json({ error: 'Label too long (max 200 chars)' });
    }

    // Store as base64 data URL in Redis
    const src = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const gallery = await getGallery();
    const newItem = { id: Date.now(), src, label };
    gallery.push(newItem);
    await saveGallery(gallery);

    res.status(201).json({ success: true, item: newItem, total: gallery.length });
  } catch (err) {
    console.error('[art-gallery] POST error:', err.message);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// DELETE /api/art-gallery/:id — admin delete
router.delete('/:id', async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const gallery = await getGallery();
    const item = gallery.find((g) => g.id === id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const updated = gallery.filter((g) => g.id !== id);
    await saveGallery(updated);
    res.json({ success: true, total: updated.length });
  } catch (err) {
    console.error('[art-gallery] DELETE error:', err.message);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
