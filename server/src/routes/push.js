// Web Push subscribe / unsubscribe API.
//
// Endpoints:
//   GET    /api/push/vapid-public-key  → returns the public key for the browser
//   POST   /api/push/subscribe          → body: PushSubscription JSON
//   POST   /api/push/unsubscribe        → body: { endpoint }
//   GET    /api/push/count              → admin-only count of active subs

const express = require('express');
const router = express.Router();
const {
  isPushEnabled,
  getVapidPublicKey,
  addSubscription,
  removeSubscription,
  subscriptionCount,
  listSubscriptions,
  sendNotificationToAll,
  getNotificationHistoryForUser,
  clearUserNotifications,
} = require('../services/push');
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');
const { getSession } = require('./auth');

const EVENING_PUSH_STATE_KEY = 'pahadi_push_evening_daily_state';
let memEveningPushState = { lastSentDay: '' };

const MORNING_NEWS_PUSH_STATE_KEY = 'pahadi_push_morning_news_state';
let memMorningNewsPushState = { lastSentDay: '' };

function readEnvInt(name, fallback) {
  const value = parseInt(process.env[name], 10);
  return Number.isFinite(value) ? value : fallback;
}

// On Vercel, serverless containers don't persist between invocations, so the
// setInterval-based scheduler never actually ticks — but the module-load
// startup check DOES run on every cold start, spamming logs (and, if Redis
// dedupe is missing, re-sending pushes). Vercel Cron (see vercel.json) is the
// real schedule there, so we skip the in-process scheduler entirely.
const IS_VERCEL = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

function getEveningPushConfig() {
  return {
    enabled: String(process.env.EVENING_PUSH_ENABLED || 'true').toLowerCase() !== 'false',
    hour: readEnvInt('EVENING_PUSH_HOUR', 18),
    minute: readEnvInt('EVENING_PUSH_MINUTE', 0),
    // Catch-up window (minutes). If the process was asleep (e.g. Render free-
    // tier spin-down) or missed the exact minute due to event-loop drift,
    // we still fire as long as we're within this window past the scheduled
    // time AND haven't sent for today yet. Only used by the setInterval
    // fallback on persistent hosts; Vercel Cron ignores it.
    catchUpMinutes: readEnvInt('EVENING_PUSH_CATCH_UP_MINUTES', 60),
    timeZone: process.env.EVENING_PUSH_TIMEZONE || 'Asia/Kolkata',
    title: process.env.EVENING_PUSH_TITLE || 'Sham ho gayi 🌄',
    body: process.env.EVENING_PUSH_BODY || 'Kuch Pahadi gaana sun lo 🎶',
    url: process.env.EVENING_PUSH_URL || '/music',
  };
}

function nowInTimeZoneParts(timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return {
    dayKey: `${map.year}-${map.month}-${map.day}`,
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

async function getEveningPushState() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(EVENING_PUSH_STATE_KEY);
    if (data && typeof data.lastSentDay === 'string') return data;
  }
  return { ...memEveningPushState };
}

async function setEveningPushState(nextState) {
  memEveningPushState = { ...nextState };
  if (isRedisEnabled()) {
    // Keep state for one year so day-level dedupe survives restarts.
    await redisSetJSON(EVENING_PUSH_STATE_KEY, memEveningPushState, 365 * 24 * 3600);
  }
}

async function runDailyEveningPushTick({ ignoreSchedule = false } = {}) {
  const cfg = getEveningPushConfig();
  if (!cfg.enabled) return { skipped: 'disabled' };
  if (!isPushEnabled()) return { skipped: 'push-not-configured' };

  const now = nowInTimeZoneParts(cfg.timeZone);

  // The setInterval loop uses a catch-up window: fire any time between
  // scheduled time and scheduled + catchUpMinutes, as long as today's push
  // hasn't gone out yet. Vercel Cron (see /cron/evening below) invokes this
  // with ignoreSchedule=true because the cron itself IS the schedule.
  if (!ignoreSchedule) {
    const nowMinutes = now.hour * 60 + now.minute;
    const scheduledMinutes = cfg.hour * 60 + cfg.minute;
    if (nowMinutes < scheduledMinutes) return { skipped: 'before-schedule' };
    if (nowMinutes > scheduledMinutes + cfg.catchUpMinutes) return { skipped: 'past-window' };
  }

  const state = await getEveningPushState();
  if (state.lastSentDay === now.dayKey) {
    console.log(`[push] evening daily dedup: already sent for ${now.dayKey}`);
    return { skipped: 'already-sent-today', dayKey: now.dayKey };
  }

  const result = await sendNotificationToAll({
    title: cfg.title,
    body: cfg.body,
    url: cfg.url,
    tag: `evening-${now.dayKey}`,
  });

  await setEveningPushState({ lastSentDay: now.dayKey, lastResult: result, sentAt: Date.now() });
  console.log(`[push] evening daily sent for ${now.dayKey} (${cfg.timeZone} ${cfg.hour}:${String(cfg.minute).padStart(2, '0')})`);
  return { sent: true, dayKey: now.dayKey, result };
}

