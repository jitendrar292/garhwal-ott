// Web Push notification service.
//
// Stores PushSubscription objects in Redis (or in-memory fallback) and sends
// VAPID-authenticated push messages via the `web-push` library.
//
// Required env vars (set in server/.env or Render dashboard):
//   VAPID_PUBLIC_KEY   — base64url public key
//   VAPID_PRIVATE_KEY  — base64url private key
//   VAPID_SUBJECT      — mailto:you@example.com  (or https://your-site)
//
// Generate a key pair once with:
//   npx web-push generate-vapid-keys
// Then add the values to your env files. The PUBLIC key is also exposed to
// the client via GET /api/push/vapid-public-key so the browser can subscribe.

const webpush = require('web-push');
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('./store');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:info@pahaditube.in';
const REDIS_KEY = 'pahadi_push_subs';

// In-memory fallback (used only when Redis is unavailable).
let memSubs = [];

const isPushEnabled = () => Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);

if (isPushEnabled()) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log('[push] enabled');
} else {
  console.log('[push] disabled — set VAPID_PUBLIC_KEY + VAPID_PRIVATE_KEY to enable');
}

async function loadSubs() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(REDIS_KEY);
    if (Array.isArray(data)) return data;
  }
  return [...memSubs];
}

async function saveSubs(list) {
  memSubs = list;
  if (isRedisEnabled()) {
    // No expiry — subscriptions live until the browser invalidates them.
    await redisSetJSON(REDIS_KEY, list, 365 * 24 * 3600);
  }
}

// Add a subscription. Deduplicates by endpoint URL.
async function addSubscription(sub) {
  if (!sub || !sub.endpoint) return false;
  const subs = await loadSubs();
  if (subs.some((s) => s.endpoint === sub.endpoint)) return false;
  subs.push({
    endpoint: sub.endpoint,
    keys: sub.keys,
    addedAt: Date.now(),
  });
  await saveSubs(subs);
  return true;
}

async function removeSubscription(endpoint) {
  if (!endpoint) return false;
  const subs = await loadSubs();
  const next = subs.filter((s) => s.endpoint !== endpoint);
  if (next.length === subs.length) return false;
  await saveSubs(next);
  return true;
}

async function subscriptionCount() {
  const subs = await loadSubs();
  return subs.length;
}

// Returns a privacy-trimmed list of subscribers for admin display.
// Each entry has: { host, browser, addedAt, endpointHash }. The full
// endpoint URL is hashed so we never expose user-identifying push tokens.
async function listSubscriptions() {
  const subs = await loadSubs();
  const crypto = require('crypto');
  return subs.map((s) => {
    let host = '';
    try { host = new URL(s.endpoint).host; } catch { /* noop */ }
    return {
      host,
      browser: hostToBrowser(host),
      addedAt: s.addedAt || null,
      endpointHash: crypto.createHash('sha1').update(s.endpoint).digest('hex').slice(0, 12),
    };
  });
}

function hostToBrowser(host) {
  if (!host) return 'Unknown';
  if (host.includes('fcm.googleapis.com') || host.includes('android.googleapis.com')) return 'Chrome / Android';
  if (host.includes('updates.push.services.mozilla.com')) return 'Firefox';
  if (host.includes('push.apple.com')) return 'Safari / iOS';
  if (host.includes('notify.windows.com') || host.includes('wns2-')) return 'Edge / Windows';
  return host;
}

