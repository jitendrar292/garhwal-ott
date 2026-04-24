// Government Jobs CRUD — stores job postings in Redis
//
// Endpoints:
//   GET    /api/jobs               → list all jobs (public)
//   GET    /api/jobs/:id           → single job (public)
//   POST   /api/jobs               → create job (admin)
//   PUT    /api/jobs/:id           → update job (admin)
//   DELETE /api/jobs/:id           → delete job (admin)
//
// Admin auth: ?key=<FEEDBACK_ADMIN_KEY>

const express = require('express');
const router = express.Router();
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');

const REDIS_KEY = 'pahadi_jobs';
const MAX_JOBS = 100;

// In-memory fallback when Redis is down
let memJobs = [];

// Cache for public list endpoint
let listCache = null;
const LIST_TTL_MS = 60 * 1000; // 60 seconds
function invalidateListCache() { listCache = null; }

async function loadJobs() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY);
    if (data) return data;
  }
  return [...memJobs];
}

async function saveJobs(list) {
  memJobs = list;
  invalidateListCache();
  if (isRedisEnabled()) {
    await redisSetJSON(REDIS_KEY, list, 365 * 24 * 3600);
  }
}

// Validate admin key
function checkAdmin(req, res) {
  const key = req.query.key || req.headers['x-admin-key'];
  const expected = process.env.FEEDBACK_ADMIN_KEY || 'admin123';
  if (key !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ── Public: list jobs ──
router.get('/', async (_req, res) => {
  try {
    if (listCache && Date.now() - listCache.at < LIST_TTL_MS) {
      res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
      return res.json(listCache.payload);
    }

    const jobs = await loadJobs();
    // Sort by lastDate ascending (upcoming first)
    const sorted = jobs.sort((a, b) => (a.lastDate || '').localeCompare(b.lastDate || ''));

    const payload = { jobs: sorted };
    listCache = { at: Date.now(), payload };
    res.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    res.json(payload);
  } catch (err) {
    console.error('[jobs] list error:', err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// ── Public: single job ──
router.get('/:id', async (req, res) => {
  try {
    const jobs = await loadJobs();
    const job = jobs.find((j) => j.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ job });
  } catch (err) {
    console.error('[jobs] get error:', err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// ── Admin: create job ──
router.post('/', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const { title, titleLocal, department, location, vacancies, lastDate, postedDate, salary, eligibility, category, link, emoji, featured } = req.body;

    if (!title || !department || !lastDate) {
      return res.status(400).json({ error: 'title, department, and lastDate are required' });
    }

    const jobs = await loadJobs();

    // Generate ID from title
    const id = title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50) + '-' + Date.now().toString(36);

    const newJob = {
      id,
      title,
      titleLocal: titleLocal || '',
      department,
      location: location || 'Uttarakhand',
      vacancies: parseInt(vacancies) || 0,
      lastDate,
      postedDate: postedDate || new Date().toISOString().slice(0, 10),
      salary: salary || '',
      eligibility: eligibility || '',
      category: category || 'state',
      link: link || '',
      emoji: emoji || '📋',
      featured: featured === true,
      createdAt: Date.now(),
    };

    jobs.unshift(newJob);
    
    // Keep only MAX_JOBS
    if (jobs.length > MAX_JOBS) jobs.length = MAX_JOBS;

    await saveJobs(jobs);
    res.status(201).json({ job: newJob });
  } catch (err) {
    console.error('[jobs] create error:', err);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// ── Admin: update job ──
router.put('/:id', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const jobs = await loadJobs();
    const idx = jobs.findIndex((j) => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Job not found' });

    const updates = req.body;
    const updated = { ...jobs[idx], ...updates, updatedAt: Date.now() };
    // Preserve original id
    updated.id = jobs[idx].id;
    jobs[idx] = updated;

    await saveJobs(jobs);
    res.json({ job: updated });
  } catch (err) {
    console.error('[jobs] update error:', err);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// ── Admin: delete job ──
router.delete('/:id', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  try {
    const jobs = await loadJobs();
    const idx = jobs.findIndex((j) => j.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Job not found' });

    jobs.splice(idx, 1);
    await saveJobs(jobs);
    res.json({ success: true });
  } catch (err) {
    console.error('[jobs] delete error:', err);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;