let eveningPushTimer = null;
function startDailyEveningPushJob() {
  if (eveningPushTimer) return;

  if (IS_VERCEL) {
    console.log('[push] evening daily in-process scheduler skipped (Vercel — cron drives schedule)');
    return;
  }

  const cfg = getEveningPushConfig();
  if (!cfg.enabled) {
    console.log('[push] evening daily job disabled (EVENING_PUSH_ENABLED=false)');
    return;
  }

  // Check every minute and send once/day when local target time matches.
  eveningPushTimer = setInterval(() => {
    runDailyEveningPushTick().catch((err) => {
      console.error('[push] evening daily tick error:', err.message);
    });
  }, 60 * 1000);

  // Run one immediate check at startup in case server booted exactly near 6 PM.
  runDailyEveningPushTick().catch((err) => {
    console.error('[push] evening daily startup check error:', err.message);
  });

  console.log(
    `[push] evening daily job enabled at ${String(cfg.hour).padStart(2, '0')}:${String(cfg.minute).padStart(2, '0')} (${cfg.timeZone})`
  );
}

startDailyEveningPushJob();

// ── Morning 9 AM Garhwali News Auto-Agent ──
// Automatically crawls news → translates 1 most relevant to Garhwali →
// publishes it → sends push notification. Runs the full newsAgent pipeline.
// Config via env vars: MORNING_NEWS_PUSH_ENABLED, MORNING_NEWS_PUSH_HOUR,
// MORNING_NEWS_PUSH_MINUTE, MORNING_NEWS_PUSH_TIMEZONE.

function getMorningNewsPushConfig() {
  return {
    enabled: String(process.env.MORNING_NEWS_PUSH_ENABLED || 'true').toLowerCase() !== 'false',
    hour: readEnvInt('MORNING_NEWS_PUSH_HOUR', 9),
    minute: readEnvInt('MORNING_NEWS_PUSH_MINUTE', 0),
    // See getEveningPushConfig for rationale. Only used by the setInterval
    // fallback on persistent hosts; Vercel Cron ignores it.
    catchUpMinutes: readEnvInt('MORNING_NEWS_PUSH_CATCH_UP_MINUTES', 60),
    timeZone: process.env.MORNING_NEWS_PUSH_TIMEZONE || 'Asia/Kolkata',
  };
}

async function getMorningNewsPushState() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(MORNING_NEWS_PUSH_STATE_KEY);
    if (data && typeof data.lastSentDay === 'string') return data;
  }
  return { ...memMorningNewsPushState };
}

async function setMorningNewsPushState(nextState) {
  memMorningNewsPushState = { ...nextState };
  if (isRedisEnabled()) {
    await redisSetJSON(MORNING_NEWS_PUSH_STATE_KEY, memMorningNewsPushState, 365 * 24 * 3600);
  }
}

