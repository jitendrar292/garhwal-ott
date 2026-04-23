// Persistent counter via Upstash Redis REST API.
// Falls back to in-memory when Upstash isn't configured.
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Render env vars.
// Set VISIT_SEED to preserve a previous count after switching strategies.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VISIT_SEED = parseInt(process.env.VISIT_SEED || '0', 10);
const UPSTASH_ENABLED = !!(UPSTASH_URL && UPSTASH_TOKEN);
const REDIS_KEY = 'pahadi_visits';
const OPENS_KEY = 'pahadi_opens';
const VISITORS_KEY = 'pahadi_visitors';
const SEEN_IPS_KEY = 'pahadi_seen_ips';
const MAX_VISITORS = 500; // keep last 500 visitor records

let memVisits = VISIT_SEED;
let memOpens = 0;
let memFeedback = [];
let memVisitors = [];
let memSeenIps = new Set();

// Returns true if this IP has never been seen before
async function isNewIp(ip) {
  if (UPSTASH_ENABLED) {
    try {
      const added = await redisCmd('SADD', SEEN_IPS_KEY, ip);
      return parseInt(added, 10) === 1;
    } catch (err) {
      console.error('Upstash isNewIp error:', err.message);
    }
  }
  if (memSeenIps.has(ip)) return false;
  memSeenIps.add(ip);
  return true;
}

async function redisCmd(...args) {
  const path = args.map((a) => encodeURIComponent(String(a))).join('/');
  const res = await fetch(`${UPSTASH_URL}/${path}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Upstash error ${res.status}`);
  const json = await res.json();
  return json.result;
}

