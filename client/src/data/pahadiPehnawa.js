// Pahadi Pehnawa — Traditional clothing/attire of Uttarakhand
// Region-wise traditional garments, accessories, and textiles

const PAHADI_PEHNAWA = [
  // ===== GARHWAL REGION =====
  {
    id: 'garhwal-women-attire',
    title: 'गढ़वाळी महिलाओं का पहनावा',
    titleEn: 'Garhwali Women\'s Attire',
    region: 'Garhwal',
    emoji: '👗',
    bg: 'from-rose-700 to-pink-900',
    items: [
      { name: 'Ghaghra', nameLocal: 'घाघरा', description: 'भारी प्लेटेड स्कर्ट, ऊन या सूती कपड़े से बनी', icon: '👗' },
      { name: 'Angra / Angi', nameLocal: 'आंगड़ा / अंगी', description: 'ऊपर पहनने वाला ब्लाउज़, कढ़ाई सहित', icon: '👚' },
      { name: 'Dhoti (Pichhora)', nameLocal: 'धोती (पिछौड़ा)', description: 'शादी-ब्याह में पहनी जाने वाली पीली/लाल ओढ़नी', icon: '🧣' },
      { name: 'Rangwali Pichhora', nameLocal: 'रंगवाली पिछौड़ा', description: 'शुभ अवसरों पर पहना जाने वाला रंगीन दुपट्टा', icon: '🎨' },
      { name: 'Gulyaband', nameLocal: 'गुल्यबंद', description: 'गले में पहनने वाला सोने/चांदी का गहना', icon: '📿' },
      { name: 'Nathuli', nameLocal: 'नथुली', description: 'नाक की बड़ी नथ — विवाहित स्त्रियों की पहचान', icon: '💎' },
    ],
    description: 'गढ़वाळ की महिलाएं घाघरा-आंगड़ा पहनदिन, पिछौड़ा ओढ़दिन। शादी-ब्याह मा रंगवाली पिछौड़ा अर गुल्यबंद विशेष छ।',
  },
  {
    id: 'garhwal-men-attire',
    title: 'गढ़वाळी पुरुषों का पहनावा',
    titleEn: 'Garhwali Men\'s Attire',
    region: 'Garhwal',
    emoji: '🧥',
    bg: 'from-blue-700 to-indigo-900',
    items: [
      { name: 'Surma (Kurta)', nameLocal: 'सुरमा (कुर्ता)', description: 'लंबा ढीला कुर्ता — रोज़ का पहनावा', icon: '👔' },
      { name: 'Churidar Pajama', nameLocal: 'चूड़ीदार पजामा', description: 'तंग पजामा, कुर्ते के साथ पहनते', icon: '👖' },
      { name: 'Mirzai / Sadri', nameLocal: 'मिरजई / सदरी', description: 'बिना बांह की जैकेट — ठंड में पहनते', icon: '🧥' },
      { name: 'Topi (Gandhi Topi)', nameLocal: 'टोपी (गांधी टोपी)', description: 'सफ़ेद टोपी — पहाड़ी पुरुषों की पहचान', icon: '🧢' },
      { name: 'Loi / Kambal', nameLocal: 'लोई / कम्बल', description: 'ऊनी शॉल — भेड़ की ऊन से बुनी हुई', icon: '🧶' },
      { name: 'Dhotiyu', nameLocal: 'धोतियु', description: 'कमर पर बांधी जाने वाली धोती', icon: '🪡' },
    ],
    description: 'गढ़वाळी पुरुष सुरमा (कुर्ता), चूड़ीदार, मिरजई पहनदन। सर पर टोपी अर ठंडा मा लोई ओढ़ दन।',
  },
  {
    id: 'garhwal-winter-wear',
    title: 'गढ़वाळी शीतकालीन पहनावा',
    titleEn: 'Garhwali Winter Wear',
    region: 'Garhwal',
    emoji: '🧶',
    bg: 'from-slate-700 to-gray-900',
    items: [
      { name: 'Thulma', nameLocal: 'थुलमा', description: 'मोटा ऊनी कोट — भारी सर्दी में पहनते', icon: '🧥' },
      { name: 'Loi Shawl', nameLocal: 'लोई शॉल', description: 'हाथ से बुनी ऊनी शॉल', icon: '🧣' },
      { name: 'Pankhi (Woolen Cap)', nameLocal: 'पांखी (ऊनी टोपी)', description: 'कानों को ढकने वाली ऊनी टोपी', icon: '🧢' },
      { name: 'Pashm Shawl', nameLocal: 'पश्म शॉल', description: 'बकरी के नरम ऊन से बनी महीन शॉल', icon: '🐐' },
      { name: 'Woolen Socks (Jurabi)', nameLocal: 'ऊनी जुराबी', description: 'हाथ से बुनी रंग-बिरंगी मोज़े', icon: '🧦' },
    ],
    description: 'ऊंचे पहाड़ मा ठंडा बहुत लगद। थुलमा, लोई, पांखी — सब भेड़-बकरी की ऊन से बणैयां जांदन।',
  },

  // ===== KUMAON REGION =====
  {
    id: 'kumaon-women-attire',
    title: 'कुमाऊँनी महिलाओं का पहनावा',
    titleEn: 'Kumaoni Women\'s Attire',
    region: 'Kumaon',
    emoji: '💃',
    bg: 'from-purple-700 to-violet-900',
    items: [
      { name: 'Ghaghra-Angra', nameLocal: 'घाघरा-आंगड़ा', description: 'भारी प्लेटेड स्कर्ट और ब्लाउज़', icon: '👗' },
      { name: 'Pichhora', nameLocal: 'पिछौड़ा', description: 'ओढ़नी/दुपट्टा — लाल या पीला', icon: '🧣' },
      { name: 'Hansuli', nameLocal: 'हांसुली', description: 'गले का चांदी का भारी आभूषण', icon: '⭕' },
      { name: 'Pahunchi', nameLocal: 'पहुंची', description: 'कलाई पर चांदी के चौड़े कड़े', icon: '💫' },
      { name: 'Bichhiya', nameLocal: 'बिछिया', description: 'पैर की अंगुली में चांदी की अंगूठी', icon: '💍' },
      { name: 'Maang Tikka', nameLocal: 'मांग टीका', description: 'माथे पर सोने/चांदी का टीका', icon: '✨' },
    ],
    description: 'कुमाऊँ की महिलाएं घाघरा-आंगड़ा पहनती हैं। चांदी के गहने — हांसुली, पहुंची, बिछिया — कुमाऊँनी पहचान हैं।',
  },
  {
    id: 'kumaon-men-attire',
    title: 'कुमाऊँनी पुरुषों का पहनावा',
    titleEn: 'Kumaoni Men\'s Attire',
    region: 'Kumaon',
    emoji: '🎩',
    bg: 'from-teal-700 to-emerald-900',
    items: [
      { name: 'Kurta-Pajama', nameLocal: 'कुर्ता-पजामा', description: 'लंबा सफ़ेद कुर्ता और पजामा', icon: '👔' },
      { name: 'Kumaoni Topi', nameLocal: 'कुमाऊँनी टोपी', description: 'गोल टोपी — सफ़ेद या काली', icon: '🧢' },
      { name: 'Sadri (Waistcoat)', nameLocal: 'सदरी (वेस्टकोट)', description: 'बिना बांह की जैकेट — त्योहारों पर', icon: '🧥' },
      { name: 'Chaddar', nameLocal: 'चादर', description: 'कंधे पर डालने वाली ऊनी/सूती चादर', icon: '🧶' },
      { name: 'Dhoti', nameLocal: 'धोती', description: 'पारंपरिक धोती — पूजा-पाठ में', icon: '🪡' },
    ],
    description: 'कुमाऊँनी पुरुष कुर्ता-पजामा और टोपी पहनते हैं। सदरी विशेष अवसरों पर पहनी जाती है।',
  },

  // ===== JAUNSAR-BAWAR REGION =====
  {
    id: 'jaunsar-women-attire',
    title: 'जौनसारी महिलाओं का पहनावा',
    titleEn: 'Jaunsari Women\'s Attire',
    region: 'Jaunsar-Bawar',
    emoji: '🌺',
    bg: 'from-orange-700 to-red-900',
    items: [
      { name: 'Dhaatu', nameLocal: 'धातू', description: 'लंबा कुर्ता-जैसा वस्त्र', icon: '👗' },
      { name: 'Ghagri', nameLocal: 'घाघरी', description: 'प्लेटेड स्कर्ट — गहरे रंगों में', icon: '💃' },
      { name: 'Chaundar', nameLocal: 'चौंदर', description: 'ओढ़नी — सिर और कंधे ढकने को', icon: '🧣' },
      { name: 'Bulakh', nameLocal: 'बुलाख', description: 'नाक का बड़ा गहना — जौनसारी पहचान', icon: '💎' },
      { name: 'Chandrahar', nameLocal: 'चंद्रहार', description: 'गले की भारी चांदी/सोने की माला', icon: '📿' },
    ],
    description: 'जौनसार-बावर की महिलाएं धातू-घाघरी पहनती हैं। बुलाख और चंद्रहार उनकी विशिष्ट पहचान है।',
  },
  {
    id: 'jaunsar-men-attire',
    title: 'जौनसारी पुरुषों का पहनावा',
    titleEn: 'Jaunsari Men\'s Attire',
    region: 'Jaunsar-Bawar',
    emoji: '🎭',
    bg: 'from-amber-700 to-yellow-900',
    items: [
      { name: 'Chola', nameLocal: 'चोला', description: 'ढीला लंबा कुर्ता — ऊन या सूती', icon: '👔' },
      { name: 'Dora', nameLocal: 'डोरा', description: 'कमर पर बांधने की रस्सी/पट्टी', icon: '🪢' },
      { name: 'Topi (Jaunsari)', nameLocal: 'टोपी (जौनसारी)', description: 'विशिष्ट फूलदार/रंगीन टोपी', icon: '🎪' },
      { name: 'Loi (Blanket Shawl)', nameLocal: 'लोई', description: 'भेड़ की ऊन की मोटी शॉल', icon: '🧶' },
    ],
    description: 'जौनसारी पुरुष चोला पहनदन, कमर पर डोरा बांधदन। सिर पर रंग-बिरंगी टोपी उनकी पहचान छ।',
  },

  // ===== BHOTIYA / TRIBAL =====
  {
    id: 'bhotiya-attire',
    title: 'भोटिया जनजाति का पहनावा',
    titleEn: 'Bhotiya Tribal Attire',
    region: 'Tribal',
    emoji: '🏔️',
    bg: 'from-cyan-700 to-blue-900',
    items: [
      { name: 'Ranga', nameLocal: 'रंगा', description: 'भेड़ की ऊन का लंबा कोट', icon: '🧥' },
      { name: 'Bakhu (Chuba)', nameLocal: 'बाखू (चुबा)', description: 'तिब्बती शैली का ऊनी गाउन', icon: '👘' },
      { name: 'Woolen Boots', nameLocal: 'ऊनी जूते', description: 'भेड़ की खाल से बने गर्म जूते', icon: '🥾' },
      { name: 'Dhantu', nameLocal: 'धंतू', description: 'महिलाओं का ऊनी ओवरकोट', icon: '🧥' },
      { name: 'Silver Ornaments', nameLocal: 'चांदी के गहने', description: 'भारी चांदी के कंठहार, करधनी', icon: '🪙' },
    ],
    description: 'भोटिया लोग ऊंचे हिमालयी क्षेत्रों में रहते हैं। रंगा, बाखू जैसे भारी ऊनी वस्त्र और चांदी के गहने उनकी पहचान हैं।',
  },

  // ===== TEXTILES & WEAVING =====
  {
    id: 'pahadi-textiles',
    title: 'पहाड़ी बुनाई व कपड़े',
    titleEn: 'Pahadi Textiles & Weaving',
    region: 'Textiles',
    emoji: '🧵',
    bg: 'from-fuchsia-700 to-pink-900',
    items: [
      { name: 'Ringaal Weaving', nameLocal: 'रिंगाल बुनाई', description: 'बांस की बुनाई — टोकरी, चटाई', icon: '🎋' },
      { name: 'Handloom (Khadi)', nameLocal: 'हथकरघा (खादी)', description: 'हाथ से बुना सूती कपड़ा', icon: '🪡' },
      { name: 'Eri Silk (Reri)', nameLocal: 'एरी सिल्क (रेरी)', description: 'रेशम कीड़े से बनी रेशमी कपड़ा', icon: '🐛' },
      { name: 'Thulma Wool', nameLocal: 'थुलमा ऊन', description: 'भेड़ की ऊन से बुने मोटे कपड़े', icon: '🐑' },
      { name: 'Aipan Embroidery', nameLocal: 'ऐपण कढ़ाई', description: 'कुमाऊँनी पारंपरिक कढ़ाई शैली', icon: '🎨' },
      { name: 'Pashmina', nameLocal: 'पश्मीना', description: 'चांगथांगी बकरी की महीन ऊन', icon: '🐐' },
    ],
    description: 'उत्तराखंड की बुनाई परंपरा सदियों पुरानी छ। हथकरघा, ऊनी शॉल, ऐपण कढ़ाई — सब हाथ से बणैयां जांदन।',
  },

  // ===== WEDDING / FESTIVE ATTIRE =====
  {
    id: 'wedding-festive-attire',
    title: 'शादी-त्यौहार का पहनावा',
    titleEn: 'Wedding & Festive Attire',
    region: 'Festive',
    emoji: '💒',
    bg: 'from-red-700 to-rose-900',
    items: [
      { name: 'Bridal Pichhora', nameLocal: 'दुल्हन का पिछौड़ा', description: 'लाल/पीला शादी का ओढ़ना — अत्यंत शुभ', icon: '👰' },
      { name: 'Groom Topi & Sherwani', nameLocal: 'दूल्हे की टोपी व शेरवानी', description: 'शादी में पहाड़ी टोपी + शेरवानी', icon: '🤵' },
      { name: 'Nath (Bridal)', nameLocal: 'नथ (दुल्हन)', description: 'बड़ी सोने की नथ — दुल्हन की पहचान', icon: '💍' },
      { name: 'Mangalsutra', nameLocal: 'मंगलसूत्र', description: 'सुहाग का प्रतीक — काले मोतियों की माला', icon: '📿' },
      { name: 'Gauri-Shankar Mala', nameLocal: 'गौरी-शंकर माला', description: 'रुद्राक्ष की माला — धार्मिक अवसरों पर', icon: '📿' },
      { name: 'Payal / Jhanjhar', nameLocal: 'पायल / झांझर', description: 'पैर में चांदी की पायल — घुंघरू सहित', icon: '🔔' },
    ],
    description: 'शादी-ब्याह मा दुल्हन पिछौड़ा ओढ़दी, नथ पहनदी। दूल्हा पहाड़ी टोपी लगान्द। त्यौहारों मा रंग-बिरंगा पहनावा होंद।',
  },
];

export default PAHADI_PEHNAWA;