async function runMorningNewsPushTick({ ignoreSchedule = false } = {}) {
  const cfg = getMorningNewsPushConfig();
  if (!cfg.enabled) return { skipped: 'disabled' };
  if (!isPushEnabled()) return { skipped: 'push-not-configured' };

  const now = nowInTimeZoneParts(cfg.timeZone);

  // See runDailyEveningPushTick — Vercel Cron passes ignoreSchedule=true.
  if (!ignoreSchedule) {
    const nowMinutes = now.hour * 60 + now.minute;
    const scheduledMinutes = cfg.hour * 60 + cfg.minute;
    if (nowMinutes < scheduledMinutes) return { skipped: 'before-schedule' };
    if (nowMinutes > scheduledMinutes + cfg.catchUpMinutes) return { skipped: 'past-window' };
  }

  const state = await getMorningNewsPushState();
  if (state.lastSentDay === now.dayKey) {
    console.log(`[push] morning news dedup: already sent for ${now.dayKey}`);
    return { skipped: 'already-sent-today', dayKey: now.dayKey };
  }

  console.log(`[push] morning news: starting auto crawl+translate+publish for ${now.dayKey}...`);

  try {
    // Lazy-require to avoid circular dependency
    const { crawlNews, deduplicateArticles } = require('../services/newsCrawler');
    const { translateBatch } = require('../services/newsTranslator');
    const { loadNews, saveNews } = require('./news');

    // Step 1: Crawl latest news (max 5 per feed, last 24h)
    const crawled = await crawlNews({ maxPerFeed: 5, maxAge: 24 });
    if (!crawled || crawled.length === 0) {
      console.log('[push] morning news: no articles crawled, skipping');
      await setMorningNewsPushState({ lastSentDay: now.dayKey, status: 'no-articles-crawled', sentAt: Date.now() });
      return { skipped: 'no-articles-crawled', dayKey: now.dayKey };
    }

    // Step 2: Deduplicate against existing news
    const existing = await loadNews();
    const newArticles = deduplicateArticles(crawled, existing);
    if (newArticles.length === 0) {
      console.log('[push] morning news: all articles already exist, skipping');
      await setMorningNewsPushState({ lastSentDay: now.dayKey, status: 'all-duplicates', sentAt: Date.now() });
      return { skipped: 'all-duplicates', dayKey: now.dayKey };
    }

    // Step 3: Pick the 1 most relevant (newest) article and translate to Garhwali
    const topArticle = newArticles[0]; // already sorted newest-first by crawler
    console.log(`[push] morning news: translating "${topArticle.title.slice(0, 60)}..." to Garhwali`);
    const translated = await translateBatch([topArticle], 2);

    if (!translated || translated.length === 0) {
      console.error('[push] morning news: translation failed');
      await setMorningNewsPushState({ lastSentDay: now.dayKey, status: 'translation-failed', sentAt: Date.now() });
      return { skipped: 'translation-failed', dayKey: now.dayKey };
    }

    // Step 4: Publish the translated article
    const t = translated[0];
    let articleBody = t.body;
    if (t.source) {
      articleBody += `\n\n---\n📰 स्रोत: ${t.source}`;
      if (t.sourceUrl) articleBody += ` | [मूल लेख](${t.sourceUrl})`;
    }

    const article = {
      id: Date.now(),
      title: t.title,
      summary: t.summary || '',
      body: articleBody,
      category: t.category || 'uttarakhand',
      imageUrl: '',
      createdAt: Date.now(),
      autoGenerated: true,
      source: t.source || topArticle.source,
      sourceUrl: t.sourceUrl || topArticle.sourceUrl,
    };

    const articles = await loadNews();
    articles.unshift(article);
    if (articles.length > 200) articles.length = 200;
    await saveNews(articles);

    // Step 5: Send push notification
    const result = await sendNotificationToAll({
      title: article.title.slice(0, 80),
      body: (article.summary || article.body).slice(0, 160),
      url: '/news',
      tag: `morning-news-${now.dayKey}`,
      icon: '/icons/icon-192-v2.png',
    });

    await setMorningNewsPushState({
      lastSentDay: now.dayKey,
      lastResult: result,
      sentAt: Date.now(),
      articleId: article.id,
      status: 'published',
    });
    console.log(`[push] morning news published & pushed for ${now.dayKey} — "${article.title.slice(0, 60)}" (${cfg.timeZone} ${cfg.hour}:${String(cfg.minute).padStart(2, '0')})`);
    return { sent: true, dayKey: now.dayKey, articleId: article.id, result };
  } catch (err) {
    console.error(`[push] morning news pipeline error for ${now.dayKey}:`, err.message);
    await setMorningNewsPushState({ lastSentDay: now.dayKey, status: 'error', error: err.message, sentAt: Date.now() });
    return { error: err.message, dayKey: now.dayKey };
  }
}

let morningNewsPushTimer = null;
function startMorningNewsPushJob() {
  if (morningNewsPushTimer) return;

  if (IS_VERCEL) {
    console.log('[push] morning news in-process scheduler skipped (Vercel — cron drives schedule)');
    return;
  }

  const cfg = getMorningNewsPushConfig();
  if (!cfg.enabled) {
    console.log('[push] morning news push disabled (MORNING_NEWS_PUSH_ENABLED=false)');
    return;
  }

  morningNewsPushTimer = setInterval(() => {
    runMorningNewsPushTick().catch((err) => {
      console.error('[push] morning news push tick error:', err.message);
    });
  }, 60 * 1000);

  // Immediate check at startup
  runMorningNewsPushTick().catch((err) => {
    console.error('[push] morning news push startup check error:', err.message);
  });

  console.log(
    `[push] morning news push enabled at ${String(cfg.hour).padStart(2, '0')}:${String(cfg.minute).padStart(2, '0')} (${cfg.timeZone})`
  );
}

startMorningNewsPushJob();

