// IP-based geolocation endpoint.
// Returns { city, region, country, bucket } where `bucket` is one of:
//   garhwal | kumaon | delhi-ncr | other
// The bucket drives region-aware trending content on the homepage.

const express = require('express');
const router = express.Router();
const { resolveGeo, getClientIp } = require('../services/geoService');

router.get('/', async (req, res) => {
  const ip = getClientIp(req);
  const geo = await resolveGeo(ip);
  res.json(geo);
});

module.exports = router;
