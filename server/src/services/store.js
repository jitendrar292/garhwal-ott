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

module.exports = { getVisits, incrementVisits, isNewIp, logVisitor, getVisitors, getFeedback, addFeedback, deleteFeedback };