// Best-effort caller identity for per-user notification clearing.
// Prefers the logged-in user email (via Bearer session token); otherwise
// falls back to an anonymous device id supplied by the client. Returns
// null if neither is available.
async function resolveUserKey(req) {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const session = await getSession(token);
      if (session && session.expiresAt > Date.now() && session.email) {
        return `u:${session.email}`;
      }
    } catch { /* ignore */ }
  }
  const anon = req.headers['x-device-id'] || req.query.deviceId || req.body?.deviceId;
  if (anon && typeof anon === 'string') {
    // Limit length to avoid unbounded keys.
    return `d:${anon.slice(0, 64)}`;
  }
  return null;
}

router.get('/vapid-public-key', (_req, res) => {
  if (!isPushEnabled()) {
    return res.status(503).json({ error: 'Push notifications are not configured' });
  }
  res.json({ publicKey: getVapidPublicKey() });
});

router.post('/subscribe', async (req, res) => {
  try {
    const sub = req.body;
    if (!sub || !sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
      return res.status(400).json({ error: 'Invalid subscription' });
    }
    const created = await addSubscription(sub);
    res.json({ ok: true, created });
  } catch (err) {
    console.error('[push] subscribe error:', err.message);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

router.post('/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: 'endpoint required' });
    const removed = await removeSubscription(endpoint);
    res.json({ ok: true, removed });
  } catch (err) {
    console.error('[push] unsubscribe error:', err.message);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Public: recent notifications for subscribed users
router.get('/subscriber-count', async (_req, res) => {
  const count = await subscriptionCount();
  res.json({ count });
});

// Public: notification history (last 20 sent notifications), filtered by
// the caller's per-user "cleared" timestamp when an identity is available.
router.get('/notifications', async (req, res) => {
  const userKey = await resolveUserKey(req);
  const notifications = await getNotificationHistoryForUser(userKey);
  res.json({ notifications });
});

// Public: clear the caller's notification list. We record a `clearedAt`
// timestamp in Redis for this user/device so future GETs filter out
// anything older. Does NOT mutate the global history (other users still
// see their notifications).
router.post('/notifications/clear', async (req, res) => {
  const userKey = await resolveUserKey(req);
  if (!userKey) {
    return res.status(400).json({ error: 'Missing user identity (login or x-device-id header required)' });
  }
  const clearedAt = await clearUserNotifications(userKey);
  res.json({ ok: true, clearedAt });
});

router.get('/count', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const count = await subscriptionCount();
  res.json({ count, enabled: isPushEnabled() });
});

// Admin: list registered subscribers (privacy-trimmed).
//   GET /api/push/list?key=<adminKey>
router.get('/list', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const subscriptions = await listSubscriptions();
  res.json({ count: subscriptions.length, enabled: isPushEnabled(), subscriptions });
});

// Admin: send a test push to every subscribed device. Useful for debugging
// platform-specific delivery issues (e.g. Android battery optimization).
//   curl -X POST 'https://<host>/api/push/test?key=<adminKey>'
router.post('/test', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const result = await sendNotificationToAll({
    title: 'PahadiTube test 🔔',
    body: 'Agar yeh dikhe to notifications kaam kar rahe hain.',
    url: '/',
    tag: `test-${Date.now()}`,
  });
  res.json(result);
});

// Admin: send a custom push to every subscribed device.
//   POST /api/push/send?key=<adminKey>
//   Body: { title, body, url?, tag? }
router.post('/send', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { title, body, url, tag } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const result = await sendNotificationToAll({
    title: String(title).slice(0, 80),
    body: String(body || '').slice(0, 200),
    url: url || '/',
    tag: tag || `custom-${Date.now()}`,
  });
  res.json(result);
});

// ── Vercel Cron endpoints ──
// On Vercel, the app runs as serverless functions so setInterval-based
// scheduling does not survive between invocations. Vercel Cron (declared in
// vercel.json → "crons") makes an HTTP GET to these paths on schedule and
// automatically attaches `Authorization: Bearer $CRON_SECRET` when the
// `CRON_SECRET` env var is set in the Vercel project.
//
// Manual override for testing: append ?key=<FEEDBACK_ADMIN_KEY>.
function isCronAuthorized(req) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization || '';
    if (auth === `Bearer ${cronSecret}`) return true;
  }
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key && req.query.key === adminKey) return true;
  return false;
}

router.get('/cron/evening', async (req, res) => {
  if (!isCronAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await runDailyEveningPushTick({ ignoreSchedule: true });
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('[push] cron/evening error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/cron/morning-news', async (req, res) => {
  if (!isCronAuthorized(req)) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await runMorningNewsPushTick({ ignoreSchedule: true });
    res.json({ ok: true, ...result });
  } catch (err) {
    console.error('[push] cron/morning-news error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
