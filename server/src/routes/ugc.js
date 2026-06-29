// UGC (User-Generated Content) route
// POST /api/ugc/submit           — community submits a recipe or village story
// GET  /api/ugc/admin/submissions — admin lists all pending/approved submissions
// PATCH /api/ugc/admin/submissions/:id/approve — admin approves
// DELETE /api/ugc/admin/submissions/:id        — admin deletes

const express = require('express');
const router = express.Router();
const { redisGetJSON, redisSetJSON } = require('../services/store');

const UGC_KEY = 'ugc_submissions';
const TTL_SECONDS = 60 * 60 * 24 * 365; // 1 year
const MAX_PENDING = 500; // cap to avoid runaway growth

// ─── Field validation ─────────────────────────────────────────────────────────
const TITLE_MAX = 120;
const CONTENT_MAX = 8000;
const NAME_MAX = 80;
const CONTACT_MAX = 120;
const ALLOWED_TYPES = ['recipe', 'story'];

function sanitizeText(str, max) {
  if (typeof str !== 'string') return '';
  // Remove null bytes and control characters, then trim and truncate
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim().slice(0, max);
}

function validateSubmission(body) {
  const errors = [];
  const { type, title, content, submitterName, contact } = body;

  if (!ALLOWED_TYPES.includes(type)) errors.push('type must be "recipe" or "story"');
  if (!title || sanitizeText(title, TITLE_MAX).length < 3) errors.push('title is required (min 3 chars)');
  if (!content || sanitizeText(content, CONTENT_MAX).length < 20) errors.push('content is required (min 20 chars)');
  if (!submitterName || sanitizeText(submitterName, NAME_MAX).length < 2) errors.push('submitterName is required');
  if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
    // Allow empty contact; if provided must be valid email
    errors.push('contact must be a valid email address if provided');
  }

  // Extra fields for recipes
  if (type === 'recipe') {
    if (!body.ingredients || sanitizeText(body.ingredients, CONTENT_MAX).length < 5) {
      errors.push('ingredients is required for recipe submissions');
    }
  }

  return errors;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
// In-memory fallback when Redis is not configured
let memSubmissions = [];

async function loadSubmissions() {
  const cached = await redisGetJSON(UGC_KEY);
  if (cached && Array.isArray(cached)) return cached;
  return memSubmissions;
}

async function saveSubmissions(list) {
  memSubmissions = list;
  await redisSetJSON(UGC_KEY, list, TTL_SECONDS);
}

function requireAdmin(req, res, next) {
  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  if (!ADMIN_SECRET) {
    return res.status(503).json({ error: 'Admin access not configured on this server.' });
  }
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// POST /api/ugc/submit
router.post('/submit', async (req, res) => {
  const errors = validateSubmission(req.body);
  if (errors.length) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  const submissions = await loadSubmissions();
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  if (pendingCount >= MAX_PENDING) {
    return res.status(429).json({ error: 'Submission queue is full. Please try again later.' });
  }

  const { type, title, content, submitterName, contact, ingredients, region, district } = req.body;

  const entry = {
    id: `ugc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: sanitizeText(title, TITLE_MAX),
    content: sanitizeText(content, CONTENT_MAX),
    submitterName: sanitizeText(submitterName, NAME_MAX),
    contact: contact ? sanitizeText(contact, CONTACT_MAX) : '',
    region: region ? sanitizeText(region, 80) : '',
    district: district ? sanitizeText(district, 80) : '',
    ingredients: ingredients ? sanitizeText(ingredients, CONTENT_MAX) : '',
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  submissions.push(entry);
  await saveSubmissions(submissions);

  res.status(201).json({ ok: true, message: 'Submission received. It will appear after review.' });
});

// GET /api/ugc/admin/submissions
router.get('/admin/submissions', requireAdmin, async (req, res) => {
  const submissions = await loadSubmissions();
  // Sort newest first
  const sorted = [...submissions].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  res.json({ submissions: sorted });
});

// PATCH /api/ugc/admin/submissions/:id/approve
router.patch('/admin/submissions/:id/approve', requireAdmin, async (req, res) => {
  const submissions = await loadSubmissions();
  const idx = submissions.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Submission not found' });

  submissions[idx].status = 'approved';
  submissions[idx].approvedAt = new Date().toISOString();
  await saveSubmissions(submissions);
  res.json({ ok: true });
});

// DELETE /api/ugc/admin/submissions/:id
router.delete('/admin/submissions/:id', requireAdmin, async (req, res) => {
  let submissions = await loadSubmissions();
  const exists = submissions.some((s) => s.id === req.params.id);
  if (!exists) return res.status(404).json({ error: 'Submission not found' });

  submissions = submissions.filter((s) => s.id !== req.params.id);
  await saveSubmissions(submissions);
  res.json({ ok: true });
});

// GET /api/ugc/approved — public endpoint returning approved items
router.get('/approved', async (req, res) => {
  const submissions = await loadSubmissions();
  const { type } = req.query;
  let approved = submissions.filter((s) => s.status === 'approved');
  if (type && ALLOWED_TYPES.includes(type)) {
    approved = approved.filter((s) => s.type === type);
  }
  res.json({ submissions: approved });
});

module.exports = router;
