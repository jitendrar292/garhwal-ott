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
    shopUrl: 'https://www.amazon.in/s?k=garhwali+traditional+women+dress+uttarakhand&tag=pahadistore29-21',
    items: [
      { name: 'Ghaghra', nameLocal: 'घाघरा', description: 'भारी प्लेटेड स्कर्ट, ऊन या सूती कपड़े से बनी', icon: '👗', buyUrl: 'https://www.amazon.in/s?k=pahadi+ghaghra+skirt+traditional&tag=pahadistore29-21' },
      { name: 'Angra / Angi', nameLocal: 'आंगड़ा / अंगी', description: 'ऊपर पहनने वाला ब्लाउज़, कढ़ाई सहित', icon: '👚', buyUrl: 'https://www.amazon.in/s?k=pahadi+embroidered+blouse+kumaoni&tag=pahadistore29-21' },
      { name: 'Dhoti (Pichhora)', nameLocal: 'धोती (पिछौड़ा)', description: 'शादी-ब्याह में पहनी जाने वाली पीली/लाल ओढ़नी', icon: '🧣', buyUrl: 'https://www.amazon.in/s?k=pichhora+pahadi+dupatta+uttarakhand&tag=pahadistore29-21' },
      { name: 'Rangwali Pichhora', nameLocal: 'रंगवाली पिछौड़ा', description: 'शुभ अवसरों पर पहना जाने वाला रंगीन दुपट्टा', icon: '🎨', buyUrl: 'https://www.amazon.in/s?k=rangwali+pichhora+garhwali&tag=pahadistore29-21' },
      { name: 'Gulyaband', nameLocal: 'गुल्यबंद', description: 'गले में पहनने वाला सोने/चांदी का गहना', icon: '📿', buyUrl: 'https://www.amazon.in/s?k=gulyaband+pahadi+necklace+silver&tag=pahadistore29-21' },
      { name: 'Nathuli', nameLocal: 'नथुली', description: 'नाक की बड़ी नथ — विवाहित स्त्रियों की पहचान', icon: '💎', buyUrl: 'https://www.amazon.in/s?k=pahadi+nath+nose+ring+traditional&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=garhwali+men+traditional+kurta+topi&tag=pahadistore29-21',
    items: [
      { name: 'Surma (Kurta)', nameLocal: 'सुरमा (कुर्ता)', description: 'लंबा ढीला कुर्ता — रोज़ का पहनावा', icon: '👔', buyUrl: 'https://www.amazon.in/s?k=pahadi+kurta+men+cotton+white&tag=pahadistore29-21' },
      { name: 'Churidar Pajama', nameLocal: 'चूड़ीदार पजामा', description: 'तंग पजामा, कुर्ते के साथ पहनते', icon: '👖', buyUrl: 'https://www.amazon.in/s?k=churidar+pajama+men+cotton&tag=pahadistore29-21' },
      { name: 'Mirzai / Sadri', nameLocal: 'मिरजई / सदरी', description: 'बिना बांह की जैकेट — ठंड में पहनते', icon: '🧥', buyUrl: 'https://www.amazon.in/s?k=nehru+jacket+men+traditional+sadri&tag=pahadistore29-21' },
      { name: 'Topi (Gandhi Topi)', nameLocal: 'टोपी (गांधी टोपी)', description: 'सफ़ेद टोपी — पहाड़ी पुरुषों की पहचान', icon: '🧢', buyUrl: 'https://www.amazon.in/s?k=pahadi+topi+uttarakhand+gandhi+cap&tag=pahadistore29-21' },
      { name: 'Loi / Kambal', nameLocal: 'लोई / कम्बल', description: 'ऊनी शॉल — भेड़ की ऊन से बुनी हुई', icon: '🧶', buyUrl: 'https://www.amazon.in/s?k=pahadi+woolen+shawl+handloom+uttarakhand&tag=pahadistore29-21' },
      { name: 'Dhotiyu', nameLocal: 'धोतियु', description: 'कमर पर बांधी जाने वाली धोती', icon: '🪡', buyUrl: 'https://www.amazon.in/s?k=cotton+dhoti+men+white+traditional&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=pahadi+woolen+shawl+handloom+winter&tag=pahadistore29-21',
    items: [
      { name: 'Thulma', nameLocal: 'थुलमा', description: 'मोटा ऊनी कोट — भारी सर्दी में पहनते', icon: '🧥', buyUrl: 'https://www.amazon.in/s?k=handloom+woolen+coat+pahadi&tag=pahadistore29-21' },
      { name: 'Loi Shawl', nameLocal: 'लोई शॉल', description: 'हाथ से बुनी ऊनी शॉल', icon: '🧣', buyUrl: 'https://www.amazon.in/s?k=pahadi+loi+shawl+handwoven+wool&tag=pahadistore29-21' },
      { name: 'Pankhi (Woolen Cap)', nameLocal: 'पांखी (ऊनी टोपी)', description: 'कानों को ढकने वाली ऊनी टोपी', icon: '🧢', buyUrl: 'https://www.amazon.in/s?k=pahadi+woolen+cap+ear+flap+himalayan&tag=pahadistore29-21' },
      { name: 'Pashm Shawl', nameLocal: 'पश्म शॉल', description: 'बकरी के नरम ऊन से बनी महीन शॉल', icon: '🐐', buyUrl: 'https://www.amazon.in/s?k=pashmina+shawl+handmade+himalayan&tag=pahadistore29-21' },
      { name: 'Woolen Socks (Jurabi)', nameLocal: 'ऊनी जुराबी', description: 'हाथ से बुनी रंग-बिरंगी मोज़े', icon: '🧦', buyUrl: 'https://www.amazon.in/s?k=handknit+woolen+socks+pahadi+colorful&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=kumaoni+traditional+women+dress+jewelry&tag=pahadistore29-21',
    items: [
      { name: 'Ghaghra-Angra', nameLocal: 'घाघरा-आंगड़ा', description: 'भारी प्लेटेड स्कर्ट और ब्लाउज़', icon: '👗', buyUrl: 'https://www.amazon.in/s?k=pahadi+ghaghra+traditional+skirt&tag=pahadistore29-21' },
      { name: 'Pichhora', nameLocal: 'पिछौड़ा', description: 'ओढ़नी/दुपट्टा — लाल या पीला', icon: '🧣', buyUrl: 'https://www.amazon.in/s?k=pichhora+pahadi+bridal+dupatta&tag=pahadistore29-21' },
      { name: 'Hansuli', nameLocal: 'हांसुली', description: 'गले का चांदी का भारी आभूषण', icon: '⭕', buyUrl: 'https://www.amazon.in/s?k=hansuli+silver+necklace+traditional&tag=pahadistore29-21' },
      { name: 'Pahunchi', nameLocal: 'पहुंची', description: 'कलाई पर चांदी के चौड़े कड़े', icon: '💫', buyUrl: 'https://www.amazon.in/s?k=pahadi+silver+bangle+traditional+kadaa&tag=pahadistore29-21' },
      { name: 'Bichhiya', nameLocal: 'बिछिया', description: 'पैर की अंगुली में चांदी की अंगूठी', icon: '💍', buyUrl: 'https://www.amazon.in/s?k=bichhiya+silver+toe+ring+traditional&tag=pahadistore29-21' },
      { name: 'Maang Tikka', nameLocal: 'मांग टीका', description: 'माथे पर सोने/चांदी का टीका', icon: '✨', buyUrl: 'https://www.amazon.in/s?k=maang+tikka+traditional+gold+silver&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=kumaoni+men+topi+kurta+traditional&tag=pahadistore29-21',
    items: [
      { name: 'Kurta-Pajama', nameLocal: 'कुर्ता-पजामा', description: 'लंबा सफ़ेद कुर्ता और पजामा', icon: '👔', buyUrl: 'https://www.amazon.in/s?k=white+cotton+kurta+pajama+men&tag=pahadistore29-21' },
      { name: 'Kumaoni Topi', nameLocal: 'कुमाऊँनी टोपी', description: 'गोल टोपी — सफ़ेद या काली', icon: '🧢', buyUrl: 'https://www.amazon.in/s?k=kumaoni+topi+uttarakhand+cap&tag=pahadistore29-21' },
      { name: 'Sadri (Waistcoat)', nameLocal: 'सदरी (वेस्टकोट)', description: 'बिना बांह की जैकेट — त्योहारों पर', icon: '🧥', buyUrl: 'https://www.amazon.in/s?k=nehru+jacket+waistcoat+traditional&tag=pahadistore29-21' },
      { name: 'Chaddar', nameLocal: 'चादर', description: 'कंधे पर डालने वाली ऊनी/सूती चादर', icon: '🧶', buyUrl: 'https://www.amazon.in/s?k=handloom+cotton+chaddar+shawl+men&tag=pahadistore29-21' },
      { name: 'Dhoti', nameLocal: 'धोती', description: 'पारंपरिक धोती — पूजा-पाठ में', icon: '🪡', buyUrl: 'https://www.amazon.in/s?k=pure+cotton+dhoti+men+white&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=jaunsari+traditional+dress+uttarakhand&tag=pahadistore29-21',
    items: [
      { name: 'Dhaatu', nameLocal: 'धातू', description: 'लंबा कुर्ता-जैसा वस्त्र', icon: '👗' },
      { name: 'Ghagri', nameLocal: 'घाघरी', description: 'प्लेटेड स्कर्ट — गहरे रंगों में', icon: '💃' },
      { name: 'Chaundar', nameLocal: 'चौंदर', description: 'ओढ़नी — सिर और कंधे ढकने को', icon: '🧣' },
      { name: 'Bulakh', nameLocal: 'बुलाख', description: 'नाक का बड़ा गहना — जौनसारी पहचान', icon: '💎', buyUrl: 'https://www.amazon.in/s?k=bulak+nose+ring+traditional+silver&tag=pahadistore29-21' },
      { name: 'Chandrahar', nameLocal: 'चंद्रहार', description: 'गले की भारी चांदी/सोने की माला', icon: '📿', buyUrl: 'https://www.amazon.in/s?k=chandrahar+necklace+silver+traditional&tag=pahadistore29-21' },
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
      { name: 'Topi (Jaunsari)', nameLocal: 'टोपी (जौनसारी)', description: 'विशिष्ट फूलदार/रंगीन टोपी', icon: '🎪', buyUrl: 'https://www.amazon.in/s?k=jaunsari+topi+pahadi+cap+colorful&tag=pahadistore29-21' },
      { name: 'Loi (Blanket Shawl)', nameLocal: 'लोई', description: 'भेड़ की ऊन की मोटी शॉल', icon: '🧶', buyUrl: 'https://www.amazon.in/s?k=pahadi+woolen+blanket+shawl+handmade&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=tibetan+woolen+coat+himalayan+handmade&tag=pahadistore29-21',
    items: [
      { name: 'Ranga', nameLocal: 'रंगा', description: 'भेड़ की ऊन का लंबा कोट', icon: '🧥', buyUrl: 'https://www.amazon.in/s?k=himalayan+wool+long+coat+handmade&tag=pahadistore29-21' },
      { name: 'Bakhu (Chuba)', nameLocal: 'बाखू (चुबा)', description: 'तिब्बती शैली का ऊनी गाउन', icon: '👘', buyUrl: 'https://www.amazon.in/s?k=tibetan+chuba+woolen+gown&tag=pahadistore29-21' },
      { name: 'Woolen Boots', nameLocal: 'ऊनी जूते', description: 'भेड़ की खाल से बने गर्म जूते', icon: '🥾', buyUrl: 'https://www.amazon.in/s?k=himalayan+wool+boots+handmade&tag=pahadistore29-21' },
      { name: 'Dhantu', nameLocal: 'धंतू', description: 'महिलाओं का ऊनी ओवरकोट', icon: '🧥' },
      { name: 'Silver Ornaments', nameLocal: 'चांदी के गहने', description: 'भारी चांदी के कंठहार, करधनी', icon: '🪙', buyUrl: 'https://www.amazon.in/s?k=tribal+silver+jewelry+necklace+heavy&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=uttarakhand+handloom+handwoven+fabric&tag=pahadistore29-21',
    items: [
      { name: 'Ringaal Weaving', nameLocal: 'रिंगाल बुनाई', description: 'बांस की बुनाई — टोकरी, चटाई', icon: '🎋', buyUrl: 'https://www.amazon.in/s?k=ringaal+bamboo+basket+uttarakhand&tag=pahadistore29-21' },
      { name: 'Handloom (Khadi)', nameLocal: 'हथकरघा (खादी)', description: 'हाथ से बुना सूती कपड़ा', icon: '🪡', buyUrl: 'https://www.amazon.in/s?k=khadi+handloom+fabric+uttarakhand&tag=pahadistore29-21' },
      { name: 'Eri Silk (Reri)', nameLocal: 'एरी सिल्क (रेरी)', description: 'रेशम कीड़े से बनी रेशमी कपड़ा', icon: '🐛', buyUrl: 'https://www.amazon.in/s?k=eri+silk+fabric+handloom+indian&tag=pahadistore29-21' },
      { name: 'Thulma Wool', nameLocal: 'थुलमा ऊन', description: 'भेड़ की ऊन से बुने मोटे कपड़े', icon: '🐑', buyUrl: 'https://www.amazon.in/s?k=pahadi+sheep+wool+handspun+yarn&tag=pahadistore29-21' },
      { name: 'Aipan Embroidery', nameLocal: 'ऐपण कढ़ाई', description: 'कुमाऊँनी पारंपरिक कढ़ाई शैली', icon: '🎨', buyUrl: 'https://www.amazon.in/s?k=aipan+kumaoni+embroidery+art&tag=pahadistore29-21' },
      { name: 'Pashmina', nameLocal: 'पश्मीना', description: 'चांगथांगी बकरी की महीन ऊन', icon: '🐐', buyUrl: 'https://www.amazon.in/s?k=pashmina+shawl+pure+handmade+himalayan&tag=pahadistore29-21' },
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
    shopUrl: 'https://www.amazon.in/s?k=pahadi+bridal+pichhora+wedding+jewelry&tag=pahadistore29-21',
    items: [
      { name: 'Bridal Pichhora', nameLocal: 'दुल्हन का पिछौड़ा', description: 'लाल/पीला शादी का ओढ़ना — अत्यंत शुभ', icon: '👰', buyUrl: 'https://www.amazon.in/s?k=bridal+pichhora+pahadi+red+yellow&tag=pahadistore29-21' },
      { name: 'Groom Topi & Sherwani', nameLocal: 'दूल्हे की टोपी व शेरवानी', description: 'शादी में पहाड़ी टोपी + शेरवानी', icon: '🤵', buyUrl: 'https://www.amazon.in/s?k=sherwani+men+wedding+pahadi+topi&tag=pahadistore29-21' },
      { name: 'Nath (Bridal)', nameLocal: 'नथ (दुल्हन)', description: 'बड़ी सोने की नथ — दुल्हन की पहचान', icon: '💍', buyUrl: 'https://www.amazon.in/s?k=bridal+nath+gold+plated+traditional+big&tag=pahadistore29-21' },
      { name: 'Mangalsutra', nameLocal: 'मंगलसूत्र', description: 'सुहाग का प्रतीक — काले मोतियों की माला', icon: '📿', buyUrl: 'https://www.amazon.in/s?k=mangalsutra+gold+plated+traditional&tag=pahadistore29-21' },
      { name: 'Gauri-Shankar Mala', nameLocal: 'गौरी-शंकर माला', description: 'रुद्राक्ष की माला — धार्मिक अवसरों पर', icon: '📿', buyUrl: 'https://www.amazon.in/s?k=gauri+shankar+rudraksha+mala&tag=pahadistore29-21' },
      { name: 'Payal / Jhanjhar', nameLocal: 'पायल / झांझर', description: 'पैर में चांदी की पायल — घुंघरू सहित', icon: '🔔', buyUrl: 'https://www.amazon.in/s?k=silver+payal+anklet+ghungroo+traditional&tag=pahadistore29-21' },
    ],
    description: 'शादी-ब्याह मा दुल्हन पिछौड़ा ओढ़दी, नथ पहनदी। दूल्हा पहाड़ी टोपी लगान्द। त्यौहारों मा रंग-बिरंगा पहनावा होंद।',
  },
];

export default PAHADI_PEHNAWA;
