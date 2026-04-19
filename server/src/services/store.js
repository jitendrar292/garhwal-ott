// Persistent counter via Upstash Redis REST API.
// Falls back to in-memory when Upstash isn't configured.
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Render env vars.
// Set VISIT_SEED to preserve a previous count after switching strategies.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VISIT_SEED = parseInt(process.env.VISIT_SEED || '0', 10);
const UPSTASH_ENABLED = !!(UPSTASH_URL && UPSTASH_TOKEN);
const REDIS_KEY = 'pahadi_visits';
const VISITORS_KEY = 'pahadi_visitors';
const SEEN_IPS_KEY = 'pahadi_seen_ips';
const MAX_VISITORS = 500; // keep last 500 visitor records

let memVisits = VISIT_SEED;
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

async function logVisitor(ip) {
  // Fetch geo from ip-api.com (free, no key needed, 45 req/min)
  let geo = { country: 'Unknown', regionName: 'Unknown', city: 'Unknown', isp: '' };
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}?fields=country,regionName,city,isp,status`, { signal: AbortSignal.timeout(4000) });
    if (r.ok) {
      const d = await r.json();
      if (d.status === 'success') geo = d;
    }
  } catch { /* geo lookup is best-effort */ }

  const entry = {
    ip,
    country: geo.country,
    region: geo.regionName,
    city: geo.city,
    isp: geo.isp,
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

module.exports = { getVisits, incrementVisits, isNewIp, logVisitor, getVisitors, seedAndDeduplicateVisitors, getFeedback, addFeedback, deleteFeedback, redisGetJSON, redisSetJSON, isRedisEnabled };