// POST-based SET for large values (feedback JSON can exceed URL length limits)
async function redisCmdPost(cmd, key, value) {
  const res = await fetch(`${UPSTASH_URL}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([cmd, key, value]),
  });
  if (!res.ok) throw new Error(`Upstash POST error ${res.status}`);
  const json = await res.json();
  return json.result;
}

// Generic JSON cache helpers (Redis-backed when Upstash is configured).
// Use these to persist cache entries across server restarts / cold starts.
async function redisGetJSON(key) {
  if (!UPSTASH_ENABLED) return null;
  try {
    const raw = await redisCmd('GET', key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('[store] redisGetJSON error:', err.message);
    return null;
  }
}

// SETEX = SET key seconds value (atomic write + TTL).
// Uses POST body because cached payloads can be large (>2KB URL limit).
async function redisSetJSON(key, value, ttlSeconds) {
  if (!UPSTASH_ENABLED) return false;
  try {
    const body = JSON.stringify(value);
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SETEX', key, String(ttlSeconds), body]),
    });
    if (!res.ok) throw new Error(`Upstash SETEX error ${res.status}`);
    return true;
  } catch (err) {
    console.error('[store] redisSetJSON error:', err.message);
    return false;
  }
}

function isRedisEnabled() {
  return UPSTASH_ENABLED;
}

// =====================================================================
// Redis Set operations (for tracking signups, etc.)
// =====================================================================

// Add member to a set, returns 1 if new, 0 if already exists
async function redisSetAdd(key, member) {
  if (!UPSTASH_ENABLED) return 0;
  try {
    return await redisCmd('SADD', key, member);
  } catch (err) {
    console.error('[store] redisSetAdd error:', err.message);
    return 0;
  }
}

// Get all members of a set
async function redisSetMembers(key) {
  if (!UPSTASH_ENABLED) return [];
  try {
    return await redisCmd('SMEMBERS', key) || [];
  } catch (err) {
    console.error('[store] redisSetMembers error:', err.message);
    return [];
  }
}

// Get count of members in a set
async function redisSetCount(key) {
  if (!UPSTASH_ENABLED) return 0;
  try {
    const count = await redisCmd('SCARD', key);
    return parseInt(count || '0', 10);
  } catch (err) {
    console.error('[store] redisSetCount error:', err.message);
    return 0;
  }
}

// =====================================================================
// Redis Hash operations (for storing users in pahadi_users table)
// =====================================================================

// Get a field from a hash
async function redisHashGet(key, field) {
  if (!UPSTASH_ENABLED) return null;
  try {
    const raw = await redisCmd('HGET', key, field);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error('[store] redisHashGet error:', err.message);
    return null;
  }
}

// Set a field in a hash (uses POST for large values)
async function redisHashSet(key, field, value) {
  if (!UPSTASH_ENABLED) return false;
  try {
    const body = JSON.stringify(value);
    const res = await fetch(UPSTASH_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['HSET', key, field, body]),
    });
    if (!res.ok) throw new Error(`Upstash HSET error ${res.status}`);
    return true;
  } catch (err) {
    console.error('[store] redisHashSet error:', err.message);
    return false;
  }
}

// Get all fields and values from a hash
async function redisHashGetAll(key) {
  if (!UPSTASH_ENABLED) return {};
  try {
    const result = await redisCmd('HGETALL', key);
    if (!result || !Array.isArray(result)) return {};
    // HGETALL returns [field1, value1, field2, value2, ...]
    const obj = {};
    for (let i = 0; i < result.length; i += 2) {
      const field = result[i];
      const value = result[i + 1];
      try {
        obj[field] = JSON.parse(value);
      } catch {
        obj[field] = value;
      }
    }
    return obj;
  } catch (err) {
    console.error('[store] redisHashGetAll error:', err.message);
    return {};
  }
}

// Get count of fields in a hash
async function redisHashLen(key) {
  if (!UPSTASH_ENABLED) return 0;
  try {
    const count = await redisCmd('HLEN', key);
    return parseInt(count || '0', 10);
  } catch (err) {
    console.error('[store] redisHashLen error:', err.message);
    return 0;
  }
}

async function getVisits() {
  if (UPSTASH_ENABLED) {
    try {
      const val = await redisCmd('GET', REDIS_KEY);
      return parseInt(val || '0', 10);
    } catch (err) {
      console.error('Upstash getVisits error:', err.message);
    }
  }
  return memVisits;
}

async function incrementVisits() {
  if (UPSTASH_ENABLED) {
    try {
      const val = await redisCmd('INCR', REDIS_KEY);
      return parseInt(val, 10);
    } catch (err) {
      console.error('Upstash incrementVisits error:', err.message);
    }
  }
  memVisits++;
  return memVisits;
}

// Total page opens — increments on every visit (not deduplicated by IP).
async function getOpens() {
  if (UPSTASH_ENABLED) {
    try {
      const val = await redisCmd('GET', OPENS_KEY);
      return parseInt(val || '0', 10);
    } catch (err) {
      console.error('Upstash getOpens error:', err.message);
    }
  }
  return memOpens;
}

async function incrementOpens() {
  if (UPSTASH_ENABLED) {
    try {
      const val = await redisCmd('INCR', OPENS_KEY);
      return parseInt(val, 10);
    } catch (err) {
      console.error('Upstash incrementOpens error:', err.message);
    }
  }
  memOpens++;
  return memOpens;
}

async function logVisitor(ip, userAgent = '') {
  // Fetch geo from ip-api.com (free, no key needed, 45 req/min)
  let geo = { country: 'Unknown', regionName: 'Unknown', city: 'Unknown', isp: '' };
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,isp,status`, { signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const d = await r.json();
      if (d.status === 'success') geo = d;
    }
  } catch { /* geo lookup is best-effort */ }

  const device = parseDevice(userAgent);

  const entry = {
    ip,
    country: geo.country,
    region: geo.regionName,
    city: geo.city,
    isp: geo.isp,
    device: device.type,         // 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown'
    os: device.os,               // 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'unknown'
    browser: device.browser,     // 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Samsung Internet' | 'unknown'
    pwa: device.pwa,             // boolean — true if launched as PWA (best-effort)
    userAgent: userAgent ? userAgent.slice(0, 300) : '',
    visitedAt: new Date().toISOString(),
  };

  if (UPSTASH_ENABLED) {
    try {
      // LPUSH + LTRIM keeps a capped list of last MAX_VISITORS entries
      await redisCmdPost('LPUSH', VISITORS_KEY, JSON.stringify(entry));
      await redisCmd('LTRIM', VISITORS_KEY, 0, MAX_VISITORS - 1);
      return;
    } catch (err) {
      console.error('Upstash logVisitor error:', err.message);
    }
  }
  memVisitors.unshift(entry);
  if (memVisitors.length > MAX_VISITORS) memVisitors.length = MAX_VISITORS;
}

