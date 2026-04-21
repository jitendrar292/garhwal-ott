// Garhwali grammar reference distilled from:
//   https://viewuttarakhand.blogspot.com/2017/06/gharwali-gramer.html
//
// Same shape as `garhwali-glossary.js` so it plugs straight into the
// existing INDEX in services/aiCache.js (just spread it in).
//
// Coverage: copula (am/is/are), pronouns (nom/oblique/possessive),
// case markers, numerals, and distinctive vocabulary called out as
// "literary meaning" examples on the source page.

module.exports = [
  // ===== Copula (verb "to be") — derived from Sanskrit root √ach =====
  // The page lists Khas-Kura / Garhwali / Kashmiri / Nepali side by side.
  // We keep only Garhwali masc/fem singular; plural is already in the
  // curated glossary as 'छन'.
  { gw: 'छौं', hi: 'मैं हूँ (पु./स्त्री.)', en: 'I am', tags: ['main hoon', 'i am', 'छौं', 'chhaun', 'copula'], note: 'Garhwali 1st-person singular of "to be" — used for both masculine and feminine speakers.' },
  { gw: 'छै / छन', hi: 'तुम हो / आप हैं', en: 'you are', tags: ['tum ho', 'aap hain', 'you are', 'छै', 'chhai', 'copula'], note: '2nd-person form of "to be"; also used as plural "are".' },
  { gw: 'छ / च', hi: 'है', en: 'is (masc.)', tags: ['hai', 'is', 'छ', 'च', 'chha', 'cha', 'copula'], note: '3rd-person singular masculine of "to be" — central marker of Garhwali grammar.' },
  { gw: 'छे', hi: 'है (स्त्री.)', en: 'is (fem.)', tags: ['hai feminine', 'छे', 'chhe', 'copula'], note: 'Feminine form of 3rd-person "is". Garhwali copula inflects for gender (unlike Hindi).' },

  // ===== Pronouns =====
  { gw: 'मी', hi: 'मैं', en: 'I (nominative)', tags: ['main', 'i', 'मी', 'mee', 'pronoun', 'nominative'], note: 'Nominative 1st-person singular. Oblique: म्ये; possessive: म्यर.' },
  { gw: 'म्ये', hi: 'मुझे / मेरा (oblique)', en: 'me / my (oblique)', tags: ['mujhe', 'mera', 'm\'ye', 'oblique'], note: 'Oblique form of मी. Possessive determiner: म्यर ("my").' },
  { gw: 'म्यर', hi: 'मेरा', en: 'my', tags: ['mera', 'my', 'm\'yar', 'possessive'], note: 'Possessive determiner — "my book" → म्यर किताब.' },
  { gw: 'तुम', hi: 'तुम / आप', en: 'you (sing./pl.)', tags: ['tum', 'aap', 'you', 'pronoun'], note: '2nd-person pronoun — same form for singular and plural in Garhwali. Oblique: त्वे/तुमते.' },
  { gw: 'त्वे', hi: 'तुझे', en: 'you (oblique)', tags: ['tujhe', 'tvay', 'oblique'], note: 'Oblique 2nd-person singular. Possessive: तुमुर / त्वे / तुमौ.' },
  { gw: 'तुमुर', hi: 'तुम्हारा / आपका', en: 'your', tags: ['tumhara', 'aapka', 'your', 'possessive'], note: 'Possessive 2nd-person — "your house" → तुमुर घौर.' },
  { gw: 'व / उ / इ / सि', hi: 'वह', en: 'he / she / it', tags: ['vah', 'wo', 'he', 'she', 'it', 'pronoun'], note: '3rd-person singular has multiple forms. Oblique: वीँ/वे/ए/से (same set serves reflexive and possessive).' },
  { gw: 'हम', hi: 'हम', en: 'we', tags: ['hum', 'we', 'pronoun', 'plural'], note: '1st-person plural. Oblique: हमते; possessive: हमर / हमौ.' },
  { gw: 'हमर', hi: 'हमारा', en: 'our', tags: ['hamara', 'our', 'possessive'], note: 'Possessive 1st-person plural.' },
  { gw: 'उ', hi: 'वे', en: 'they', tags: ['ve', 'they', 'pronoun', 'plural'], note: '3rd-person plural. Oblique: उँते; possessive: उँ / ऊँ.' },

  // ===== Case markers (postpositions) =====
  { gw: 'न / ल', hi: 'ने (कर्ता)', en: 'agentive case marker (ergative "ne")', tags: ['ne', 'agentive', 'ergative', 'case', 'न', 'ल'], note: 'Garhwali ergative postposition (Hindi "ने"). Spoken fluently as न्/ल्.' },
  { gw: 'थे / थेकी / सणि', hi: 'को (कर्म)', en: 'accusative case marker', tags: ['ko', 'accusative', 'object', 'case', 'थे', 'सणि'], note: 'Marks direct object. Spoken fluently as ते/ते/सन्.' },
  { gw: 'न / ल / चे', hi: 'से (instrumental)', en: 'instrumental case marker (with/by)', tags: ['se', 'instrumental', 'case', 'चे'], note: 'Marks the instrument or means — "by", "with".' },
  { gw: 'खुण / बाना', hi: 'के लिए', en: 'dative case marker (for, to)', tags: ['ke liye', 'for', 'dative', 'case', 'खुण', 'बाना', 'kuna'], note: 'Spoken fluently as कु / बान्. Used for purpose / beneficiary.' },
  { gw: 'चुले / बटि', hi: 'से (ablative)', en: 'ablative case marker (from)', tags: ['se', 'from', 'ablative', 'case', 'चुले', 'बटि'], note: 'Marks source / starting point — "from".' },
  { gw: 'ऑ / ई / ऊ / ऎ', hi: 'का / की / के', en: 'genitive case marker (of)', tags: ['ka', 'ki', 'ke', 'genitive', 'possessive', 'case'], note: 'Garhwali genitive vowels — replace Hindi का/की/के depending on gender & number.' },
  { gw: 'म / फुण्ड / फर', hi: 'में / पर', en: 'locative case marker (in, on)', tags: ['mein', 'par', 'in', 'on', 'locative', 'case', 'फर'], note: 'Spoken fluently as म्/पुन्/पर्.' },

  // ===== Numerals 0–9 (distinctive Garhwali forms) =====
  { gw: 'सुन्ने', hi: 'शून्य / 0', en: 'zero', tags: ['zero', '0', 'sunne', 'numeral'], note: 'Garhwali numeral 0 — IPA /sunnɨ/.' },
  { gw: 'यऽक', hi: 'एक / 1', en: 'one', tags: ['one', '1', 'yak', 'ek', 'numeral'], note: 'Garhwali numeral 1 — IPA /yʌk/. Note initial palatal glide.' },
  { gw: 'दुई', hi: 'दो / 2', en: 'two', tags: ['two', '2', 'dui', 'do', 'numeral'], note: 'Garhwali numeral 2.' },
  { gw: 'तीन', hi: 'तीन / 3', en: 'three', tags: ['three', '3', 'teen', 'tin', 'numeral'], note: 'Garhwali numeral 3.' },
  { gw: 'चार', hi: 'चार / 4', en: 'four', tags: ['four', '4', 'char', 'numeral'], note: 'Garhwali numeral 4.' },
  { gw: 'पाँच', hi: 'पाँच / 5', en: 'five', tags: ['five', '5', 'paanch', 'numeral'], note: 'Garhwali numeral 5 — also pronounced /pʌ̃/ in fast speech.' },
  { gw: 'छॉ', hi: 'छह / 6', en: 'six', tags: ['six', '6', 'chha', 'chhaw', 'numeral'], note: 'Garhwali numeral 6 — IPA /tʃʰɔ/.' },
  { gw: 'सात', hi: 'सात / 7', en: 'seven', tags: ['seven', '7', 'saat', 'numeral'], note: 'Garhwali numeral 7.' },
  { gw: 'आठ', hi: 'आठ / 8', en: 'eight', tags: ['eight', '8', 'aath', 'numeral'], note: 'Garhwali numeral 8.' },
  { gw: 'नउ', hi: 'नौ / 9', en: 'nine', tags: ['nine', '9', 'nau', 'numeral'], note: 'Garhwali numeral 9.' },

  // ===== Distinctive vocabulary cited as examples on the source page =====
  { gw: 'कळ्यो', hi: 'नाश्ता / कलेवा', en: 'breakfast', tags: ['breakfast', 'nashta', 'कलेवा', 'kalyo', 'food'], note: 'Garhwali for breakfast — IPA /kaɭyo/. Uses the retroflex lateral ळ unique to Garhwali.' },
  { gw: 'चिटु', hi: 'सफ़ेद', en: 'white (masc.)', tags: ['white', 'safed', 'चिटु', 'chitu', 'colour'], note: 'Masculine form. Feminine: चिटि.' },
  { gw: 'गरु', hi: 'भारी', en: 'heavy', tags: ['heavy', 'bhari', 'गरु', 'garu', 'adjective'] },
  { gw: 'टिपुण्', hi: 'चुगना / उठाना', en: 'to pick up', tags: ['pick', 'utha', 'tipun', 'टिपुण', 'verb'] },
  { gw: 'डाळु', hi: 'पेड़ / वृक्ष', en: 'tree', tags: ['tree', 'ped', 'vriksh', 'डाळु', 'dalu', 'nature'], note: 'Pronounced /ɖɔɭʊ/ in standard Garhwali, /ɖaɭʊ/ in some southern dialects.' },
  { gw: 'तिमुळ', hi: 'अंजीर', en: 'fig (Moraceae fruit)', tags: ['fig', 'anjeer', 'तिमुळ', 'timul', 'fruit'] },
  { gw: 'देस', hi: 'विदेश / परदेस', en: 'foreign land', tags: ['videsh', 'pardes', 'foreign', 'देस', 'des'], note: 'Native Garhwali "देस" /deç/ means FOREIGN — distinct from the Hindi loan देस /des/ meaning country.' },
  { gw: 'पुङ्गुड़ु', hi: 'खेत / कृषि-भूमि', en: 'farm / field', tags: ['field', 'farm', 'khet', 'पुङ्गुड़ु', 'pungudu', 'agriculture'] },
  { gw: 'बाच', hi: 'जीभ / आवाज़', en: 'tongue / voice', tags: ['tongue', 'voice', 'jeebh', 'awaaz', 'बाच', 'baach'], note: 'Literal: tongue. Phrasal/figurative meaning: voice.' },
  { gw: 'लाटु', hi: 'पागल / झल्ला', en: 'mad / fool', tags: ['mad', 'pagal', 'fool', 'लाटु', 'latu'], note: 'Tone-dependent: anger → "psycho/insane"; affection/pity → "innocent dear one".' },
  { gw: 'गढ़वाळ्', hi: 'गढ़वाल', en: 'Garhwal (one who holds forts)', tags: ['Garhwal', 'गढ़वाल', 'land', 'place'], note: 'Etymology: गढ़ (fort) + वाळ् (holder). Uses retroflex ळ्.' },
  { gw: 'यार', hi: 'यार / दोस्त', en: 'friend (vocative)', tags: ['friend', 'yaar', 'dost', 'यार', 'vocative'] },
  { gw: 'बिस्वास', hi: 'विश्वास / भरोसा', en: 'faith / trust', tags: ['faith', 'trust', 'vishwas', 'बिस्वास', 'biswas'] },
  { gw: 'मुसु', hi: 'चूहा / मूषक', en: 'mouse', tags: ['mouse', 'chuha', 'मुसु', 'musu', 'animal'] },
  { gw: 'पाणि', hi: 'पानी', en: 'water', tags: ['water', 'pani', 'paani', 'पाणि', 'pan'] },
  { gw: 'सोङ्ग / स्वाङ्ग', hi: 'सरल / आसान', en: 'easy', tags: ['easy', 'simple', 'saral', 'aasaan', 'song', 'svang', 'adjective'] },
  { gw: 'फञ्चु', hi: 'पोटली / गुच्छा', en: 'bundle / bunch', tags: ['bundle', 'bunch', 'potli', 'फञ्चु', 'fanchu'] },

  // ===== Aspirated-consonant example words =====
  { gw: 'खार्यु', hi: 'पर्याप्त / खासा', en: 'enough / sufficient', tags: ['enough', 'sufficient', 'paryapt', 'खार्यु', 'kharyu'] },
  { gw: 'घंघतौळ', hi: 'दुविधा / भ्रम', en: 'confusion', tags: ['confusion', 'duvidha', 'घंघतौळ', 'ghanghatol'] },
  { gw: 'छज्जा', hi: 'बालकनी / ओलती', en: 'balcony / gallery', tags: ['balcony', 'gallery', 'olti', 'छज्जा', 'chhajja'] },
  { gw: 'झसक्याण', hi: 'डर जाना', en: 'to be scared', tags: ['scared', 'fear', 'dar', 'झसक्याण', 'jhasakyan', 'verb'] },
  { gw: 'थुँथुरु', hi: 'ठोड़ी', en: 'chin', tags: ['chin', 'thodi', 'थुँथुरु', 'thunthuru', 'body'] },
  { gw: 'धागु', hi: 'धागा', en: 'thread / tag', tags: ['thread', 'dhaga', 'धागु', 'dhagu'] },
  { gw: 'ठुङ्गार', hi: 'नमकीन / स्नैक्स', en: 'snacks', tags: ['snacks', 'namkeen', 'ठुङ्गार', 'thungar', 'food'] },
  { gw: 'ढिकणु', hi: 'ओढ़ने की चादर', en: 'coverlet', tags: ['coverlet', 'chadar', 'ढिकणु', 'dhikanu'] },
  { gw: 'फुकाण', hi: 'नाश / विनाश', en: 'destruction', tags: ['destruction', 'nash', 'फुकाण', 'fukan'] },
  { gw: 'भौळ / भ्वळ', hi: 'कल (आने वाला)', en: 'tomorrow', tags: ['tomorrow', 'kal', 'भौळ', 'भ्वळ', 'bhol', 'time'] },

  // ===== Linguistic family note (no gw form — pure context entry) =====
  {
    gw: '—',
    hi: 'गढ़वाली का भाषा-परिवार',
    en: 'Garhwali language family',
    tags: ['indo-aryan', 'pahari', 'kumaoni', 'nepali', 'kashmiri', 'rajasthani', 'khasa', 'language family', 'history'],
    note: 'Garhwali is an Indo-Aryan / Central Pahari language closely related to Kumaoni and Nepali. Its grammar shares features with Rajasthani and Kashmiri, and many distinctive traits (vowel shortening, epenthesis, de-aspiration, gender-inflected copula) descend from the ancient Khas/Khasa language. Source: viewuttarakhand.blogspot.com (June 2017).',
  },
];
