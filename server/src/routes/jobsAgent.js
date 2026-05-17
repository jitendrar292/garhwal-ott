// Jobs & Events Agent — automated pipeline: crawl → extract → preview → publish.
//
// Endpoints:
//   POST /api/jobs-agent/pull-jobs     → crawl + extract jobs (admin, returns preview)
//   POST /api/jobs-agent/publish-jobs  → publish selected jobs to CMS (admin)
//   POST /api/jobs-agent/pull-events   → crawl + extract events (admin, returns preview)
//   POST /api/jobs-agent/publish-events → publish selected events (admin)
//   GET  /api/jobs-agent/status        → last run info (admin)

const express = require('express');
const router = express.Router();
const { crawlJobs, crawlEvents, deduplicateJobs } = require('../services/jobsCrawler');
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');
const { sendNotificationToAll } = require('../services/push');

const REDIS_KEY_JOBS = 'pahadi_jobs';
const REDIS_KEY_EVENTS = 'pahadi_events';
const MAX_JOBS = 100;
const MAX_EVENTS = 50;

// ── Run state ──
let lastRun = {
  type: null, // 'jobs' | 'events'
  status: 'idle',
  startedAt: null,
  completedAt: null,
  found: 0,
  new: 0,
  published: 0,
  errors: [],
};

// ── Admin auth ──
function checkAdmin(req, res) {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  const key = req.query.key || req.headers['x-admin-key'];
  if (key !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ── Load/save jobs (mirrors jobs.js logic) ──
let memJobs = [];
async function loadJobs() {
  if (memJobs.length > 0) return memJobs;
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY_JOBS);
    if (data) { memJobs = data; return memJobs; }
  }
  return memJobs;
}

async function saveJobs(list) {
  memJobs = list;
  if (isRedisEnabled()) {
    await redisSetJSON(REDIS_KEY_JOBS, list, 365 * 24 * 3600);
  }
}

// ── Load/save events ──
let memEvents = [];
async function loadEvents() {
  if (memEvents.length > 0) return memEvents;
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY_EVENTS);
    if (data) { memEvents = data; return memEvents; }
  }
  return memEvents;
}

async function saveEvents(list) {
  memEvents = list;
  if (isRedisEnabled()) {
    await redisSetJSON(REDIS_KEY_EVENTS, list, 365 * 24 * 3600);
  }
}

// ── Pull Jobs (crawl + extract, return preview) ──
router.post('/pull-jobs', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  lastRun = { type: 'jobs', status: 'running', startedAt: Date.now(), completedAt: null, found: 0, new: 0, published: 0, errors: [] };

  try {
    console.log('[jobsAgent] Pulling latest jobs...');
    const crawled = await crawlJobs();
    lastRun.found = crawled.length;

    if (crawled.length === 0) {
      lastRun.status = 'completed';
      lastRun.completedAt = Date.now();
      return res.json({ message: 'No jobs found from sources', jobs: [], found: 0, new: 0 });
    }

    // Deduplicate against existing
    const existing = await loadJobs();
    const newJobs = deduplicateJobs(crawled, existing);
    lastRun.new = newJobs.length;
    lastRun.status = 'completed';
    lastRun.completedAt = Date.now();

    console.log(`[jobsAgent] Found ${crawled.length}, ${newJobs.length} are new`);
    res.json({
      message: `Found ${crawled.length} jobs, ${newJobs.length} are new`,
      jobs: newJobs.slice(0, 20), // Preview up to 20
      found: crawled.length,
      new: newJobs.length,
    });
  } catch (err) {
    console.error('[jobsAgent] pull-jobs error:', err);
    lastRun.status = 'error';
    lastRun.completedAt = Date.now();
    lastRun.errors.push(err.message);
    res.status(500).json({ error: err.message || 'Failed to pull jobs' });
  }
});

