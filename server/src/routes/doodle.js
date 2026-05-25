const express = require('express');
const multer = require('multer');
const { redisGetJSON, redisSetJSON } = require('../services/store');

const router = express.Router();
const ADMIN_KEY = () => process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
const DOODLE_REDIS_KEY = 'pahadi_doodle_active';

// Multer: in-memory for upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PNG, JPEG, WebP, GIF images are allowed'));
  },
});

// GET /api/doodle — public, returns active doodle (or null)
router.get('/', async (_req, res) => {
  try {
    const doodle = await redisGetJSON(DOODLE_REDIS_KEY);
    res.json({ doodle: doodle || null });
  } catch (err) {
    console.error('[doodle] GET error:', err.message);
    res.status(500).json({ error: 'Failed to fetch doodle' });
  }
});

// POST /api/doodle — admin upload new doodle
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const caption = (req.body.caption || '').trim() || 'आज का डूडल';
    const subtitle = (req.body.subtitle || '').trim() || '';
    const overlayText = (req.body.overlayText || '').trim() || '';

    // Store as base64 data URL
    const src = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const doodle = {
      id: Date.now(),
      src,
      caption,
      subtitle,
      overlayText,
      createdAt: new Date().toISOString(),
    };

    // Doodle lasts 24 hours
    await redisSetJSON(DOODLE_REDIS_KEY, doodle, 60 * 60 * 24);

    res.status(201).json({ success: true, doodle });
  } catch (err) {
    console.error('[doodle] POST error:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// DELETE /api/doodle — admin remove active doodle
router.delete('/', async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    await redisSetJSON(DOODLE_REDIS_KEY, null, 1);
    res.json({ success: true });
  } catch (err) {
    console.error('[doodle] DELETE error:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
