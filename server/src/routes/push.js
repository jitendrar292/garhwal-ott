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

function readEnvInt(name, fallback) {
  const value = parseInt(process.env[name], 10);
  return Number.isFinite(value) ? value : fallback;
}

function getEveningPushConfig() {
  return {
    enabled: String(process.env.EVENING_PUSH_ENABLED || 'true').toLowerCase() !== 'false',
    hour: readEnvInt('EVENING_PUSH_HOUR', 18),
    minute: readEnvInt('EVENING_PUSH_MINUTE', 0),
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

async function runDailyEveningPushTick() {
  const cfg = getEveningPushConfig();
  if (!cfg.enabled) return;
  if (!isPushEnabled()) return;

  const now = nowInTimeZoneParts(cfg.timeZone);
  if (now.hour !== cfg.hour || now.minute !== cfg.minute) return;

  const state = await getEveningPushState();
  if (state.lastSentDay === now.dayKey) return;

  const result = await sendNotificationToAll({
    title: cfg.title,
    body: cfg.body,
    url: cfg.url,
    tag: `evening-${now.dayKey}`,
  });

  await setEveningPushState({ lastSentDay: now.dayKey, lastResult: result, sentAt: Date.now() });
  console.log(`[push] evening daily sent for ${now.dayKey} (${cfg.timeZone} ${cfg.hour}:${String(cfg.minute).padStart(2, '0')})`);
}

let eveningPushTimer = null;
function startDailyEveningPushJob() {
  if (eveningPushTimer) return;

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

module.exports = router;
