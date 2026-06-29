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

  // ===== 2027 (continued) =====
  {
    id: 'harela-2027',
    name: 'Harela',
    nameLocal: 'हरेला',
    date: '2027-07-17',
    region: 'Kumaon · Garhwal',
    emoji: '🌱',
    bg: 'from-emerald-600 to-green-800',
    description:
      'सौंण संक्रान्ति — नौ दिन पहले बोए सात अनाज अब उगकर तैयार छन। परिवार का बड़े बच्चुं के सिर पर हरेला रखके आशीर्वाद दिन्दा छन।',
  },
  {
    id: 'ghee-sankranti-2027',
    name: 'Ghee Sankranti (Olgia)',
    nameLocal: 'घी संक्रांति · ओल्गिया',
    date: '2027-08-17',
    region: 'Kumaon · Garhwal',
    emoji: '🧈',
    bg: 'from-amber-500 to-orange-700',
    description:
      'भादौं संक्रान्ति — पैलु दिन घ्यू खाणा कु। दही-घी-रोटी खाण से शरीर तंदुरुस्त रहद छ। किसान अपण काम का बदले भेंट दिन्दा छन।',
  },
  {
    id: 'budi-diwali-2027',
    name: 'Budi Diwali',
    nameLocal: 'बूढ़ी दीवाली',
    date: '2027-11-30',
    region: 'Uttarkashi · Jaunsar',
    emoji: '🔥',
    bg: 'from-orange-600 to-red-800',
    description:
      'दीवाली का एक महीना बाद मनौण वाळु "पुराणु" दीवाली — भैलो (आग कि रस्सी) घुमौण, ठोडा नृत्य औ पारम्परिक गीतुं के साथ मनौंदा छन।',
  },
  {
    id: 'khatik-2027',
    name: 'Kartik Purnima',
    nameLocal: 'कार्तिक पूर्णिमा',
    date: '2027-11-23',
    region: 'All Uttarakhand',
    emoji: '🌕',
    bg: 'from-yellow-500 to-amber-700',
    description:
      'कार्तिक पूर्णिमा — गंगा नदी म पवित्र स्नान कु पर्व। हरिद्वार, ऋषिकेश औ गंगोत्री म लाखों श्रद्धालु दीपदान करदा छन।',
  },

  // ===== 2028 =====
  {
    id: 'uttarayani-2028',
    name: 'Uttarayani / Makar Sankranti',
    nameLocal: 'उत्तरायणी · मकर संक्रांति',
    date: '2028-01-14',
    region: 'All Uttarakhand',
    emoji: '☀️',
    bg: 'from-amber-400 to-orange-600',
    description:
      'सुर्ज उत्तर दिशा म औंद — बागनाथ (बागेश्वर) म पवित्र स्नान, उत्तरायणी मेला औ तिळकुट कु प्रसाद बंट्द छ।',
  },
  {
    id: 'phooldei-2028',
    name: 'Phool Dei',
    nameLocal: 'फूल देई',
    date: '2028-03-14',
    region: 'Garhwal · Kumaon',
    emoji: '🌸',
    bg: 'from-pink-500 to-rose-700',
    description:
      'चैत्र संक्रान्ति — बसन्त का पैला दिन। नौनि-नौना घौर-घौर कि देहरी म ताजा फूल चढ़ौंदा छन — परिवार कु सुख-समृद्धि कु आशीर्वाद माँगदा छन।',
  },
  {
    id: 'harela-2028',
    name: 'Harela',
    nameLocal: 'हरेला',
    date: '2028-07-16',
    region: 'Kumaon · Garhwal',
    emoji: '🌱',
    bg: 'from-emerald-600 to-green-800',
    description:
      'सौंण संक्रान्ति — हरेला बोणा बटि काटणा तक नौ दिन का पर्व। धरती माँ, अनाज औ नई फसल कु सम्मान करदा छां।',
  },
  {
    id: 'igas-2028',
    name: 'Igas Bagwal',
    nameLocal: 'इगास बग्वाल',
    date: '2028-11-07',
    region: 'Garhwal',
    emoji: '🎆',
    bg: 'from-purple-600 to-fuchsia-800',
    description:
      'गढ़वाळ कि असली दीवाली — भगवान रामजी का दीवाली का ग्यारह दिन बाद घर लौटणा कि खुशी म मनौंदा छन। भैलो नृत्य औ ढोल दमाऊ की धुन।',
  },
  {
    id: 'basant-panchami-2028',
    name: 'Basant Panchami',
    nameLocal: 'बसन्त पंचमी',
    date: '2028-02-03',
    season: 'spring',
    region: 'All Uttarakhand',
    emoji: '🌼',
    bg: 'from-yellow-400 to-amber-600',
    traditions: ['Worship of Goddess Saraswati', 'Children start learning letters (Vidya Arambha)', 'Yellow clothes worn', 'Kite flying', 'Kesari halwa prasad'],
    description:
      'माँ सरस्वती कु पर्व — पीला रंग पहणणो, बच्चों का विद्यारम्भ संस्कार। बसन्त ऋतु का स्वागत औ खेतुं म सरसों का पीला सोना।',
  },
  {
    id: 'hariyali-teej-2028',
    name: 'Hariyali Teej',
    nameLocal: 'हरियाली तीज',
    date: '2028-08-07',
    season: 'monsoon',
    region: 'Garhwal · Kumaon',
    emoji: '🌿',
    bg: 'from-green-500 to-emerald-700',
    traditions: ['Married women fast for husbands longevity', 'Swing festivals (Jhulna)', 'Green clothes worn', 'Mehndi (henna) applied', 'Hariyali songs sung'],
    description:
      'सावन माह म पहाड़ी महिलाओं कु खास पर्व — पेड़ुं म झूला पड़दो, हरा लिबास पहणीजांद, मेहँदी लगाईजांद। माँ पार्वती कु व्रत औ गीत-संगीत।',
  },
  {
    id: 'nanda-devi-raj-jat-2028',
    name: 'Nanda Devi Raj Jat Yatra',
    nameLocal: 'नन्दा देवी राज जात यात्रा',
    date: '2028-08-27',
    season: 'monsoon',
    region: 'Chamoli · Garhwal',
    emoji: '🏔️',
    bg: 'from-fuchsia-600 to-violet-900',
    traditions: ['Once every 12 years', 'Four-horned ram leads the procession', 'Ritual journey of 280 km through Himalayas', 'Devotees in traditional dress', 'Dhol-Damau musical bands'],
    description:
      'हर बारा बरस म एक बार निकलणी वाळी भव्य यात्रा — चार सींगुं वाळो भेड़ा आगि-आगि चल्द। 280 किमी का हिमालयी मार्ग पर माँ नन्दा देवी का दर्शन।',
  },
  {
    id: 'kartik-purnima-2028',
    name: 'Kartik Purnima',
    nameLocal: 'कार्तिक पूर्णिमा',
    date: '2028-11-05',
    season: 'autumn',
    region: 'All Uttarakhand',
    emoji: '🕯️',
    bg: 'from-orange-400 to-amber-600',
    traditions: ['Holy dip at sunrise (Dev Snan)', 'Deepdaan (lamp floating) on rivers', 'Tulsi Vivah celebrations', 'Satyanarayan Katha recitation'],
    description:
      'कार्तिक पूर्णिमा पर गंगा, यमुना, मन्दाकिनी — सब्बि नदियों म पवित्र स्नान। देव सनान औ दीपदान — दीपावली बाद सबसे पवित्र स्नान पर्व।',
  },
  {
    id: 'makar-mela-2028',
    name: 'Makar Mela',
    nameLocal: 'मकर मेला',
    date: '2028-01-15',
    season: 'winter',
    region: 'Chamoli · Pauri · Tehri',
    emoji: '☀️',
    bg: 'from-sky-500 to-blue-700',
    traditions: ['New crop tasting ceremony', 'Ceremonial plough (Hali Puja)', 'Til and jaggery distribution', 'Folk dance performances'],
    description:
      'मकर संक्रान्ति पर ग्रामीण गढ़वाळ म लगणु मेला — नई फसल तिळ-गुड़ कु प्रसाद। हलि पूजा, ग्रामीण बाज़ार औ लोकनृत्य — सर्दी का त्योहारी समापन।',
  },
];

export default FESTIVALS;
