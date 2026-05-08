// Known Pahadi-ingredient-friendly markets & stores by city.
// `aliases` are used to match against the city/town name returned by
// Nominatim reverse geocoding (case-insensitive partial match).
// `mapsQuery` is opened in Google Maps search when user taps "Find on Map".

const PAHADI_STORES = [
  {
    city: 'Dehradun',
    cityHi: 'देहरादून',
    state: 'Uttarakhand',
    aliases: ['dehradun', 'dehra dun', 'doon'],
    lat: 30.3165, lng: 78.0322,
    patanjali: [
      { name: 'Patanjali Mega Store – Rajpur Road', mapsQuery: 'Patanjali Mega Store Rajpur Road Dehradun' },
      { name: 'Patanjali Arogya Kendra – Paltan Bazaar', mapsQuery: 'Patanjali Arogya Kendra Paltan Bazaar Dehradun' },
    ],
    markets: [
      {
        name: 'पलटन बाज़ार',
        nameEn: 'Paltan Bazaar',
        desc: 'पहाड़ी किराना, मसाले, गहत, भट्ट, मंडुवा — सब कुछ।',
        mapsQuery: 'Paltan Bazaar Dehradun pahadi kirana',
      },
      {
        name: 'झंडा बाज़ार',
        nameEn: 'Jhanda Bazaar',
        desc: 'देसी मसाले, जखिया, जम्बू, सरसों तेल की पुरानी दुकानें।',
        mapsQuery: 'Jhanda Bazaar Dehradun masala',
      },
      {
        name: 'आस्था मेगा स्टोर',
        nameEn: 'Aastha Mega Store',
        desc: 'ऑर्गेनिक उत्तराखंडी उत्पाद, पैकेज्ड पहाड़ी दालें।',
        mapsQuery: 'Aastha Mega Store Dehradun organic',
      },
    ],
  },
  {
    city: 'Haridwar',
    cityHi: 'हरिद्वार',
    state: 'Uttarakhand',
    aliases: ['haridwar', 'hardwar'],
    lat: 29.9457, lng: 78.1642,
    patanjali: [
      { name: 'Patanjali Headquarters Store', mapsQuery: 'Patanjali Yogpeeth store Haridwar' },
      { name: 'Divya Pharmacy – Haridwar', mapsQuery: 'Divya Pharmacy Patanjali Haridwar' },
    ],
    markets: [
      {
        name: 'बड़ा बाज़ार',
        nameEn: 'Bada Bazaar',
        desc: 'गहत, कुलथी, भट्ट — सीधे किसानों से आई दालें।',
        mapsQuery: 'Bada Bazaar Haridwar pahadi dal',
      },
      {
        name: 'पतंजलि मेगा स्टोर',
        nameEn: 'Patanjali Mega Store',
        desc: 'मंडुवा आटा, सरसों तेल, हर्बल मसाले — सस्ते और शुद्ध।',
        mapsQuery: 'Patanjali Mega Store Haridwar',
      },
    ],
  },
  {
    city: 'Rishikesh',
    cityHi: 'ऋषिकेश',
    state: 'Uttarakhand',
    aliases: ['rishikesh', 'hrishikesh'],
    lat: 30.0869, lng: 78.2676,
    patanjali: [
      { name: 'Patanjali Store – Rishikesh', mapsQuery: 'Patanjali store Rishikesh' },
    ],
    markets: [
      {
        name: 'त्रिवेणी घाट बाज़ार',
        nameEn: 'Triveni Ghat Market',
        desc: 'पहाड़ी मसाले, जखिया, जम्बू — मंदिर मार्ग की दुकानें।',
        mapsQuery: 'Triveni Ghat market Rishikesh masala',
      },
      {
        name: 'लक्ष्मण झूला मार्केट',
        nameEn: 'Laxman Jhula Market',
        desc: 'ऑर्गेनिक पहाड़ी उत्पाद, हर्बल चाय, भांग के बीज।',
        mapsQuery: 'Laxman Jhula market Rishikesh organic',
      },
    ],
  },
  {
    city: 'Nainital',
    cityHi: 'नैनीताल',
    state: 'Uttarakhand',
    aliases: ['nainital'],
    lat: 29.3919, lng: 79.4542,
    patanjali: [
      { name: 'Patanjali Store – Mallital', mapsQuery: 'Patanjali store Nainital' },
    ],
    markets: [
      {
        name: 'माल रोड बाज़ार',
        nameEn: 'Mall Road Market',
        desc: 'कुमाऊँनी मसाले, तिल, भट्ट, भांग की चटनी।',
        mapsQuery: 'Mall Road Nainital pahadi kirana',
      },
    ],
  },
  {
    city: 'Haldwani',
    cityHi: 'हल्द्वानी',
    state: 'Uttarakhand',
    aliases: ['haldwani', 'kathgodam'],
    lat: 29.2183, lng: 79.5130,
    patanjali: [
      { name: 'Patanjali Mega Store – Haldwani', mapsQuery: 'Patanjali Mega Store Haldwani' },
    ],
    markets: [
      {
        name: 'बनभूलपुरा बाज़ार',
        nameEn: 'Banbhulpura Bazaar',
        desc: 'कुमाऊँनी और गढ़वाली सामग्री — पहाड़ का किराना हब।',
        mapsQuery: 'Banbhulpura Bazaar Haldwani pahadi dal masala',
      },
    ],
  },
  {
    city: 'Pauri',
    cityHi: 'पौड़ी',
    state: 'Uttarakhand',
    aliases: ['pauri', 'pauri garhwal'],
    lat: 30.1503, lng: 78.7793,
    patanjali: [
      { name: 'Patanjali Chikitsalaya – Pauri', mapsQuery: 'Patanjali store Pauri Garhwal' },
    ],
    markets: [
      {
        name: 'पौड़ी मुख्य बाज़ार',
        nameEn: 'Pauri Main Market',
        desc: 'भट्ट, गहत, मंडुवा — गाँव से सीधे आया माल।',
        mapsQuery: 'main market Pauri Garhwal pahadi',
      },
    ],
  },
  {
    city: 'Srinagar (Garhwal)',
    cityHi: 'श्रीनगर गढ़वाल',
    state: 'Uttarakhand',
    aliases: ['srinagar garhwal', 'srinagar uttarakhand'],
    lat: 30.2204, lng: 78.7815,
    patanjali: [
      { name: 'Patanjali Store – Srinagar', mapsQuery: 'Patanjali store Srinagar Garhwal Uttarakhand' },
    ],
    markets: [
      {
        name: 'श्रीनगर मुख्य बाज़ार',
        nameEn: 'Srinagar Main Market',
        desc: 'स्थानीय उत्पाद, गहत, जखिया, पहाड़ी मसाले।',
        mapsQuery: 'main bazaar Srinagar Garhwal pahadi kirana',
      },
    ],
  },
  // Major metros — show online links prominently + nearest UK market
  {
    city: 'Delhi',
    cityHi: 'दिल्ली',
    state: 'Delhi',
    aliases: ['delhi', 'new delhi'],
    lat: 28.6139, lng: 77.2090,
    nearestUK: 'Dehradun',
    patanjali: [
      { name: 'Patanjali Mega Store – Connaught Place', mapsQuery: 'Patanjali Mega Store Connaught Place Delhi' },
      { name: 'Patanjali Store – Karol Bagh', mapsQuery: 'Patanjali store Karol Bagh Delhi' },
    ],
    markets: [
      {
        name: 'खान मार्केट / INA मार्केट',
        nameEn: 'INA Market, Delhi',
        desc: 'उत्तराखंडी सामग्री यहाँ मिलती है — गहत, मंडुवा, जखिया।',
        mapsQuery: 'INA market Delhi pahadi uttarakhand dal',
      },
      {
        name: 'दिल्ली हाट, INA',
        nameEn: 'Dilli Haat INA',
        desc: 'उत्तराखंड के स्टॉल्स — पहाड़ी उत्पाद, मसाले, अचार।',
        mapsQuery: 'Dilli Haat INA uttarakhand stall',
      },
    ],
  },
  {
    city: 'Mumbai',
    cityHi: 'मुंबई',
    state: 'Maharashtra',
    aliases: ['mumbai', 'bombay'],
    lat: 19.0760, lng: 72.8777,
    nearestUK: 'Dehradun',
    patanjali: [
      { name: 'Patanjali Store – Andheri', mapsQuery: 'Patanjali store Andheri Mumbai' },
      { name: 'Patanjali Store – Dadar', mapsQuery: 'Patanjali store Dadar Mumbai' },
    ],
    markets: [
      {
        name: 'क्रॉफर्ड मार्केट',
        nameEn: 'Crawford Market',
        desc: 'यहाँ उत्तराखंडी दालें और मसाले कभी-कभी मिलते हैं।',
        mapsQuery: 'Crawford Market Mumbai pahadi dal',
      },
    ],
  },
  {
    city: 'Bengaluru',
    cityHi: 'बेंगलुरु',
    state: 'Karnataka',
    aliases: ['bengaluru', 'bangalore'],
    lat: 12.9716, lng: 77.5946,
    nearestUK: 'Dehradun',
    patanjali: [
      { name: 'Patanjali Store – Jayanagar', mapsQuery: 'Patanjali store Jayanagar Bengaluru' },
      { name: 'Patanjali Store – Koramangala', mapsQuery: 'Patanjali store Koramangala Bengaluru' },
    ],
    markets: [
      {
        name: 'KR मार्केट',
        nameEn: 'KR Market',
        desc: 'यहाँ कुछ उत्तर भारतीय दुकानें पहाड़ी दालें रखती हैं।',
        mapsQuery: 'KR Market Bengaluru north indian pahadi dal',
      },
    ],
  },
];

export default PAHADI_STORES;

/**
 * Find the best matching store entry for a city/state string.
 * Returns the store entry or null.
 */
export function matchCity(city = '', state = '') {
  const haystack = `${city} ${state}`.toLowerCase();
  // Exact alias match first
  return (
    PAHADI_STORES.find((s) => s.aliases.some((a) => haystack.includes(a))) || null
  );
}

/**
 * Haversine distance in km between two lat/lng pairs.
 */
export function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Find the nearest store entry by coordinates (if city match fails).
 */
export function nearestStore(lat, lng) {
  return PAHADI_STORES.reduce((best, s) => {
    const d = distanceKm(lat, lng, s.lat, s.lng);
    return !best || d < best.dist ? { ...s, dist: d } : best;
  }, null);
}
