const express = require('express');
const multer = require('multer');
const { redisGetJSON, redisSetJSON } = require('../services/store');

const router = express.Router();
const ADMIN_KEY = () => process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
const RUNNER_REDIS_KEY = 'pahadi_runner_chars';

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

// Default characters (seeded if Redis is empty)
const DEFAULT_CHARACTERS = [
  { id: 1, src: '/art/run-char.png', label: 'पहाड़ी दौड़' },
];

async function getCharacters() {
  const cached = await redisGetJSON(RUNNER_REDIS_KEY);
  if (cached && Array.isArray(cached) && cached.length > 0) return cached;
  // Seed with defaults
  await redisSetJSON(RUNNER_REDIS_KEY, DEFAULT_CHARACTERS, 60 * 60 * 24 * 365 * 5);
  return DEFAULT_CHARACTERS;
}

async function saveCharacters(chars) {
  await redisSetJSON(RUNNER_REDIS_KEY, chars, 60 * 60 * 24 * 365 * 5);
  return chars;
}

// GET /api/runner — public, returns runner characters
router.get('/', async (_req, res) => {
  try {
    const chars = await getCharacters();
    res.json({ characters: chars });
  } catch (err) {
    console.error('[runner] GET error:', err.message);
    res.status(500).json({ error: 'Failed to fetch runner characters' });
  }
});

// POST /api/runner — admin upload new character
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    const label = (req.body.label || '').trim() || 'Runner';
    if (label.length > 200) {
      return res.status(400).json({ error: 'Label too long (max 200 chars)' });
    }

    // Store as base64 data URL in Redis
    const src = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const chars = await getCharacters();
    const newItem = { id: Date.now(), src, label };
    chars.push(newItem);
    await saveCharacters(chars);

    res.status(201).json({ success: true, item: newItem, total: chars.length });
  } catch (err) {
    console.error('[runner] POST error:', err.message);
    res.status(500).json({ error: 'Failed to upload character' });
  }
});

// DELETE /api/runner/:id — admin delete
router.delete('/:id', async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    const chars = await getCharacters();
    const item = chars.find((c) => c.id === id);
    if (!item) return res.status(404).json({ error: 'Character not found' });

    const updated = chars.filter((c) => c.id !== id);
    await saveCharacters(updated);
    res.json({ success: true, total: updated.length });
  } catch (err) {
    console.error('[runner] DELETE error:', err.message);
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

module.exports = router;
