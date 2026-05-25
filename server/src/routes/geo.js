// IP-based geolocation endpoint.
// Returns { city, region, country, bucket } where `bucket` is one of:
//   garhwal | kumaon | delhi-ncr | other
// The bucket drives region-aware trending content on the homepage.

const express = require('express');
const router = express.Router();
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');

const GEO_CACHE_TTL = 24 * 60 * 60; // 24h

// --- District → bucket mapping for Uttarakhand ---
const GARHWAL_CITIES = [
  'dehradun', 'haridwar', 'tehri', 'tehri garhwal', 'new tehri',
  'pauri', 'pauri garhwal', 'srinagar', 'rudraprayag',
  'chamoli', 'joshimath', 'uttarkashi', 'rishikesh',
  'mussoorie', 'kotdwar', 'lansdowne', 'roorkee',
];

const KUMAON_CITIES = [
  'nainital', 'almora', 'pithoragarh', 'bageshwar',
  'champawat', 'haldwani', 'rudrapur', 'kashipur',
  'ramnagar', 'bhimtal', 'mukteshwar', 'ranikhet',
  'udham singh nagar', 'us nagar',
];

const DELHI_NCR_CITIES = [
  'delhi', 'new delhi', 'noida', 'gurgaon', 'gurugram',
  'ghaziabad', 'faridabad', 'greater noida',
];

function classifyBucket(city, region) {
  const c = (city || '').toLowerCase().trim();
  const r = (region || '').toLowerCase().trim();

  // Check explicit city lists
  if (GARHWAL_CITIES.some((g) => c.includes(g))) return 'garhwal';
  if (KUMAON_CITIES.some((k) => c.includes(k))) return 'kumaon';
  if (DELHI_NCR_CITIES.some((d) => c.includes(d))) return 'delhi-ncr';

  // Fallback: check region name
  if (r.includes('uttarakhand') || r.includes('uttaranchal')) {
    // Unknown city in Uttarakhand — default to garhwal (larger population)
    return 'garhwal';
  }
  if (r.includes('delhi') || r.includes('haryana') || r.includes('uttar pradesh')) {
    return 'delhi-ncr';
  }

  return 'other';
}

router.get('/', async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

  // Try cache first
  if (isRedisEnabled()) {
    const cached = await redisGetJSON(`pahadi_geo:${ip}`);
    if (cached) return res.json(cached);
  }

  // Lookup from ip-api.com (free, no key, 45 req/min)
  let geo = { city: '', region: '', country: '', bucket: 'other' };
  try {
    const r = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,city,regionName,country`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (r.ok) {
      const d = await r.json();
      if (d.status === 'success') {
        geo.city = d.city || '';
        geo.region = d.regionName || '';
        geo.country = d.country || '';
        geo.bucket = classifyBucket(d.city, d.regionName);
      }
    }
  } catch { /* geo lookup is best-effort */ }

  // Cache in Redis for 24h
  if (isRedisEnabled()) {
    redisSetJSON(`pahadi_geo:${ip}`, geo, GEO_CACHE_TTL).catch(() => {});
  }

  res.json(geo);
});

module.exports = router;