// Send a payload to every subscribed browser. Removes subscriptions that
// the push service reports as gone (404 / 410).
async function sendNotificationToAll(payload) {
  if (!isPushEnabled()) {
    console.log('[push] sendNotificationToAll skipped — VAPID keys not set');
    return { sent: 0, removed: 0, failed: 0 };
  }
  const subs = await loadSubs();
  if (subs.length === 0) return { sent: 0, removed: 0, failed: 0 };

  // Record notification in history for subscribers to view
  await addToHistory(payload);

  const body = JSON.stringify(payload);
  const dead = [];
  let sent = 0;
  let failed = 0;

  // High urgency + short TTL tells FCM/APNs to deliver IMMEDIATELY,
  // bypassing Android Doze batching. Without this, Android can delay
  // pushes by several minutes (or hours when the screen is off).
  // Topic collapses older queued pushes with the same tag.
  const sendOptions = {
    TTL: 3600, // keep at most 1h if device is offline
    urgency: 'high',
    topic: (payload.tag || 'pahaditube').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32) || 'pahaditube',
  };

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, body, sendOptions);
        sent++;
      } catch (err) {
        // 404 / 410 → subscription is permanently gone, prune it.
        if (err.statusCode === 404 || err.statusCode === 410) {
          dead.push(sub.endpoint);
        } else {
          failed++;
          console.error('[push] send failed:', err.statusCode, err.body || err.message);
        }
      }
    })
  );

  if (dead.length) {
    const remaining = subs.filter((s) => !dead.includes(s.endpoint));
    await saveSubs(remaining);
  }

  console.log(`[push] sent=${sent} removed=${dead.length} failed=${failed} (of ${subs.length})`);
  return { sent, removed: dead.length, failed };
}

// --- Notification history (stores last N sent notifications) ---
const HISTORY_KEY = 'pahadi_push_history';
const MAX_HISTORY = 20;
let memHistory = [];

async function loadHistory() {
  if (isRedisEnabled()) {
    const data = await redisGetJSON(HISTORY_KEY);
    if (Array.isArray(data)) return data;
  }
  return [...memHistory];
}

async function saveHistory(list) {
  memHistory = list;
  if (isRedisEnabled()) {
    await redisSetJSON(HISTORY_KEY, list, 30 * 24 * 3600); // 30 days
  }
}

async function addToHistory(payload) {
  const history = await loadHistory();
  history.unshift({
    id: Date.now(),
    title: payload.title || '',
    body: payload.body || '',
    url: payload.url || '/',
    sentAt: new Date().toISOString(),
  });
  // Keep only last N
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  await saveHistory(history);
}

async function getNotificationHistory() {
  return await loadHistory();
}

// --- Per-user "cleared" tracking ---
// Each user can clear their notification list independently. We persist a
// timestamp (`clearedAt`) per user in Redis and filter the global history
// against it when returning notifications for that user.
const CLEARED_PREFIX = 'pahadi_push_cleared:';
const memCleared = new Map(); // userKey -> clearedAt (fallback when Redis is off)

function clearedKeyFor(userKey) {
  return CLEARED_PREFIX + String(userKey);
}

async function getUserClearedAt(userKey) {
  if (!userKey) return 0;
  if (isRedisEnabled()) {
    const data = await redisGetJSON(clearedKeyFor(userKey));
    if (data && typeof data.clearedAt === 'number') return data.clearedAt;
    return 0;
  }
  return memCleared.get(userKey) || 0;
}

async function setUserClearedAt(userKey, clearedAt) {
  if (!userKey) return;
  memCleared.set(userKey, clearedAt);
  if (isRedisEnabled()) {
    // Keep for 90 days; refreshed every time the user clears.
    await redisSetJSON(clearedKeyFor(userKey), { clearedAt }, 90 * 24 * 3600);
  }
}

async function clearUserNotifications(userKey) {
  const now = Date.now();
  await setUserClearedAt(userKey, now);
  return now;
}

async function getNotificationHistoryForUser(userKey) {
  const history = await loadHistory();
  if (!userKey) return history;
  const clearedAt = await getUserClearedAt(userKey);
  if (!clearedAt) return history;
  return history.filter((n) => Number(n.id) > clearedAt);
}

module.exports = {
  isPushEnabled,
  getVapidPublicKey: () => VAPID_PUBLIC_KEY,
  addSubscription,
  removeSubscription,
  subscriptionCount,
  listSubscriptions,
  sendNotificationToAll,
  addToHistory,
  getNotificationHistory,
  getNotificationHistoryForUser,
  clearUserNotifications,
};
