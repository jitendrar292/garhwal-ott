/**
 * Garhwali Muhavare (Proverbs & Sayings)
 * Traditional wisdom passed down through generations in Uttarakhand
 */
const GARHWALI_MUHAVARE = [
  {
    id: 1,
    garhwali: "घास खाणी पड़ी त भी शेर रैणू छ",
    hindi: "घास खानी पड़े तो भी शेर रहना है",
    english: "Even if one must eat grass, one should remain a lion — never compromise your dignity.",
    context: "Used to encourage maintaining self-respect even in the worst circumstances. Common in Kshatriya households.",
    category: "courage"
  },
  {
    id: 2,
    garhwali: "पाणी मा रैक मगरमच्छ से बैर नी राखणो",
    hindi: "पानी में रहकर मगरमच्छ से बैर नहीं रखना",
    english: "Don't make enemies with the crocodile while living in the water — know your environment.",
    context: "Advises pragmatic behavior. Often cited in village council (nyay panchayat) discussions.",
    category: "wisdom"
  },
  {
    id: 3,
    garhwali: "जैको काम वैको थाम",
    hindi: "जिसका काम उसी का थाम",
    english: "Every task belongs to the one skilled at it — let experts handle their craft.",
    context: "Used when someone interferes in another's domain. Reflects the traditional division of specialized labor in hill society.",
    category: "wisdom"
  },
  {
    id: 4,
    garhwali: "डाँडी को बादल कबी भरोसा नी",
    hindi: "पहाड़ की चोटी के बादल का कभी भरोसा नहीं",
    english: "Never trust the clouds at the mountain peak — weather and fortune change quickly in the hills.",
    context: "Practical wisdom from shepherds and farmers who depend on mountain weather patterns.",
    category: "nature"
  },
  {
    id: 5,
    garhwali: "घर की मुर्गी दाल बराबर",
    hindi: "घर की मुर्गी दाल बराबर",
    english: "A chicken at home is worth only as much as dal — we undervalue what is familiar.",
    context: "Pan-Indian proverb with special resonance in Garhwal where urban migration leads youth to undervalue hill culture.",
    category: "wisdom"
  },
  {
    id: 6,
    garhwali: "गाडू मा पाणी बगन्दो त एक दिन पत्थर भी घिसी जान्दो",
    hindi: "नदी में पानी बहता है तो एक दिन पत्थर भी घिस जाता है",
    english: "Flowing water wears down even stone — persistence conquers all obstacles.",
    context: "Spoken by elders to encourage patience. Drawn from observing Himalayan rivers carving gorges over millennia.",
    category: "perseverance"
  },
  {
    id: 7,
    garhwali: "जख धूप तख छाँव भी",
    hindi: "जहाँ धूप वहाँ छाँव भी",
    english: "Where there is sunshine, there is also shade — good and bad coexist.",
    context: "Consolation proverb used after misfortune. Reflects the philosophical acceptance typical of Pahadi culture.",
    category: "philosophy"
  },
  {
    id: 8,
    garhwali: "बिना मेहनत की रोटी भूत भी नी खान्दा",
    hindi: "बिना मेहनत की रोटी भूत भी नहीं खाता",
    english: "Even ghosts don't eat bread earned without hard work — nothing comes free.",
    context: "Motivational proverb taught to children. Combines the Pahadi work ethic with the supernatural folklore tradition.",
    category: "hardwork"
  },
  {
    id: 9,
    garhwali: "एक हाथ से ताली नी बजदी",
    hindi: "एक हाथ से ताली नहीं बजती",
    english: "One hand cannot clap — cooperation is essential for any achievement.",
    context: "Used in community conflicts to remind both parties share responsibility. Central to the 'baal' (collective labor) tradition.",
    category: "community"
  },
  {
    id: 10,
    garhwali: "खुब्यार बणौणी त आगी बी बुझाणी पड़दी",
    hindi: "खैरात बनानी हो तो आग भी बुझानी पड़ती है",
    english: "To create charity, one must first put out fires in one's own home — self-care before service.",
    context: "Practical wisdom warning against overextending oneself in helping others while neglecting family.",
    category: "wisdom"
  },
  {
    id: 11,
    garhwali: "बुढ़ी घोड़ी लाल लगाम",
    hindi: "बूढ़ी घोड़ी लाल लगाम",
    english: "A red bridle on an old horse — decorating what has lost its use; vanity in old age.",
    context: "Humorous proverb used to gently mock excessive self-decoration. Common in rural Garhwali humor.",
    category: "humor"
  },
  {
    id: 12,
    garhwali: "नाक कटाणी से भली नाक नी होणी",
    hindi: "नाक कटाने से अच्छी नाक नहीं होती",
    english: "Cutting one's nose to fix it doesn't help — drastic measures often make things worse.",
    context: "Warning against overreaction. Used when someone considers extreme action for a small problem.",
    category: "wisdom"
  },
  {
    id: 13,
    garhwali: "जो जंगल मा रन्दो वो शेर से नी डरन्दो",
    hindi: "जो जंगल में रहता है वो शेर से नहीं डरता",
    english: "One who lives in the forest doesn't fear the lion — familiarity breeds confidence.",
    context: "Said about seasoned mountain folk who face natural dangers daily. Celebrates Pahadi resilience.",
    category: "courage"
  },
  {
    id: 14,
    garhwali: "कांठा चढ़ण वालन तैं कांठा दिखन्दा",
    hindi: "पहाड़ चढ़ने वालों को ही पहाड़ दिखते हैं",
    english: "Only those who climb mountains can see mountains — ambition reveals the path.",
    context: "Inspirational proverb encouraging people to attempt difficult tasks to discover their potential.",
    category: "perseverance"
  },
  {
    id: 15,
    garhwali: "मन्दिर को घण्टा बजौणो ओर भगवान को मिलणो अलग बात छ",
    hindi: "मंदिर का घंटा बजाना और भगवान से मिलना अलग बात है",
    english: "Ringing the temple bell and meeting God are two different things — ritual alone isn't devotion.",
    context: "Philosophical proverb distinguishing between outward religious practice and genuine spiritual connection.",
    category: "philosophy"
  },
  {
    id: 16,
    garhwali: "दूध को जल्यो छाछ भी फूंक-फूंक पीन्दो",
    hindi: "दूध का जला छाछ भी फूंक-फूंक कर पीता है",
    english: "One burnt by hot milk blows on buttermilk too — past trauma makes us overcautious.",
    context: "Explains why people become overly careful after bad experiences. Common in village storytelling.",
    category: "wisdom"
  },
  {
    id: 17,
    garhwali: "भैंसी का आगे बीन बजाणो बेकार छ",
    hindi: "भैंस के आगे बीन बजाना बेकार है",
    english: "Playing the flute before a buffalo is pointless — don't waste effort on the unappreciative.",
    context: "Used humorously when advice falls on deaf ears. Reflects the pastoral lifestyle of Garhwali villages.",
    category: "humor"
  },
  {
    id: 18,
    garhwali: "जनी बाट जान्दी वनी बाट गाडू भी जान्दो",
    hindi: "जिस रास्ते जाते हो उसी रास्ते नदी भी जाती है",
    english: "The river follows the path of least resistance — nature and destiny flow naturally.",
    context: "Philosophical observation about accepting life's natural flow rather than fighting it.",
    category: "nature"
  },
  {
    id: 19,
    garhwali: "खाली हाथ आयो खाली हाथ जाणू",
    hindi: "खाली हाथ आए खाली हाथ जाना है",
    english: "We come empty-handed and leave empty-handed — material possessions are temporary.",
    context: "Philosophical proverb often recited at funerals and by elderly villagers reflecting on life's impermanence.",
    category: "philosophy"
  },
  {
    id: 20,
    garhwali: "जख मौत लेखी होन्दी तख दवाई नी काम करदी",
    hindi: "जहाँ मौत लिखी होती है वहाँ दवाई काम नहीं करती",
    english: "Where death is written, no medicine works — acceptance of fate beyond human control.",
    context: "Fatalistic saying reflecting the Hindu concept of 'prarabdha karma.' Used during bereavement.",
    category: "philosophy"
  },
  {
    id: 21,
    garhwali: "अपणो हाथ जगन्नाथ",
    hindi: "अपना हाथ जगन्नाथ",
    english: "Your own hand is your God — self-reliance is the truest form of power.",
    context: "Encourages self-dependence. Widely used in Garhwali households to teach children independence.",
    category: "hardwork"
  },
  {
    id: 22,
    garhwali: "बोली मा गुड़ होणो चैन्दो",
    hindi: "बोली में गुड़ होना चाहिए",
    english: "Speech should have jaggery in it — kind words sweeten all relationships.",
    context: "Teaches the importance of polite, sweet speech in Pahadi social interactions.",
    category: "community"
  },
  {
    id: 23,
    garhwali: "चोर की दाड़ी मा तिनका",
    hindi: "चोर की दाढ़ी में तिनका",
    english: "A straw in the thief's beard — the guilty always leave evidence of their wrongdoing.",
    context: "Used when someone's guilt becomes obvious through their own behavior or nervousness.",
    category: "wisdom"
  },
  {
    id: 24,
    garhwali: "आँख वाला अन्धों मा राजा",
    hindi: "अंधों में काना राजा",
    english: "Among the blind, the one-eyed is king — relative advantage matters more than absolute ability.",
    context: "Practical observation about competence being relative. Used in village leadership discussions.",
    category: "wisdom"
  },
  {
    id: 25,
    garhwali: "दूर का ढोल सुहावणा",
    hindi: "दूर के ढोल सुहावने",
    english: "Distant drums sound sweet — things look better from afar than up close.",
    context: "Common in migration context — young people who leave for cities often romanticize village life, and vice versa.",
    category: "philosophy"
  },
  {
    id: 26,
    garhwali: "जैकी लाठी वैकी भैंस",
    hindi: "जिसकी लाठी उसकी भैंस",
    english: "The buffalo belongs to whoever holds the stick — might often prevails over right.",
    context: "Critical proverb commenting on power dynamics in society. Used when the powerful take advantage of the weak.",
    category: "wisdom"
  },
  {
    id: 27,
    garhwali: "घाम मा सूखी पाणी बर्खा मा बगदो",
    hindi: "धूप में सूखा पानी बरसात में बहता है",
    english: "Water dried in sunshine flows again in rain — fortunes rise and fall in cycles.",
    context: "Consolation proverb comparing life's ups and downs to seasonal water cycles in the mountains.",
    category: "nature"
  },
  {
    id: 28,
    garhwali: "बारह गाँव को बाणियो, एक गाँव को ठाकुर",
    hindi: "बारह गाँव का बनिया, एक गाँव का ठाकुर",
    english: "A merchant serves twelve villages, a chief rules one — different roles have different reach.",
    context: "Observes social structure of traditional hill society where traders traveled widely but local authority was concentrated.",
    category: "community"
  },
  {
    id: 29,
    garhwali: "बरफ मा बी फूल उग्दा — बुरांस देखो",
    hindi: "बर्फ में भी फूल उगता है — बुरांस देखो",
    english: "Flowers bloom even in snow — look at the Rhododendron. Hope persists in adversity.",
    context: "Uniquely Garhwali proverb referencing the iconic buransh (rhododendron) that blooms red against white snowfields at 3000m altitude.",
    category: "perseverance"
  },
  {
    id: 30,
    garhwali: "पहाड़ पर बस्यो त पहाड़ जसो बणो",
    hindi: "पहाड़ पर बसे हो तो पहाड़ जैसे बनो",
    english: "If you live on the mountain, become like the mountain — strong, patient, and unshakeable.",
    context: "The quintessential Garhwali proverb celebrating Pahadi identity. Often used in cultural pride speeches and songs.",
    category: "courage"
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'सभी', english: 'All' },
  { id: 'wisdom', label: 'बुद्धि', english: 'Wisdom' },
  { id: 'courage', label: 'साहस', english: 'Courage' },
  { id: 'nature', label: 'प्रकृति', english: 'Nature' },
  { id: 'philosophy', label: 'दर्शन', english: 'Philosophy' },
  { id: 'perseverance', label: 'लगन', english: 'Perseverance' },
  { id: 'hardwork', label: 'मेहनत', english: 'Hard Work' },
  { id: 'community', label: 'समाज', english: 'Community' },
  { id: 'humor', label: 'हास्य', english: 'Humor' },
];

export default GARHWALI_MUHAVARE;
