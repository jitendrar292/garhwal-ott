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
  sendNotificationToAll,
} = require('../services/push');

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

router.get('/count', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const count = await subscriptionCount();
  res.json({ count, enabled: isPushEnabled() });
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
