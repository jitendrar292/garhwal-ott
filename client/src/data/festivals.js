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
      'सौंण संक्रान्ति — सात अनाज बौंदा छां औ हरियाली कि पूजा करदा छां। यो फसल, सम्पन्नता औ धरती मैया कु आदर कु प्रतीक छ।',
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
      'भादौं संक्रान्ति — पैलु दिन घ्यू खाणा कु। किसान औ कारीगर अपणा मालिकु तैं ओल्गिया (भेंट) दिन्दा छन।',
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
      'सदियूं पुराणु मेला — माँ नन्दा देवी कु सम्मान म लग्द छ। नन्दा देवी कुमाऊँ औ गढ़वाळ का पहाड़ुं कि कुलदेवी छ।',
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
      'आश्विन संक्रान्ति — खेतुं म आग जळैक ऋतु बदळणा कु संदेश दिन्दा छां। यो दिन कुमाऊँ का चन्द राजा कि गढ़वाळ पर जीत कु भि पर्व छ।',
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
      'दीयों कु त्योहार — पूरा पहाड़ म दीया जळैक, रंगोली बणैक औ परिवार सँग पकवान खैक मनौंदा छां।',
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
      'गढ़वाळ कि "दूसरी दीवाली" — दीवाली का ग्यारह दिन बाद भैलो (आग कि रस्सी घुमौणु), लोक नृत्य औ पारम्परिक खाणा सँग मनौंदा छां।',
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
      'जौनसारी समाज कु म्हैना भर चलणु वाळु जाड़ा कु पर्व — माघ बटि शुरू होंद। मांस का पकवान, लोक गीत औ समाज कु मेळ जुळ।',
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
      'सुर्ज मकर राशि म औंद — बागनाथ (बागेश्वर) म पवित्र स्नान, उत्तरायणी मेला औ पूरा पहाड़ म तिळकुट कु प्रसाद बंट्द छ।',
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
      'बसन्त ऋतु कु आगमन — नौना-नौनी पढ़णु शुरू करदा छन औ पहाड़ुं म पीळी सरसुं का फूल खिलदा छन।',
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
      'भगवान शिव कि महा रात्रि — केदारनाथ, जागेश्वर औ देवभूमि का सब्बि शिव मन्दिरुं म बहुत महिमा कु दिन।',
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
      'चैत्र संक्रान्ति — नौना-नौनी हर घौर कि देहरी म बसन्त का फूल चढ़ौंदा छन औ हर परिवार तैं सम्पन्नता कु आशीर्वाद दिन्दा छन।',
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
      'बैसाखी संक्रान्ति — द्वाराहाट (कुमाऊँ) म बिखौती मेला औ जौनसार म तांदी-हारुल नृत्य सँग बिस्सू पर्व मनौंदा छां।',
  },
];

export default FESTIVALS;
