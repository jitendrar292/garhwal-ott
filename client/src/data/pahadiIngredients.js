// Pahadi specialty ingredients — where to buy online + local shop notes
// `keywords` are matched against dish ingredient strings (case-insensitive)

const PAHADI_INGREDIENTS = [
  {
    id: 'gehat',
    name: 'गहत / कुलथी दाल',
    nameEn: 'Gehat / Horse Gram Dal',
    emoji: '🫘',
    desc: 'पहाड़ी दालों की रानी — गहत सूप, फाणू और चैंसू की आत्मा।',
    keywords: ['गहत', 'कुलथी', 'gehat', 'kulath'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=gehat+dal+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=gehat+kulath+dal' },
      { label: 'Himalayan Organic', url: 'https://www.amazon.in/s?k=organic+horse+gram+uttarakhand&tag=pahadistore29-21' },
    ],
    localNote: 'देहरादून पलटन बाज़ार, हरिद्वार बड़ा बाज़ार, ऋषिकेश में किसी भी पहाड़ी किराना दुकान पर मिलती है।',
  },
  {
    id: 'bhatt',
    name: 'भट्ट / काला सोयाबीन',
    nameEn: 'Bhatt / Black Soybean',
    emoji: '🖤',
    desc: 'उत्तराखंड का देसी सोयाबीन — भट्ट की चुड़कानी और दाल का स्वाद अनोखा।',
    keywords: ['भट्ट', 'bhatt', 'काला सोयाबीन'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=bhatt+ki+dal+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=bhatt+dal+pahadi' },
    ],
    localNote: 'पहाड़ी गाँवों के स्थानीय बाज़ार में मिलती है। देहरादून, पौड़ी, श्रीनगर गढ़वाल में आसानी से।',
  },
  {
    id: 'mandua',
    name: 'मंडुवा / कोदा आटा',
    nameEn: 'Mandua / Finger Millet Flour',
    emoji: '🌾',
    desc: 'पहाड़ का सुपरफूड — मंडुवे की रोटी और बाड़ी सर्दियों में गर्माहट देती है।',
    keywords: ['मंडुवे', 'मंडुवा', 'mandua', 'कोदा'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=mandua+flour+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=mandua+ragi+pahadi' },
      { label: 'Organic India', url: 'https://www.amazon.in/s?k=organic+finger+millet+flour&tag=pahadistore29-21' },
    ],
    localNote: 'उत्तराखंड के हर बाज़ार में मिलता है। ऑनलाइन "Ragi flour Uttarakhand" सर्च करें।',
  },
  {
    id: 'jakhiya',
    name: 'जखिया (Jakhiya)',
    nameEn: 'Jakhiya / Wild Mustard Seeds',
    emoji: '🌿',
    desc: 'गढ़वाल का तड़का मसाला — बिना जखिया के पहाड़ी साग अधूरा।',
    keywords: ['जखिया', 'jakhiya', 'जम्बू'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=jakhiya+spice+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=jakhiya' },
    ],
    localNote: 'देहरादून के पहाड़ी मसाला बाज़ार में, या उत्तराखंड के किसी भी स्थानीय बाज़ार में मिलता है।',
  },
  {
    id: 'jambu',
    name: 'जम्बू (Jambu)',
    nameEn: 'Jambu / Himalayan Herb',
    emoji: '🌱',
    desc: 'हिमालयी जड़ी — सूखे जम्बू का तड़का दाल-साग को खुशबूदार बनाता है।',
    keywords: ['जम्बू', 'jambu'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=jambu+herb+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=jambu+himalayan+herb' },
    ],
    localNote: 'उत्तराखंड के पहाड़ी बाज़ारों में सूखा जम्बू मिलता है। देहरादून, मसूरी, नैनीताल में।',
  },
  {
    id: 'gahat-masala',
    name: 'पहाड़ी गरम मसाला',
    nameEn: 'Pahadi Garam Masala',
    emoji: '🌶️',
    desc: 'उत्तराखंड की देसी मसाला मिश्रण — हर पहाड़ी रेसिपी का आधार।',
    keywords: ['पहाड़ी मसाला', 'गरम मसाला', 'pahadi masala'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=pahadi+garam+masala+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=pahadi+masala' },
    ],
    localNote: 'देहरादून पलटन बाज़ार, हरिद्वार में मिलते हैं — ताज़े पिसे मसाले।',
  },
  {
    id: 'sarso-tel',
    name: 'पहाड़ी सरसों तेल',
    nameEn: 'Pahadi Mustard Oil',
    emoji: '🫙',
    desc: 'कच्ची घानी सरसों तेल — पहाड़ी खाने का असली स्वाद इसी तेल से आता है।',
    keywords: ['सरसों का तेल', 'सरसों', 'mustard oil'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=pahadi+kachi+ghani+mustard+oil&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=kachi+ghani+mustard+oil' },
    ],
    localNote: 'किसी भी स्थानीय तेल मिल या किराना स्टोर पर मिलती है। "कच्ची घानी" लिखा देखें।',
  },
  {
    id: 'bhang-beej',
    name: 'भांग के बीज',
    nameEn: 'Hemp Seeds (Bhang Beej)',
    emoji: '🌿',
    desc: 'चटनी और रायते में डाले जाने वाले पहाड़ी भांग के बीज — पोषण से भरपूर।',
    keywords: ['भांग', 'bhang', 'hemp seeds'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=hemp+seeds+uttarakhand&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=bhang+seeds+pahadi' },
    ],
    localNote: 'उत्तराखंड में किसी भी पहाड़ी बाज़ार में "भांग के बीज" के नाम से मिलते हैं।',
  },
  {
    id: 'chainsoo-dal',
    name: 'उड़द / काला उड़द',
    nameEn: 'Black Urad Dal (for Chainsoo)',
    emoji: '🫘',
    desc: 'चैंसू बनाने के लिए साबुत काला उड़द — पहले भूनना पड़ता है।',
    keywords: ['उड़द', 'urad', 'चैंसू'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=black+urad+dal+whole&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=kala+urad+dal' },
    ],
    localNote: 'हर किराना दुकान पर मिलती है। "साबुत काला उड़द" माँगें।',
  },
  {
    id: 'til',
    name: 'तिल (Sesame)',
    nameEn: 'Sesame Seeds',
    emoji: '⚪',
    desc: 'पहाड़ी मिठाइयों और चटनी में पड़ने वाले सफेद/काले तिल।',
    keywords: ['तिल', 'til', 'sesame'],
    online: [
      { label: 'Amazon India', url: 'https://www.amazon.in/s?k=organic+sesame+seeds+white&tag=pahadistore29-21' },
      { label: 'Flipkart', url: 'https://www.flipkart.com/search?q=til+sesame+seeds' },
    ],
    localNote: 'किसी भी किराना दुकान पर मिलते हैं।',
  },
];

export default PAHADI_INGREDIENTS;

// Helper: find matching ingredients for a dish's ingredient list
export function getIngredientLinks(dishIngredients) {
  if (!dishIngredients?.length) return [];
  const combined = dishIngredients.join(' ').toLowerCase();
  return PAHADI_INGREDIENTS.filter((ing) =>
    ing.keywords.some((kw) => combined.includes(kw.toLowerCase()))
  );
}
