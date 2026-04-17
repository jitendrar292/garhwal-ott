// Persistent counter via Upstash Redis REST API.
// Falls back to in-memory when Upstash isn't configured.
// Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in Render env vars.
// Set VISIT_SEED to preserve a previous count after switching strategies.

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const VISIT_SEED = parseInt(process.env.VISIT_SEED || '0', 10);
const UPSTASH_ENABLED = !!(UPSTASH_URL && UPSTASH_TOKEN);
const REDIS_KEY = 'pahadi_visits';

let memVisits = VISIT_SEED;
let memFeedback = [];

async function redisCmd(...args) {
  const path = args.map((a) => encodeURIComponent(String(a))).join('/');
  const res = await fetch(`${UPSTASH_URL}/${path}`, {
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Upstash error ${res.status}`);
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

function getFeedback() {
  return [...memFeedback];
}

function addFeedback(entry) {
  memFeedback.push({
    id: Date.now(),
    name: entry.name,
    email: entry.email || '',
    message: entry.message,
    createdAt: new Date().toISOString(),
  });
  return [...memFeedback];
}

function deleteFeedback(id) {
  memFeedback = memFeedback.filter((f) => f.id !== id);
  return [...memFeedback];
}

module.exports = { getVisits, incrementVisits, getFeedback, addFeedback, deleteFeedback };

