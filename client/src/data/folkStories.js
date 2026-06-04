// Garhwali folk stories — traditional oral narratives from Uttarakhand.
// These are original Garhwali-language folk tales (लोक-गाथा) passed down
// through generations in the Pahadi communities of Garhwal region.
// Each story preserves the authentic Garhwali dialect and poetic form.

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
  {
    slug: 'rajula-malushahi',
    name: 'राजुला मालूशाही',
    blurb: 'बैराठ के राजकुमार मालूशाही और रंग महल की राजुला की अमर प्रेम-गाथा।',
    emoji: '💕',
  },
  {
    slug: 'surja-kunwar',
    name: 'सूर्जा कुंवर',
    blurb: 'हुडकी बोल की वीर-गाथा — सूर्जा कुंवर का शौर्य और बलिदान।',
    emoji: '☀️',
  },
  {
    slug: 'gaadu-folk-tale',
    name: 'गाडू — वफादार कुत्ता',
    blurb: 'गढ़वाली लोक-कथा — एक वफादार कुत्ते और अपने मालिक की मार्मिक गाथा।',
    emoji: '🐕',
  },
  {
    slug: 'nanda-devi-raj-jaat',
    name: 'नन्दा देवी राज जात',
    blurb: 'नन्दा देवी की ससुराल यात्रा — हिमालय की सबसे बड़ी धार्मिक यात्रा की कथा।',
    emoji: '🏔️',
  },
  {
    slug: 'ajua-bafaul',
    name: 'अजुआ बफौल',
    blurb: 'गढ़वाल की एक मार्मिक बाल-विधवा की कथा — अन्याय के विरुद्ध आवाज।',
    emoji: '🕊️',
  },
  {
    slug: 'bhana-gangnath',
    name: 'भाना गंगनाथ',
    blurb: 'गढ़वाल के सिद्ध सन्यासी भाना गंगनाथ और रानी बेलापाटणी की प्रेम-गाथा।',
    emoji: '🔱',
  },
  {
    slug: 'madhomahesh-gaatha',
    name: 'मादो महेश गाथा',
    blurb: 'पंवार वंश के शासक मादो महेश और उनकी वीरता की गाथा।',
    emoji: '⚜️',
  },
  {
    slug: 'garhwali-bhoot-katha',
    name: 'गढ़वाली भूत कथाएँ',
    blurb: 'गढ़वाल की रहस्यमयी भूत-प्रेत कथाएँ — चुड़ैल, झ्यूंता और भैरो।',
    emoji: '👻',
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
  return { ...meta, ...(bodies[slug] || { body: '', summary: '' }) };
}
