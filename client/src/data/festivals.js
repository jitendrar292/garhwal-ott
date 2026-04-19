// Curated upcoming festivals across Garhwal, Kumaon and Jaunsar-Bawar.
// Dates use ISO `YYYY-MM-DD` (local). Sankranti-based festivals are solar
// (dates stay stable year-to-year); lunar festivals (Diwali, Igas, Nanda
// Devi) are looked up per year — update as needed.
//
// Add new entries here; the UI will auto-pick the next N entries whose
// date is >= today (sorted ascending).

const FESTIVALS = [
  // ===== 2026 =====
  {
    id: 'harela-2026',
    name: 'Harela',
    nameLocal: 'हरेला',
    date: '2026-07-16',
    region: 'Kumaon · Garhwal',
    emoji: '🌱',
    bg: 'from-emerald-600 to-green-800',
    description:
      'Sawan sankranti — sowing of seven grains and worship of greenery. A symbol of harvest, prosperity and respect for nature.',
  },
  {
    id: 'olgia-2026',
    name: 'Ghee Sankranti (Olgia)',
    nameLocal: 'घी संक्रांति · ओल्गिया',
    date: '2026-08-17',
    region: 'Kumaon · Garhwal',
    emoji: '🧈',
    bg: 'from-amber-500 to-orange-700',
    description:
      'Bhado sankranti — first day of consuming pure ghee. Farmers and craftsmen gift their patrons (olgia).',
  },
  {
    id: 'nandadevi-2026',
    name: 'Nanda Devi Mela',
    nameLocal: 'नन्दा देवी मेला',
    date: '2026-09-01',
    region: 'Almora · Nainital · Garhwal',
    emoji: '🛕',
    bg: 'from-rose-600 to-red-800',
    description:
      'Centuries-old fair honouring goddess Nanda — the patron deity of Kumaon and Garhwal hills.',
  },
  {
    id: 'khatarua-2026',
    name: 'Khatarua',
    nameLocal: 'खतरुआ',
    date: '2026-09-17',
    region: 'Kumaon',
    emoji: '🔥',
    bg: 'from-orange-600 to-red-700',
    description:
      'Ashwin sankranti — bonfires lit in fields to mark the change of season and victory of the Kumaoni Chand king over Garhwal.',
  },
  {
    id: 'diwali-2026',
    name: 'Diwali',
    nameLocal: 'दीपावली',
    date: '2026-11-08',
    region: 'All Uttarakhand',
    emoji: '🪔',
    bg: 'from-yellow-500 to-amber-700',
    description:
      'Festival of lights — celebrated across all hills with diyas, rangoli and family feasts.',
  },
  {
    id: 'igas-2026',
    name: 'Igas Bagwal',
    nameLocal: 'इगास बग्वाल',
    date: '2026-11-19',
    region: 'Garhwal',
    emoji: '🎆',
    bg: 'from-purple-600 to-fuchsia-800',
    description:
      'Garhwal\'s "second Diwali" — celebrated 11 days after Diwali with bhailo (fire-rope swinging), folk dance and traditional food.',
  },

  // ===== 2027 =====
  {
    id: 'maroj-2027',
    name: 'Maroj',
    nameLocal: 'मरोज',
    date: '2027-01-13',
    region: 'Jaunsar-Bawar',
    emoji: '🥩',
    bg: 'from-red-700 to-rose-900',
    description:
      'Month-long winter feast of the Jaunsari community starting from Magh — meat dishes, folk songs and community gatherings.',
  },
  {
    id: 'uttarayani-2027',
    name: 'Uttarayani / Makar Sankranti',
    nameLocal: 'उत्तरायणी · मकर संक्रांति',
    date: '2027-01-14',
    region: 'All Uttarakhand',
    emoji: '☀️',
    bg: 'from-amber-400 to-orange-600',
    description:
      'Sun enters Capricorn — holy dip at Bagnath (Bageshwar), Uttarayani Mela, and tilkut sweets across the hills.',
  },
  {
    id: 'basant-2027',
    name: 'Basant Panchami',
    nameLocal: 'बसंत पंचमी',
    date: '2027-02-01',
    region: 'All Uttarakhand',
    emoji: '🌼',
    bg: 'from-yellow-400 to-yellow-600',
    description:
      'Arrival of spring — children start learning, and yellow mustard flowers bloom across the hills.',
  },
  {
    id: 'shivratri-2027',
    name: 'Maha Shivratri',
    nameLocal: 'महा शिवरात्रि',
    date: '2027-03-06',
    region: 'Kedarnath · Jageshwar · All',
    emoji: '🔱',
    bg: 'from-indigo-700 to-blue-900',
    description:
      'Night of Lord Shiva — deep significance at Kedarnath, Jageshwar and the dev-bhumi shrines.',
  },
  {
    id: 'phooldei-2027',
    name: 'Phool Dei',
    nameLocal: 'फूल देई',
    date: '2027-03-14',
    region: 'Garhwal · Kumaon',
    emoji: '🌸',
    bg: 'from-pink-500 to-rose-700',
    description:
      'Chaitra sankranti — children scatter spring flowers on doorsteps, blessing every home with prosperity.',
  },
  {
    id: 'bikhauti-2027',
    name: 'Bikhauti · Bissu',
    nameLocal: 'बिखौती · बिस्सू',
    date: '2027-04-14',
    region: 'Kumaon · Jaunsar',
    emoji: '🎉',
    bg: 'from-teal-500 to-emerald-700',
    description:
      'Baisakhi sankranti — Bikhauti fair at Dwarahat (Kumaon) and Bissu festival of Jaunsar with Tandi & Harul folk dance.',
  },
];

export default FESTIVALS;
