const express = require('express');
const { redisGetJSON, redisSetJSON } = require('../services/store');

const router = express.Router();
const ADMIN_KEY = () => process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
const BYO_REDIS_KEY = 'pahadi_byo_registrations';

async function getRegistrations() {
  const data = await redisGetJSON(BYO_REDIS_KEY);
  return Array.isArray(data) ? data : [];
}

async function saveRegistrations(list) {
  await redisSetJSON(BYO_REDIS_KEY, list, 60 * 60 * 24 * 365 * 2); // 2 years
}

// POST /api/byo/register — public, user early-access signup
router.post('/register', async (req, res) => {
  try {
    const { name, phone, region } = req.body || {};
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    if (phone.length < 10 || phone.length > 15) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    const entry = {
      id: Date.now(),
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 15),
      region: (region || '').trim().slice(0, 50),
      createdAt: new Date().toISOString(),
    };

    const list = await getRegistrations();

    // Prevent duplicate phone numbers
    if (list.some((r) => r.phone === entry.phone)) {
      return res.status(409).json({ error: 'Already registered', alreadyExists: true });
    }

    list.unshift(entry); // newest first
    await saveRegistrations(list);

    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (err) {
    console.error('[byo] register error:', err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/byo/registrations — admin only
router.get('/registrations', async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const list = await getRegistrations();
    res.json({ registrations: list, count: list.length });
  } catch (err) {
    console.error('[byo] list error:', err.message);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// DELETE /api/byo/registrations/:id — admin only
router.delete('/registrations/:id', async (req, res) => {
  try {
    if (req.query.key !== ADMIN_KEY()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const id = parseInt(req.params.id, 10);
    const list = await getRegistrations();
    const filtered = list.filter((r) => r.id !== id);
    await saveRegistrations(filtered);
    res.json({ success: true, remaining: filtered.length });
  } catch (err) {
    console.error('[byo] delete error:', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