// Lightweight User-Agent parser. No external dependency — covers the
// browsers/OS combos that actually visit the site.
function parseDevice(ua) {
  const out = { type: 'unknown', os: 'unknown', browser: 'unknown', pwa: false };
  if (!ua || typeof ua !== 'string') return out;
  const s = ua;

  // Bots first (some pretend to be mobile)
  if (/bot|crawler|spider|crawling|facebookexternalhit|preview|HeadlessChrome/i.test(s)) {
    out.type = 'bot';
  }

  // OS
  if (/iPhone|iPad|iPod/.test(s)) out.os = 'iOS';
  else if (/Android/.test(s)) out.os = 'Android';
  else if (/Windows NT/.test(s)) out.os = 'Windows';
  else if (/Mac OS X|Macintosh/.test(s)) out.os = 'macOS';
  else if (/Linux/.test(s)) out.os = 'Linux';
  else if (/CrOS/.test(s)) out.os = 'ChromeOS';

  // Browser (order matters — Edge/Samsung pretend to be Chrome)
  if (/Edg\//.test(s)) out.browser = 'Edge';
  else if (/SamsungBrowser/.test(s)) out.browser = 'Samsung Internet';
  else if (/OPR\/|Opera/.test(s)) out.browser = 'Opera';
  else if (/Firefox/.test(s)) out.browser = 'Firefox';
  else if (/Chrome\//.test(s)) out.browser = 'Chrome';
  else if (/Safari/.test(s)) out.browser = 'Safari';

  // Device type
  if (out.type !== 'bot') {
    if (/iPad|Tablet/i.test(s) || (/Android/.test(s) && !/Mobile/.test(s))) out.type = 'tablet';
    else if (/Mobi|Android.+Mobile|iPhone|iPod|Mobile Safari/i.test(s)) out.type = 'mobile';
    else out.type = 'desktop';
  }

  // PWA hint — Chrome/Android sometimes appends "; wv" (WebView) or
  // standalone-launched WebKit may strip "Safari" from UA.
  out.pwa = /; wv\)/.test(s) || (/iPhone|iPad/.test(s) && !/Safari/.test(s));

  return out;
}

async function getVisitors() {
  if (UPSTASH_ENABLED) {
    try {
      const raw = await redisCmd('LRANGE', VISITORS_KEY, 0, MAX_VISITORS - 1);
      return (raw || []).map((r) => JSON.parse(r));
    } catch (err) {
      console.error('Upstash getVisitors error:', err.message);
    }
  }
  return [...memVisitors];
}

const FEEDBACK_KEY = 'pahadi_feedback';

async function getFeedback() {
  if (UPSTASH_ENABLED) {
    try {
      const raw = await redisCmd('GET', FEEDBACK_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Upstash getFeedback error:', err.message);
    }
  }
  return [...memFeedback];
}

async function addFeedback(entry) {
  const newEntry = {
    id: Date.now(),
    name: entry.name,
    email: entry.email || '',
    message: entry.message,
    createdAt: new Date().toISOString(),
  };
  if (UPSTASH_ENABLED) {
    try {
      const existing = await getFeedback();
      existing.push(newEntry);
      await redisCmdPost('SET', FEEDBACK_KEY, JSON.stringify(existing));
      return existing;
    } catch (err) {
      console.error('Upstash addFeedback error:', err.message);
    }
  }
  memFeedback.push(newEntry);
  return [...memFeedback];
}

async function deleteFeedback(id) {
  if (UPSTASH_ENABLED) {
    try {
      const existing = await getFeedback();
      const filtered = existing.filter((f) => f.id !== id);
      await redisCmdPost('SET', FEEDBACK_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (err) {
      console.error('Upstash deleteFeedback error:', err.message);
    }
  }
  memFeedback = memFeedback.filter((f) => f.id !== id);
  return [...memFeedback];
}

// ===== Chat history (long-term conversation memory) =====
// Stores anonymized Q→A pairs in a capped Redis list so the AI can recall
// past exchanges and learn from them across sessions/restarts.
const CHAT_HISTORY_KEY = 'pahadi_chat_history';
const MAX_CHAT_HISTORY = 500;
let memChatHistory = [];

async function logChatExchange(userMsg, assistantMsg) {
  if (!userMsg || !assistantMsg) return;
  const entry = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    q: String(userMsg).slice(0, 1000),
    a: String(assistantMsg).slice(0, 2000),
    at: new Date().toISOString(),
  };
  if (UPSTASH_ENABLED) {
    try {
      await redisCmdPost('LPUSH', CHAT_HISTORY_KEY, JSON.stringify(entry));
      await redisCmd('LTRIM', CHAT_HISTORY_KEY, 0, MAX_CHAT_HISTORY - 1);
      return;
    } catch (err) {
      console.error('[store] logChatExchange error:', err.message);
    }
  }
  memChatHistory.unshift(entry);
  if (memChatHistory.length > MAX_CHAT_HISTORY) memChatHistory.length = MAX_CHAT_HISTORY;
}

async function getChatHistory(limit = MAX_CHAT_HISTORY) {
  if (UPSTASH_ENABLED) {
    try {
      const raw = await redisCmd('LRANGE', CHAT_HISTORY_KEY, 0, Math.max(0, limit - 1));
      return (raw || []).map((r) => {
        try { return JSON.parse(r); } catch { return null; }
      }).filter(Boolean);
    } catch (err) {
      console.error('[store] getChatHistory error:', err.message);
    }
  }
  return memChatHistory.slice(0, limit);
}

// ===== Favorites (per-device, anonymous) =====
// Stored in Redis as one JSON array per deviceId. No auth — clients generate
// a UUID locally and send it as ?deviceId=. Cap entries to keep memory bounded.
const FAVORITES_KEY_PREFIX = 'pahadi_favs:';
const MAX_FAVORITES_PER_DEVICE = 200;
const memFavorites = new Map(); // deviceId -> array

function favKey(deviceId) {
  return `${FAVORITES_KEY_PREFIX}${deviceId}`;
}

// Strip down to the essential video fields so the Redis blob stays small.
function sanitizeFavorite(v) {
  if (!v || typeof v !== 'object' || !v.id) return null;
  return {
    id:           String(v.id).slice(0, 50),
    title:        String(v.title || '').slice(0, 300),
    thumbnail:    String(v.thumbnail || '').slice(0, 500),
    channelTitle: String(v.channelTitle || '').slice(0, 200),
    publishedAt:  String(v.publishedAt || '').slice(0, 40),
  };
}

async function getFavorites(deviceId) {
  if (!deviceId) return [];
  if (UPSTASH_ENABLED) {
    try {
      const raw = await redisCmd('GET', favKey(deviceId));
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('[store] getFavorites error:', err.message);
    }
  }
  return memFavorites.get(deviceId) ? [...memFavorites.get(deviceId)] : [];
}

async function saveFavorites(deviceId, list) {
  if (!deviceId) return [];
  // Sanitize + dedupe by id (last write wins) + cap
  const seen = new Set();
  const cleaned = [];
  for (const v of (Array.isArray(list) ? list : [])) {
    const s = sanitizeFavorite(v);
    if (!s || seen.has(s.id)) continue;
    seen.add(s.id);
    cleaned.push(s);
    if (cleaned.length >= MAX_FAVORITES_PER_DEVICE) break;
  }
  if (UPSTASH_ENABLED) {
    try {
      await redisCmdPost('SET', favKey(deviceId), JSON.stringify(cleaned));
      return cleaned;
    } catch (err) {
      console.error('[store] saveFavorites error:', err.message);
    }
  }
  memFavorites.set(deviceId, cleaned);
  return cleaned;
}

async function addFavorite(deviceId, video) {
  const sanitized = sanitizeFavorite(video);
  if (!sanitized) return await getFavorites(deviceId);
  const existing = await getFavorites(deviceId);
  if (existing.some((v) => v.id === sanitized.id)) return existing;
  const updated = [sanitized, ...existing].slice(0, MAX_FAVORITES_PER_DEVICE);
  return await saveFavorites(deviceId, updated);
}

async function removeFavorite(deviceId, videoId) {
  const existing = await getFavorites(deviceId);
  const updated = existing.filter((v) => v.id !== videoId);
  if (updated.length === existing.length) return existing;
  return await saveFavorites(deviceId, updated);
}

// On startup: deduplicate existing visitor list and seed pahadi_seen_ips set.
// Safe to run multiple times — SADD is idempotent.
async function seedAndDeduplicateVisitors() {
  if (!UPSTASH_ENABLED) return;
  try {
    const raw = await redisCmd('LRANGE', VISITORS_KEY, 0, MAX_VISITORS - 1);
    const all = (raw || []).map((r) => JSON.parse(r));

    // List is newest-first (LPUSH order); keep first (most recent) per IP
    const seenIps = new Set();
    const deduped = [];
    for (const entry of all) {
      if (!seenIps.has(entry.ip)) {
        seenIps.add(entry.ip);
        deduped.push(entry);
      }
    }

    // Rewrite list only if duplicates were found
    if (deduped.length < all.length) {
      await redisCmd('DEL', VISITORS_KEY);
      // Push oldest-first so newest ends up at index 0 (LPUSH semantics)
      for (let i = deduped.length - 1; i >= 0; i--) {
        await redisCmdPost('LPUSH', VISITORS_KEY, JSON.stringify(deduped[i]));
      }
      console.log(`[store] removed ${all.length - deduped.length} duplicate visitor record(s)`);
    }

    // Seed pahadi_seen_ips with every IP already in the list
    for (const ip of seenIps) {
      await redisCmd('SADD', SEEN_IPS_KEY, ip);
    }
    if (seenIps.size > 0) {
      console.log(`[store] seeded ${seenIps.size} unique IP(s) into seen-set`);
    }
  } catch (err) {
    console.error('[store] seedAndDeduplicateVisitors error:', err.message);
  }
}

module.exports = { getVisits, incrementVisits, getOpens, incrementOpens, isNewIp, logVisitor, getVisitors, seedAndDeduplicateVisitors, getFeedback, addFeedback, deleteFeedback, redisGetJSON, redisSetJSON, isRedisEnabled, redisSetAdd, redisSetMembers, redisSetCount, redisHashGet, redisHashSet, redisHashGetAll, redisHashLen, logChatExchange, getChatHistory, getFavorites, saveFavorites, addFavorite, removeFavorite };

