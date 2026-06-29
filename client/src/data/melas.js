// Curated upcoming famous melas (fairs) across Uttarakhand.
// Dates use ISO `YYYY-MM-DD` (local). Most melas are tied to Hindu lunar/solar
// calendar dates that shift slightly each year — update entries per year as
// the official dates are announced by district administrations.
//
// Add new entries here; the UI auto-picks the next N entries whose date is
// >= today (sorted ascending).

const MELAS = [
  // ===== 2026 =====
  {
    id: 'jauljibi-2026',
    name: 'Jauljibi Mela',
    nameLocal: 'जौलजीबी मेला',
    date: '2026-11-14',
    region: 'Pithoragarh · Kumaon',
    emoji: '🏞️',
    bg: 'from-cyan-600 to-blue-800',
    description:
      'काली औ गोरी नदी कु संगम म लगणु वाळु ऐतिहासिक व्यापारिक मेला — भारत, नेपाळ औ तिब्बत का व्यापारी पहाड़ी ऊन, घोड़ा औ जड़ी-बूटी कु लेन-देन करदा छन।',
  },
  {
    id: 'gauchar-2026',
    name: 'Gauchar Mela',
    nameLocal: 'गौचर मेला',
    date: '2026-11-14',
    region: 'Chamoli · Garhwal',
    emoji: '🎪',
    bg: 'from-amber-600 to-orange-800',
    description:
      'गढ़वाळ कु सबसे बड़ु औद्योगिक-सांस्कृतिक मेला — 1943 बटि शुरू, हफ्ता भर चल्द। लोक नृत्य, कृषि प्रदर्शनी औ हस्तशिल्प कु मेळ।',
  },

  // ===== 2027 =====
  {
    id: 'uttarayani-bageshwar-2027',
    name: 'Uttarayani Mela',
    nameLocal: 'उत्तरायणी मेला',
    date: '2027-01-14',
    region: 'Bageshwar · Kumaon',
    emoji: '🛕',
    bg: 'from-orange-500 to-red-700',
    description:
      'बागनाथ मन्दिर म सरयू-गोमती संगम पर पवित्र स्नान — कुमाऊँ कु सबसे बड़ु पारम्परिक मेला, मकर संक्रान्ति बटि एक हफ्ता तक चल्द।',
  },
  {
    id: 'magh-mela-uttarkashi-2027',
    name: 'Magh Mela',
    nameLocal: 'माघ मेला',
    date: '2027-01-14',
    region: 'Uttarkashi · Garhwal',
    emoji: '🪔',
    bg: 'from-indigo-600 to-purple-800',
    description:
      'उत्तरकाशी म माघ संक्रान्ति पर भगवान काशी विश्वनाथ कु मेला — डोली यात्रा, लोक गीत औ पारम्परिक रंवाई-जौनपुरी संस्कृति कु झलक।',
  },
  {
    id: 'purnagiri-2027',
    name: 'Purnagiri Mela',
    nameLocal: 'पूर्णागिरी मेला',
    date: '2027-03-22',
    region: 'Champawat · Tanakpur',
    emoji: '🙏',
    bg: 'from-rose-600 to-pink-800',
    description:
      'माँ पूर्णागिरी देवी कु प्रसिद्ध सिद्धपीठ — चैत्र नवरात्रि बटि लग्द, लाख्खुं श्रद्धालु काली नदी कु किनारा बटि चढ़ाई करदा छन।',
  },
  {
    id: 'syalde-bikhauti-2027',
    name: 'Syalde Bikhauti Mela',
    nameLocal: 'स्याल्दे बिखौती मेला',
    date: '2027-04-14',
    region: 'Dwarahat · Almora',
    emoji: '⚔️',
    bg: 'from-emerald-600 to-teal-800',
    description:
      'द्वाराहाट म बैसाखी संक्रान्ति पर लगणु वाळु प्राचीन मेला — ऐंठी-ओड़ा गाँव वाळुं कि पारम्परिक "ओड़ा-भेटना" लड़ाई कु अनूठु प्रदर्शन।',
  },
  {
    id: 'devidhura-bagwal-2027',
    name: 'Devidhura Bagwal Mela',
    nameLocal: 'देवीधुरा बग्वाल मेला',
    date: '2027-08-17',
    region: 'Champawat · Kumaon',
    emoji: '🪨',
    bg: 'from-stone-600 to-gray-800',
    description:
      'रक्षाबन्धन पर माँ बाराही धाम म प्रसिद्ध "पाषाण युद्ध" — चार खाम (वंश) पत्थरुं सँग प्रतीकात्मक लड़ाई करदा छन, सदियूं पुरणि परम्परा।',
  },
  {
    id: 'nanda-devi-mela-almora-2027',
    name: 'Nanda Devi Mela',
    nameLocal: 'नन्दा देवी मेला',
    date: '2027-09-04',
    region: 'Almora · Nainital',
    emoji: '🛕',
    bg: 'from-fuchsia-600 to-purple-900',
    description:
      'अल्मोड़ा औ नैनीताल म माँ नन्दा-सुनन्दा कि भव्य डोली यात्रा — कदली वृक्ष कि पूजा, झोड़ा-चांचरी नृत्य औ पारम्परिक पकवान।',
  },
  {
    id: 'nauchandi-2027',
    name: 'Thal Mela',
    nameLocal: 'थल मेला',
    date: '2027-04-13',
    region: 'Pithoragarh · Kumaon',
    emoji: '🐎',
    bg: 'from-yellow-600 to-amber-800',
    description:
      'थल म रामगंगा का किनारा बैसाखी पर लगणु वाळु पशु मेला — घोड़ा, खच्चर औ ऊनी सामान कु बड़ु बाजार, कुमाऊँनी झोड़ा गीत।',
  },
  {
    id: 'kandali-2027',
    name: 'Kandali Mahotsav',
    nameLocal: 'कण्डाली महोत्सव',
    date: '2027-09-15',
    region: 'Chaudans · Pithoragarh',
    emoji: '🌺',
    bg: 'from-pink-600 to-rose-900',
    description:
      'दर्मा-व्यास घाटी का रं समाज कु 12 बरस म एक बार लगणु वाळु अनोखु पर्व — कण्डाली का गुलाबी फूलुं कि पूजा औ पारम्परिक रं नृत्य।',
  },
  {
    id: 'someshwar-mela-2027',
    name: 'Someshwar Mela',
    nameLocal: 'सोमेश्वर मेला',
    date: '2027-10-02',
    region: 'Someshwar · Almora',
    emoji: '🛕',
    bg: 'from-teal-600 to-cyan-800',
    description:
      'अल्मोड़ा ज़िल्ला का सोमेश्वर म कोसी नदी का किनारा लगणु वाळु पारम्परिक मेला — कुमाऊँनी लोक संगीत, झोड़ा-चाँचरी औ हस्तशिल्प बाज़ार।',
  },
  {
    id: 'kartik-purnima-mela-2027',
    name: 'Kartik Purnima Mela',
    nameLocal: 'कार्तिक पूर्णिमा मेला',
    date: '2027-11-05',
    region: 'Haridwar · Rishikesh',
    emoji: '🪔',
    bg: 'from-amber-500 to-yellow-700',
    description:
      'कार्तिक पूर्णिमा पर गंगा म दीपदान — हरिद्वार औ ऋषिकेश म लाख्खुं दीपक तराता छन, नौका विहार औ पारम्परिक पूजा-अर्चना।',
  },
  {
    id: 'ghee-sankranti-uttarkashi-2027',
    name: 'Ghee Sankranti Mela',
    nameLocal: 'घी संक्रान्ति मेला',
    date: '2027-08-17',
    region: 'Uttarkashi · Garhwal',
    emoji: '🧈',
    bg: 'from-yellow-500 to-amber-700',
    description:
      'भाद्रपद संक्रान्ति — घी औ काखड़ी दान कु पर्व। घर म नई फसल कु स्वागत, बड़ा-बुजुर्गों कु आशीर्वाद औ लोकगीत कु आयोजन।',
  },
  {
    id: 'vyas-mela-2027',
    name: 'Vyas Purnima Mela',
    nameLocal: 'व्यास पूर्णिमा मेला',
    date: '2027-07-10',
    region: 'Badrinath · Chamoli',
    emoji: '📖',
    bg: 'from-blue-600 to-indigo-800',
    description:
      'गुरु पूर्णिमा पर बद्रीनाथ धाम म वेदव्यास कि पूजा — संत, महात्मा औ विद्यार्थी गुरु-शिष्य परम्परा कु सम्मान करदा छन।',
  },

  // ===== 2028 =====
  {
    id: 'uttarayani-mela-2028',
    name: 'Uttarayani Mela',
    nameLocal: 'उत्तरायणी मेला',
    date: '2028-01-14',
    region: 'Bageshwar · Kumaon',
    emoji: '🛕',
    bg: 'from-orange-500 to-red-700',
    description:
      'बागनाथ मन्दिर म सरयू-गोमती संगम पर पवित्र स्नान — मकर संक्रान्ति पर कुमाऊँ कु सबसे बड़ु पारम्परिक मेला। ऊनी वस्त्र, मसाला औ लोक शिल्प कु विशाल बाज़ार।',
  },
  {
    id: 'hariyali-mela-2028',
    name: 'Hariyali Mela',
    nameLocal: 'हरियाली मेला',
    date: '2028-07-28',
    region: 'Tehri · Pauri Garhwal',
    emoji: '🌿',
    bg: 'from-green-600 to-lime-800',
    description:
      'सौंण माह म हरियाली तीज पर माँ शक्ति कि पूजा — टिहरी गढ़वाल म हरियाली मेला सदियूं पुराणो। लोक गीत, ग्रामीण बाज़ार औ औषधीय पौधुं कि प्रदर्शनी।',
  },
  {
    id: 'kalpeshwar-mela-2028',
    name: 'Kalpeshwar Mela',
    nameLocal: 'कल्पेश्वर मेला',
    date: '2028-05-15',
    region: 'Urgam Valley · Chamoli',
    emoji: '🙏',
    bg: 'from-slate-600 to-gray-800',
    description:
      'उरगाम घाटी म पंच केदार का एक — भगवान कल्पेश्वर कि यात्रा। यहाँ शिव की जटाओं की पूजा होती है। चरवाहा समुदाय कु सबसे प्रिय तीर्थ।',
  },
  {
    id: 'jauljibi-2028',
    name: 'Jauljibi Mela',
    nameLocal: 'जौलजीबी मेला',
    date: '2028-11-14',
    region: 'Pithoragarh · Kumaon',
    emoji: '🏞️',
    bg: 'from-cyan-600 to-blue-800',
    description:
      'काली-गोरी संगम पर ऐतिहासिक व्यापार मेला — भारत, नेपाल औ तिब्बती व्यापारी पहाड़ी ऊन, जड़ी-बूटी औ हस्तशिल्प बेचदा छन।',
  },
  {
    id: 'gauchar-2028',
    name: 'Gauchar Mela',
    nameLocal: 'गौचर मेला',
    date: '2028-11-14',
    region: 'Chamoli · Garhwal',
    emoji: '🎪',
    bg: 'from-amber-600 to-orange-800',
    description:
      '1943 बटि गढ़वाळ कु सबसे बड़ु सांस्कृतिक-औद्योगिक मेला — हफ्ता भर चल्द। लोक नृत्य, पशु प्रदर्शनी, कृषि यंत्र औ हस्तशिल्प कु विशाल बाजार।',
  },
];

export default MELAS;
