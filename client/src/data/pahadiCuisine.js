// District-wise (Zila-wise) famous things from Uttarakhand
// Includes attractions, specialties, food, products, and cultural significance

const UTTARAKHAND_SPECIALTIES = [
  // ===== FOOTHILLS & PLAINS REGION =====
  {
    id: 'dehradun-specialty',
    district: 'Dehradun',
    districtLocal: 'देहरादून',
    sequence: 1,
    region: 'Foothills',
    emoji: '🎓',
    bg: 'from-blue-600 to-indigo-800',
    title: 'Education Hub & Natural Beauty',
    titleLocal: 'शिक्षा का केंद्र',
    items: [
      {
        name: 'FRI (Forest Research Institute)',
        nameLocal: 'वन अनुसंधान संस्थान',
        category: 'Heritage Institution',
        icon: '🌳',
      },
      {
        name: "Robber's Cave (Guchhupani)",
        nameLocal: 'डाकुओं की गुफा',
        category: 'Natural Attraction',
        icon: '🏞️',
      },
      {
        name: 'Bakery Items (Rusks, Plum Cake)',
        nameLocal: 'बेकरी वस्तुएं',
        category: 'Famous Products',
        icon: '🍰',
      },
      {
        name: 'Doon School',
        nameLocal: 'दून स्कूल',
        category: 'Elite Institution',
        icon: '📚',
      },
      {
        name: 'Lacquer Ware',
        nameLocal: 'लाख की कारीगरी',
        category: 'Handicraft',
        icon: '🎨',
      },
    ],
    description:
      'देहरादून शिक्षा, वनस्पति अनुसंधान, बेकरी खाद्य पदार्थों और मसालों के लिए प्रसिद्ध है। प्राचीन गुफाएं और हरी-भरी पहाड़ियां इसे एक पर्यटन स्वर्ग बनाती हैं।',
  },

  // ===== GARHWAL REGION =====
  {
    id: 'uttarkashi-specialty',
    district: 'Uttarkashi',
    districtLocal: 'उत्तरकाशी',
    sequence: 2,
    region: 'Garhwal',
    emoji: '🌲',
    bg: 'from-emerald-700 to-teal-900',
    title: 'Aloo ka Gutka & Mandua Roti',
    titleLocal: 'आलू का गुटखा औ मंडुवा रोटी',
    items: [
      {
        name: 'Aloo ka Gutka',
        nameLocal: 'आलू का गुटखा',
        category: 'Traditional Food',
        icon: '🥔',
      },
      {
        name: 'Mandua Roti',
        nameLocal: 'मंडुवा रोटी',
        category: 'Finger Millet Bread',
        icon: '🍞',
      },
      {
        name: 'Har ki Dun Valley Hiking',
        nameLocal: 'हर की दून ट्रेकिंग',
        category: 'Adventure',
        icon: '🏔️',
      },
    ],
    description:
      'उत्तरकाशी कि बर्फानी पहाड़ुं म आलू कि सब्जि तै सरसों कु तेल, जखिया औ लाल मिर्च सँग बणान्द छन। मंडुवा कि रोटी देशी घी म तलिक परोसदा छ।',
  },
  {
    id: 'chamoli-specialty',
    district: 'Chamoli',
    districtLocal: 'चमोली',
    sequence: 3,
    region: 'Garhwal',
    emoji: '🏔️',
    bg: 'from-blue-700 to-indigo-900',
    title: 'Chainsoo & Jhangora Kheer',
    titleLocal: 'चैंसू औ झंगोरा खीर',
    items: [
      {
        name: 'Chainsoo',
        nameLocal: 'चैंसू',
        category: 'Traditional Gravy',
        icon: '🍲',
      },
      {
        name: 'Jhangora Kheer',
        nameLocal: 'झंगोरा खीर',
        category: 'Dessert',
        icon: '🥛',
      },
      {
        name: 'Kedarnath & Chopta Peaks',
        nameLocal: 'केदारनाथ यात्रा',
        category: 'Pilgrimage',
        icon: '🛕',
      },
      {
        name: 'Auli Ski Resort',
        nameLocal: 'औली स्की रिसॉर्ट',
        category: 'Adventure',
        icon: '⛷️',
      },
    ],
    description:
      'चमोली म काला उरद दाऴ तै सूखा भून, पीसिक घी-जखिया सँग गाढ़ी ग्रेवी बणान्द छन। झंगोरा कु खीर दूध औ गुड़ सँग तैयार होंद छ।',
  },

  {
    id: 'tehri-specialty',
    district: 'Tehri Garhwal',
    districtLocal: 'टिहरी गढ़वाल',
    sequence: 4,
    region: 'Garhwal',
    emoji: '🌊',
    bg: 'from-cyan-600 to-blue-800',
    title: 'Kafuli & Badi - Green Delights',
    titleLocal: 'काफुली औ बाडी',
    items: [
      {
        name: 'Kafuli (Saag)',
        nameLocal: 'काफुली',
        category: 'Green Curry',
        icon: '🥬',
      },
      {
        name: 'Badi (Steamed Cake)',
        nameLocal: 'बाडी',
        category: 'Comfort Food',
        icon: '🍲',
      },
      {
        name: 'Tehri Dam',
        nameLocal: 'टिहरी बाँध',
        category: 'Engineering Marvel',
        icon: '🏗️',
      },
    ],
    description:
      'टिहरी कि सबजि पालक, मेथी, लिंगुड़ा (स्थानीय साग) कु गाढ़ु मिश्रण मंडुवा कु आटु सँग। बाडी दाल या साग सँग परोसदा छ।',
  },

  {
    id: 'rudraprayag-specialty',
    district: 'Rudraprayag',
    districtLocal: 'रुद्रप्रयाग',
    sequence: 5,
    region: 'Garhwal',
    emoji: '⛩️',
    bg: 'from-orange-600 to-red-800',
    title: 'Phanu & Ragi Roti',
    titleLocal: 'फाणु औ रागी रोटी',
    items: [
      {
        name: 'Phanu (Gahat Dal)',
        nameLocal: 'फाणु',
        category: 'Energy Food',
        icon: '🥘',
      },
      {
        name: 'Ragi Roti',
        nameLocal: 'रागी रोटी',
        category: 'Millets',
        icon: '🌾',
      },
      {
        name: 'Chopta (Mini Switzerland)',
        nameLocal: 'चोपता घास के मैदान',
        category: 'Natural Beauty',
        icon: '🌄',
      },
    ],
    description:
      'रुद्रप्रयाग कु पहाड़ुं म गहत (कुलथी) दाऴ रात भर भिगै, पीसिक पतलु ग्रेवी म पकान्द छन। यु दिनभर कु काम-काज खातिर बहुत ताकत दिन्द।',
  },

  // ===== KUMAON REGION =====
  {
    id: 'almora-specialty',
    district: 'Almora',
    districtLocal: 'अल्मोड़ा',
    sequence: 6,
    region: 'Kumaon',
    emoji: '🏛️',
    bg: 'from-purple-600 to-indigo-800',
    title: 'Singaudi & Paju - Sweet Heaven',
    titleLocal: 'सिंगौड़ी औ पाजु',
    items: [
      {
        name: 'Singaudi',
        nameLocal: 'सिंगौड़ी',
        category: 'Traditional Sweet',
        icon: '🍨',
      },
      {
        name: 'Paju (Dessert)',
        nameLocal: 'पाजु',
        category: 'Festival Sweet',
        icon: '🍯',
      },
      {
        name: 'Almora Haat Bazaar',
        nameLocal: 'अल्मोड़ा हाट ',
        category: 'Heritage Market',
        icon: '🏪',
      },
      {
        name: 'Nanda Devi Peak Views',
        nameLocal: 'नंदा देवी दृश्य',
        category: 'Trekking',
        icon: '📍',
      },
    ],
    description:
      'अल्मोड़ा कु प्रसिद्ध मीठे पकवान — सिंगौड़ी दूध, इलायची औ मेवा सँग, मालू पात म लपेट्यां। पाजु विशेष दिन म बणान्द छ।',
  },

  {
    id: 'nainital-specialty',
    district: 'Nainital',
    districtLocal: 'नैनीताल',
    sequence: 7,
    region: 'Kumaon',
    emoji: '🏞️',
    bg: 'from-green-600 to-emerald-800',
    title: 'Bal Mithai & Lake Beauty',
    titleLocal: 'बाल मिठाई',
    items: [
      {
        name: 'Bal Mithai (Khoya Sweet)',
        nameLocal: 'बाल मिठाई',
        category: 'Famous Sweet',
        icon: '🍯',
      },
      {
        name: 'Bhang ki Khir',
        nameLocal: 'भाङ की खीर',
        category: 'Sesame Dessert',
        icon: '🥛',
      },
      {
        name: 'Naini Lake',
        nameLocal: 'नैनी झील',
        category: 'Natural Lake',
        icon: '💎',
      },
      {
        name: 'Mall Road Shopping',
        nameLocal: 'मॉल रोड',
        category: 'Tourist Hub',
        icon: '🛍️',
      },
    ],
    description:
      'नैनीताल कि विश्व-प्रसिद्ध बाल मिठाई — खोये कु गोल्ड फॉयल म लपेट्यां मिठाई। भाङ कि खीर कुमाऊँ कु परम्परागत मिठै छह।',
  },

  {
    id: 'bageshwar-specialty',
    district: 'Bageshwar',
    districtLocal: 'बागेश्वर',
    sequence: 8,
    region: 'Kumaon',
    emoji: '🙏',
    bg: 'from-red-600 to-rose-800',
    title: 'Arsa & Phaafri Sweets',
    titleLocal: 'अरसा औ फाफरी',
    items: [
      {
        name: 'Arsa (Sweet Rice Cake)',
        nameLocal: 'अरसा',
        category: 'Festival Sweet',
        icon: '🍪',
      },
      {
        name: 'Phaafri (Sesame Sweet)',
        nameLocal: 'फाफरी',
        category: 'Winter Sweet',
        icon: '🍬',
      },
      {
        name: 'Uttarayani Mela Fair',
        nameLocal: 'उत्तरायणी मेला',
        category: 'Religious Fair',
        icon: '🏛️',
      },
    ],
    description:
      'बागेश्वर म चावल कु आटु, गुड़ औ तेल सँग अरसा बणान्द छन। फाफरी सर्दियुं म बणाए जान वाली परम्परागत मिठै छ।',
  },

  {
    id: 'pithoragarh-specialty',
    district: 'Pithoragarh',
    districtLocal: 'पिथौरागढ़',
    sequence: 9,
    region: 'Kumaon',
    emoji: '🏔️',
    bg: 'from-indigo-700 to-purple-900',
    title: 'Bhatt ki Churkani & Border Tales',
    titleLocal: 'भट्ट की चुरकानी',
    items: [
      {
        name: 'Bhatt ki Churkani',
        nameLocal: 'भट्ट की चुरकानी',
        category: 'Savory Snack',
        icon: '🥘',
      },
      {
        name: 'Puan (Oil Droplets)',
        nameLocal: 'पुआन',
        category: 'Winter Food',
        icon: '🍂',
      },
      {
        name: 'India-Nepal Border Town',
        nameLocal: 'सीमांत क्षेत्र',
        category: 'Geography',
        icon: '🇮🇳',
      },
    ],
    description:
      'पिथौरागढ़ कु सीमांत क्षेत्र म भट्ट (छोले जन दाऴ) कु चूरनु मसाले सँग — तीखु औ स्वाद। पुआन तेल म तरै विशेष खान पान छ।',
  },

  // ===== JAUNSAR-BAWAR REGION =====
  {
    id: 'jaunsar-specialty',
    district: 'Jaunsar-Bawar',
    districtLocal: 'जौंसार-बावर',
    sequence: 10,
    region: 'Jaunsar-Bawar',
    emoji: '🥾',
    bg: 'from-amber-600 to-orange-800',
    title: 'Babrù & Kinema - Tribal Heritage',
    titleLocal: 'बाबरू औ किनेमा',
    items: [
      {
        name: 'Babrù (Millet Bread)',
        nameLocal: 'बाबरू',
        category: 'Tribal Food',
        icon: '🍞',
      },
      {
        name: 'Kinema (Fermented Soy)',
        nameLocal: 'किनेमा',
        category: 'Protein Food',
        icon: '🌱',
      },
      {
        name: 'Tribal Culture & Festivals',
        nameLocal: 'जनजातीय संस्कृति',
        category: 'Heritage',
        icon: '🎭',
      },
    ],
    description:
      'जौंसार-बावर कु अनोखु भोजन — बाबरू (बाजरु कु आटु आलू सँग) औ किनेमा (सुखै हुए सोयाबीन कु खमीरयुक्त पकवान) स्थानीय जीवन शैली कु हिस्सा छ।',
  },

  // ===== ADDITIONAL DISTRICTS =====
  {
    id: 'pauri-specialty',
    district: 'Pauri Garhwal',
    districtLocal: 'पौड़ी गढ़वाल',
    sequence: 11,
    region: 'Garhwal',
    emoji: '🌳',
    bg: 'from-green-700 to-emerald-900',
    title: 'Handicrafts & Hill Views',
    titleLocal: 'हस्तशिल्प',
    items: [
      {
        name: 'Wool Blankets & Shawls',
        nameLocal: 'ऊनी कपड़े',
        category: 'Handicraft',
        icon: '🧶',
      },
      {
        name: 'Hill Station Tourism',
        nameLocal: 'पहाड़ी पर्यटन',
        category: 'Tourism',
        icon: '🏞️',
      },
    ],
    description:
      'पौड़ी गढ़वाल हस्तशिल्प, खाद्य पदार्थों और प्राकृतिक सौंदर्य के लिए प्रसिद्ध है। पारंपरिक ऊनी कपड़े और कंबल यहां की खासियत हैं।',
  },

  {
    id: 'haridwar-specialty',
    district: 'Haridwar',
    districtLocal: 'हरिद्वार',
    sequence: 12,
    region: 'Foothills',
    emoji: '🛕',
    bg: 'from-yellow-600 to-orange-800',
    title: 'Holy City & Gur (Jaggery)',
    titleLocal: 'पवित्र नगर',
    items: [
      {
        name: 'Gur (Jaggery Production)',
        nameLocal: 'गुड़',
        category: 'Food Product',
        icon: '🍯',
      },
      {
        name: 'Gaumukh Pilgrimage',
        nameLocal: 'गौमुख तीर्थ',
        category: 'Pilgrimage',
        icon: '🦁',
      },
      {
        name: 'Har ki Pauri Ghat',
        nameLocal: 'हर की पैड़ी घाट',
        category: 'Religious Site',
        icon: '💧',
      },
    ],
    description:
      'हरिद्वार गंगा के किनारे स्थित एक पवित्र शहर है। यहां गुड़ का उत्पादन और परंपरागत कारीगरी प्रसिद्ध है।',
  },
];

export default UTTARAKHAND_SPECIALTIES;