// ── Publish selected jobs ──
router.post('/publish-jobs', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  const { jobs: selected } = req.body || {};
  if (!Array.isArray(selected) || selected.length === 0) {
    return res.status(400).json({ error: 'No jobs provided' });
  }
  if (selected.length > 20) {
    return res.status(400).json({ error: 'Max 20 jobs at a time' });
  }

  try {
    const existingJobs = await loadJobs();
    let published = 0;

    for (const job of selected) {
      if (!job.title || !job.department || !job.lastDate) continue;

      const id = job.title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50) + '-' + Date.now().toString(36);

      const newJob = {
        id,
        title: job.title,
        titleLocal: job.titleLocal || '',
        department: job.department,
        location: job.location || 'Uttarakhand',
        vacancies: parseInt(job.vacancies) || 0,
        lastDate: job.lastDate,
        postedDate: new Date().toISOString().slice(0, 10),
        salary: job.salary || '',
        eligibility: job.eligibility || '',
        category: job.category || 'state',
        link: job.link || '',
        emoji: job.emoji || '📋',
        featured: job.featured === true || (parseInt(job.vacancies) || 0) >= 100,
        createdAt: Date.now(),
        autoGenerated: true,
      };

      existingJobs.unshift(newJob);
      published++;
    }

    if (existingJobs.length > MAX_JOBS) existingJobs.length = MAX_JOBS;
    await saveJobs(existingJobs);

    lastRun.published = published;

    // Send push notification
    if (published > 0) {
      sendNotificationToAll({
        title: `💼 ${published} नई सरकारी नौकरियाँ!`,
        body: selected[0]?.title || 'New government jobs posted',
        url: '/jobs',
        tag: `jobs-agent-${Date.now()}`,
        icon: '/icons/icon-192-v2.png',
      }).catch((e) => console.error('[jobsAgent] push error:', e.message));
    }

    console.log(`[jobsAgent] Published ${published} jobs`);
    res.json({ message: `Published ${published} jobs`, published });
  } catch (err) {
    console.error('[jobsAgent] publish-jobs error:', err);
    res.status(500).json({ error: err.message || 'Failed to publish jobs' });
  }
});

// ── Pull Events (crawl + extract, return preview) ──
router.post('/pull-events', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  lastRun = { type: 'events', status: 'running', startedAt: Date.now(), completedAt: null, found: 0, new: 0, published: 0, errors: [] };

  try {
    console.log('[jobsAgent] Pulling latest events...');
    const crawled = await crawlEvents();
    lastRun.found = crawled.length;
    lastRun.status = 'completed';
    lastRun.completedAt = Date.now();

    if (crawled.length === 0) {
      return res.json({ message: 'No events found from sources', events: [], found: 0 });
    }

    console.log(`[jobsAgent] Found ${crawled.length} events`);
    res.json({
      message: `Found ${crawled.length} events`,
      events: crawled.slice(0, 15),
      found: crawled.length,
    });
  } catch (err) {
    console.error('[jobsAgent] pull-events error:', err);
    lastRun.status = 'error';
    lastRun.completedAt = Date.now();
    lastRun.errors.push(err.message);
    res.status(500).json({ error: err.message || 'Failed to pull events' });
  }
});

// ── Publish selected events ──
router.post('/publish-events', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  const { events: selected } = req.body || {};
  if (!Array.isArray(selected) || selected.length === 0) {
    return res.status(400).json({ error: 'No events provided' });
  }
  if (selected.length > 15) {
    return res.status(400).json({ error: 'Max 15 events at a time' });
  }

  try {
    const existingEvents = await loadEvents();
    let published = 0;

    for (const event of selected) {
      if (!event.name || !event.date) continue;

      const newEvent = {
        id: event.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 50) + '-' + Date.now().toString(36),
        name: event.name,
        nameLocal: event.nameLocal || '',
        date: event.date,
        endDate: event.endDate || null,
        location: event.location || 'Uttarakhand',
        organizer: event.organizer || '',
        category: event.category || 'fest',
        emoji: event.emoji || '🎉',
        description: event.description || '',
        link: event.link || '',
        createdAt: Date.now(),
        autoGenerated: true,
      };

      existingEvents.unshift(newEvent);
      published++;
    }

    if (existingEvents.length > MAX_EVENTS) existingEvents.length = MAX_EVENTS;
    await saveEvents(existingEvents);

    // Push notification
    if (published > 0) {
      sendNotificationToAll({
        title: `🎉 ${published} new events added!`,
        body: selected[0]?.name || 'New Uttarakhand events',
        url: '/',
        tag: `events-agent-${Date.now()}`,
        icon: '/icons/icon-192-v2.png',
      }).catch((e) => console.error('[jobsAgent] push error:', e.message));
    }

    console.log(`[jobsAgent] Published ${published} events`);
    res.json({ message: `Published ${published} events`, published });
  } catch (err) {
    console.error('[jobsAgent] publish-events error:', err);
    res.status(500).json({ error: err.message || 'Failed to publish events' });
  }
});

// ── Status ──
router.get('/status', (req, res) => {
  if (!checkAdmin(req, res)) return;
  res.json({ lastRun });
});

module.exports = router;
