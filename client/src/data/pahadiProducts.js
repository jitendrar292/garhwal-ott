// Pahadi Products — Traditional & homemade pahadi food products of Uttarakhand
// Category-wise: Pisyun Loon (नून), Achar (अचार), Squash, Juice, Jam, Murabba, Chutney, Honey
// Each `buyUrl` points to Amazon.in; affiliate tag is appended automatically via
// withAffiliateTag() in the UI. Keep this file pure data — no React imports here.

const PAHADI_PRODUCTS = [
  // ===== PISYUN LOON / NAMAK =====
  {
    id: 'pisyun-loon',
    title: 'पिस्यूं नून',
    titleEn: 'Pisyun Loon (Pahadi Salt)',
    category: 'Namak',
    emoji: '🧂',
    bg: 'from-amber-700 to-orange-900',
    shopUrl: 'https://www.amazon.in/s?k=pisyun+loon+pahadi+namak+uttarakhand',
    description:
      'सिल-बट्टा पर पीस्या ग्यूं पिस्यूं नून — हर्ब, लहसुन, अदरक, धनिया, भांग, पुदीना, मूली अर हल्दी मिलैक बणैयूं पहाड़ी मसाला नून। रोटी, भात, मूली अर खीरा के साथ चटनी जैसा खाई जांद।',
    items: [
      { name: 'Bhang Loon', nameLocal: 'भांग नून', description: 'भांग के बीज + लहसुन + हरि मिर्च — पारंपरिक पहाड़ी पिस्यूं नून।', icon: '🌿', buyUrl: 'https://www.amazon.in/s?k=bhang+namak+pisyun+loon+uttarakhand' },
      { name: 'Lahsun Loon', nameLocal: 'लहसुन नून', description: 'लहसुन + हरि मिर्च + धनिया का चटपटा नून।', icon: '🧄', buyUrl: 'https://www.amazon.in/s?k=lahsun+namak+pahadi+garlic+salt' },
      { name: 'Pudina Loon', nameLocal: 'पुदीना नून', description: 'सूखे पुदीना + जीरा + काला नमक — पाचक नून।', icon: '🌱', buyUrl: 'https://www.amazon.in/s?k=pudina+namak+mint+salt' },
      { name: 'Til Loon', nameLocal: 'तिल नून', description: 'भुने तिल + हल्दी + नमक — सर्दी के लिए।', icon: '⚪', buyUrl: 'https://www.amazon.in/s?k=til+namak+sesame+salt+uttarakhand' },
      { name: 'Mooli Loon', nameLocal: 'मूली नून', description: 'मूली के पत्ते + लहसुन सहित ताज़ा पिस्यूं नून।', icon: '🥬', buyUrl: 'https://www.amazon.in/s?k=mooli+namak+pahadi' },
      { name: 'Adrak Loon', nameLocal: 'अदरक नून', description: 'सूखा अदरक + काला नमक — गला साफ करण को।', icon: '🫚', buyUrl: 'https://www.amazon.in/s?k=adrak+namak+ginger+salt' },
    ],
  },

  // ===== ACHAR / PICKLES =====
  {
    id: 'pahadi-achar',
    title: 'पहाड़ी अचार',
    titleEn: 'Pahadi Pickles',
    category: 'Achar',
    emoji: '🫙',
    bg: 'from-red-700 to-rose-900',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+achar+uttarakhand+pickle',
    description:
      'सरसों तेल, जखिया अर पहाड़ी मसालों मा बणयूं घर का अचार। गलगल, माल्टा, लिंगुड़ा, तिमरू अर भांग — हर अचार की अपनी कथा छ।',
    items: [
      { name: 'Galgal Achar', nameLocal: 'गलगल अचार', description: 'पहाड़ी जंगली नींबू (गलगल) का खट्टा-तीखा अचार।', icon: '🍋', buyUrl: 'https://www.amazon.in/s?k=galgal+pickle+pahadi+himalayan+lemon' },
      { name: 'Malta Achar', nameLocal: 'माल्टा अचार', description: 'पहाड़ी संतरा माल्टा का मीठा-खट्टा अचार।', icon: '🍊', buyUrl: 'https://www.amazon.in/s?k=malta+pickle+uttarakhand+orange' },
      { name: 'Lingude Achar', nameLocal: 'लिंगुड़ा अचार', description: 'जंगली फर्न (लिंगुड़ा) से बना दुर्लभ पहाड़ी अचार।', icon: '🌿', buyUrl: 'https://www.amazon.in/s?k=lingura+pickle+fiddlehead+fern+uttarakhand' },
      { name: 'Timur Achar', nameLocal: 'तिमरू अचार', description: 'पहाड़ी सिचुआन काली मिर्च (तिमरू) का तीखा अचार।', icon: '⚫', buyUrl: 'https://www.amazon.in/s?k=timur+pickle+sichuan+pepper+uttarakhand' },
      { name: 'Aam Achar', nameLocal: 'आम अचार', description: 'कच्चे आम + सरसों तेल + पहाड़ी मसाले।', icon: '🥭', buyUrl: 'https://www.amazon.in/s?k=mango+pickle+pahadi+homemade' },
      { name: 'Bhang Achar', nameLocal: 'भांग अचार', description: 'भांग के बीज + सरसों तेल — पारंपरिक चटनी-अचार।', icon: '🌱', buyUrl: 'https://www.amazon.in/s?k=bhang+pickle+hemp+seed+uttarakhand' },
      { name: 'Mooli Achar', nameLocal: 'मूली अचार', description: 'पहाड़ी मूली + अदरक + नींबू का करारा अचार।', icon: '🥬', buyUrl: 'https://www.amazon.in/s?k=mooli+pickle+radish+pahadi' },
      { name: 'Nimbu Achar', nameLocal: 'नींबू अचार', description: 'धूप मा सुखयूं नींबू अचार — हजम के लिए।', icon: '🍋', buyUrl: 'https://www.amazon.in/s?k=nimbu+pickle+pahadi+lemon' },
    ],
  },

  // ===== SQUASH =====
  {
    id: 'pahadi-squash',
    title: 'पहाड़ी स्क्वैश',
    titleEn: 'Pahadi Squash',
    category: 'Squash',
    emoji: '🥤',
    bg: 'from-pink-700 to-fuchsia-900',
    shopUrl: 'https://www.amazon.in/s?k=buransh+squash+uttarakhand+himalayan',
    description:
      'पहाड़ की जंगली फूल अर फलों से बणयूं प्राकृतिक स्क्वैश। पाणी मा मिलैक ठंडा पेय — गर्मियों मा अमृत समान।',
    items: [
      { name: 'Buransh Squash', nameLocal: 'बुरांश स्क्वैश', description: 'रोडोडेंड्रोन (बुरांश) फूल से बना दिल को फायदा करने वाला स्क्वैश।', icon: '🌺', buyUrl: 'https://www.amazon.in/s?k=buransh+squash+rhododendron+himalayan' },
      { name: 'Malta Squash', nameLocal: 'माल्टा स्क्वैश', description: 'पहाड़ी संतरा (माल्टा) से बना खट्टा-मीठा स्क्वैश।', icon: '🍊', buyUrl: 'https://www.amazon.in/s?k=malta+squash+uttarakhand+orange' },
      { name: 'Kafal Squash', nameLocal: 'काफल स्क्वैश', description: 'दुर्लभ पहाड़ी फल काफल से बना सीज़नल स्क्वैश।', icon: '🍒', buyUrl: 'https://www.amazon.in/s?k=kafal+squash+bayberry+himalayan' },
      { name: 'Hisalu Squash', nameLocal: 'हिसालू स्क्वैश', description: 'पीला पहाड़ी रसभरी (हिसालू) से बना स्क्वैश।', icon: '🟡', buyUrl: 'https://www.amazon.in/s?k=hisalu+squash+himalayan+raspberry' },
      { name: 'Aadu Squash', nameLocal: 'आड़ू स्क्वैश', description: 'पहाड़ी आड़ू (पीच) का ताज़ा स्क्वैश।', icon: '🍑', buyUrl: 'https://www.amazon.in/s?k=peach+squash+pahadi+aadu' },
      { name: 'Pulam Squash', nameLocal: 'पुलम स्क्वैश', description: 'पहाड़ी पुलम (आलूबुखारा) से बना स्क्वैश।', icon: '🟣', buyUrl: 'https://www.amazon.in/s?k=plum+squash+pahadi+pulam' },
    ],
  },

  // ===== JUICE =====
  {
    id: 'pahadi-juice',
    title: 'पहाड़ी जूस',
    titleEn: 'Pahadi Juice',
    category: 'Juice',
    emoji: '🧃',
    bg: 'from-orange-700 to-red-900',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+juice+uttarakhand+himalayan+fruit',
    description:
      'सीधा फल से निकयूं ताज़ा पहाड़ी जूस — कोई preservative नी, कोई एक्स्ट्रा शक्कर नी। शरीर को ताकत अर इम्यूनिटी देणे वाला।',
    items: [
      { name: 'Buransh Juice', nameLocal: 'बुरांश जूस', description: 'दिल अर रक्त के लिए लाभदायक बुरांश फूल का जूस।', icon: '🌺', buyUrl: 'https://www.amazon.in/s?k=buransh+juice+rhododendron' },
      { name: 'Malta Juice', nameLocal: 'माल्टा जूस', description: 'विटामिन-C भरपूर पहाड़ी संतरा का ताज़ा जूस।', icon: '🍊', buyUrl: 'https://www.amazon.in/s?k=malta+juice+himalayan+orange' },
      { name: 'Aamla Juice', nameLocal: 'आंवला जूस', description: 'पहाड़ी आंवला — बाल अर इम्यूनिटी के लिए।', icon: '🟢', buyUrl: 'https://www.amazon.in/s?k=amla+juice+pahadi+himalayan' },
      { name: 'Buransh-Honey Juice', nameLocal: 'बुरांश-शहद जूस', description: 'बुरांश + पहाड़ी शहद का स्वास्थ्यवर्धक मेल।', icon: '🍯', buyUrl: 'https://www.amazon.in/s?k=buransh+honey+juice+himalayan' },
      { name: 'Apricot Juice', nameLocal: 'चुलू जूस', description: 'पहाड़ी खुबानी (चुलू) से बना मीठा-खट्टा जूस।', icon: '🍑', buyUrl: 'https://www.amazon.in/s?k=apricot+juice+pahadi+chulu' },
      { name: 'Sea Buckthorn Juice', nameLocal: 'लेह बेरी जूस', description: 'हिमालयी सी-बकथॉर्न — विटामिन का खज़ाना।', icon: '🟠', buyUrl: 'https://www.amazon.in/s?k=sea+buckthorn+juice+himalayan+leh' },
    ],
  },

  // ===== JAM =====
  {
    id: 'pahadi-jam',
    title: 'पहाड़ी जैम',
    titleEn: 'Pahadi Jam',
    category: 'Jam',
    emoji: '🍓',
    bg: 'from-rose-700 to-pink-900',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+jam+uttarakhand+himalayan+fruit',
    description:
      'पहाड़ की जंगली बेरी अर फलों से बणयूं घर का जैम — कम चीनी, ज़्यादा फल। रोटी, ब्रेड अर परांठा के साथ शानदार।',
    items: [
      { name: 'Buransh Jam', nameLocal: 'बुरांश जैम', description: 'बुरांश फूल की पंखुड़ियों से बना अनूठा जैम।', icon: '🌺', buyUrl: 'https://www.amazon.in/s?k=buransh+jam+rhododendron+himalayan' },
      { name: 'Kafal Jam', nameLocal: 'काफल जैम', description: 'सीज़नल पहाड़ी फल काफल का दुर्लभ जैम।', icon: '🍒', buyUrl: 'https://www.amazon.in/s?k=kafal+jam+himalayan+bayberry' },
      { name: 'Hisalu Jam', nameLocal: 'हिसालू जैम', description: 'पीला पहाड़ी रसभरी (हिसालू) से बना जैम।', icon: '🟡', buyUrl: 'https://www.amazon.in/s?k=hisalu+jam+himalayan+raspberry' },
      { name: 'Apricot Jam', nameLocal: 'चुलू जैम', description: 'पहाड़ी खुबानी (चुलू) का मीठा जैम।', icon: '🍑', buyUrl: 'https://www.amazon.in/s?k=apricot+jam+pahadi+chulu' },
      { name: 'Pulam Jam', nameLocal: 'पुलम जैम', description: 'पहाड़ी पुलम (प्लम) से बना खट्टा-मीठा जैम।', icon: '🟣', buyUrl: 'https://www.amazon.in/s?k=plum+jam+pahadi+pulam' },
      { name: 'Malta Marmalade', nameLocal: 'माल्टा मार्मलेड', description: 'पहाड़ी संतरा की छिलके सहित मार्मलेड।', icon: '🍊', buyUrl: 'https://www.amazon.in/s?k=malta+marmalade+pahadi+orange' },
    ],
  },

  // ===== MURABBA =====
  {
    id: 'pahadi-murabba',
    title: 'पहाड़ी मुरब्बा',
    titleEn: 'Pahadi Murabba',
    category: 'Murabba',
    emoji: '🍯',
    bg: 'from-amber-600 to-orange-800',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+murabba+uttarakhand',
    description:
      'धीमी आंच मा चाशनी मा पकयूं पहाड़ी फल — मुरब्बा सेहत के लिए भी अर स्वाद के लिए भी। दादी-नानी की रसोई की पुरानी कला।',
    items: [
      { name: 'Aamla Murabba', nameLocal: 'आंवला मुरब्बा', description: 'पहाड़ी आंवला + केसर — आँख अर बाल के लिए।', icon: '🟢', buyUrl: 'https://www.amazon.in/s?k=amla+murabba+pahadi+himalayan' },
      { name: 'Adrak Murabba', nameLocal: 'अदरक मुरब्बा', description: 'सर्दी-खांसी का घरेलू इलाज।', icon: '🫚', buyUrl: 'https://www.amazon.in/s?k=ginger+murabba+adrak+pahadi' },
      { name: 'Bel Murabba', nameLocal: 'बेल मुरब्बा', description: 'पेट की समस्या के लिए लाभदायक बेल फल का मुरब्बा।', icon: '🟤', buyUrl: 'https://www.amazon.in/s?k=bel+murabba+wood+apple' },
      { name: 'Aam Murabba', nameLocal: 'आम मुरब्बा', description: 'कच्चे आम का पारंपरिक मुरब्बा।', icon: '🥭', buyUrl: 'https://www.amazon.in/s?k=aam+murabba+mango+pahadi' },
      { name: 'Harad Murabba', nameLocal: 'हरड़ मुरब्बा', description: 'पाचन ठीक करने वाला आयुर्वेदिक मुरब्बा।', icon: '🟫', buyUrl: 'https://www.amazon.in/s?k=harad+murabba+ayurvedic' },
    ],
  },

  // ===== CHUTNEY =====
  {
    id: 'pahadi-chutney',
    title: 'पहाड़ी चटनी',
    titleEn: 'Pahadi Chutney',
    category: 'Chutney',
    emoji: '🥣',
    bg: 'from-emerald-700 to-green-900',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+chutney+uttarakhand',
    description:
      'सिल-बट्टा पर ताज़ा पिस्यूं पहाड़ी चटनी। भांग, तिल, लहसुन, धनिया — पहाड़ की हर रसोई की पहचान। रोटी, भात अर मंडवे की रोटी के साथ।',
    items: [
      { name: 'Bhang Chutney', nameLocal: 'भांग चटनी', description: 'भुने भांग के बीज + हरि मिर्च — Uttarakhand की GI-tagged चटनी।', icon: '🌿', buyUrl: 'https://www.amazon.in/s?k=bhang+chutney+hemp+seed+uttarakhand' },
      { name: 'Til Chutney', nameLocal: 'तिल चटनी', description: 'भुने तिल + लहसुन + हरि मिर्च — सर्दी के लिए।', icon: '⚪', buyUrl: 'https://www.amazon.in/s?k=til+chutney+sesame+pahadi' },
      { name: 'Lahsun Chutney', nameLocal: 'लहसुन चटनी', description: 'सूखा लहसुन + लाल मिर्च + नमक।', icon: '🧄', buyUrl: 'https://www.amazon.in/s?k=lahsun+chutney+garlic+pahadi' },
      { name: 'Hari Mirch Chutney', nameLocal: 'हरि मिर्च चटनी', description: 'पहाड़ी हरि मिर्च + पुदीना + धनिया।', icon: '🌶️', buyUrl: 'https://www.amazon.in/s?k=green+chilli+chutney+pahadi' },
      { name: 'Timur Chutney', nameLocal: 'तिमरू चटनी', description: 'पहाड़ी काली मिर्च (तिमरू) + नींबू — सिक्किम-नेपाल जैसी।', icon: '⚫', buyUrl: 'https://www.amazon.in/s?k=timur+chutney+sichuan+pepper' },
    ],
  },

  // ===== HONEY =====
  {
    id: 'pahadi-shahad',
    title: 'पहाड़ी शहद',
    titleEn: 'Pahadi Honey',
    category: 'Honey',
    emoji: '🍯',
    bg: 'from-yellow-600 to-amber-800',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+honey+uttarakhand+himalayan+raw',
    description:
      'हिमालय की जंगली मधुमक्खी अर बुरांश-लीची फूलों से इकट्ठा कयूं शुद्ध पहाड़ी शहद। कोई मिलावट नी, कोई processing नी — सिर्फ शुद्ध मधु।',
    items: [
      { name: 'Buransh Honey', nameLocal: 'बुरांश शहद', description: 'बुरांश फूल से इकट्ठा कयूं दुर्लभ शहद।', icon: '🌺', buyUrl: 'https://www.amazon.in/s?k=buransh+honey+rhododendron' },
      { name: 'Multiflora Honey', nameLocal: 'जंगली शहद', description: 'हिमालयी जंगल के अनेक फूलों से शहद।', icon: '🌸', buyUrl: 'https://www.amazon.in/s?k=himalayan+multiflora+honey+raw' },
      { name: 'Wild Forest Honey', nameLocal: 'जंगली वन शहद', description: 'जंगल की पुरानी मधुमक्खियों का शहद।', icon: '🐝', buyUrl: 'https://www.amazon.in/s?k=wild+forest+honey+himalayan' },
      { name: 'Sidr Honey', nameLocal: 'सिद्र शहद', description: 'सिद्र (बेर) के फूलों से बना औषधीय शहद।', icon: '🟤', buyUrl: 'https://www.amazon.in/s?k=sidr+honey+himalayan+raw' },
      { name: 'Honey with Ginger', nameLocal: 'अदरक शहद', description: 'अदरक + शहद — सर्दी-खांसी के लिए।', icon: '🫚', buyUrl: 'https://www.amazon.in/s?k=ginger+honey+pahadi+himalayan' },
    ],
  },

  // ===== GHEE =====
  {
    id: 'pahadi-ghee',
    title: 'पहाड़ी घी',
    titleEn: 'Pahadi Ghee',
    category: 'Ghee',
    emoji: '🧈',
    bg: 'from-yellow-700 to-amber-900',
    shopUrl: 'https://www.amazon.in/s?k=pahadi+ghee+uttarakhand+bilona+desi',
    description:
      'पहाड़ की गाय अर भैंस के दूध से बिलोणा विधि से बणयूं शुद्ध देसी घी। हाथ से मथयूं मक्खन धीमी आंच मा पकाक — पुरानी पीढ़ियों की रसोई की पहचान।',
    items: [
      { name: 'Gai Ghee (A2 Bilona)', nameLocal: 'गाय का घी (A2 बिलोणा)', description: 'A2 देसी गाय के दूध से बिलोणा विधि से बनाया सोने जैसा घी।', icon: '🐄', buyUrl: 'https://www.amazon.in/s?k=a2+cow+ghee+bilona+pahadi+desi' },
      { name: 'Bhains Ghee', nameLocal: 'भैंस का घी', description: 'भैंस के गाढ़े दूध से बना मलाईदार सफेद घी।', icon: '🐃', buyUrl: 'https://www.amazon.in/s?k=buffalo+ghee+desi+pahadi+pure' },
      { name: 'Pahadi Gai Ghee', nameLocal: 'पहाड़ी गाय घी', description: 'बद्री गाय (पहाड़ी देशी नस्ल) के दूध से दुर्लभ घी।', icon: '🏔️', buyUrl: 'https://www.amazon.in/s?k=badri+cow+ghee+pahadi+uttarakhand' },
      { name: 'Jersey Cow Ghee', nameLocal: 'जर्सी गाय घी', description: 'जर्सी गाय के दूध से बना मीठी खुशबू वाला घी।', icon: '🥛', buyUrl: 'https://www.amazon.in/s?k=jersey+cow+ghee+desi+pure' },
      { name: 'Mixed Bilona Ghee', nameLocal: 'मिश्रित बिलोणा घी', description: 'गाय + भैंस के दूध का बैलेंस्ड बिलोणा घी।', icon: '🫕', buyUrl: 'https://www.amazon.in/s?k=bilona+ghee+mixed+pahadi+desi' },
      { name: 'Organic Cow Ghee', nameLocal: 'ऑर्गेनिक गाय घी', description: 'घास चराई गई गायों के दूध से ऑर्गेनिक घी।', icon: '🌾', buyUrl: 'https://www.amazon.in/s?k=organic+cow+ghee+grassfed+pahadi' },
    ],
  },
];

export default PAHADI_PRODUCTS;
