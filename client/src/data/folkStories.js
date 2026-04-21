// Garhwali folk stories — sourced from himlingo.com/folk-stories.
// Mirrored client-side (≈55 KB raw, ~20 KB gzipped) so the reader page
// renders instantly without a server round-trip. To refresh the dataset,
// re-run `node scripts/scrape-himlingo-folkstories.js` in /server and copy
// the regenerated entries into this file.
//
// The data comes from the upstream scraper as `{ slug, title, body, url }`
// where `title` includes the trailing "/ गढ़वाली लोक-गाथा" suffix. We strip
// that suffix here and add a display emoji + short Hindi blurb so each card
// has a distinct identity in the row.

const STORIES = [
  {
    slug: 'jagdev-panwar',
    name: 'जगदेव पंवार',
    blurb: 'धारानगरी के दानवीर राजा जिन्होंने कैड़ी कंकाली को अपना शीश दान कर दिया।',
    emoji: '👑',
  },
  {
    slug: 'jeetu-bagdwal-part-1',
    name: 'जीतू बगडवाल — भाग 1',
    blurb: 'बासी गाँव का प्रसिद्ध बंसी-वादक जीतू और आँछरी देवियों की प्रेम-गाथा।',
    emoji: '🎶',
  },
  {
    slug: 'jeetu-bagdwal-part-2',
    name: 'जीतू बगडवाल — भाग 2',
    blurb: 'जीतू बगडवाल की कथा का दूसरा भाग — आँछरियों के साथ अंतिम मिलन।',
    emoji: '🌸',
  },
  {
    slug: 'kalu-bhandari',
    name: 'कालू भण्डारी',
    blurb: 'मालू मा का नौजवान कालू और गंगाड़ीहाट की राजकुमारी ध्यानमाला की प्रेम-गाथा।',
    emoji: '⚔️',
  },
  {
    slug: 'teelu-rauteli',
    name: 'तीलू रौतेली',
    blurb: 'गढ़वाल की झाँसी की रानी — सात युद्ध जीतने वाली वीरांगना तीलू रौतेली।',
    emoji: '🛡️',
  },
  {
    slug: 'ranu-rout',
    name: 'रणू रौत — भाग 1',
    blurb: 'चांदपुरगढ़ के वीर योद्धा रणू रौत की पहली गाथा।',
    emoji: '🏹',
  },
  {
    slug: 'ranu-rout-2',
    name: 'रणू रौत — भाग 2',
    blurb: 'रणू रौत के पराक्रम और बलिदान की कहानी का दूसरा भाग।',
    emoji: '🗡️',
  },
];

// Lazily load the heavy text bundle only when a reader actually opens a
// story. Keeps the homepage row weightless (just metadata).
let _bodiesPromise = null;
function loadBodies() {
  if (!_bodiesPromise) {
    _bodiesPromise = import('./folkStoryBodies.js').then((m) => m.default);
  }
  return _bodiesPromise;
}

export const folkStories = STORIES;

export function getFolkStory(slug) {
  return STORIES.find((s) => s.slug === slug) || null;
}

export async function getFolkStoryWithBody(slug) {
  const meta = getFolkStory(slug);
  if (!meta) return null;
  const bodies = await loadBodies();
  return { ...meta, ...(bodies[slug] || { body: '', url: '' }) };
}
