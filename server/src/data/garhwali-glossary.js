// Curated Garhwali vocabulary & cultural reference data for RAG injection.
// Each entry: { gw (Garhwali), hi (Hindi), en (English), tags (search keywords), note (optional) }
// Add new words/phrases here — they'll automatically be matched & passed to the AI.

module.exports = [
  // ===== Common verbs / pronouns =====
  { gw: 'च', hi: 'है', en: 'is', tags: ['है', 'is', 'hai'] },
  { gw: 'छन', hi: 'हैं', en: 'are', tags: ['हैं', 'are'] },
  { gw: 'छौं', hi: 'हूँ', en: 'I am', tags: ['हूँ', 'main', 'i am'] },
  { gw: 'तुम', hi: 'आप', en: 'you', tags: ['आप', 'tum', 'you'] },
  { gw: 'हम', hi: 'हम', en: 'we', tags: ['हम', 'we'] },
  { gw: 'मैं', hi: 'मैं', en: 'I', tags: ['मैं', 'main', 'i'] },
  { gw: 'कख', hi: 'कहाँ', en: 'where', tags: ['कहाँ', 'kaha', 'where'] },
  { gw: 'कन', hi: 'कैसे/कैसा', en: 'how', tags: ['कैसे', 'कैसा', 'kaise', 'how'] },
  { gw: 'कब', hi: 'कब', en: 'when', tags: ['कब', 'when'] },
  { gw: 'क्या', hi: 'क्या', en: 'what', tags: ['क्या', 'kya', 'what'] },
  { gw: 'किलैक', hi: 'क्यों', en: 'why', tags: ['क्यों', 'kyon', 'why'] },
  { gw: 'जाण', hi: 'जाना', en: 'to go', tags: ['जाना', 'jana', 'go'] },
  { gw: 'आण', hi: 'आना', en: 'to come', tags: ['आना', 'aana', 'come'] },
  { gw: 'करण', hi: 'करना', en: 'to do', tags: ['करना', 'karna', 'do'] },
  { gw: 'बोलण / बल्याण', hi: 'बोलना', en: 'to speak', tags: ['बोलना', 'bolna', 'speak'] },
  { gw: 'खाण', hi: 'खाना', en: 'to eat', tags: ['खाना खाना', 'khana khana', 'eat'] },
  { gw: 'पीण', hi: 'पीना', en: 'to drink', tags: ['पीना', 'peena', 'drink'] },
  { gw: 'देखण', hi: 'देखना', en: 'to see', tags: ['देखना', 'dekhna', 'see'] },

  // ===== Greetings & courtesy =====
  { gw: 'जय भारत माता / नमस्कार', hi: 'नमस्ते', en: 'hello', tags: ['नमस्ते', 'namaste', 'hello', 'hi'] },
  { gw: 'ज्यूँ रै, जियाण रै, खुश रै', hi: 'जीते रहो, लंबी उम्र पाओ, खुश रहो (आशीर्वाद)', en: 'live long, prosper, be happy (blessing)', tags: ['blessing', 'jiyo', 'aashirwad', 'आशीर्वाद'] },
  { gw: 'धन्यवाद / थैंक्यू', hi: 'धन्यवाद', en: 'thank you', tags: ['धन्यवाद', 'thanks', 'thank you', 'shukriya'] },
  { gw: 'कन छन?', hi: 'कैसे हो?', en: 'how are you', tags: ['कैसे हो', 'how are you', 'kaise ho'] },
  { gw: 'भलि च', hi: 'अच्छा है / ठीक है', en: 'good / fine', tags: ['अच्छा', 'ठीक', 'good', 'fine', 'accha'] },

  // ===== Family =====
  { gw: 'बाबा / बौज्यू', hi: 'पिता', en: 'father', tags: ['पिता', 'father', 'papa', 'dad'] },
  { gw: 'ब्वै / ब्वारि', hi: 'माँ / बहू', en: 'mother / daughter-in-law', tags: ['माँ', 'mother', 'mom', 'बहू'] },
  { gw: 'नाति', hi: 'पोता / बेटा', en: 'grandson / son', tags: ['पोता', 'बेटा', 'son', 'grandson'] },
  { gw: 'दीदी', hi: 'बड़ी बहन', en: 'elder sister', tags: ['बहन', 'sister', 'didi'] },
  { gw: 'भुला', hi: 'छोटा भाई', en: 'younger brother', tags: ['भाई', 'brother', 'bhai'] },
  { gw: 'दाज्यू', hi: 'बड़ा भाई', en: 'elder brother', tags: ['बड़ा भाई', 'elder brother', 'dajyu'] },
  { gw: 'काका / काकी', hi: 'चाचा / चाची', en: 'uncle / aunt', tags: ['चाचा', 'चाची', 'uncle', 'aunt'] },
  { gw: 'घौर / घर', hi: 'घर', en: 'home', tags: ['घर', 'home', 'ghar'] },

  // ===== Food =====
  // Broad overview entry — fires for open-ended "गढ़वाली खाना" / "Garhwali food"
  // queries so the LLM has a grounded list of authentic dishes with their real
  // main ingredients (not copy-pasted "wheat + curd + spices" hallucinations).
  { gw: 'गढ़वाली खाणा / पहाड़क खाणा', hi: 'गढ़वाल का पारंपरिक भोजन — मोटे अनाज, स्थानीय दालें, जंगली साग पर आधारित', en: 'Garhwali traditional cuisine — based on millets, local pulses and wild greens', tags: ['गढ़वाली खाना', 'गढ़वाली खाणा', 'पहाड़ी खाना', 'pahadi food', 'garhwali food', 'cuisine', 'व्यंजन', 'खाणा', 'khana', 'food', 'भोजन', 'पहाड़क खाणा'], note: 'AUTHENTIC GARHWALI DISHES — use these facts verbatim, never invent recipes: (1) मंडुवा/कोदा कि रोटि — finger-millet (ragi) flatbread, hand-patted on tava, eaten with ghee. (2) झंगोरा — barnyard millet; cooked as kheer (with milk + jaggery) or as khichdi. (3) फाणु — gahat (horse-gram/kulthi) dal soaked overnight, ground to paste, slow-cooked thin curry. (4) चैंसू — black-gram (urad) DRY-ROASTED, then ground, cooked thick with ghee/hing/jakhya. (5) कापा/काफुली — palak/methi/lingura greens cooked with mandua-flour slurry; STRICTLY VEGETARIAN. (6) गहत कि दाल — whole horse-gram lentil soup with ginger-garlic-jeera tadka. (7) आलू का गुटखा — boiled potatoes tossed in mustard oil, jakhya, red chilli, coriander. (8) बाडि — mandua flour stirred into hot salted water till firm; eaten with phaanu/kafuli. (9) अरसा — deep-fried sweet from rice-flour + jaggery (festival treat). (10) सिंगौड़ी — milk-cardamom sweet wrapped in malu leaf (Kumaon). KEY FACTS: Garhwali kitchen barely uses curd or wheat-based gravies; it is built on millets (मंडुवा/झंगोरा), pulses (गहत/उरद/भट्ट), wild greens, ghee, and the signature spice जखिया. Tempering is jakhya/jeera/hing, not garam-masala. NEVER describe multiple dishes with identical "wheat + curd + spices" ingredients — that is wrong for every dish above.' },
  { gw: 'मंडुवा / कोदा', hi: 'रागी / फिंगर मिलेट', en: 'finger millet (ragi)', tags: ['रागी', 'मंडुवा', 'ragi', 'millet', 'koda'] },
  { gw: 'झंगोरा', hi: 'सावां चावल / बार्नयार्ड बाजरा', en: 'barnyard millet', tags: ['झंगोरा', 'jhangora', 'savan'] },
  { gw: 'फाणु', hi: 'गहत (कुलथी) कि भीगी-पीसी पारंपरिक दाल — पतली ग्रेवी, जखिया का तड़का', en: 'Phaanu — horse-gram (gahat/kulthi) dal soaked overnight, ground to paste, then slow-cooked into a thin curry. NEVER uses chickpea (chana) flour or wheat flour.', tags: ['फाणु', 'फाणू', 'phaanu', 'phanu', 'faanu', 'gahat', 'गहत', 'kulthi', 'horse gram', 'dal', 'food', 'recipe'], note: 'फाणु recipe (authentic): गहत (कुलथी) तै रात भर पाणि म भिगौ। सुबेर पीसिक पतलु पेस्ट बणौ। कढ़ै म घी/तेल, जखिया, हिंग, अदरक, लसुण कु तड़का लगौ। पेस्ट डाऴ, खूब पाणि मिलै, हल्दी-नौण-धनिया डाऴिक 30-40 मिनट तक धीमी आँच म पकौ। भात या मंडुवा कि रोटि सँग खांदा। NEVER made from chana dal or wheat flour — that is a hallucination.' },
  { gw: 'बाडि / बाड़ी', hi: 'मंडुवा (रागी) के आटे का गाढ़ा नमकीन हलवा — सब्जी या दाल के साथ', en: 'Baadi — thick savoury porridge made by stirring finger-millet (mandua/ragi) flour into hot water until firm. Eaten with phaanu, kafuli or any local curry.', tags: ['बाडि', 'बाड़ी', 'baadi', 'badi', 'mandua', 'मंडुवा', 'ragi', 'finger millet', 'food', 'recipe'], note: 'बाडि recipe (authentic): एक भगौणि म पाणि उबाऴ, थोड़ु नौण डाऴ। मंडुवा कु आटु धीरे-धीरे डाऴिक लगातार चलांद रौ — गुठाण नी पड़ण चैंदा। आटु पकि-पकिक गाढ़ु ह्वै जाद, चम्मच सँग साँचु म ढाऴ या प्लेट म फैलै द्या। ऊपर सी देशी घी डाऴिक फाणु, काफुली या गहत कि दाल सँग खा। NEVER made with curd or wheat — only mandua flour and water.' },
  { gw: 'काफुली / कापा', hi: 'पालक, मेथी, लिंगुड़ा जन हरी पत्तेदार सब्जियूं औ मंडुवा/गेहूं का आटा सी बण्यां पारंपरिक गढ़वळि करी (शुद्ध शाकाहारी — मांस सी कभी नी बणदु)', en: 'Traditional Garhwali curry made from green leafy vegetables (spinach, fenugreek, lingura) thickened with finger-millet or wheat flour. Strictly VEGETARIAN — never made with meat.', tags: ['काफुली', 'कापा', 'kafuli', 'kapa', 'kaapa', 'पालक', 'spinach', 'मेथी', 'लिंगुड़ा', 'fenugreek', 'curry', 'vegetarian', 'food'], note: 'IMPORTANT: कापा / काफुली is a vegetarian dish — greens (पालक/मेथी/लिंगुड़ा) cooked with finger-millet (मंडुवा) or wheat flour as thickener, tempered with ghee, garlic, ginger, jakhya/jeera. Never contains meat. Often confused by AI with non-veg dishes — DO NOT make that mistake.' },
  { gw: 'गहत', hi: 'कुलथी दाल', en: 'horse gram', tags: ['गहत', 'gahat', 'kulthi', 'horse gram'] },
  { gw: 'चैंसू / चैनसू', hi: 'काले उरद कि भुनी-पीसी पारंपरिक गाढ़ी दाल — जखिया-घी का तड़का', en: 'Chainsu — roasted-and-ground black gram (urad) lentil curry, slow-cooked thick, tempered with ghee, hing and jakhya. NEVER made with wheat flour or curd.', tags: ['चैंसू', 'चैनसू', 'चैन्सू', 'chainsu', 'chainsoo', 'chainsoo', 'chensu', 'urad', 'urd', 'काला उरद', 'black gram', 'dal', 'food', 'recipe'], note: 'चैंसू recipe (authentic): काला उरद दाऴ तै सूखा तावा म भून, ठंडु करिक मिक्सी म बारीक पीस। कढ़ै म घी गरम करिक हिंग, जीरु, जखिया, लसुण-अदरक डाऴ। पीस्यूं दाऴ कु पाउडर डाऴ, धीमी आँच म लगातार चलांद रौ। थोड़ु-थोड़ु पाणि डाऴिक उबाऴ, हल्दी-नौण मिलै, 15-20 मिनट पकौ। भात या मंडुवा कि रोटि सँग खांदा। NEVER contains wheat flour, curd or yoghurt — that is a hallucination AI must not make.' },
  { gw: 'अरसा', hi: 'पारंपरिक मीठा पकवान (चावल का)', en: 'traditional rice-jaggery sweet', tags: ['अरसा', 'arsa', 'sweet', 'मिठाई'] },
  { gw: 'बेड़ु पाको', hi: 'गढ़वाली अनार/फल और प्रसिद्ध लोकगीत', en: 'Garhwali pomegranate & famous folk song', tags: ['बेड़ु पाको', 'bedu pako', 'फल'] },
  { gw: 'सिंगोरी / सिंगौड़ी', hi: 'मलाई और चीनी का मिठाई', en: 'cone-shaped milk-cardamom sweet from Kumaon', tags: ['सिंगोरी', 'singori', 'sweet'] },

  // ===== Festivals =====
  { gw: 'हरेला', hi: 'हरेला त्योहार — बीज बोने और पर्यावरण का त्योहार (श्रावण)', en: 'Harela — green festival in Shravan, sowing seeds; symbolizes nature & prosperity', tags: ['हरेला', 'harela', 'festival', 'त्योहार', 'पर्यावरण'] },
  { gw: 'फूल देई', hi: 'फूल देई — चैत्र मास का त्योहार जब बच्चे घरों की चौखट पर फूल रखते हैं', en: 'Phool Dei — Chaitra festival; children place flowers on doorsteps', tags: ['फूल देई', 'phool dei', 'चैत्र', 'flowers'] },
  { gw: 'बिखोति', hi: 'बैसाखी / बिखोति — बैशाख संक्रांति', en: 'Bikhoti — Baisakh Sankranti new-year festival', tags: ['बिखोति', 'bikhoti', 'baisakh', 'बैसाखी'] },
  { gw: 'इगास', hi: 'इगास बग्वाल — बूढ़ी दिवाली', en: 'Igas Bagwal — Garhwali Diwali celebrated 11 days after main Diwali', tags: ['इगास', 'igas', 'bagwal', 'बग्वाल', 'दिवाली', 'diwali'] },
  { gw: 'घी संक्रांति / ओलगिया', hi: 'सावन संक्रांति — घी खाने का त्योहार', en: 'Ghee Sankranti — Shravan festival of eating ghee', tags: ['घी संक्रांति', 'olgia', 'ओलगिया', 'sankranti'] },

  // ===== Places =====
  { gw: 'केदारनाथ', hi: 'केदारनाथ धाम — चार धाम में से एक, रुद्रप्रयाग ज़िला', en: 'Kedarnath — Lord Shiva temple in Rudraprayag, one of Char Dham', tags: ['केदारनाथ', 'kedarnath', 'char dham', 'shiva'] },
  { gw: 'बद्रीनाथ', hi: 'बद्रीनाथ धाम — विष्णु मंदिर, चमोली', en: 'Badrinath — Vishnu temple in Chamoli, one of Char Dham', tags: ['बद्रीनाथ', 'badrinath', 'char dham', 'vishnu'] },
  { gw: 'गंगोत्री', hi: 'गंगोत्री — गंगा नदी का उद्गम, उत्तरकाशी', en: 'Gangotri — origin of river Ganga in Uttarkashi', tags: ['गंगोत्री', 'gangotri', 'ganga'] },
  { gw: 'यमुनोत्री', hi: 'यमुनोत्री — यमुना नदी का उद्गम', en: 'Yamunotri — origin of river Yamuna', tags: ['यमुनोत्री', 'yamunotri', 'yamuna'] },
  { gw: 'औली', hi: 'औली — स्कीइंग के लिए प्रसिद्ध हिल स्टेशन, चमोली', en: 'Auli — famous skiing destination in Chamoli', tags: ['औली', 'auli', 'skiing', 'snow'] },
  { gw: 'देहरादून', hi: 'देहरादून — उत्तराखंड की राजधानी', en: 'Dehradun — capital of Uttarakhand', tags: ['देहरादून', 'dehradun', 'capital'] },
  { gw: 'ऋषिकेश', hi: 'ऋषिकेश — योग नगरी, गंगा किनारे', en: 'Rishikesh — yoga capital on the Ganga', tags: ['ऋषिकेश', 'rishikesh', 'yoga', 'rafting'] },
  { gw: 'मसूरी', hi: 'मसूरी — पहाड़ों की रानी', en: 'Mussoorie — Queen of the Hills', tags: ['मसूरी', 'mussoorie', 'hill station'] },
  { gw: 'नैनीताल', hi: 'नैनीताल — झीलों का शहर, कुमाऊँ', en: 'Nainital — lake city in Kumaon', tags: ['नैनीताल', 'nainital', 'lake'] },
  { gw: 'चोपता', hi: 'चोपता — मिनी स्विट्जरलैंड, तुंगनाथ बेस', en: 'Chopta — Mini Switzerland, base for Tungnath trek', tags: ['चोपता', 'chopta', 'tungnath'] },

  // ===== Folk artists & music =====
  { gw: 'नरेंद्र सिंह नेगी', hi: 'नरेंद्र सिंह नेगी — गढ़वाली लोकसंगीत के पितामह, "नौछमी नारैणा" जैसे प्रसिद्ध गीत', en: 'Narendra Singh Negi — legendary Garhwali folk singer, songs like Nauchhami Narayana', tags: ['नरेंद्र सिंह नेगी', 'narendra singh negi', 'negi', 'folk', 'गायक', 'singer'] },
  { gw: 'जुबिन नौटियाल', hi: 'जुबिन नौटियाल — देहरादून का प्रसिद्ध बॉलीवुड गायक', en: 'Jubin Nautiyal — Bollywood playback singer from Dehradun', tags: ['जुबिन नौटियाल', 'jubin nautiyal', 'bollywood', 'singer'] },
  { gw: 'पांडवाज़', hi: 'पांडवाज़ — गढ़वाली फ्यूज़न बैंड', en: 'Pandavaas — Garhwali fusion music band', tags: ['पांडवाज़', 'pandavaas', 'pandavas', 'band'] },
  { gw: 'जागर', hi: 'जागर — पारंपरिक देवी-देवताओं को जगाने का लोकसंगीत', en: 'Jaagar — folk ritual music to invoke deities', tags: ['जागर', 'jaagar', 'jagar', 'folk', 'ritual', 'देवता'] },
  { gw: 'मांगल', hi: 'मांगल गीत — शुभ अवसरों के पारंपरिक गढ़वाली गीत', en: 'Mangal geet — auspicious traditional Garhwali songs sung at weddings', tags: ['मांगल', 'mangal geet', 'wedding', 'शादी'] },
  { gw: 'चौंफला / थड्या', hi: 'चौंफला, थड्या — पारंपरिक गढ़वाली नृत्य', en: 'Chaunphula, Thadya — traditional Garhwali folk dances', tags: ['चौंफला', 'थड्या', 'chaunphula', 'thadya', 'dance', 'नृत्य'] },

  // ===== Misc cultural =====
  { gw: 'देवभूमि', hi: 'देवभूमि — देवताओं की भूमि (उत्तराखंड का उपनाम)', en: 'Devbhoomi — Land of the Gods (epithet of Uttarakhand)', tags: ['देवभूमि', 'devbhoomi', 'uttarakhand', 'उत्तराखंड'] },
  { gw: 'पहाड़', hi: 'पहाड़ / पर्वत', en: 'mountain', tags: ['पहाड़', 'पर्वत', 'pahad', 'mountain'] },
  { gw: 'गाड़ / गधेरु', hi: 'पहाड़ी नदी / नाला', en: 'mountain stream', tags: ['नदी', 'नाला', 'river', 'stream', 'gad'] },
  { gw: 'बुग्याल', hi: 'ऊँचे पहाड़ी घास के मैदान', en: 'high-altitude alpine meadows', tags: ['बुग्याल', 'bugyal', 'meadow', 'alpine'] },
  { gw: 'टिहरी', hi: 'टिहरी ज़िला और टिहरी बाँध', en: 'Tehri district & Tehri Dam', tags: ['टिहरी', 'tehri', 'dam'] },
  { gw: 'गढ़वाल', hi: 'गढ़वाल मंडल', en: 'Garhwal region of Uttarakhand', tags: ['गढ़वाल', 'garhwal'] },
  { gw: 'कुमाऊँ', hi: 'कुमाऊँ मंडल', en: 'Kumaon region of Uttarakhand', tags: ['कुमाऊँ', 'kumaon', 'kumaoni'] },

  // ===== Flowers & Plants (पहाड़ी फूल अर पौधा) =====
  { gw: 'फ्यूँली', hi: 'फ्यूँली — छोटू पीळू फूल, बसंत ऋतु मा पहाड़ का डांडि-कांठु पर खिलदू; गढ़वळि लोकगीतुं मा प्यार अर सुंदरता कु प्रतीक', en: 'Phyunli — small yellow spring flower blooming on Pahadi slopes; symbol of love & beauty in Garhwali folk songs', tags: ['फ्यूँली', 'phyunli', 'fyunli', 'flower', 'फूल', 'spring', 'बसंत'] },
  { gw: 'ब्रह्मकमल', hi: 'ब्रह्मकमल — उत्तराखंड कु राजकी फूल; भौत ऊंचाई मा मिलदू, देवताओं कु फूल मान्द छन', en: 'Brahmakamal — state flower of Uttarakhand; found at high altitudes, considered the flower of gods', tags: ['ब्रह्मकमल', 'brahmakamal', 'brahma kamal', 'state flower', 'राजकी फूल'] },
  { gw: 'बुरांश', hi: 'बुरांश (Rhododendron) — लाल रंग कु फूल, बसंत ऋतु मा पहाड़ु मा चारु तरफ खिलदू; येका जूस भी बणान्द छन', en: 'Buransh (Rhododendron) — red flower blooming across mountains in spring; juice is made from it', tags: ['बुरांश', 'buransh', 'burans', 'rhododendron', 'flower', 'जूस'] },
  { gw: 'कंडली / बिच्छू घास', hi: 'कंडली / बिच्छू घास (Stinging Nettle) — कांटेदार पौधा; येका साग भौत प्रसिद्ध अर पौष्टिक च', en: 'Kandali / Stinging Nettle — thorny plant; its saag (greens) is very famous and nutritious', tags: ['कंडली', 'बिच्छू घास', 'kandali', 'stinging nettle', 'साग', 'saag'] },
  { gw: 'किंगगोड़', hi: 'किंगगोड़ (Berberis Aristata) — औषधीय पौधा; येका फल अर फूल दुयनु इस्तेमाल होंदन', en: 'Kingor (Berberis Aristata) — medicinal plant; both fruit and flower are used', tags: ['किंगगोड़', 'kingor', 'kingod', 'berberis', 'औषधीय', 'medicinal'] },

  // ===== Literature: notable writers (sourced from Wikipedia: Garhwali language) =====
  { gw: 'अबोध बंधु बहुगुणा', hi: 'अबोध बंधु बहुगुणा (1927–2004) — आधुनिक गढ़वाली लेखन के स्तंभ; प्रसिद्ध रचनाएँ: "गाड़", "म्यतेकि गंगा", "भूम्याल", "पार्वती", "घोल", "दैसत", "कंखिला", "शैलवाणी"', en: 'Abodh Bandhu Bahuguna (1927–2004) — pillar of modern Garhwali writing; works: Gaad, Myateki Ganga, Bhumyal, Parvati, Ghol, Daisat, Kankhila, Shailvani', tags: ['अबोध बंधु बहुगुणा', 'abodh bandhu bahuguna', 'bahuguna', 'literature', 'साहित्य', 'गाड़', 'भूम्याल'] },
  { gw: 'तारा दत्त गैरोला', hi: 'तारा दत्त गैरोला (1875–1940) — गढ़वाल लोक-साहित्य के संग्राहक; प्रसिद्ध काव्य "सदेई"', en: 'Taradutt Gairola (1875–1940) — collector of Garhwal folklore; famous poem "Sadei"', tags: ['तारा दत्त गैरोला', 'taradutt gairola', 'sadei', 'सदेई', 'folklore'] },
  { gw: 'कन्हैयालाल डंडरियाल', hi: 'कन्हैयालाल डंडरियाल — कवि; रचनाएँ "अंजवाल", "मंगतू", "नागराजा" (दो भाग)', en: 'Kanhaiyyalal Dandriyal — poet; works: Anjwaal, Mangtu, Nagraja (2 parts)', tags: ['कन्हैयालाल डंडरियाल', 'kanhaiyyalal dandriyal', 'nagraja', 'anjwaal', 'poet', 'कवि'] },
  { gw: 'चंद्रमोहन रतूड़ी', hi: 'चंद्रमोहन रतूड़ी — रचना "फ्योंली"; गढ़वाली नवजागरण के अग्रणी कवि', en: 'Chandramohan Raturi — work "Phyunli"; pioneer of the Garhwali literary renaissance', tags: ['चंद्रमोहन रतूड़ी', 'chandramohan raturi', 'phyunli', 'फ्योंली'] },
  { gw: 'लीलाधर जगूड़ी', hi: 'लीलाधर जगूड़ी (जन्म 1944) — कवि-उपन्यासकार, पद्मश्री से सम्मानित', en: 'Leeladhar Jagudi (b. 1944) — poet & novelist, Padma Shri awardee', tags: ['लीलाधर जगूड़ी', 'leeladhar jagudi', 'padma shri', 'novelist'] },
  { gw: 'चक्रधर बहुगुणा', hi: 'चक्रधर बहुगुणा — रचना "मोछंग"', en: 'Chakradhar Bahuguna — work "Mochhang"', tags: ['चक्रधर बहुगुणा', 'chakradhar bahuguna', 'mochhang'] },
  { gw: 'भजन सिंह "सिंह"', hi: 'भजन सिंह "सिंह" — रचना "सिंहनाद"', en: 'Bhajan Singh "Singh" — work "Singnaad"', tags: ['भजन सिंह', 'bhajan singh', 'singnaad'] },
  { gw: 'भवानीदत्त थपलियाल', hi: 'भवानीदत्त थपलियाल — रचना "प्रल्हाद"', en: 'Bhawanidutt Thapliyal — work "Pralhad"', tags: ['भवानीदत्त थपलियाल', 'bhawanidutt thapliyal', 'pralhad'] },
  { gw: 'भोलादत्त देवरानी', hi: 'भोलादत्त देवरानी — रचना "मलेथा कि कूल"', en: 'Bholadutt Devrani — work "Malethaki Kool"', tags: ['भोलादत्त देवरानी', 'bholadutt devrani', 'malethaki kool', 'मलेथा'] },
  { gw: 'गोविंद चातक', hi: 'गोविंद चातक — रचना "क्या गोरी क्या सौंली"; "गढ़वाली लोकगीत" (साहित्य अकादमी)', en: 'Govind Chatak — works: "Kya Gori Kya Saunli", "Garhwali Lokgeet" (Sahitya Akademi)', tags: ['गोविंद चातक', 'govind chatak', 'lokgeet', 'लोकगीत'] },
  { gw: 'सुदामा प्रसाद "प्रेमी"', hi: 'सुदामा प्रसाद "प्रेमी" — रचना "अग्याल"; 2010 में साहित्य अकादमी "भाषा सम्मान"', en: 'Sudama Prasad "Premi" — work "Agyaal"; 2010 Sahitya Akademi Bhasha Samman recipient', tags: ['सुदामा प्रसाद', 'sudama prasad', 'premi', 'agyaal', 'sahitya akademi'] },
  { gw: 'प्रेमलाल भट्ट', hi: 'प्रेमलाल भट्ट — रचना "उमाल"; 2010 साहित्य अकादमी भाषा सम्मान', en: 'Premlal Bhatt — work "Umaal"; 2010 Sahitya Akademi Bhasha Samman', tags: ['प्रेमलाल भट्ट', 'premlal bhatt', 'umaal'] },
  { gw: 'बचन सिंह नेगी', hi: 'बचन सिंह नेगी — महाभारत और रामायण का गढ़वाली अनुवाद; रामचरितमानस व श्रीमद्भगवद्गीता का गढ़वाली अनुवाद', en: 'Bachan Singh Negi — Garhwali translations of Mahabharata, Ramayana, Ramcharitmanas & Bhagavad Gita', tags: ['बचन सिंह नेगी', 'bachan singh negi', 'mahabharata', 'ramayana', 'gita'] },
  { gw: 'विशालमणि नैथाणी', hi: 'विशालमणि नैथाणी — पटकथा लेखक; "चक्रचाल", "कौथिक", "बेटी ब्वारी", "प्यूंळी ज्वान ह्वैगे", "जीतू बगड्वाल"', en: 'Vishalmani Naithani — playwright; works: Chakrachal, Kauthik, Beti Buwari, Pyunli Jwan Hwegi, Jeetu Bagdwal', tags: ['विशालमणि नैथाणी', 'vishalmani naithani', 'kauthik', 'jeetu bagdwal'] },
  { gw: 'नरेंद्र कठैत', hi: 'नरेंद्र कठैत — समकालीन गढ़वाली व्यंग्य व कविता; "तबरि अर अबरि", "तुप-तप", "पाणि", "कुल्ला पिचकारी"', en: 'Narendra Kathait — contemporary Garhwali poetry & satire; works: Tabari Ar Abari, Tup-Tap, Pani, Kulla Pichkari', tags: ['नरेंद्र कठैत', 'narendra kathait', 'satire', 'व्यंग्य'] },
  { gw: 'जयदेव बहुगुणा', hi: 'पं. जयदेव बहुगुणा (16वीं सदी) — गढ़वाली की सबसे पुरानी ज्ञात पांडुलिपि "रांच जुड्या जुड़िगे घिमसाण जी" के रचयिता', en: 'Pt. Jayadev Bahuguna (16th c.) — author of the oldest known Garhwali manuscript "Ranch Judya Judige Ghimsaan Ji"', tags: ['जयदेव बहुगुणा', 'jayadev bahuguna', 'oldest manuscript', 'पांडुलिपि'] },
  { gw: 'महाराजा सुदर्शन शाह', hi: 'महाराजा सुदर्शन शाह — 1828 ई. में "सभासार" लिखा', en: 'Maharaja Sudarshan Shah — wrote "Sabhaasaar" in 1828 CE', tags: ['सुदर्शन शाह', 'sudarshan shah', 'sabhaasaar', 'tehri king'] },
  { gw: 'मोलाराम', hi: 'मोलाराम — गढ़वाल चित्रकला शैली के संस्थापक चित्रकार-इतिहासकार', en: 'Mola Ram — founder painter-historian of the Garhwal school of painting', tags: ['मोलाराम', 'mola ram', 'painter', 'चित्रकार', 'garhwal school'] },

  // ===== Literature: magazines, newspapers, organisations =====
  { gw: 'उत्तराखंड खबरसार', hi: 'पूरी तरह गढ़वाली में प्रकाशित अख़बार', en: 'Garhwali-language newspaper "Uttarakhand Khabarsar"', tags: ['खबरसार', 'khabarsar', 'newspaper', 'अख़बार'] },
  { gw: 'रंत रैबार', hi: '"रंत रैबार" — अखिल गढ़वाल सभा द्वारा प्रकाशित मासिक गढ़वाली अख़बार', en: 'Rant Raibar — monthly Garhwali newspaper by Akhil Garhwal Sabha', tags: ['रंत रैबार', 'rant raibar', 'newspaper', 'akhil garhwal sabha'] },
  { gw: 'बदुली / हिलांस / चिट्ठी-पत्री / ढाड़', hi: 'गढ़वाली पत्रिकाएँ: बदुली, हिलांस, चिट्ठी-पत्री, ढाड़', en: 'Garhwali magazines: Baduli, Hilaans, Chitthi-Patri, Dhaad', tags: ['बदुली', 'हिलांस', 'ढाड़', 'baduli', 'hilaans', 'dhaad', 'magazine', 'पत्रिका'] },
  { gw: 'अखिल गढ़वाल सभा', hi: 'देहरादून आधारित संगठन — गढ़वाली भाषा कार्यशाला और "कौथिग उत्तराखंड महोत्सव" का आयोजक', en: 'Akhil Garhwal Sabha — Dehradun-based body running annual Garhwali language workshops & Kautig Uttarakhand Mahotsav', tags: ['अखिल गढ़वाल सभा', 'akhil garhwal sabha', 'kautig', 'workshop'] },
  { gw: 'विंसर पब्लिशिंग', hi: 'विंसर पब्लिशिंग कंपनी — गढ़वाली साहित्य प्रकाशन में अग्रणी', en: 'Winsar Publishing — leading publisher of Garhwali literature', tags: ['विंसर', 'winsar', 'publishing', 'प्रकाशक'] },
  { gw: 'चखुल गढ़वाली शब्दकोश', hi: 'चखुल — 2015 में लॉन्च हुआ पहला गढ़वाली डिक्शनरी ऐप', en: 'Chakhul Garhwali Dictionary — first Garhwali language app, launched 2015', tags: ['चखुल', 'chakhul', 'dictionary', 'app', 'शब्दकोश'] },
  { gw: 'गढ़पीडिया', hi: 'गढ़पीडिया (2025) — समुदाय-संचालित गढ़वाली विश्वकोश', en: 'Garhpedia (2025) — community-driven Garhwali encyclopedia', tags: ['गढ़पीडिया', 'garhpedia', 'encyclopedia', 'विश्वकोश'] },
  { gw: 'हिमलिंगो', hi: 'हिमलिंगो (2025) — गढ़वाली, कुमाऊनी और जौनसारी संरक्षण के लिए ऑनलाइन परियोजना (4000+ शब्द)', en: 'HimLingo (2025) — community project preserving Garhwali, Kumaoni, Jaunsari (4000+ words crowdsourced)', tags: ['हिमलिंगो', 'himlingo', 'preservation', 'dictionary'] },
  { gw: 'साहित्य अकादमी भाषा सम्मान', hi: '2010 में साहित्य अकादमी ने सुदामा प्रसाद "प्रेमी" व प्रेमलाल भट्ट को भाषा सम्मान दिया; पौड़ी में "गढ़वाली भाषा सम्मेलन" आयोजित', en: 'In 2010, Sahitya Akademi conferred Bhasha Samman on Sudama Prasad "Premi" & Premlal Bhatt; held Garhwali Bhasha Sammelan at Pauri', tags: ['साहित्य अकादमी', 'sahitya akademi', 'bhasha samman', 'सम्मेलन'] },
  { gw: 'गोविंद प्रसाद घिल्डियाल', hi: 'पं. गोविंद प्रसाद घिल्डियाल — 1901 में "हिंदी राजनीति" के पहले भाग का गढ़वाली अनुवाद (अल्मोड़ा)', en: 'Pt. Gobind Prasad Ghildyal — translated first part of "Hindi Rajniti" into Garhwali, printed Almora 1901', tags: ['घिल्डियाल', 'ghildyal', 'translation', 'अनुवाद'] },
  { gw: 'गंगा दत्त उप्रेती', hi: 'पं. गंगा दत्त उप्रेती — "Proverbs & Folklore of Kumaun and Garhwal" (1894) के संग्राहक', en: 'Pt. Ganga Datt Upreti — compiled "Proverbs & Folklore of Kumaun and Garhwal" (1894)', tags: ['उप्रेती', 'upreti', 'proverbs', 'कहावत', 'folklore'] },

  // ===== Literary genres & oral forms =====
  { gw: 'पंवाड़ा', hi: 'पंवाड़ा — गढ़वाल के वीर नायकों की लंबी लोक-गाथा', en: 'Panwara — long heroic ballad of Garhwal folk heroes', tags: ['पंवाड़ा', 'panwara', 'ballad', 'heroic'] },
  { gw: 'भड़ियाली', hi: 'भड़ियाली — वीर रस की लोकगाथाएँ (भड़ों/योद्धाओं की कथा)', en: 'Bhadiyali — heroic folk narratives of warrior-clans (bhads)', tags: ['भड़ियाली', 'bhadiyali', 'warrior', 'योद्धा'] },
  { gw: 'जागर गाथा', hi: 'जागर — देवताओं को जगाने वाली अनुष्ठानिक गाथाएँ; प्रीतम भरतवाण इसके प्रमुख गायक', en: 'Jaagar — ritual narrative songs invoking deities; Pritam Bhartwan is a leading exponent', tags: ['जागर', 'jaagar', 'pritam bhartwan', 'ritual'] },
  { gw: 'जीतू बगड्वाल', hi: 'जीतू बगड्वाल — गढ़वाल की लोकप्रिय प्रेम-त्रासदी लोकगाथा', en: 'Jeetu Bagdwal — popular tragic love-folktale of Garhwal', tags: ['जीतू बगड्वाल', 'jeetu bagdwal', 'folktale', 'लोकगाथा'] },
  { gw: 'माठो सिंह भंडारी', hi: '"माठो सिंह भंडारी" — पारंपरिक गढ़वाली नृत्य-नाटिका', en: 'Matho Singh Bhandari — traditional Garhwali dance-drama', tags: ['माठो सिंह भंडारी', 'matho singh bhandari', 'dance drama'] },
  { gw: 'मलेथा कि कूल', hi: '"मलेथा कि कूल" — माधो सिंह भंडारी द्वारा खोदी गई ऐतिहासिक नहर की लोक-कथा', en: 'Malethaki Kool — folktale of the historic canal dug by Madho Singh Bhandari', tags: ['मलेथा', 'malethaki kool', 'kool', 'canal', 'folktale'] },
  { gw: 'खुदेड़ गीत', hi: 'खुदेड़ — विवाहिता स्त्री द्वारा मायके की याद में गाये जाने वाले विरह-गीत', en: 'Khuded — songs of longing sung by married women remembering their natal home', tags: ['खुदेड़', 'khuded', 'longing', 'विरह'] },
  { gw: 'बाजूबंद', hi: 'बाजूबंद — स्त्री-पुरुष के बीच गाये जाने वाले प्रश्नोत्तरी प्रेम-गीत', en: 'Bajuband — call-and-response love duets between men and women', tags: ['बाजूबंद', 'bajuband', 'duet', 'love song'] },
  { gw: 'झुमैलो', hi: 'झुमैलो — स्त्रियों द्वारा सामूहिक रूप से नाचते-गाते लोकगीत', en: 'Jhumailo — collective song-and-dance form performed by women', tags: ['झुमैलो', 'jhumailo', 'jhumaila', 'group dance'] },
  { gw: 'घसियारी गीत', hi: 'घसियारी — घास काटने जाती स्त्रियों के लोकगीत', en: 'Ghasyari geet — songs sung by women going to cut grass', tags: ['घसियारी', 'ghasyari', 'work song'] },

  // ===== Famous folk songs =====
  { gw: 'बेडु पाको बारामासा', hi: '"बेडु पाको बारामासा" — गढ़वाल-कुमाऊँ का सबसे प्रसिद्ध लोकगीत; प्रथम बार राष्ट्रपति राधाकृष्णन के सम्मुख गाया गया', en: 'Bedu Pako Baro Masa — most famous folk song of Garhwal-Kumaon; first sung before President Radhakrishnan', tags: ['बेडु पाको', 'bedu pako', 'baro masa', 'folk song'] },
  { gw: 'नौछमी नारैणा', hi: '"नौछमी नारैणा" — नरेंद्र सिंह नेगी का राजनीतिक व्यंग्य गीत जो उत्तराखंड में चर्चित हुआ', en: 'Nauchhami Narayana — Narendra Singh Negi\'s landmark political-satire song', tags: ['नौछमी नारैणा', 'nauchhami narayana', 'negi', 'satire'] },

  // ===== Numerals (gw–en) =====
  { gw: 'य़क / यऽक', hi: 'एक (1)', en: 'one (1)', tags: ['एक', 'one', '1', 'yak', 'number'] },
  { gw: 'दुई / द्वी', hi: 'दो (2)', en: 'two (2)', tags: ['दो', 'two', '2', 'dui', 'dvi'] },
  { gw: 'तीन', hi: 'तीन (3)', en: 'three (3)', tags: ['तीन', 'three', '3', 'teen'] },
  { gw: 'चार', hi: 'चार (4)', en: 'four (4)', tags: ['चार', 'four', '4', 'char'] },
  { gw: 'पाँच / पाँ', hi: 'पाँच (5)', en: 'five (5)', tags: ['पाँच', 'five', '5', 'panch'] },
  { gw: 'छॉ / छै', hi: 'छह (6)', en: 'six (6)', tags: ['छह', 'six', '6', 'cho', 'chai'] },
  { gw: 'सात', hi: 'सात (7)', en: 'seven (7)', tags: ['सात', 'seven', '7', 'saat'] },
  { gw: 'आठ', hi: 'आठ (8)', en: 'eight (8)', tags: ['आठ', 'eight', '8', 'aath'] },
  { gw: 'नउ / नौ', hi: 'नौ (9)', en: 'nine (9)', tags: ['नौ', 'nine', '9', 'nau'] },
  { gw: 'सुन्ने', hi: 'शून्य (0)', en: 'zero (0)', tags: ['शून्य', 'zero', '0', 'sunne'] },

  // ===== Sample phrases (Wikipedia attested) =====
  { gw: 'कख जाणा छों?', hi: 'कहाँ जा रहे हो?', en: 'Where are you going?', tags: ['कहाँ जा', 'where going', 'kakh jana'] },
  { gw: 'कथ्गा?', hi: 'कितना?', en: 'How much?', tags: ['कितना', 'how much', 'kathga'] },
  { gw: 'त्येरु नौं क्या च?', hi: 'तुम्हारा नाम क्या है?', en: 'What is your name?', tags: ['नाम क्या', 'your name', 'tyaru naun'] },
  { gw: 'कख बटिन अयाँ छां तुम?', hi: 'तुम कहाँ से आए हो?', en: 'Where have you come from?', tags: ['कहाँ से', 'where from', 'kakh batin'] },
  { gw: 'हिटण दे मि तै', hi: 'मुझे चलने दो', en: 'Let me walk', tags: ['चलने दो', 'let me walk', 'hitan de'] },
  { gw: 'कि व्हैगे?', hi: 'क्या हो गया?', en: 'What happened?', tags: ['क्या हुआ', 'what happened', 'ki vhwege'] },
  { gw: 'व्ह्वैगै', hi: 'हो गया', en: 'Done / it happened', tags: ['हो गया', 'done', 'vhwege'] },
  { gw: 'सेमन्या', hi: 'अभिवादन / सलाम', en: 'Salutation / formal greeting', tags: ['अभिवादन', 'salutation', 'semanya'] },

  // ===== Vocabulary attested in Wikipedia phonology samples =====
  { gw: 'कळ्यो', hi: 'नाश्ता / कलेवा', en: 'breakfast', tags: ['नाश्ता', 'breakfast', 'kalyo'] },
  { gw: 'पाणि', hi: 'पानी', en: 'water', tags: ['पानी', 'water', 'pani'] },
  { gw: 'फूळ', hi: 'फूल', en: 'flower', tags: ['फूल', 'flower', 'phool', 'phul'] },
  { gw: 'डाळु', hi: 'पेड़ / वृक्ष', en: 'tree', tags: ['पेड़', 'tree', 'dalu', 'vriksh'] },
  { gw: 'पुङ्गुड़ु', hi: 'खेत / कृषि-भूमि', en: 'farm / field', tags: ['खेत', 'farm', 'field', 'pungudu'] },
  { gw: 'भौळ / भ्वळ', hi: 'कल (आने वाला)', en: 'tomorrow', tags: ['कल', 'tomorrow', 'bhaul', 'bhwal'] },
  { gw: 'चिटु', hi: 'सफ़ेद (पुल्लिंग)', en: 'white (masc.)', tags: ['सफ़ेद', 'white', 'chitu'] },
  { gw: 'ज्वनि', hi: 'जवानी / यौवन', en: 'youth', tags: ['जवानी', 'youth', 'jvani'] },
  { gw: 'लाटु', hi: 'पागल / झल्ला (प्रेम/तरस में भी प्रयुक्त)', en: 'mad / silly (also affectionate)', tags: ['पागल', 'mad', 'latu'] },
  { gw: 'यार / य़ार', hi: 'मित्र (संबोधन)', en: 'friend (vocative)', tags: ['यार', 'friend', 'yaar'] },
  { gw: 'ठुंगार', hi: 'नाश्ता / नमकीन', en: 'snacks', tags: ['नाश्ता', 'snack', 'thungar'] },
  { gw: 'मांस / मनखी', hi: 'आदमी / मनुष्य', en: 'man / person', tags: ['आदमी', 'man', 'person', 'mankhi', 'mans'] },
  { gw: 'जनानी', hi: 'महिला / स्त्री', en: 'woman', tags: ['महिला', 'woman', 'janani'] },
  { gw: 'स्वैन', hi: 'पत्नी', en: 'wife', tags: ['पत्नी', 'wife', 'swain'] },
  { gw: 'नौनो / नौनी', hi: 'बेटा / बेटी', en: 'son / daughter', tags: ['बेटा', 'बेटी', 'son', 'daughter', 'nauno', 'nauni'] },
  { gw: 'बैनि', hi: 'बहन', en: 'sister', tags: ['बहन', 'sister', 'bain', 'baini'] },

  // ===== Dialects of Garhwali =====
  { gw: 'श्रीनगरिया', hi: 'श्रीनगरिया — श्रीनगर क्षेत्र की बोली; मानक गढ़वाली मानी जाती है', en: 'Srinagaria — dialect of Srinagar region; regarded as the standard Garhwali', tags: ['श्रीनगरिया', 'srinagaria', 'standard', 'dialect'] },
  { gw: 'टिहरियाली', hi: 'टिहरियाली — चंबा, नई टिहरी, घनसाली में बोली; मानक के बहुत निकट', en: 'Tehriyali — spoken in Chamba, New Tehri, Ghansyali; very close to standard', tags: ['टिहरियाली', 'tehriyali', 'tehri'] },
  { gw: 'राठी', hi: 'राठी (राठवाली) — चंदपुर, देवलगढ़ क्षेत्र; खस-समुदाय की बोली', en: 'Rathwali (Rathi) — spoken in Chandpur, Devalgarh; the Khasiya speech', tags: ['राठी', 'rathi', 'rathwali', 'khasiya'] },
  { gw: 'जौनपुरी', hi: 'जौनपुरी — मसूरी-धनोल्टी क्षेत्र; टिहरियाली व जौनसारी की संधि-बोली', en: 'Jaunpuri — Mussoorie-Dhanaulti area; transitional between Tehriyali & Jaunsari', tags: ['जौनपुरी', 'jaunpuri', 'mussoorie'] },
  { gw: 'गंगाड़ी', hi: 'गंगाड़ी — उत्तरकाशी, डुंडा, चिन्यालीसौड़', en: 'Gangadi — Uttarkashi, Dunda, Chinyalisaur', tags: ['गंगाड़ी', 'gangadi', 'uttarkashi'] },
  { gw: 'नागपुरिया', hi: 'नागपुरिया — रुद्रप्रयाग, नागपुर परगना, पैनखंडा', en: 'Nagpuriya — Rudraprayag, Nagpur pargana, Painkhanda', tags: ['नागपुरिया', 'nagpuriya', 'rudraprayag'] },
  { gw: 'सलाणी', hi: 'सलाणी — मल्ला, तल्ला व गंगा सलाण; श्रीनगरिया के समान', en: 'Salani — Malla, Talla & Ganga Salan; nearly identical to Srinagaria', tags: ['सलाणी', 'salani'] },
  { gw: 'बधाणी', hi: 'बधाणी — पश्चिमी बधान परगना', en: 'Badhani — Western Badhan pargana', tags: ['बधाणी', 'badhani'] },

  // ===== Historical / language facts =====
  { gw: 'खस प्राकृत', hi: 'खस प्राकृत — गढ़वाली का प्रारंभिक स्रोत मानी जाने वाली मध्य भारतीय-आर्य भाषा', en: 'Khas Prakrit — Middle Indo-Aryan language considered the source of Garhwali', tags: ['खस प्राकृत', 'khas prakrit', 'origin', 'इतिहास'] },
  { gw: 'देवप्रयाग शिलालेख', hi: 'राजा जगतपाल का देवप्रयाग शिलालेख (1335 ई.) — गढ़वाली का प्रारंभिक प्रमाण', en: 'Devprayag inscription of King Jagatpal (1335 CE) — early Garhwali evidence', tags: ['देवप्रयाग', 'devprayag', 'jagatpal', 'inscription', '1335'] },
  { gw: 'गढ़वाली लिपि', hi: 'गढ़वाली देवनागरी लिपि में लिखी जाती है', en: 'Garhwali is written in Devanagari script', tags: ['लिपि', 'script', 'devanagari', 'देवनागरी'] },
  { gw: 'ISO 639-3: gbm', hi: 'गढ़वाली का ISO 639-3 कोड "gbm" है; ग्लोटोलॉग: garh1243', en: 'Garhwali ISO 639-3 code is "gbm"; Glottolog: garh1243', tags: ['iso', 'gbm', 'code', 'glottolog'] },
  { gw: 'यूनेस्को संकट-भाषा', hi: 'यूनेस्को के "Atlas of World\'s Languages in Danger" में गढ़वाली "vulnerable" श्रेणी में', en: 'UNESCO Atlas lists Garhwali as a "vulnerable" language', tags: ['यूनेस्को', 'unesco', 'vulnerable', 'endangered'] },
  { gw: '24 लाख वक्ता', hi: '2011 जनगणना अनुसार लगभग 24.8 लाख गढ़वाली भाषी', en: 'About 2.48 million Garhwali speakers (2011 census)', tags: ['speakers', 'जनगणना', 'census', 'population'] },
  { gw: 'लिंग्विस्टिक सर्वे ऑफ इंडिया', hi: 'जॉर्ज ग्रियर्सन के LSI (1916) में गढ़वाली का पहला विस्तृत भाषाई दस्तावेज़ीकरण', en: 'George Grierson\'s Linguistic Survey of India (1916) — first detailed documentation of Garhwali', tags: ['ग्रियर्सन', 'grierson', 'lsi', 'linguistic survey'] },

  // ===== Garhwali film / cinema =====
  { gw: 'जग्वाळ', hi: '"जग्वाळ" (1983) — पहली गढ़वाली फ़िल्म, निर्देशक पारेश्वर गौड़', en: 'Jagwal (1983) — first Garhwali feature film, directed by Pareshwar Gaur', tags: ['जग्वाळ', 'jagwal', 'first film', 'पहली फिल्म', 'cinema'] },
  { gw: 'पाइनफ्लिक्स', hi: 'पाइनफ्लिक्स (2017) — रचित पोखरियाल द्वारा शुरू गढ़वाली कंटेंट प्लेटफॉर्म', en: 'Pineflix (2017) — Garhwali content platform launched by Rachit Pokhriyal', tags: ['पाइनफ्लिक्स', 'pineflix', 'platform', 'films'] },

  // ===== Everyday household nouns (user-corrected, authoritative) =====
  { gw: 'द्वार / किवाड़', hi: 'दरवाज़ा', en: 'door', tags: ['दरवाजा', 'दरवाज़ा', 'darwaza', 'door', 'kiwad', 'किवाड'] },
  { gw: 'पाथर', hi: 'पत्थर', en: 'stone', tags: ['पत्थर', 'patthar', 'stone', 'pathar'] },
  { gw: 'घर / घेर', hi: 'घर', en: 'house / home', tags: ['घर', 'घेर', 'ghar', 'gher', 'house', 'home'] },
  { gw: 'सिंघाड़ो', hi: 'सिंघाड़ा', en: 'water chestnut', tags: ['सिंघाड़ा', 'singhara', 'water chestnut', 'singhado'] },
  { gw: 'छान / छप्पर', hi: 'छत', en: 'roof', tags: ['छत', 'chhat', 'chat', 'roof', 'chhan', 'chhappar', 'छान', 'छप्पर'] },
  { gw: 'भांडु / बर्तन', hi: 'बर्तन', en: 'utensil', tags: ['बर्तन', 'bartan', 'utensil', 'bhandu'] },
  { gw: 'चूलो', hi: 'चूल्हा', en: 'stove / hearth', tags: ['चूल्हा', 'chulha', 'stove', 'hearth', 'chulo'] },
  { gw: 'पाणी', hi: 'पानी', en: 'water', tags: ['पानी', 'pani', 'water'] },
  { gw: 'दूध', hi: 'दूध', en: 'milk', tags: ['दूध', 'doodh', 'milk', 'dudh'] },
  { gw: 'गोरु / ग्वैरु', hi: 'गाय', en: 'cow', tags: ['गाय', 'gaay', 'cow', 'goru'] },
  { gw: 'बखरु', hi: 'बकरी', en: 'goat', tags: ['बकरी', 'bakri', 'goat', 'bakhru'] },
  { gw: 'खिड़की', hi: 'खिड़की', en: 'window', tags: ['खिड़की', 'khidki', 'window'] },
  { gw: 'चौक / आँगन', hi: 'आँगन / चौक', en: 'courtyard', tags: ['आँगन', 'angan', 'aangan', 'courtyard', 'chowk'] },
  { gw: 'खाणु', hi: 'भोजन / खाना', en: 'food / meal', tags: ['खाना', 'khana', 'food', 'meal', 'bhojan'] },
  { gw: 'रोटी', hi: 'रोटी', en: 'flatbread', tags: ['रोटी', 'roti', 'flatbread'] },
  { gw: 'दाळ', hi: 'दाल', en: 'lentils', tags: ['दाल', 'dal', 'daal', 'lentils'] },
  { gw: 'भात', hi: 'चावल / भात', en: 'rice', tags: ['चावल', 'chawal', 'rice', 'bhat', 'भात'] },
  { gw: 'धार', hi: 'पहाड़ की चोटी', en: 'mountain ridge / peak', tags: ['पहाड़', 'pahad', 'ridge', 'dhar', 'peak'] },
  { gw: 'गाड़', hi: 'नदी', en: 'river', tags: ['नदी', 'nadi', 'river', 'gad'] },
  { gw: 'बांज', hi: 'बांज (ओक का पेड़)', en: 'oak tree', tags: ['बांज', 'banj', 'oak'] },
  { gw: 'बुरांश', hi: 'बुरांश (राज्य पुष्प)', en: 'rhododendron (state flower)', tags: ['बुरांश', 'burans', 'rhododendron', 'state flower'] },
  { gw: 'काफळ', hi: 'काफल (पहाड़ी फल)', en: 'kaphal (Himalayan bayberry)', tags: ['काफल', 'kafal', 'kaphal', 'bayberry'] },

  // ===========================================================
  // Authentic phrases — sourced from Omniglot (omniglot.com/language/phrases/garhwali.htm)
  // These are conversational sentences, not single words. They give
  // the LLM real Garhwali sentence patterns to ground its replies.
  // ===========================================================

  // ----- Greetings -----
  { gw: 'सिवासौँळी / ढकुली / सेमन्या / नमस्कार', hi: 'नमस्ते / नमस्कार (सामान्य अभिवादन)', en: 'Hello (general greeting)', tags: ['hello', 'hi', 'नमस्ते', 'नमस्कार', 'siwasanli', 'dhakuli', 'semanya', 'greeting'] },
  { gw: 'सेमन्या', hi: 'हेलो (फ़ोन पर)', en: 'Hello (on phone)', tags: ['hello on phone', 'फोन', 'semanya'] },
  { gw: 'स्वागत छ', hi: 'स्वागत है', en: 'Welcome', tags: ['welcome', 'स्वागत', 'swagat'] },
  { gw: 'उठी / बीजा · जसीलो बिनसरि', hi: 'सुप्रभात / सुबह की शुभकामना', en: 'Good morning', tags: ['good morning', 'सुप्रभात', 'सुबह', 'jasilo binsari', 'subah'] },
  { gw: 'जसीलो दोफर / शुभ दोफर', hi: 'शुभ दोपहर', en: 'Good afternoon', tags: ['good afternoon', 'दोपहर', 'jasilo dofar'] },
  { gw: 'जसीलो बखयुनी / जसीलो शाम', hi: 'शुभ संध्या / शुभ शाम', en: 'Good evening', tags: ['good evening', 'शाम', 'संध्या', 'jasilo bakhayuni'] },
  { gw: 'जसीलो रुमुक / जसीलो रात्री / शुभ रात्री', hi: 'शुभ रात्रि', en: 'Good night', tags: ['good night', 'रात', 'jasilo rumuk', 'shubh ratri'] },
  { gw: 'अच्छी बात / फेरि मल्यां', hi: 'अलविदा / फिर मिलेंगे', en: 'Goodbye / See you later', tags: ['goodbye', 'bye', 'अलविदा', 'फिर मिलेंगे', 'feri malyan'] },
  { gw: 'जसीलो बेली', hi: 'आपका दिन शुभ हो', en: 'Have a nice day', tags: ['have a nice day', 'शुभ दिन', 'jasilo beli'] },
  { gw: 'जसीलो जात्रा / शुभ जात्रा', hi: 'शुभ यात्रा', en: 'Bon voyage / Have a good journey', tags: ['bon voyage', 'safe journey', 'shubh yatra', 'jasilo jatra'] },
  { gw: 'पौंडल्या पौणखि जिम्मुस्', hi: 'भोजन का आनंद लें', en: 'Bon appetit / Have a nice meal', tags: ['bon appetit', 'enjoy meal', 'भोजन', 'paundalya'] },
  { gw: 'छंद', hi: 'शुभकामनाएँ / गुड लक', en: 'Good luck!', tags: ['good luck', 'शुभकामनाएँ', 'chand'] },
  { gw: 'जसीलो गासी', hi: 'चियर्स! तंदुरुस्ती के लिए!', en: 'Cheers! Good health!', tags: ['cheers', 'good health', 'toast', 'jasilo gasi'] },
  { gw: 'भद्दे भद्दे!', hi: 'बधाई हो!', en: 'Congratulations!', tags: ['congratulations', 'बधाई', 'bhadde'] },
  { gw: 'जन्मदिणा की बधाई च!', hi: 'जन्मदिन मुबारक!', en: 'Happy birthday!', tags: ['happy birthday', 'जन्मदिन', 'janmadina'] },
  { gw: 'भिंड्या दिन पच्छी भेठ ह्वी', hi: 'बहुत दिनों बाद मुलाक़ात हुई', en: 'Long time no see', tags: ['long time no see', 'bhindya din', 'मुलाक़ात'] },

  // ----- Introductions -----
  { gw: 'आप कन छो? / तू के छा?', hi: 'आप कैसे हैं? / तुम कैसे हो?', en: 'How are you?', tags: ['how are you', 'कैसे हो', 'aap kan cho', 'tu ke cha'] },
  { gw: 'मी भल्लु छो / मी ठीक छो', hi: 'मैं ठीक हूँ', en: "I'm fine / I'm well (reply to 'How are you?')", tags: ['i am fine', 'मैं ठीक हूँ', 'mi bhallu cho', 'mi thik cho'] },
  { gw: 'तुमर नौ कि छ? / तेरू नाम के छ?', hi: 'आपका नाम क्या है?', en: "What's your name?", tags: ['what is your name', 'नाम क्या है', 'tumar naw ki cha', 'teru nam'] },
  { gw: 'मेरु नौ … छ / म्यार नौ … छ', hi: 'मेरा नाम … है', en: 'My name is …', tags: ['my name is', 'मेरा नाम', 'meru naw', 'myar naw'] },
  { gw: 'आप कख बटि छो? / तू कहाँ का छा?', hi: 'आप कहाँ से हैं?', en: 'Where are you from?', tags: ['where are you from', 'कहाँ से', 'aap kakh bati cho'] },
  { gw: 'मी … बटि छो / मैं … सौं छु', hi: 'मैं … से हूँ', en: "I'm from …", tags: ['i am from', 'मैं से हूँ', 'mi bati cho'] },
  { gw: 'त्वैते भेटिन भल्लु लगील / तुज मिलक बढ़िया लागु', hi: 'आपसे मिलकर अच्छा लगा', en: 'Pleased to meet you', tags: ['pleased to meet you', 'nice to meet you', 'milkar accha laga', 'twaite bhetin'] },
  { gw: 'तीमी कति विरबैको छौ? / ती कति विरबैको छै?', hi: 'आप कितने साल के हैं?', en: 'How old are you?', tags: ['how old are you', 'उम्र', 'kati virbaiko'] },
  { gw: 'मी … विरबैको छु', hi: 'मैं … साल का हूँ', en: "I'm … years old", tags: ['i am years old', 'उम्र', 'mi virbaiko chu'] },

  // ----- Yes / No / Understanding -----
  { gw: 'हो', hi: 'हाँ', en: 'Yes', tags: ['yes', 'हाँ', 'ho'] },
  { gw: 'नी / ना', hi: 'नहीं', en: 'No', tags: ['no', 'नहीं', 'ni', 'na'] },
  { gw: 'ह्वै सकदन', hi: 'शायद / हो सकता है', en: 'Maybe', tags: ['maybe', 'शायद', 'hwai sakdan'] },
  { gw: 'भैं/भौं, म्यै नीं थाह छन्', hi: 'मुझे नहीं पता', en: "I don't know", tags: ['i dont know', 'पता नहीं', 'nahi pata', 'myai ni thah'] },
  { gw: 'मी विंग् छु', hi: 'मैं समझता हूँ', en: 'I understand', tags: ['i understand', 'समझता हूँ', 'mi ving chu'] },
  { gw: 'मी नीं विंग् छु', hi: 'मैं नहीं समझता', en: "I don't understand", tags: ['i dont understand', 'नहीं समझा', 'mi ni ving chu'] },
  { gw: 'कृपा मठु-मठु बव्ल्या', hi: 'कृपया धीरे बोलें', en: 'Please speak more slowly', tags: ['speak slowly', 'धीरे बोलें', 'mathu-mathu bawlya'] },
  { gw: 'फेरि भन्नुस्', hi: 'कृपया दोबारा कहें', en: 'Please say that again', tags: ['say again', 'फिर कहें', 'feri bhannus'] },
  { gw: 'कृपा इथे लिख द्या', hi: 'कृपया लिख दीजिए', en: 'Please write it down', tags: ['write it down', 'लिखें', 'likh dya'] },

  // ----- Language -----
  { gw: 'कि आप गढ़वाली बव्ल्दा छौ?', hi: 'क्या आप गढ़वाली बोलते हैं?', en: 'Do you speak Garhwali?', tags: ['speak garhwali', 'garhwali bolte ho', 'ki aap garhwali'] },
  { gw: 'कि आप अंग्रेजी बव्ल्दा छौ?', hi: 'क्या आप अंग्रेज़ी बोलते हैं?', en: 'Do you speak English?', tags: ['speak english', 'angrezi bolte ho'] },
  { gw: 'हो, जरू-ज़रासेक', hi: 'हाँ, थोड़ी-सी', en: 'Yes, a little', tags: ['yes a little', 'थोड़ी सी', 'haan thoda', 'jaru-zarasek'] },
  { gw: 'गढ़वाली मा म्यार दगड छुई लग्या कौर', hi: 'मुझसे गढ़वाली में बात करें', en: 'Speak to me in Garhwali', tags: ['speak in garhwali', 'गढ़वाली में बात', 'myar dagad chui'] },
  { gw: 'गढ़वाली मा … ते कि बव्ल्दा छौ?', hi: 'गढ़वाली में … को क्या कहते हैं?', en: 'How do you say … in Garhwali?', tags: ['how do you say in garhwali', 'kya bolte hain', 'kaise kahte hain'] },
  { gw: 'यक भाखा कत्तई खार्यों नी हुंद छ', hi: 'एक भाषा कभी काफ़ी नहीं होती', en: 'One language is never enough', tags: ['one language is never enough', 'भाषा', 'bhasha', 'yak bhakha'] },

  // ----- Politeness -----
  { gw: 'कृपा', hi: 'कृपया', en: 'Please', tags: ['please', 'कृपया', 'krpa'] },
  { gw: 'धन्बाद / धन्यवाद / आभार', hi: 'धन्यवाद', en: 'Thank you', tags: ['thank you', 'धन्यवाद', 'dhanbad', 'aabhar'] },
  { gw: 'स्वागत छ', hi: 'स्वागत है (धन्यवाद का जवाब)', en: "You're welcome (reply to thank you)", tags: ['youre welcome', 'koi baat nahi', 'swagat cha'] },
  { gw: 'माफ गरुस्', hi: 'माफ़ कीजिए / क्षमा करें', en: 'Sorry / Excuse me', tags: ['sorry', 'excuse me', 'माफ़ करें', 'maaf garus'] },

  // ----- Common questions / shopping -----
  { gw: 'यु कथगा च?', hi: 'यह कितने का है?', en: 'How much is this?', tags: ['how much', 'कितने का', 'kathaga cha', 'price'] },
  { gw: 'बाथरूम कख च?', hi: 'बाथरूम कहाँ है?', en: "Where's the toilet / bathroom?", tags: ['where is bathroom', 'टॉयलेट कहाँ', 'bathroom kakh cha'] },

  // ----- Emotions -----
  { gw: 'मी त्वै अग्णाण् छु', hi: 'मैं तुमसे प्यार करता हूँ', en: 'I love you', tags: ['i love you', 'प्यार', 'pyaar', 'mi twai agnan'] },
  { gw: 'म्यै त्यारो खुद छ', hi: 'मुझे तुम्हारी याद आती है', en: 'I miss you', tags: ['i miss you', 'याद आती', 'tyaro khud'] },
  { gw: 'मी तीमी तड़गे चिफ् छु', hi: 'मैं आप पर भरोसा करता हूँ', en: 'I trust you', tags: ['i trust you', 'भरोसा', 'mi timi chif chu'] },
  { gw: 'मी तीमी तड़गे नीं चिफ् छु', hi: 'मैं आप पर भरोसा नहीं करता', en: "I don't trust you", tags: ['dont trust you', 'भरोसा नहीं', 'ni chif chu'] },
  { gw: 'छिटो-छिटो भल्लु ह्वे जावा', hi: 'जल्दी ठीक हो जाओ', en: 'Get well soon', tags: ['get well soon', 'जल्दी ठीक', 'chito-chito bhallu'] },

  // ----- Emergencies -----
  { gw: 'धड्वे!', hi: 'मदद!', en: 'Help!', tags: ['help', 'मदद', 'dhadwe'] },
  { gw: 'भडि!', hi: 'आग!', en: 'Fire!', tags: ['fire', 'आग', 'bhadi'] },
  { gw: 'ठैरा बल!', hi: 'रुको!', en: 'Stop!', tags: ['stop', 'रुको', 'thaira bal'] },
  { gw: 'ठापी भटयुस्!', hi: 'पुलिस को बुलाओ!', en: 'Call the police!', tags: ['call police', 'पुलिस', 'thapi bhatyus'] },
  { gw: 'फुण्ड फूंक!', hi: 'चले जाओ!', en: 'Go away!', tags: ['go away', 'चले जाओ', 'phund phunk'] },
  { gw: 'म्यै यखुड्या फूको!', hi: 'मुझे अकेला छोड़ दो!', en: 'Leave me alone!', tags: ['leave me alone', 'अकेला छोड़', 'yakhudya phuko'] },

  // ===========================================================
  // लोक व्यवसायों से जुड़ीं गढ़वाळि शब्दावली
  // Traditional occupations / trades vocabulary
  // ===========================================================
  { gw: 'अन्वाळ', hi: 'बकरी चुगाने वाला', en: 'goat herder / one who grazes goats', tags: ['anwal', 'अन्वाळ', 'goat herder', 'shepherd', 'बकरी'] },
  { gw: 'अलखणियाँ', hi: 'अलख-अलख पुकारने वाला (साधु)', en: 'wandering ascetic who calls "alakh-alakh"', tags: ['alakhaniyan', 'अलखणियाँ', 'sadhu', 'ascetic', 'अलख'] },
  { gw: 'औजी', hi: 'वादक, दर्जी (पारंपरिक)', en: 'traditional musician and tailor caste', tags: ['auji', 'औजी', 'musician', 'tailor', 'वादक', 'दर्जी'] },
  { gw: 'कंडेर', hi: 'कंडी (टोकरी) पर आदमी या बोझ ले जाने वाला', en: 'porter who carries people/loads in a basket', tags: ['kander', 'कंडेर', 'porter', 'kandi', 'कंडी'] },
  { gw: 'कुमार', hi: 'कुम्हार, मिट्टी के बर्तन बनाने वाला', en: 'potter', tags: ['kumar', 'कुमार', 'potter', 'कुम्हार', 'kumhar'] },
  { gw: 'कोळि', hi: 'तिलहन से तेल निकालने वाला', en: 'oil-presser (extracts oil from oilseeds)', tags: ['koli', 'कोळि', 'oil presser', 'तेल', 'तिलहन'] },
  { gw: 'खड्वाळ', hi: 'भेड़पालक', en: 'shepherd / sheep-rearer', tags: ['khadwal', 'खड्वाळ', 'shepherd', 'sheep', 'भेड़पालक'] },
  { gw: 'खेत्वाळो', hi: 'खेत मज़दूर', en: 'farm labourer', tags: ['khetwalo', 'खेत्वाळो', 'farm labourer', 'खेत मज़दूर'] },
  { gw: 'गळ्दार', hi: 'पशुओं का व्यापार करने वाला', en: 'cattle trader', tags: ['galdar', 'गळ्दार', 'cattle trader', 'पशु व्यापारी'] },
  { gw: 'गारुड़ि', hi: 'तांत्रिक', en: 'tantric / occult practitioner', tags: ['garudi', 'गारुड़ि', 'tantric', 'तांत्रिक'] },
  { gw: 'ग्वेर / ग्वीर', hi: 'गाय चराने वाले', en: 'cowherd', tags: ['gwer', 'gwir', 'ग्वेर', 'ग्वीर', 'cowherd', 'cattle herder', 'गाय चराने'] },
  { gw: 'घड्यळ्या / जागरी / धामी', hi: 'डौंर-थाली बजाकर भूत एवं देवता नचाने वाले', en: 'jaagari — drums daunr-thali to invoke spirits/deities (jaagar performer)', tags: ['ghadyalya', 'jagari', 'dhami', 'जागरी', 'धामी', 'जागर', 'jaagar', 'daunr', 'thali'] },
  { gw: 'घसारि', hi: 'घास काटने वाली', en: 'woman who cuts grass / fodder collector', tags: ['ghasari', 'घसारि', 'grass cutter', 'घास काटने', 'fodder'] },
  { gw: 'घोड़ीत', hi: 'घोड़े वाला', en: 'horseman / mule driver', tags: ['ghorit', 'घोड़ीत', 'horseman', 'mule', 'घोड़े वाला'] },
  { gw: 'चिरानि', hi: 'आरी से लकड़ी चीरने का काम करने वाले', en: 'sawyer (cuts wood with saw)', tags: ['chirani', 'चिरानि', 'sawyer', 'wood cutter', 'लकड़ी चीरने'] },
  { gw: 'चुनार', hi: 'काष्ठ शिल्पी', en: 'wood carver / carpenter-artisan', tags: ['chunar', 'चुनार', 'wood carver', 'काष्ठ शिल्पी', 'carpenter'] },
  { gw: 'डंडेर', hi: 'डांडी ले जाने वाले', en: 'palanquin/dandi bearer', tags: ['dander', 'डंडेर', 'dandi bearer', 'palanquin', 'डांडी'] },
  { gw: 'डळ्यो', hi: 'गाकर माँगने वाले जोगी', en: 'singing mendicant / wandering minstrel-yogi', tags: ['dalyo', 'डळ्यो', 'mendicant', 'singing yogi', 'जोगी'] },
  { gw: 'डोल्यौर', hi: 'कहार, डोली ले जाने वाले', en: 'kahar / doli (palanquin) bearer', tags: ['dolyaur', 'डोल्यौर', 'kahar', 'doli bearer', 'palanquin', 'कहार'] },
  { gw: 'धयाणी', hi: 'सिर पर देवता रखकर भविष्य कथन करने वाले', en: 'oracle who carries deity on head and foretells future', tags: ['dhayani', 'धयाणी', 'oracle', 'soothsayer', 'भविष्य कथन', 'देवता'] },
  { gw: 'धुनार', hi: 'नदियों पर रस्सियों के पुल बनाकर लोगों को नदी पार करवाने वाला', en: 'rope-bridge builder / river-crossing helper', tags: ['dhunar', 'धुनार', 'rope bridge', 'river crossing', 'पुल बनाने'] },
  { gw: 'धूणा', hi: 'बालू धोकर सोना निकालने वाला', en: 'gold-panner (washes sand to extract gold)', tags: ['dhuna', 'धूणा', 'gold panner', 'सोना निकालने', 'बालू'] },
  { gw: 'धौंस्या', hi: 'डमरू की तरह का एक वाद्य यंत्र "धाँसी" बजाने वाला', en: 'player of dhansi (small drum like damaru)', tags: ['dhansya', 'धौंस्या', 'dhansi', 'धाँसी', 'damaru', 'drummer'] },
  { gw: 'पंडा', hi: 'तीर्थस्थल पर पूजा कराने के हकदार', en: 'panda — hereditary priest at pilgrimage sites', tags: ['panda', 'पंडा', 'priest', 'तीर्थ', 'pilgrimage priest'] },
  { gw: 'पंडित', hi: 'ब्राह्मण', en: 'pandit / brahmin priest', tags: ['pandit', 'पंडित', 'brahmin', 'ब्राह्मण', 'priest'] },
  { gw: 'पौरि', hi: 'पहरेदार', en: 'guard / sentry', tags: ['pauri', 'पौरि', 'guard', 'sentry', 'पहरेदार'] },
  { gw: 'पणतरु', hi: 'पानी में तैरने वाला', en: 'swimmer (one who swims in water)', tags: ['pantaru', 'पणतरु', 'swimmer', 'तैरने वाला'] },
  { gw: 'पणसारु', hi: 'पानी ढोने वाला', en: 'water-carrier', tags: ['pansaru', 'पणसारु', 'water carrier', 'पानी ढोने'] },
  { gw: 'पतरोळ', hi: 'जंगल का चौकीदार', en: 'forest watchman / patrolman', tags: ['patrol', 'patrol forest guard', 'पतरोळ', 'forest guard', 'जंगल चौकीदार'] },

  // ===========================================================
  // Words from "Thando Re Thando" — Narendra Singh Negi (classic)
  // (lyric vocabulary, useful for explaining the song & for general use)
  // ===========================================================
  { gw: 'थंडो / ठंडो', hi: 'ठंडा', en: 'cold / cool', tags: ['cold', 'cool', 'ठंडा', 'thando', 'thanda'] },
  { gw: 'गाड़ु', hi: 'नदी / जलधारा', en: 'river / mountain stream', tags: ['river', 'stream', 'नदी', 'जलधारा', 'gaadu', 'gaad'] },
  { gw: 'बौण', hi: 'जंगल', en: 'forest / jungle', tags: ['forest', 'jungle', 'जंगल', 'baun', 'baand'] },
  { gw: 'डांडा', hi: 'पहाड़ की चोटी', en: 'mountain ridge / peak', tags: ['ridge', 'peak', 'पहाड़ चोटी', 'danda'] },
  { gw: 'सेरा / सेरु', hi: 'सीढ़ीदार खेत', en: 'terraced field', tags: ['terraced field', 'सीढ़ीदार खेत', 'sera', 'seru'] },
  { gw: 'चौंरि', hi: 'याक / पहाड़ी पशु', en: 'yak / chauri (Himalayan cattle)', tags: ['yak', 'chauri', 'चौंरि'] },
  { gw: 'ब्योली', hi: 'दुल्हन', en: 'bride', tags: ['bride', 'दुल्हन', 'byoli', 'byouli'] },
  { gw: 'घस्यारी', hi: 'घास काटने वाली स्त्री', en: 'woman who cuts grass / fodder collector', tags: ['ghasyari', 'घस्यारी', 'grass cutter woman', 'fodder woman'] },
  { gw: 'खुदेड़', hi: 'किसी की याद / विरह-वेदना', en: 'longing / pining for someone (homesickness)', tags: ['khuded', 'खुदेड़', 'longing', 'याद', 'विरह'] },
  { gw: 'मैत', hi: 'मायका (विवाहित स्त्री का जन्म-घर)', en: "maternal home (woman's natal village)", tags: ['mait', 'मैत', 'maika', 'मायका', 'maternal home'] },
  { gw: 'सौंजाड़', hi: 'सहेली / संगिनी', en: 'female friend / companion', tags: ['saunjar', 'सौंजाड़', 'female friend', 'companion', 'सहेली'] },
  { gw: 'बीजा', hi: 'जल्दी उठो / जागो', en: 'wake up / get up early', tags: ['wake up', 'get up', 'जागो', 'bija'] },
  { gw: 'बाटो / बाट', hi: 'रास्ता', en: 'path / road', tags: ['path', 'road', 'रास्ता', 'baat', 'bato'] },
  { gw: 'धार', hi: 'पहाड़ की धार / मुहाने पर बहता पानी', en: 'mountain ridge or natural spring outlet', tags: ['dhar', 'धार', 'ridge', 'spring outlet'] },
  { gw: 'धुर', hi: 'दूर / सबसे ऊँची चोटी', en: 'far / highest peak', tags: ['dhur', 'धुर', 'far', 'highest peak'] },
  { gw: 'दीदा', hi: 'देखा (past tense)', en: 'saw / looked at', tags: ['dida', 'दीदा', 'saw', 'देखा'] },
  { gw: 'खैरि / खैर', hi: 'दुख / विपदा', en: 'sorrow / hardship', tags: ['khair', 'खैरि', 'sorrow', 'दुख', 'hardship'] },
  { gw: 'बिगरैकी', hi: 'विरह में / बिछड़कर', en: 'in separation / having parted', tags: ['bigraiki', 'बिगरैकी', 'separation', 'विरह'] },
  { gw: 'मुलुक', hi: 'देश / प्रदेश', en: 'country / homeland', tags: ['mulk', 'mulluk', 'मुलुक', 'country', 'homeland', 'प्रदेश'] },
  { gw: 'पराण', hi: 'प्राण / जान', en: 'life-breath / soul', tags: ['praan', 'पराण', 'life', 'soul', 'प्राण'] },

  // ====================================================================
  // Authentic vocabulary from Uttarakhand Open University textbook
  // (CGL-103 "Garhwali Bhasha, Vyakaran evam Shabdavali" — official
  // government-published certificate course material). Pronouns, verbs,
  // grammar particles, household items, common nouns.
  // ====================================================================

  // --- Pronouns ---
  { gw: 'मि / मी / मैं', hi: 'मैं', en: 'I', tags: ['mi', 'me', 'main', 'मैं', 'i'] },
  { gw: 'हम / हमु', hi: 'हम', en: 'we', tags: ['ham', 'hamu', 'हम', 'we'] },
  { gw: 'त्यार / त्यारो', hi: 'तेरा / तुम्हारा', en: 'your', tags: ['tyar', 'tyaro', 'त्यार', 'your', 'tera', 'tumhara'] },
  { gw: 'त्वै / त्यार', hi: 'तुझे / तेरा', en: 'you (oblique)', tags: ['twai', 'tyar', 'त्वै', 'tujhe'] },
  { gw: 'सु / उ / वु', hi: 'वह (पुरुष)', en: 'he / that (m)', tags: ['su', 'u', 'vu', 'सु', 'वह', 'he'] },
  { gw: 'वा / स्या', hi: 'वह (स्त्री)', en: 'she / that (f)', tags: ['wa', 'sya', 'वा', 'स्या', 'she'] },
  { gw: 'सि / स्या', hi: 'वे', en: 'they', tags: ['si', 'sya', 'सि', 'वे', 'they'] },
  { gw: 'यु / या', hi: 'यह', en: 'this', tags: ['yu', 'ya', 'यु', 'या', 'this', 'yah'] },
  { gw: 'क्वी / कुछ', hi: 'कोई / कुछ', en: 'someone / something', tags: ['kwi', 'kuchh', 'क्वी', 'कोई', 'someone'] },
  { gw: 'अफु / अप्वी', hi: 'खुद / स्वयं', en: 'self / oneself', tags: ['afu', 'apwi', 'अफु', 'खुद', 'self'] },

  // --- Question words ---
  { gw: 'कख', hi: 'कहाँ', en: 'where', tags: ['kakh', 'कख', 'कहाँ', 'where'] },
  { gw: 'कन', hi: 'कैसे / कैसा', en: 'how / what kind', tags: ['kan', 'कन', 'कैसे', 'how'] },
  { gw: 'कतगा', hi: 'कितना', en: 'how much / how many', tags: ['kataga', 'कतगा', 'कितना', 'how much', 'how many'] },
  { gw: 'कै / को', hi: 'कौन / किस', en: 'who / which', tags: ['kai', 'ko', 'कै', 'को', 'who', 'which'] },
  { gw: 'कबारि / कब', hi: 'कब', en: 'when', tags: ['kabari', 'kab', 'कबारि', 'कब', 'when'] },
  { gw: 'किलैक / किलै', hi: 'क्यों', en: 'why', tags: ['kilai', 'kilek', 'किलै', 'क्यों', 'why'] },

  // --- Time / direction adverbs ---
  { gw: 'अबि / अबारि', hi: 'अभी', en: 'now', tags: ['abi', 'abari', 'अबि', 'अभी', 'now'] },
  { gw: 'भोळ', hi: 'कल (आने वाला)', en: 'tomorrow', tags: ['bhol', 'भोळ', 'कल', 'tomorrow'] },
  { gw: 'ब्याळि', hi: 'कल (बीता हुआ)', en: 'yesterday', tags: ['byali', 'ब्याळि', 'kal', 'yesterday'] },
  { gw: 'सुबेर', hi: 'सुबह', en: 'morning', tags: ['suber', 'सुबेर', 'सुबह', 'morning'] },
  { gw: 'ब्यखुनि', hi: 'शाम', en: 'evening', tags: ['byakhuni', 'ब्यखुनि', 'शाम', 'evening', 'सांझ'] },
  { gw: 'दोफर', hi: 'दोपहर', en: 'noon / afternoon', tags: ['dofar', 'दोफर', 'दोपहर', 'noon'] },
  { gw: 'रुमुक', hi: 'गोधूलि / सूर्यास्त', en: 'dusk / sunset', tags: ['rumuk', 'रुमुक', 'godhuli', 'dusk', 'sunset'] },
  { gw: 'इनै', hi: 'इधर / इस ओर', en: 'this way / here', tags: ['inai', 'इनै', 'इधर', 'this way'] },
  { gw: 'उनै / उथैं', hi: 'उधर / उस ओर', en: 'that way / there', tags: ['unai', 'उनै', 'उधर', 'that way'] },
  { gw: 'भैर', hi: 'बाहर', en: 'outside', tags: ['bhair', 'भैर', 'बाहर', 'outside'] },
  { gw: 'भितर', hi: 'अंदर', en: 'inside', tags: ['bhitar', 'भितर', 'अंदर', 'inside'] },
  { gw: 'उब्बु / ऐंच', hi: 'ऊपर', en: 'up / above', tags: ['ubbu', 'aench', 'उब्बु', 'ऊपर', 'up'] },
  { gw: 'निस / बेड़', hi: 'नीचे', en: 'down / below', tags: ['nis', 'bed', 'निस', 'नीचे', 'down'] },

  // --- Common verbs (root forms) ---
  { gw: 'बांचण', hi: 'पढ़ना', en: 'to read', tags: ['banchan', 'बांचण', 'पढ़ना', 'read', 'padhna'] },
  { gw: 'लिख्ण', hi: 'लिखना', en: 'to write', tags: ['likhan', 'लिख्ण', 'लिखना', 'write'] },
  { gw: 'बोलण / बच्याण', hi: 'बोलना', en: 'to speak', tags: ['bolan', 'bachyan', 'बोलण', 'बोलना', 'speak'] },
  { gw: 'सुणण', hi: 'सुनना', en: 'to listen', tags: ['sunan', 'सुणण', 'सुनना', 'listen'] },
  { gw: 'देखण / हेरण', hi: 'देखना', en: 'to see / look', tags: ['dekhan', 'heran', 'देखण', 'देखना', 'see'] },
  { gw: 'खाण', hi: 'खाना', en: 'to eat', tags: ['khan', 'खाण', 'खाना', 'eat'] },
  { gw: 'पीण', hi: 'पीना', en: 'to drink', tags: ['peen', 'पीण', 'पीना', 'drink'] },
  { gw: 'सेण', hi: 'सोना', en: 'to sleep', tags: ['sen', 'सेण', 'सोना', 'sleep'] },
  { gw: 'जाण', hi: 'जाना', en: 'to go', tags: ['jan', 'जाण', 'जाना', 'go'] },
  { gw: 'आण', hi: 'आना', en: 'to come', tags: ['aan', 'आण', 'आना', 'come'] },
  { gw: 'हिटण', hi: 'चलना', en: 'to walk', tags: ['hitan', 'हिटण', 'चलना', 'walk'] },
  { gw: 'कन्न / करण', hi: 'करना', en: 'to do', tags: ['kann', 'karan', 'कन्न', 'करना', 'do'] },
  { gw: 'देण', hi: 'देना', en: 'to give', tags: ['den', 'देण', 'देना', 'give'] },
  { gw: 'धैरण', hi: 'रखना', en: 'to keep / put', tags: ['dharan', 'dheran', 'धैरण', 'रखना', 'keep'] },
  { gw: 'बैठण', hi: 'बैठना', en: 'to sit', tags: ['bethan', 'बैठण', 'बैठना', 'sit'] },
  { gw: 'उठण', hi: 'उठना', en: 'to rise / wake up', tags: ['uthan', 'उठण', 'उठना', 'rise'] },
  { gw: 'मरण', hi: 'मरना', en: 'to die', tags: ['maran', 'मरण', 'मरना', 'die'] },
  { gw: 'म्वन्न', hi: 'मारना', en: 'to hit / kill', tags: ['mwann', 'म्वन्न', 'मारना', 'kill'] },
  { gw: 'उड़ण', hi: 'उड़ना', en: 'to fly', tags: ['udan', 'उड़ण', 'उड़ना', 'fly'] },
  { gw: 'हैंसण', hi: 'हँसना', en: 'to laugh', tags: ['heinsan', 'हैंसण', 'हँसना', 'laugh'] },
  { gw: 'रोण', hi: 'रोना', en: 'to cry', tags: ['ron', 'रोण', 'रोना', 'cry'] },
  { gw: 'बींगण / समझण', hi: 'समझना', en: 'to understand', tags: ['beengan', 'samjhan', 'बींगण', 'समझण', 'समझना', 'understand'] },
  { gw: 'जाण्ण', hi: 'जानना', en: 'to know', tags: ['jaan', 'जाण्ण', 'जानना', 'know'] },
  { gw: 'भागण / अटगण', hi: 'दौड़ना / भागना', en: 'to run', tags: ['bhagan', 'atgan', 'भागण', 'अटगण', 'दौड़ना', 'run'] },
  { gw: 'काटण', hi: 'काटना', en: 'to cut', tags: ['katan', 'काटण', 'काटना', 'cut'] },
  { gw: 'कूटण', hi: 'कूटना / पीटना', en: 'to beat / pound', tags: ['kutan', 'कूटण', 'कूटना', 'pound'] },
  { gw: 'भज्याण', hi: 'तोड़ना', en: 'to break', tags: ['bhajyan', 'भज्याण', 'तोड़ना', 'break'] },
  { gw: 'पाँछण', hi: 'पहुँचना', en: 'to reach / arrive', tags: ['paunchan', 'पाँछण', 'पहुँचना', 'reach', 'arrive'] },

  // --- Helping verb / copula forms ---
  { gw: 'च / छ', hi: 'है', en: 'is', tags: ['cha', 'chha', 'च', 'छ', 'है', 'hai', 'is'] },
  { gw: 'छन', hi: 'हैं', en: 'are', tags: ['chhan', 'छन', 'हैं', 'hain', 'are'] },
  { gw: 'छौं / छौ', hi: 'हूँ', en: 'I am', tags: ['chhaun', 'chhau', 'छौं', 'हूँ', 'i am'] },
  { gw: 'छा', hi: 'थे', en: 'were', tags: ['chha', 'छा', 'थे', 'the', 'were'] },
  { gw: 'छाई / छै', hi: 'थी', en: 'was (f)', tags: ['chhai', 'छाई', 'थी', 'thi', 'was'] },
  { gw: 'ह्वालु / होलो', hi: 'होगा', en: 'will be', tags: ['hwalu', 'holo', 'होगा', 'will be'] },
  { gw: 'ह्वेगि', hi: 'हो गया', en: 'has become / happened', tags: ['hwegi', 'ह्वेगि', 'हो गया', 'happened'] },

  // --- Conjunctions / particles ---
  { gw: 'अर', hi: 'और', en: 'and', tags: ['ar', 'अर', 'और', 'and'] },
  { gw: 'पण', hi: 'पर / लेकिन', en: 'but', tags: ['pan', 'पण', 'पर', 'लेकिन', 'but'] },
  { gw: 'त', hi: 'तो', en: 'then', tags: ['ta', 'त', 'तो', 'then'] },
  { gw: 'फेर / फिर', hi: 'फिर', en: 'then / again', tags: ['pher', 'फेर', 'फिर', 'again'] },
  { gw: 'जै', hi: 'जो (अप्रत्यक्ष)', en: 'whom (oblique)', tags: ['jai', 'जै', 'जो', 'whom'] },
  { gw: 'दगड़ / दगड़ा', hi: 'साथ', en: 'with / together', tags: ['dagad', 'dagada', 'दगड़', 'साथ', 'with'] },
  { gw: 'बिटि / बटिक', hi: 'से (स्थान से)', en: 'from (place)', tags: ['biti', 'batik', 'बिटि', 'से', 'from'] },
  { gw: 'सणि / तैं', hi: 'को (कर्म)', en: 'to (object)', tags: ['sani', 'tain', 'सणि', 'तैं', 'को'] },
  { gw: 'मा', hi: 'में', en: 'in', tags: ['ma', 'मा', 'में', 'in'] },
  { gw: 'पर / ऊपर', hi: 'पर / ऊपर', en: 'on / over', tags: ['par', 'पर', 'ऊपर', 'on'] },

  // --- Household / common items ---
  { gw: 'खाणौ', hi: 'खाना / भोजन', en: 'food / meal', tags: ['khanau', 'खाणौ', 'खाना', 'food', 'भोजन'] },
  { gw: 'पाणि', hi: 'पानी', en: 'water', tags: ['pani', 'पाणि', 'पानी', 'water'] },
  { gw: 'दूद', hi: 'दूध', en: 'milk', tags: ['dud', 'दूद', 'दूध', 'milk'] },
  { gw: 'दै', hi: 'दही', en: 'curd / yoghurt', tags: ['dai', 'दै', 'दही', 'curd'] },
  { gw: 'घ्यू', hi: 'घी', en: 'ghee', tags: ['ghyu', 'घ्यू', 'घी', 'ghee'] },
  { gw: 'चौंल', hi: 'चावल', en: 'rice', tags: ['chaunl', 'चौंल', 'चावल', 'rice'] },
  { gw: 'दाळ', hi: 'दाल', en: 'lentils', tags: ['daal', 'दाळ', 'दाल', 'lentils'] },
  { gw: 'भात', hi: 'पका चावल / भात', en: 'cooked rice', tags: ['bhat', 'भात', 'cooked rice'] },
  { gw: 'र्वटि / रोटि', hi: 'रोटी', en: 'flatbread', tags: ['rwati', 'roti', 'र्वटि', 'रोटी', 'roti'] },
  { gw: 'भुज्जि', hi: 'सब्जी', en: 'vegetable curry', tags: ['bhujji', 'भुज्जि', 'सब्जी', 'vegetable'] },
  { gw: 'लूण', hi: 'नमक', en: 'salt', tags: ['loon', 'लूण', 'नमक', 'salt'] },
  { gw: 'चिनि', hi: 'चीनी', en: 'sugar', tags: ['chini', 'चिनि', 'चीनी', 'sugar'] },
  { gw: 'चा', hi: 'चाय', en: 'tea', tags: ['cha', 'चा', 'चाय', 'tea'] },

  // --- People / family (extra) ---
  { gw: 'मनखि', hi: 'मनुष्य / आदमी', en: 'human / person', tags: ['manakhi', 'मनखि', 'मनुष्य', 'आदमी', 'person', 'human'] },
  { gw: 'जनानि', hi: 'स्त्री / औरत', en: 'woman', tags: ['janani', 'जनानि', 'स्त्री', 'औरत', 'woman'] },
  { gw: 'बैख / मर्द', hi: 'पुरुष / मर्द', en: 'man', tags: ['baikh', 'mard', 'बैख', 'पुरुष', 'man'] },
  { gw: 'नौनु / नौन्याल', hi: 'बेटा / बच्चा', en: 'son / boy', tags: ['nonu', 'nonyal', 'नौनु', 'बेटा', 'son', 'boy'] },
  { gw: 'नौनि', hi: 'बेटी / लड़की', en: 'daughter / girl', tags: ['noni', 'नौनि', 'बेटी', 'लड़की', 'daughter', 'girl'] },
  { gw: 'पौणो', hi: 'मेहमान / अतिथि', en: 'guest', tags: ['pauno', 'पौणो', 'मेहमान', 'guest'] },
  { gw: 'दगड़्या / गैल्या', hi: 'मित्र / साथी', en: 'friend / companion', tags: ['dagdya', 'gailya', 'दगड़्या', 'मित्र', 'friend'] },
  { gw: 'इस्कुल्या', hi: 'विद्यार्थी', en: 'student', tags: ['iskulya', 'इस्कुल्या', 'विद्यार्थी', 'student'] },

  // --- Emotional / colloquial words ---
  { gw: 'रौंस', hi: 'आनंद / उमंग', en: 'joy / delight', tags: ['rauns', 'रौंस', 'आनंद', 'joy'] },
  { gw: 'खुद', hi: 'याद / विरह', en: 'longing / homesickness', tags: ['khud', 'खुद', 'याद', 'longing'] },
  { gw: 'किरपा', hi: 'कृपा', en: 'kindness / grace', tags: ['kirpa', 'किरपा', 'कृपा', 'grace'] },
  { gw: 'भलु', hi: 'अच्छा / भला', en: 'good', tags: ['bhalu', 'भलु', 'अच्छा', 'good'] },
  { gw: 'सजिलो / स्वाणो', hi: 'सुंदर', en: 'beautiful', tags: ['sajilo', 'swano', 'सजिलो', 'सुंदर', 'beautiful'] },
  { gw: 'भौत / बिणि', hi: 'बहुत', en: 'many / much', tags: ['bhaut', 'bini', 'भौत', 'बहुत', 'many'] },
  { gw: 'जरा / मणि', hi: 'थोड़ा', en: 'a little', tags: ['jara', 'mani', 'जरा', 'मणि', 'थोड़ा', 'little'] },
  { gw: 'सरासर', hi: 'जल्दी / तेज़ी से', en: 'quickly / fast', tags: ['sarasar', 'सरासर', 'quickly', 'fast'] },
  { gw: 'मठु-मठु', hi: 'धीरे-धीरे', en: 'slowly', tags: ['mathu-mathu', 'मठु-मठु', 'धीरे', 'slowly'] },

  // --- Misc place / things ---
  { gw: 'दिसा / तरफां', hi: 'दिशा / तरफ', en: 'direction / side', tags: ['disha', 'tarfan', 'दिसा', 'दिशा', 'direction'] },
  { gw: 'नजीक', hi: 'पास / निकट', en: 'near', tags: ['najik', 'नजीक', 'पास', 'near'] },
  { gw: 'दूर', hi: 'दूर', en: 'far', tags: ['dur', 'दूर', 'far'] },
  { gw: 'ब्वारी', hi: 'बहू', en: 'daughter-in-law', tags: ['bwari', 'ब्वारी', 'बहू', 'daughter-in-law'] },
  { gw: 'भौजि / बौ', hi: 'भाभी', en: 'sister-in-law', tags: ['bhauji', 'bo', 'भौजि', 'भाभी', 'sister-in-law'] },
  { gw: 'जेठाण', hi: 'जेठानी', en: 'elder sister-in-law', tags: ['jethan', 'जेठाण', 'जेठानी'] },
  { gw: 'सासु', hi: 'सास', en: 'mother-in-law', tags: ['sasu', 'सासु', 'सास', 'mother-in-law'] },
  { gw: 'जवैं', hi: 'दामाद', en: 'son-in-law', tags: ['jawain', 'जवैं', 'दामाद', 'son-in-law'] },
  { gw: 'द्यूर', hi: 'देवर', en: "husband's younger brother", tags: ['dyur', 'द्यूर', 'देवर'] },
  { gw: 'भुली', hi: 'छोटी बहन', en: 'younger sister', tags: ['bhuli', 'भुली', 'छोटी बहन', 'younger sister'] },

  // --- Yatra / pilgrimage vocabulary (used in Char Dham doli/yatra reporting) ---
  { gw: 'राति', hi: 'रात / रात्रि', en: 'night', tags: ['raati', 'rati', 'राति', 'रात', 'रात्रि', 'night'] },
  { gw: 'राति बस्णा / राति बास', hi: 'रात्रि प्रवास / रात्रि विश्राम', en: 'overnight stay / night halt', tags: ['raati basna', 'rati bas', 'राति बस्णा', 'रात्रि प्रवास', 'night halt', 'overnight stay', 'विश्राम'] },
  { gw: 'बस्णा / बासा करण', hi: 'ठहरना / निवास करना', en: 'to stay / to lodge', tags: ['basna', 'basa karan', 'बस्णा', 'ठहरना', 'stay', 'lodge', 'निवास'] },
  { gw: 'पहुंचि गे / पौंछि गे', hi: 'पहुँच गई / पहुँच गया', en: 'reached / arrived', tags: ['pahunchi ge', 'paunchi ge', 'पहुंचि गे', 'पौंछि गे', 'पहुँच गई', 'पहुँच गया', 'reached', 'arrived'] },
  { gw: 'का वास्ता / खातिर', hi: 'के लिए', en: 'for / for the sake of', tags: ['ka vasta', 'khatir', 'का वास्ता', 'खातिर', 'के लिए', 'for'] },
  { gw: 'डोली', hi: 'डोली / पालकी (देव यात्रा की)', en: 'doli / palanquin (of the deity in yatra)', tags: ['doli', 'डोली', 'palanquin', 'पालकी', 'yatra'] },
  { gw: 'जात्रा / यात्रा', hi: 'देव यात्रा / तीर्थ यात्रा', en: 'deity procession / pilgrimage', tags: ['jatra', 'yatra', 'जात्रा', 'यात्रा', 'pilgrimage', 'procession'] },

  // --- Agriculture & nature (source: himlingo.com Garhwali Agriculture & Nature) ---
  { gw: 'डाँडा / डांडा', hi: 'पहाड़', en: 'mountain', tags: ['danda', 'daanda', 'डाँडा', 'डांडा', 'पहाड़', 'mountain'] },
  { gw: 'जंगलात', hi: 'वन विभाग / जंगल', en: 'forest department / forest', tags: ['janglat', 'जंगलात', 'वन विभाग', 'forest', 'jungle'] },
  { gw: 'स्यारि / सारी', hi: 'गाँव का कृषि क्षेत्र / सीढ़ीदार खेत', en: 'village farmland / terraced fields', tags: ['syari', 'sari', 'स्यारि', 'सारी', 'farmland', 'terraced field', 'कृषि क्षेत्र'] },
  { gw: 'पुंगड़ा / पुङ्गुड़ु', hi: 'खेत', en: 'field / farm', tags: ['pungda', 'pungudu', 'पुंगड़ा', 'पुङ्गुड़ु', 'खेत', 'field', 'farm'] },
  { gw: 'डाली बूटी', hi: 'पेड़-पौधे', en: 'trees and plants', tags: ['dali buti', 'डाली बूटी', 'पेड़ पौधे', 'trees and plants', 'flora'] },
  { gw: 'माटु', hi: 'मिट्टी', en: 'soil / earth', tags: ['matu', 'माटु', 'मिट्टी', 'soil', 'earth', 'mitti'] },
  { gw: 'झुंगरु', hi: 'जौ', en: 'barley', tags: ['jhungru', 'झुंगरु', 'जौ', 'barley', 'jau'] },
  { gw: 'सट्टी', hi: 'चावल / चाँवल', en: 'rice', tags: ['satti', 'सट्टी', 'चावल', 'चाँवल', 'rice'] },
  { gw: 'उरख्यलि', hi: 'ओखली', en: 'mortar (for pounding grain)', tags: ['urkhyali', 'उरख्यलि', 'ओखली', 'mortar', 'okhli'] },
  { gw: 'जंदरी / जन्दुर', hi: 'हाथ चक्की', en: 'hand mill / grinding stone', tags: ['jandri', 'jandur', 'जंदरी', 'जन्दुर', 'हाथ चक्की', 'hand mill', 'grinding stone'] },
  { gw: 'हैल', hi: 'हल', en: 'plough', tags: ['hail', 'हैल', 'हल', 'plough', 'plow'] },
  { gw: 'बल्द / ढांग', hi: 'बैल', en: 'ox / bullock', tags: ['bald', 'dhang', 'बल्द', 'ढांग', 'बैल', 'ox', 'bullock'] },
  { gw: 'लकड़ी', hi: 'लकड़ी', en: 'wood', tags: ['lakdi', 'लकड़ी', 'wood', 'timber'] },
  { gw: 'हल्ल्या', hi: 'हल चलाने वाला / हलवाहा', en: 'ploughman', tags: ['hallya', 'हल्ल्या', 'हलवाहा', 'ploughman', 'plowman'] },
  { gw: 'गौचर', hi: 'जानवरों के चलने का रास्ता / चरागाह', en: 'cattle path / pasture', tags: ['gauchar', 'गौचर', 'चरागाह', 'cattle path', 'pasture', 'grazing'] },
  { gw: 'घसेरी / घस्यारी', hi: 'घसयारिन (घास काटने वाली स्त्री)', en: 'woman who cuts grass for cattle', tags: ['ghaseri', 'ghasyari', 'घसेरी', 'घस्यारी', 'घसयारिन', 'grass cutter'] },
  { gw: 'फालू / फौड़', hi: 'फावड़ा', en: 'spade / shovel', tags: ['phalu', 'phaud', 'फालू', 'फौड़', 'फावड़ा', 'spade', 'shovel'] },
  { gw: 'चखुला', hi: 'चिड़िया', en: 'bird', tags: ['chakhula', 'चखुला', 'चिड़िया', 'bird', 'chidiya'] },

  // ===========================================================================
  // बनि बनि किस्मौ व्यवहार — Words for different behaviors / habits / conduct
  // Source: बालकृष्ण डी ध्यानी (sites.google.com/view/dhyani), based on
  // श्रीमती रजनी कुकरेती, "गढ़वाली भाषा का व्याकरण" (Dehradun).
  // These are onomatopoeic / descriptive single-word terms with no neat
  // Hindi or English equivalent — perfect for authentic Garhwali tone.
  // ===========================================================================
  { gw: 'कतामती', hi: 'जल्दबाज़ी / उतावलापन', en: 'haste, hurried behavior', tags: ['katamati', 'कतामती', 'haste', 'hurry', 'जल्दबाज़ी', 'behavior', 'vyavhar'] },
  { gw: 'खिगचाट', hi: 'ज़ोर-ज़ोर से हंसी मज़ाक', en: 'loud laughing and joking', tags: ['khigchat', 'खिगचाट', 'laugh', 'joke', 'मज़ाक', 'behavior'] },
  { gw: 'खुचर्याट', hi: 'बेकार / नकारात्मक बहस करना', en: 'unnecessary or negative argument', tags: ['khuchryat', 'खुचर्याट', 'argue', 'argument', 'बहस', 'behavior'] },
  { gw: 'खुबसाट', hi: 'फुसफुसाहट / कानाफूसी', en: 'whisper, whispering talk', tags: ['khubsat', 'खुबसाट', 'whisper', 'फुसफुसाहट', 'behavior'] },
  { gw: 'घिघलाट', hi: 'बच्चों की वो हंसी-मज़ाक जो बड़ों के सामने नही करनी चाहिए', en: 'inappropriate joking by children not permitted before elders', tags: ['ghighlat', 'घिघलाट', 'joke', 'children', 'behavior'] },
  { gw: 'चचराट', hi: 'निम्न स्तर पर अधिक बहस करना', en: 'arguing at a low / petty level', tags: ['chachrat', 'चचराट', 'argue', 'petty', 'behavior'] },
  { gw: 'चबल़ाट', hi: 'बेचैन / चंचल व्यवहार', en: 'restless behavior', tags: ['chablat', 'चबल़ाट', 'restless', 'बेचैन', 'behavior'] },
  { gw: 'जकबक', hi: 'अपने ऊपर नियंत्रण न होना', en: 'no control over oneself', tags: ['jakbak', 'जकबक', 'no control', 'behavior'] },
  { gw: 'तितड़ात', hi: 'मौखिक झगड़े मा बहस', en: 'argument during a verbal fight', tags: ['titdat', 'तितड़ात', 'argument', 'fight', 'behavior'] },
  { gw: 'धंगध्याट', hi: 'बेमतलब उछल-कूद जो दुसरों को चिढ़ाए', en: 'aimless jumping/playing that irritates others', tags: ['dhangdhyat', 'धंगध्याट', 'jumping', 'irritate', 'behavior'] },
  { gw: 'नचराट / नचर्याट', hi: 'दिखावा / बेचैन व्यवहार', en: 'showy / restless behavior', tags: ['nachryat', 'नचराट', 'नचर्याट', 'showy', 'restless', 'behavior'] },
  { gw: 'फफराट', hi: 'दिखावा / डींग मारणु', en: 'showy / boastful behavior', tags: ['phaphrat', 'फफराट', 'boastful', 'showy', 'behavior'] },
  { gw: 'बबराट', hi: 'गुस्सा मा चमकणु / भड़कणु', en: 'dazzling in rage', tags: ['babrat', 'बबराट', 'rage', 'गुस्सा', 'behavior'] },
  { gw: 'रगबग', hi: 'बहुत सारे काम या भ्रम सी असमंजस की स्थिति', en: 'perplexed condition due to many works or confusion', tags: ['ragbag', 'रगबग', 'perplexed', 'confusion', 'behavior'] },
  { gw: 'रगर्याट', hi: 'भावुक व्यवहार — खास कर भावनाओं मा जल्दबाज़ी', en: 'emotional behavior, haste from high emotion', tags: ['ragryat', 'रगर्याट', 'emotional', 'behavior'] },
  { gw: 'लबराट', hi: 'बेमतलब लगातार बोलणु (विशेषकर महिला)', en: 'speaking continuously without aim', tags: ['labrat', 'लबराट', 'talkative', 'behavior'] },
  { gw: 'लबड़ाट', hi: 'बेमतलब देरी', en: 'unnecessary delay', tags: ['labdat', 'लबड़ाट', 'delay', 'देरी', 'behavior'] },
  { gw: 'सगर -बगर', hi: 'उत्साह मा हलचल / कोलाहल', en: 'commotion in enthusiasm', tags: ['sagar bagar', 'सगर बगर', 'commotion', 'enthusiasm', 'behavior'] },
  { gw: 'स्क्स्याट / सगस्याट', hi: 'तेज़ साँस', en: 'fast breath / panting', tags: ['saksyat', 'sagasyat', 'सगस्याट', 'panting', 'breath', 'behavior'] },
  { gw: 'हकदक', hi: 'चकित / आश्चर्यचकित', en: 'surprise, astonished', tags: ['hakdak', 'हकदक', 'surprised', 'astonished', 'आश्चर्य', 'behavior'] },

  // ===========================================================================
  // बनि बनि क अव़ाज — Various types of sounds (onomatopoeia)
  // Same source. These give authentic flavor when describing nature,
  // village life, animals, weather etc.
  // ===========================================================================
  { gw: 'भिमणाट', hi: 'मक्खी (माख) की आवाज़', en: 'sound of a house fly', tags: ['bhimnat', 'भिमणाट', 'fly sound', 'मक्खी', 'sound', 'awaaz'] },
  { gw: 'गगडाट', hi: 'बादल की गड़गड़ाहट', en: 'sound of cloud / thunder', tags: ['gagdat', 'गगडाट', 'thunder', 'cloud', 'बादल', 'sound'] },
  { gw: 'गुमणाट', hi: 'मधुमक्खियों जै मनुष्य कि आवाज़ (भनभनाहट)', en: 'human sound resembling bees, buzzing', tags: ['gumnat', 'गुमणाट', 'buzz', 'bees', 'sound'] },
  { gw: 'खमणाट', hi: 'धातु बर्तनों की रगड़ या बर्तन गिरण की आवाज़', en: 'sound of friction among metal utensils or utensils falling', tags: ['khamnat', 'खमणाट', 'utensils', 'metal', 'sound'] },
  { gw: 'छमणाट', hi: 'चूड़ियों या पायल की आवाज़', en: 'sound of bangles or anklets', tags: ['chhamnat', 'छमणाट', 'bangles', 'anklets', 'sound'] },
  { gw: 'च्वींचाट', hi: 'चिड़ियों या चूहों की आवाज़', en: 'sound of birds or mice', tags: ['chwinchat', 'च्वींचाट', 'birds', 'mice', 'sound'] },
  { gw: 'घुंघ्याट', hi: 'गाड़ियों की आवाज़', en: 'sound of automobiles', tags: ['ghunghyat', 'घुंघ्याट', 'vehicle', 'automobile', 'sound'] },
  { gw: 'घगराट', hi: 'घर की चक्की या मिल की आवाज़', en: 'sound of house grinders / mills', tags: ['ghagrat', 'घगराट', 'grinder', 'mill', 'चक्की', 'sound'] },
  { gw: 'छिबडाट', hi: 'सूखी झाड़ी या सूखे पत्तों मा चलण की आवाज़', en: 'walking inside dry bushes or on dry leaves', tags: ['chhibdat', 'छिबडाट', 'dry leaves', 'walking', 'sound'] },
  { gw: 'ततडाट', hi: 'पाणी गिरण की आवाज़', en: 'sound of falling water', tags: ['tatdat', 'ततडाट', 'falling water', 'sound'] },
  { gw: 'कणाट', hi: 'बुखार या दर्द मा धीमी कराह — ऊं ऊं', en: 'low cry/moan in fever or pain', tags: ['kanat', 'कणाट', 'moan', 'pain', 'fever', 'sound'] },
  { gw: 'तबडाट', hi: 'अनाज भुनण की आवाज़', en: 'sound of roasting cereals', tags: ['tabdat', 'तबडाट', 'roasting', 'cereals', 'sound'] },
  { gw: 'बबडाट', hi: 'मुँह के अंदर बुदबुदाण की आवाज़', en: 'sound of muttering inside the mouth', tags: ['babdat', 'बबडाट', 'muttering', 'sound'] },
  { gw: 'घमणाट', hi: 'घंटियों की आवाज़', en: 'sound of bells', tags: ['ghamnat', 'घमणाट', 'bells', 'घंटी', 'sound'] },
  { gw: 'स्वींसाट', hi: 'पाणी (नदी, धारा) के बहण की आवाज़', en: 'sound of flowing water (river, streams)', tags: ['swinsat', 'स्वींसाट', 'river', 'flow', 'water', 'sound'] },
  { gw: 'प्वींपाट', hi: 'छोटे बच्चों कु रोणु', en: 'weeping of younger children', tags: ['pwinpat', 'प्वींपाट', 'weeping', 'children', 'sound'] },
  { gw: 'घमघ्याट', hi: 'मनुष्यों के दौड़ण/उछलण की आवाज़', en: 'sound when persons run or jump', tags: ['ghamghyat', 'घमघ्याट', 'running', 'jumping', 'sound'] },
  { gw: 'ससराट', hi: 'चलते समय कपड़ों की आवाज़', en: 'sound of clothing while walking', tags: ['sasrat', 'ससराट', 'clothing', 'walking', 'sound'] },
  { gw: 'खड़बाट', hi: 'दरवाजा या धातु पेटी खुलण की आवाज़', en: 'sound of opening a door or metal box', tags: ['khadbat', 'खड़बाट', 'door', 'opening', 'sound'] },
  { gw: 'भभडाट', hi: 'दरवाजा का अचानक धड़ाम (हवा या खुलण से)', en: 'sudden bang of door (by air or opening)', tags: ['bhabdat', 'भभडाट', 'bang', 'door', 'sound'] },
  { gw: 'खिगताट', hi: 'जोर सी हंसी (खासकर बच्चूं की)', en: 'loud laughing especially by youngsters', tags: ['khigtat', 'खिगताट', 'loud laugh', 'children', 'sound'] },

  // ===========================================================================
  // पिटण / मारण का शब्द — Verbs of hitting / striking
  // ===========================================================================
  { gw: 'धळकौण', hi: 'अंगूठा सी मारणु / डाल काटणु', en: 'to strike with thumb / to cut a branch', tags: ['dhalkaun', 'धळकौण', 'strike', 'cut', 'hit'] },
  { gw: 'लठयाण', hi: 'लकड़ी कि छड़ी सी मारणु', en: 'to beat with a wooden rod', tags: ['lathyan', 'लठयाण', 'beat', 'rod', 'lathi', 'hit'] },
  { gw: 'मुठक्यांण', hi: 'मुक्का मारणु', en: 'to punch / fist', tags: ['muthkyan', 'मुठक्यांण', 'punch', 'fist', 'मुक्का', 'hit'] },
  { gw: 'चुटण / सुटक्याण', hi: 'लचीली छड़ी सी मारणु', en: 'to beat by a flexible stick', tags: ['chutan', 'sutkyan', 'चुटण', 'सुटक्याण', 'beat', 'stick', 'hit'] },
  { gw: 'थंचकौण', hi: 'कुचलणु', en: 'to crush', tags: ['thanchkaun', 'थंचकौण', 'crush', 'कुचलना'] },
  { gw: 'लत्याण', hi: 'पैरों सी मारणु', en: 'to beat with feet / kick', tags: ['latyan', 'लत्याण', 'kick', 'feet', 'hit'] },
  { gw: 'कचमोरण / कचमोन / कचमोर्न / कचम्वन', hi: 'मसलणु / निचोड़णु', en: 'to squeeze / crush', tags: ['kachmoran', 'कचमोरण', 'कचम्वन', 'squeeze', 'crush'] },
  { gw: 'कच्याण', hi: 'पथ्थर सी कुचलणु / काटणु', en: 'to crush or cut by stone', tags: ['kachyan', 'कच्याण', 'crush', 'stone', 'hit'] },

  // ===========================================================================
  // गढ़वाल का बावन (52) ब्यंजन — Garhwal's 52 traditional dishes
  // Authentic ठेट गढ़वाली names. (Some already covered above — added with
  // explicit "बावन ब्यंजन" tag for retrieval.)
  // ===========================================================================
  { gw: 'बावन ब्यंजन', hi: 'गढ़वाल का 52 पारंपरिक व्यंजन', en: '52 traditional dishes of Garhwal', tags: ['bawan vyanjan', 'बावन ब्यंजन', '52 dishes', 'traditional food', 'garhwal food', 'cuisine'], note: 'गढ़वाल मा "बावन गढ़ कु गढ़वाल" से जुड़ी परम्परा — कृष्ण कुमार ममगांई जी द्वारा संकलित 52 ठेट गढ़वाली ब्यंजन: खिचड़ी, गिंजड़ी, पल्यो, छछिन्डु, बाड़ी, रैलु, रैठु, ढुंगला, स्वाली, भूड़ी/पक्वड़ी, रोट, अरसा, गुलगुला, लगड़ी, पैतूड़, मरगल, बुखणा, पटुड़ी, परसाद, सूजी, सत्तू, पाइस, झंग्वरू, कौंणी, पिंजरी, भटगरू, चैंसु, फांणु, झ्वल्ली, गथ्वणि, थींच्वणी, झोल, दाल, भात, र्वट्टी (रोटी), रोट (परसाद), पीलू भात, खुसका, भुज्जी, कफली, धपड़ी, बोड़ी, भ्वरीं र्वट्टी, पिस्यूँ लूण, कचम्वली, मिठै, खटै (चटनी), च्यूँ, सिकार, कुखड़, अंडरु, गड्याल/माछा।' },
  { gw: 'गिंजड़ी', hi: 'पारंपरिक गढ़वाली व्यंजन', en: 'traditional Garhwali dish', tags: ['ginjdi', 'गिंजड़ी', 'food', 'dish'] },
  { gw: 'पल्यो', hi: 'मंडुवा/जौ के आटे की पतली पकौड़ी जैसी डिश', en: 'thin gruel / paste dish from millet/barley flour', tags: ['palyo', 'पल्यो', 'food', 'dish'] },
  { gw: 'छछिन्डु', hi: 'मट्ठा/छाछ आधारित पारंपरिक व्यंजन', en: 'buttermilk-based traditional dish', tags: ['chhachhindu', 'छछिन्डु', 'buttermilk', 'food'] },
  { gw: 'बाड़ी', hi: 'मंडुवा का गाढ़ा हलवा जैसा व्यंजन (नमकीन)', en: 'thick savory finger-millet (mandua) preparation', tags: ['baadi', 'बाड़ी', 'mandua', 'finger millet', 'food'] },
  { gw: 'रैलु', hi: 'चावल और दाल का पारंपरिक व्यंजन', en: 'traditional rice + dal preparation', tags: ['railu', 'रैलु', 'rice', 'food'] },
  { gw: 'रैठु', hi: 'पारंपरिक गढ़वाली व्यंजन', en: 'traditional Garhwali dish', tags: ['raithu', 'रैठु', 'food'] },
  { gw: 'ढुंगला', hi: 'पत्तों मा लपेट के बण्यां पारंपरिक व्यंजन', en: 'traditional dish wrapped in leaves', tags: ['dhungla', 'ढुंगला', 'leaf wrap', 'food'] },
  { gw: 'स्वाली', hi: 'पूरी जैसा तला हुआ मीठा/नमकीन', en: 'fried sweet/savory like puri', tags: ['swali', 'स्वाली', 'puri', 'fried', 'food'] },
  { gw: 'भूड़ी / पक्वड़ी', hi: 'पकौड़ी जैसा तला व्यंजन', en: 'fritter-like fried dish', tags: ['bhudi', 'pakwadi', 'भूड़ी', 'पक्वड़ी', 'fritter', 'food'] },
  { gw: 'रोट', hi: 'गाढ़ी मोटी रोटी — प्रसाद के रूप मा भि', en: 'thick dense bread, also offered as prasad', tags: ['rot', 'रोट', 'bread', 'prasad', 'food'] },
  { gw: 'गुलगुला', hi: 'गुड़ और आटे का तला हुआ मीठा', en: 'fried jaggery-flour sweet ball', tags: ['gulgula', 'गुलगुला', 'sweet', 'jaggery', 'food'] },
  { gw: 'लगड़ी', hi: 'पारंपरिक मीठा/नमकीन', en: 'traditional sweet/savory', tags: ['lagdi', 'लगड़ी', 'food'] },
  { gw: 'पैतूड़', hi: 'अरबी/कोलकासिया के पत्ते सी बण्यां पारंपरिक व्यंजन', en: 'arbi/colocasia leaf-roll dish', tags: ['paitud', 'पैतूड़', 'arbi', 'colocasia', 'patod', 'food'] },
  { gw: 'मरगल', hi: 'पारंपरिक नमकीन व्यंजन', en: 'traditional savory dish', tags: ['margal', 'मरगल', 'food'] },
  { gw: 'बुखणा', hi: 'भुना हुआ अनाज (स्नैक)', en: 'roasted grain snack', tags: ['bukhna', 'बुखणा', 'roasted', 'snack', 'food'] },
  { gw: 'पटुड़ी', hi: 'अरबी के पत्तों कि लपेट सी बण्यां व्यंजन', en: 'colocasia leaf rolls (similar to patra)', tags: ['patudi', 'पटुड़ी', 'arbi', 'food'] },
  { gw: 'झंग्वरू / झंग्वरा', hi: 'झंगोरा कि खीर/भात', en: 'barnyard millet (jhangora) preparation', tags: ['jhangwru', 'झंग्वरू', 'jhangora', 'millet', 'food'] },
  { gw: 'कौंणी', hi: 'कौंणी (foxtail millet) कु व्यंजन', en: 'foxtail millet dish', tags: ['kaunni', 'कौंणी', 'foxtail millet', 'food'] },
  { gw: 'पिंजरी', hi: 'पारंपरिक गढ़वाली व्यंजन', en: 'traditional Garhwali dish', tags: ['pinjri', 'पिंजरी', 'food'] },
  { gw: 'भटगरू', hi: 'काले भट्ट कि दाल कु व्यंजन', en: 'black soybean (bhatt) dish', tags: ['bhatgaru', 'भटगरू', 'bhatt', 'soybean', 'food'] },
  { gw: 'झ्वल्ली', hi: 'पतली कढ़ी जैसी डिश', en: 'thin curry-like dish', tags: ['jhwalli', 'झ्वल्ली', 'curry', 'food'] },
  { gw: 'गथ्वणि / गहत्वाणि', hi: 'गहत (कुलथी) कि पतली दाल', en: 'thin horse-gram lentil', tags: ['gathwani', 'गथ्वणि', 'gahat', 'horse gram', 'food'] },
  { gw: 'थींच्वणी', hi: 'पथ्थर पे कूट के बणाई दाल/सब्जी', en: 'stone-pounded lentil/vegetable preparation', tags: ['thinchwani', 'थींच्वणी', 'pounded', 'food'] },
  { gw: 'झोल', hi: 'पतला रसा / तरी', en: 'thin gravy / broth', tags: ['jhol', 'झोल', 'gravy', 'broth', 'food'] },
  { gw: 'पीलू भात', hi: 'पीला भात (हल्दी आदि सी रंगदार)', en: 'yellow turmeric rice', tags: ['pilu bhat', 'पीलू भात', 'rice', 'turmeric', 'food'] },
  { gw: 'खुसका', hi: 'सादा भुना हुआ भात', en: 'plain pulao-like rice', tags: ['khuska', 'खुसका', 'rice', 'food'] },
  { gw: 'धपड़ी', hi: 'पारंपरिक गढ़वाली व्यंजन', en: 'traditional Garhwali dish', tags: ['dhapdi', 'धपड़ी', 'food'] },
  { gw: 'बोड़ी', hi: 'दाल की बड़ी (सूखा) — सब्जी बणाण मा प्रयोग', en: 'sun-dried lentil dumplings used in curry', tags: ['bodi', 'बोड़ी', 'badi', 'food'] },
  { gw: 'भ्वरीं र्वट्टी', hi: 'भरवा रोटी', en: 'stuffed roti', tags: ['bhwarin rwatti', 'भ्वरीं र्वट्टी', 'stuffed roti', 'bharwa', 'food'] },
  { gw: 'पिस्यूँ लूण', hi: 'पिसा हुआ नमक (मसाले युक्त)', en: 'ground spiced salt (chutney-style)', tags: ['pisyun lun', 'पिस्यूँ लूण', 'ground salt', 'spiced salt', 'food'] },
  { gw: 'कचम्वली', hi: 'पारंपरिक चटनी/अचार जैसा', en: 'traditional pickle/chutney-like preparation', tags: ['kachmwali', 'कचम्वली', 'pickle', 'chutney', 'food'] },
  { gw: 'मिठै', hi: 'मिठाई', en: 'sweet', tags: ['mithai', 'मिठै', 'sweet', 'food'] },
  { gw: 'खटै', hi: 'चटनी', en: 'chutney', tags: ['khatai', 'खटै', 'chutney', 'food'] },
  { gw: 'च्यूँ', hi: 'मशरूम / कुकुरमुत्ता', en: 'mushroom', tags: ['chyun', 'च्यूँ', 'mushroom', 'food'] },
  { gw: 'सिकार', hi: 'शिकार कु मांस (मटन/जंगली)', en: 'meat from hunt (mutton / wild game)', tags: ['sikar', 'सिकार', 'meat', 'mutton', 'food'] },
  { gw: 'कुखड़', hi: 'मुर्गा / कुक्कुट', en: 'chicken', tags: ['kukhad', 'कुखड़', 'chicken', 'kukkut', 'food'] },
  { gw: 'अंडरु', hi: 'अंडा', en: 'egg', tags: ['andru', 'अंडरु', 'egg', 'food'] },
  { gw: 'गड्याल / माछा', hi: 'मछली', en: 'fish', tags: ['gadyal', 'macha', 'गड्याल', 'माछा', 'fish', 'food'] },

  // ===========================================================================
  // गढ़वाल का बावन (52) डाला — 52 traditional trees of Garhwal
  // ===========================================================================
  { gw: 'बावन डाला', hi: 'गढ़वाल का 52 पारंपरिक पेड़', en: '52 traditional trees of Garhwal', tags: ['bawan dala', 'बावन डाला', '52 trees', 'garhwal trees', 'flora', 'plants'], note: 'गढ़वाल का 52 आम पेड़ (कृष्ण कुमार ममगांई जी संकलित): कुलैं, बांज, खड़िक, ककड़सिंग, तूंण, औंला, बेडू, तिमला, भ्यूल, काफल, पीपल, पय्यां, दल्म्या, अनार, लुकाट, माल्टा, दक्क, च्वाला, आरू, बुरान्स, रौंसल, ग्वीराल, लींची, आम, लिसोड़ा, सेब, नाशपाती, मेलु, मौसमी, पुलम, खैर, सांधण, साल, शीसम, बांस, ईसकोस, हैड़ा, निम्म्बु, डैंगण, सेमल, द्वोदार, अखोड़, ब्यलपत्री, नारंगी, संतरा, चबूतरा/चकोतरा, गलगल, सेउ, हल्दु, खिन्ना, खुमानी, अमरूद। (झाड़ियाँ जै किनगोड़, घिंगरू, हिंसर अलग सूची मा।)' },
  { gw: 'बांज', hi: 'बांज का पेड़ (Himalayan oak)', en: 'Himalayan oak — vital for water springs & forests', tags: ['banj', 'बांज', 'oak', 'tree', 'forest', 'flora'] },
  { gw: 'बुरान्स', hi: 'बुरांश (Rhododendron) — गढ़वाल का राज्य पुष्प', en: 'Rhododendron arboreum — state flower of Uttarakhand', tags: ['burans', 'बुरान्स', 'rhododendron', 'flower', 'state flower', 'tree'] },
  { gw: 'काफल', hi: 'काफल — पहाड़ी जंगली फल', en: 'Kafal (Box-myrtle) — wild Himalayan berry', tags: ['kafal', 'काफल', 'box myrtle', 'wild berry', 'fruit', 'tree'] },
  { gw: 'द्वोदार', hi: 'देवदार', en: 'deodar / Himalayan cedar', tags: ['dwodar', 'द्वोदार', 'deodar', 'cedar', 'tree'] },
  { gw: 'पय्यां', hi: 'पय्यां (Wild Himalayan cherry)', en: 'wild Himalayan cherry — sacred wood', tags: ['payyan', 'पय्यां', 'wild cherry', 'sacred', 'tree'] },
  { gw: 'तिमला', hi: 'तिमला — जंगली अंजीर', en: 'wild fig (Ficus auriculata)', tags: ['timla', 'तिमला', 'wild fig', 'tree'] },
  { gw: 'किनगोड़', hi: 'किनगोड़ — काँटेदार जंगली बेर जैसी झाड़ी', en: 'wild thorny berry shrub', tags: ['kingod', 'किनगोड़', 'wild berry', 'shrub'] },
  { gw: 'हिंसर', hi: 'हिंसर — पहाड़ी जंगली रसीला फल', en: 'wild Himalayan raspberry-like berry', tags: ['hinsar', 'हिंसर', 'wild raspberry', 'berry', 'shrub'] },
  { gw: 'घिंगरू', hi: 'घिंगरू — पहाड़ी जंगली बेर', en: 'wild hill berry', tags: ['ghingaru', 'घिंगरू', 'wild berry', 'shrub'] },

  // ===========================================================================
  // गढ़वाली मा "ळ" कु परयोग — Use of letter "ळ" (uchchaaran "ल्द" jaisa)
  // Distinctive Garhwali phoneme — these are signature words.
  // ===========================================================================
  { gw: 'ळ', hi: 'गढ़वाली कि विशिष्ट ध्वनि — उच्चारण "ल्द" जैसा', en: 'distinctive Garhwali phoneme; pronounced like a retroflex "ld"', tags: ['lla', 'ळ', 'phoneme', 'pronunciation', 'garhwali letter'], note: 'गढ़वाली मा "ळ" अक्षर कु प्रयोग होंद जैकु उच्चारण "ल्द" जनु होंद — ये शब्द गढ़वाली कि पहचान छन। उदाहरण: बळ (बैल), हळ (हल), जग्वाळ (प्रतीक्षा), उमाळ (उबाल), उकाळ (चढ़ाई), तिर्वाळ (नीचे का किनारा)।' },
  { gw: 'बळ', hi: 'बैल', en: 'ox', tags: ['bal', 'बळ', 'ox', 'bull'] },
  { gw: 'हळ', hi: 'हल', en: 'plough', tags: ['hal', 'हळ', 'plough', 'plow'] },
  { gw: 'कळकल्दि', hi: 'करुणा (भाव संबंधी)', en: 'compassion / tender feeling', tags: ['kalkaldi', 'कळकल्दि', 'compassion', 'karuna'] },
  { gw: 'मळमल्दि', hi: 'स्वाद संबंधी भाव', en: 'taste-related feeling', tags: ['malmaldi', 'मळमल्दि', 'taste'] },
  { gw: 'माल्दु', hi: 'एक पादप', en: 'a kind of plant', tags: ['maldu', 'माल्दु', 'plant'] },
  { gw: 'जग्वाळ', hi: 'प्रतीक्षा / इंतज़ार', en: 'wait, awaiting', tags: ['jagwal', 'जग्वाळ', 'wait', 'awaiting', 'pratiksha'] },
  { gw: 'मक्वाळ', hi: 'मक्कूमठ का निवासी', en: 'resident of Makku-math', tags: ['makwal', 'मक्वाळ', 'resident'] },
  { gw: 'फ्यक्वाळ', hi: 'भिक्षा-वृत्ति करण वाला विशेष जन-समूह', en: 'a community of mendicants', tags: ['phyakwal', 'फ्यक्वाळ', 'mendicant', 'beggar community'] },
  { gw: 'जौंदाळ', hi: 'अक्षत (पूजा का चावल)', en: 'akshat — unbroken rice for worship', tags: ['jaundal', 'जौंदाळ', 'akshat', 'rice', 'worship'] },
  { gw: 'छ्यंवाळ', hi: 'खास उम्र का व्यक्तियों कु समूह', en: 'group of persons of a specific age', tags: ['chhyanwal', 'छ्यंवाळ', 'age group'] },
  { gw: 'उमाळ', hi: 'उबाल', en: 'boil / boiling', tags: ['umal', 'उमाळ', 'boil', 'ubaal'] },
  { gw: 'तिर्वाळ', hi: 'नीचे कु किनारा (स्थान संबंधी)', en: 'lower edge (of a location)', tags: ['tirwal', 'तिर्वाळ', 'lower edge'] },
  { gw: 'उकाळ', hi: 'चढ़ाई (मार्ग संबंधी)', en: 'uphill climb / ascent', tags: ['ukal', 'उकाळ', 'uphill', 'climb', 'ascent'] },
  { gw: 'ल्यक्वाळ', hi: 'बांज कु फल/बीज', en: 'fruit / seed of oak (banj)', tags: ['lyakwal', 'ल्यक्वाळ', 'oak', 'banj', 'seed'] },
  { gw: 'जिबाळ', hi: 'पक्षी/जानवर पकड़ण कु डाला गया चारा', en: 'bait laid to catch birds/animals', tags: ['jibal', 'जिबाळ', 'bait', 'trap'] },
  { gw: 'खाळ', hi: 'बारिश का पाणी सी बण्यां ताल / चमोली कु एक गाँव', en: 'pond formed by rainwater; also a village in Chamoli', tags: ['khal', 'खाळ', 'pond', 'rainwater', 'village'] },

  // ===========================================================================
  // गढ़वाली परम्परिक परिधान — Traditional Garhwali attire
  // ===========================================================================
  { gw: 'पारम्परिक परिधान — पुरुष', hi: 'धोती, चूड़ीदार, पायजामा, जांघिया (सलवार), कुर्ता, मिरजई, कोट, काली टोपी (गढ़वाली टोपी), सफेद टोपी, पगड़ी, फेतकि (बास्कट / जवाहर कट)', en: 'Mens traditional Garhwali attire — dhoti, churidar, pyjama, janghiya (salwar), kurta, mirjai, coat, black Garhwali cap, white cap, pagdi, phetki (waistcoat / Jawahar cut)', tags: ['mens dress', 'paridhan', 'परिधान', 'पुरुष', 'mirjai', 'pheti', 'गढ़वाली टोपी', 'attire', 'clothing', 'culture'] },
  { gw: 'पारम्परिक परिधान — स्त्री', hi: 'धोती, घागरा, चोली, कुर्ती, सलवार (सुलार), तिग्बंदा, फुन्दा, दुशलु (खंडेली)', en: 'Womens traditional Garhwali attire — dhoti, ghagra, choli, kurti, salwar (sular), tigbanda, phunda, dushlu (khandeli)', tags: ['womens dress', 'paridhan', 'परिधान', 'स्त्री', 'tigbanda', 'phunda', 'dushlu', 'attire', 'clothing', 'culture'] },
  { gw: 'पारम्परिक परिधान — बच्चे', hi: 'झगुली / झगुलु, चूड़ीदार पायजामा, कुर्ता, सलदरास, मिरजई, टोपी', en: 'Childrens traditional Garhwali attire — jhaguli/jhagulu, churidar pyjama, kurta, saldaras, mirjai, cap', tags: ['kids dress', 'paridhan', 'परिधान', 'बच्चे', 'jhaguli', 'attire', 'clothing', 'culture'] },
  { gw: 'गढ़वाली टोपी', hi: 'काली / सफेद पारंपरिक गढ़वाली टोपी', en: 'traditional Garhwali cap (black / white)', tags: ['garhwali topi', 'गढ़वाली टोपी', 'cap', 'pahadi topi', 'culture', 'attire'] },
  { gw: 'मिरजई', hi: 'पारंपरिक छोटी जैकेट जैसा वस्त्र', en: 'traditional short jacket-like garment', tags: ['mirjai', 'मिरजई', 'jacket', 'attire'] },
  { gw: 'दुशलु / खंडेली', hi: 'महिलाओं कु पारंपरिक शॉल', en: 'traditional womens shawl', tags: ['dushlu', 'khandeli', 'दुशलु', 'खंडेली', 'shawl', 'attire'] },
  { gw: 'झगुली / झगुलु', hi: 'बच्चों कु पारंपरिक झुला-नुमा वस्त्र', en: 'traditional childrens loose dress', tags: ['jhaguli', 'jhagulu', 'झगुली', 'झगुलु', 'kids dress', 'attire'] },

  // ===========================================================================
  // बालकृष्ण ध्यानी जी की "गढ़वळि कक्षा" सी अतिरिक्त शब्दावली
  // (sites.google.com/view/dhyani — विभिन्न पृष्ठों सी संकलित)
  // ===========================================================================

  // ----- मौसम / Weather -----
  { gw: 'घाम', hi: 'धूप', en: 'sunshine', tags: ['gham', 'घाम', 'sunshine', 'sunlight', 'धूप', 'weather', 'mausam'] },
  { gw: 'बथों / हव्वा', hi: 'हवा', en: 'wind / breeze', tags: ['bathon', 'hawa', 'बथों', 'हव्वा', 'wind', 'breeze', 'हवा', 'weather'] },
  { gw: 'ह्यूं / बरफ', hi: 'बर्फ़', en: 'snow', tags: ['hyun', 'baraf', 'ह्यूं', 'बरफ', 'snow', 'weather'] },
  { gw: 'ढांडू', hi: 'ओला', en: 'hailstone', tags: ['dhandu', 'ढांडू', 'hail', 'hailstone', 'ओला', 'weather'] },
  { gw: 'छैल / छेल', hi: 'छाया', en: 'shade / shadow', tags: ['chhel', 'chhail', 'छैल', 'छेल', 'shade', 'shadow', 'छाया', 'weather'] },
  { gw: 'सर्ग / अगास', hi: 'आसमान', en: 'sky', tags: ['sarg', 'agas', 'सर्ग', 'अगास', 'sky', 'आसमान', 'weather'] },
  { gw: 'बरखा', hi: 'बारिश', en: 'rain', tags: ['barkha', 'बरखा', 'rain', 'बारिश', 'weather'] },
  { gw: 'औडल / औडळ', hi: 'तूफ़ान / आँधी', en: 'storm', tags: ['audal', 'औडल', 'storm', 'तूफ़ान', 'आँधी', 'weather'] },

  // ----- ऋतु / Seasons -----
  { gw: 'मौल्यार', hi: 'बसंत ऋतु', en: 'spring', tags: ['maulyar', 'मौल्यार', 'spring', 'बसंत', 'season', 'ritu'] },
  { gw: 'रूड़ी / करषा', hi: 'ग्रीष्म ऋतु', en: 'summer', tags: ['rudi', 'karsha', 'रूड़ी', 'करषा', 'summer', 'ग्रीष्म', 'season'] },
  { gw: 'चौमास / चतुर्मास', hi: 'वर्षा ऋतु (जुलाई–अक्टूबर)', en: 'monsoon / rainy season', tags: ['chaumas', 'चौमास', 'चतुर्मास', 'monsoon', 'वर्षा', 'rainy season', 'season'] },
  { gw: 'क्वठार', hi: 'शरद ऋतु / भंडार का समय', en: 'autumn / harvest storage time', tags: ['kwathar', 'क्वठार', 'autumn', 'शरद', 'season'] },
  { gw: 'ह्यूंद', hi: 'शिशिर / सर्दी', en: 'winter', tags: ['hyund', 'ह्यूंद', 'winter', 'शिशिर', 'सर्दी', 'season'] },
  { gw: 'झाड़पात', hi: 'हेमंत ऋतु (पतझड़ की शुरुआत)', en: 'late autumn / hemant', tags: ['jhadpat', 'झाड़पात', 'hemant', 'हेमंत', 'season'] },

  // ----- महीने / Months (Vikram calendar) -----
  { gw: 'चैत', hi: 'चैत्र (मार्च–अप्रैल)', en: 'Chaitra month', tags: ['chait', 'चैत', 'chaitra', 'month', 'mahina'] },
  { gw: 'बैसाख', hi: 'बैशाख (अप्रैल–मई)', en: 'Baishakh', tags: ['baisakh', 'बैसाख', 'baishakh', 'month'] },
  { gw: 'जेठ', hi: 'ज्येष्ठ (मई–जून)', en: 'Jeth', tags: ['jeth', 'जेठ', 'jyeshtha', 'month'] },
  { gw: 'असाढ़', hi: 'आषाढ़ (जून–जुलाई)', en: 'Asadh', tags: ['asadh', 'असाढ़', 'ashadh', 'month'] },
  { gw: 'सौंण', hi: 'श्रावण / सावन (जुलाई–अगस्त)', en: 'Saun / Shravan', tags: ['saun', 'सौंण', 'shravan', 'sawan', 'month'] },
  { gw: 'भादौ', hi: 'भाद्रपद (अगस्त–सितंबर)', en: 'Bhado / Bhadrapad', tags: ['bhado', 'भादौ', 'bhadrapad', 'month'] },
  { gw: 'असूज', hi: 'आश्विन (सितंबर–अक्टूबर)', en: 'Asuj / Ashwin', tags: ['asuj', 'असूज', 'ashwin', 'month'] },
  { gw: 'कातिक', hi: 'कार्तिक (अक्टूबर–नवंबर)', en: 'Kartik', tags: ['katik', 'कातिक', 'kartik', 'month'] },
  { gw: 'मंगसीर', hi: 'मार्गशीर्ष (नवंबर–दिसंबर)', en: 'Mangsir / Margshirsh', tags: ['mangsir', 'मंगसीर', 'margshirsh', 'month'] },
  { gw: 'पूस', hi: 'पौष (दिसंबर–जनवरी)', en: 'Pus / Paush', tags: ['pus', 'पूस', 'paush', 'month'] },
  { gw: 'माघ', hi: 'माघ (जनवरी–फरवरी)', en: 'Magh', tags: ['magh', 'माघ', 'month'] },
  { gw: 'फागुण', hi: 'फाल्गुन (फरवरी–मार्च)', en: 'Phagun / Phalgun', tags: ['phagun', 'फागुण', 'phalgun', 'month'] },

  // ----- सप्ताह / Days -----
  { gw: 'एतवार', hi: 'रविवार', en: 'Sunday', tags: ['etwar', 'एतवार', 'sunday', 'ravivar', 'din', 'day'] },
  { gw: 'सोमवार', hi: 'सोमवार', en: 'Monday', tags: ['somwar', 'सोमवार', 'monday', 'day'] },
  { gw: 'मंगल्वार / म्वाटुवार', hi: 'मंगलवार', en: 'Tuesday', tags: ['mangalwar', 'mwatuwar', 'मंगल्वार', 'tuesday', 'day'] },
  { gw: 'बुवार', hi: 'बुधवार', en: 'Wednesday', tags: ['buwar', 'बुवार', 'wednesday', 'budh', 'day'] },
  { gw: 'भिप्प्यार', hi: 'बृहस्पतिवार', en: 'Thursday', tags: ['bhippyar', 'भिप्प्यार', 'thursday', 'guruwar', 'day'] },
  { gw: 'सुक्वार', hi: 'शुक्रवार', en: 'Friday', tags: ['sukwar', 'सुक्वार', 'friday', 'shukrawar', 'day'] },
  { gw: 'छंचर', hi: 'शनिवार', en: 'Saturday', tags: ['chhanchar', 'छंचर', 'saturday', 'shaniwar', 'day'] },

  // ----- शरीर के अंग / Body parts -----
  { gw: 'बर्मंड', hi: 'सिर / खोपड़ी', en: 'head', tags: ['barmand', 'बर्मंड', 'head', 'सिर', 'body part'] },
  { gw: 'मुंड', hi: 'सिर', en: 'head', tags: ['mund', 'मुंड', 'head', 'body part'] },
  { gw: 'कपाल', hi: 'सिर / माथा', en: 'forehead / head', tags: ['kapal', 'कपाल', 'forehead', 'head', 'body part'] },
  { gw: 'गल्वड़ी', hi: 'गाल', en: 'cheek', tags: ['galwadi', 'गल्वड़ी', 'cheek', 'गाल', 'body part'] },
  { gw: 'कन्दूड़', hi: 'कान', en: 'ear', tags: ['kandud', 'कन्दूड़', 'ear', 'kaan', 'body part'] },
  { gw: 'आँखि / अंखि', hi: 'आँख', en: 'eye', tags: ['ankhi', 'आँखि', 'eye', 'body part'] },
  { gw: 'नाक', hi: 'नाक', en: 'nose', tags: ['nak', 'नाक', 'nose', 'body part'] },
  { gw: 'मुख', hi: 'मुँह', en: 'mouth', tags: ['mukh', 'मुख', 'mouth', 'face', 'body part'] },
  { gw: 'गिच्ची', hi: 'मुँह (बोलचाल)', en: 'mouth (colloquial)', tags: ['gichchi', 'गिच्ची', 'mouth', 'body part'] },
  { gw: 'जिब्बड़ी', hi: 'जीभ', en: 'tongue', tags: ['jibbadi', 'जिब्बड़ी', 'tongue', 'body part'] },
  { gw: 'दांत', hi: 'दाँत', en: 'tooth', tags: ['dant', 'दांत', 'teeth', 'body part'] },
  { gw: 'गाळु', hi: 'गला', en: 'throat / neck', tags: ['galu', 'गाळु', 'throat', 'neck', 'body part'] },
  { gw: 'खुटि', hi: 'पैर', en: 'foot / leg', tags: ['khuti', 'खुटि', 'foot', 'leg', 'पैर', 'body part'] },
  { gw: 'हथ्थ', hi: 'हाथ', en: 'hand', tags: ['hath', 'हथ्थ', 'hand', 'body part'] },
  { gw: 'अंगल्ली', hi: 'उँगली', en: 'finger', tags: ['angalli', 'अंगल्ली', 'finger', 'ungli', 'body part'] },
  { gw: 'पेट', hi: 'पेट', en: 'belly / stomach', tags: ['pet', 'पेट', 'stomach', 'belly', 'body part'] },
  { gw: 'पीठ्ठ', hi: 'पीठ', en: 'back', tags: ['pithh', 'पीठ्ठ', 'back', 'body part'] },
  { gw: 'छाती', hi: 'छाती', en: 'chest', tags: ['chhati', 'छाती', 'chest', 'body part'] },

  // ===========================================================================
  // पशु–पक्षी / Animals & insects (dhyani.com — सजीव दुनिया)
  // ===========================================================================
  { gw: 'बल्द', hi: 'बैल', en: 'ox', tags: ['bald', 'बल्द', 'ox', 'animal', 'domestic'] },
  { gw: 'बौड़', hi: 'बछड़ा', en: 'calf', tags: ['baud', 'बौड़', 'calf', 'animal'] },
  { gw: 'भैंस', hi: 'भैंस', en: 'buffalo', tags: ['bhains', 'भैंस', 'buffalo', 'animal', 'domestic'] },
  { gw: 'बखरी / बखर्या', hi: 'बकरी', en: 'goat', tags: ['bakhri', 'बखरी', 'बखर्या', 'goat', 'animal'] },
  { gw: 'घ्वाड़ा', hi: 'घोड़ा', en: 'horse', tags: ['ghwada', 'घ्वाड़ा', 'horse', 'animal'] },
  { gw: 'खच्चर', hi: 'खच्चर', en: 'mule', tags: ['khachchar', 'खच्चर', 'mule', 'animal'] },
  { gw: 'कुकुर / कुकर', hi: 'कुत्ता', en: 'dog', tags: ['kukur', 'kukar', 'कुकुर', 'dog', 'animal'] },
  { gw: 'बिरळु / बिराळु', hi: 'बिल्ली', en: 'cat', tags: ['biralu', 'बिरळु', 'cat', 'animal'] },
  { gw: 'बाघ', hi: 'बाघ', en: 'tiger', tags: ['bagh', 'बाघ', 'tiger', 'animal', 'wild'] },
  { gw: 'गुलदार', hi: 'तेंदुआ', en: 'leopard', tags: ['guldar', 'गुलदार', 'leopard', 'animal', 'wild'] },
  { gw: 'भल्लू / रिक्क', hi: 'भालू', en: 'bear', tags: ['bhallu', 'rikk', 'भल्लू', 'रिक्क', 'bear', 'animal', 'wild'] },
  { gw: 'सुंगर', hi: 'जंगली सुअर', en: 'wild boar', tags: ['sungar', 'सुंगर', 'boar', 'animal', 'wild'] },
  { gw: 'स्याळ', hi: 'सियार / लोमड़ी', en: 'jackal / fox', tags: ['syal', 'स्याळ', 'jackal', 'fox', 'animal'] },
  { gw: 'काखड़', hi: 'काकड़ (छोटा हिरण)', en: 'barking deer', tags: ['kakhad', 'काखड़', 'barking deer', 'animal', 'wild'] },
  { gw: 'मिरग', hi: 'हिरण / मृग', en: 'deer', tags: ['mirag', 'मिरग', 'deer', 'animal', 'wild'] },
  { gw: 'घ्वीड़', hi: 'घोरल (पहाड़ी हिरण)', en: 'goral (Himalayan deer)', tags: ['ghwid', 'घ्वीड़', 'goral', 'deer', 'animal', 'wild'] },
  { gw: 'बांदर', hi: 'बंदर', en: 'monkey', tags: ['bandar', 'बांदर', 'monkey', 'animal'] },
  { gw: 'लंगूर', hi: 'लंगूर', en: 'langur', tags: ['langur', 'लंगूर', 'langur', 'monkey', 'animal'] },
  { gw: 'लुखंदर / म्यूस', hi: 'चूहा', en: 'mouse / rat', tags: ['lukhandar', 'myus', 'लुखंदर', 'म्यूस', 'mouse', 'rat', 'animal'] },
  { gw: 'खरगोश / स्वागू', hi: 'खरगोश', en: 'rabbit / hare', tags: ['khargosh', 'swagu', 'स्वागू', 'rabbit', 'animal'] },
  { gw: 'सौलु', hi: 'साही (कांटों वाला जंतु)', en: 'porcupine', tags: ['saulu', 'सौलु', 'porcupine', 'animal'] },
  { gw: 'गुरौ / गुरु', hi: 'सर्प / साँप', en: 'snake', tags: ['gurau', 'गुरौ', 'snake', 'serpent', 'animal'] },
  { gw: 'छिपड़', hi: 'छिपकली', en: 'lizard', tags: ['chhipad', 'छिपड़', 'lizard', 'animal'] },
  { gw: 'मिंडख', hi: 'मेंढक', en: 'frog', tags: ['mindakh', 'मिंडख', 'frog', 'animal'] },
  { gw: 'माछ / गड्याल', hi: 'मछली', en: 'fish', tags: ['machh', 'gadyal', 'माछ', 'fish', 'animal'] },
  { gw: 'बिच्छु', hi: 'बिच्छू', en: 'scorpion', tags: ['bichchhu', 'बिच्छु', 'scorpion', 'insect'] },
  { gw: 'संगुळ', hi: 'तिलचट्टा / कॉकरोच', en: 'cockroach', tags: ['sangul', 'संगुळ', 'cockroach', 'insect'] },
  { gw: 'किरम्वळ', hi: 'चींटी', en: 'ant', tags: ['kirmwal', 'किरम्वळ', 'ant', 'insect'] },
  { gw: 'म्वार', hi: 'मधुमक्खी', en: 'honey bee', tags: ['mwar', 'म्वार', 'bee', 'honeybee', 'insect'] },
  { gw: 'घिरळ', hi: 'कनखजूरा', en: 'centipede', tags: ['ghiral', 'घिरळ', 'centipede', 'insect'] },
  { gw: 'माख / म्वाख', hi: 'मक्खी', en: 'fly', tags: ['makh', 'mwakh', 'माख', 'म्वाख', 'fly', 'insect'] },
  { gw: 'कुखड़ी', hi: 'मुर्गी', en: 'hen', tags: ['kukhdi', 'कुखड़ी', 'hen', 'bird'] },
  { gw: 'काग / कग्ग', hi: 'कौआ', en: 'crow', tags: ['kag', 'kagg', 'काग', 'crow', 'bird'] },
  { gw: 'घुघुती', hi: 'फाख़्ता / पहाड़ी कबूतर', en: 'Himalayan dove (ghughuti)', tags: ['ghughuti', 'घुघुती', 'dove', 'bird', 'iconic'] },
  { gw: 'न्यौळी', hi: 'न्यौली पक्षी (पहाड़ी)', en: 'Himalayan whistling thrush', tags: ['nyauli', 'न्यौळी', 'thrush', 'bird'] },
  { gw: 'चकोर', hi: 'चकोर', en: 'chukar partridge', tags: ['chakor', 'चकोर', 'chukar', 'bird'] },
  { gw: 'मोनाळ', hi: 'मोनाल पक्षी (राज्य पक्षी)', en: 'Himalayan monal — state bird', tags: ['monal', 'मोनाळ', 'monal', 'state bird'] },

  // ===========================================================================
  // ऋतु / Seasons (gढ़वळि बारह मासि)
  // ===========================================================================
  { gw: 'मौल्यार', hi: 'वसंत ऋतु', en: 'spring', tags: ['maulyar', 'मौल्यार', 'spring', 'season', 'ritu'] },
  { gw: 'रूड़ी / करषा', hi: 'ग्रीष्म ऋतु', en: 'summer', tags: ['rudi', 'karsha', 'रूड़ी', 'करषा', 'summer', 'season'] },
  { gw: 'चौमास / बरखा', hi: 'वर्षा ऋतु', en: 'monsoon / rainy season', tags: ['chaumas', 'barkha', 'चौमास', 'बरखा', 'monsoon', 'rains', 'season'] },
  { gw: 'क्वठार', hi: 'शरद ऋतु', en: 'autumn', tags: ['kwathar', 'क्वठार', 'autumn', 'sharad', 'season'] },
  { gw: 'झाड़पात', hi: 'शिशिर ऋतु (पतझड़)', en: 'shishir / leaf-fall', tags: ['jhadpat', 'झाड़पात', 'shishir', 'autumn', 'season'] },
  { gw: 'ह्यूंद', hi: 'शीत ऋतु / जाड़ा', en: 'winter', tags: ['hyund', 'ह्यूंद', 'winter', 'jada', 'season'] },

  // ===========================================================================
  // मौसम / Weather words
  // ===========================================================================
  { gw: 'घाम', hi: 'धूप / सूरज की रोशनी', en: 'sunshine / sunlight', tags: ['gham', 'घाम', 'sunshine', 'sun', 'weather'] },
  { gw: 'बथों / हव्वा', hi: 'हवा', en: 'wind', tags: ['bathon', 'havva', 'बथों', 'हव्वा', 'wind', 'air', 'weather'] },
  { gw: 'ह्यूं', hi: 'बर्फ', en: 'snow', tags: ['hyun', 'ह्यूं', 'snow', 'weather'] },
  { gw: 'ध्याण', hi: 'बर्फ / हिमपात', en: 'snowfall', tags: ['dhyan', 'ध्याण', 'snowfall', 'weather'] },
  { gw: 'ढांडू', hi: 'ओले / हिमवर्षा', en: 'hail', tags: ['dhandu', 'ढांडू', 'hail', 'weather'] },
  { gw: 'छैल', hi: 'छाया', en: 'shade', tags: ['chhail', 'छैल', 'shade', 'weather'] },
  { gw: 'सर्ग / अगास', hi: 'आसमान', en: 'sky', tags: ['sarg', 'agas', 'सर्ग', 'अगास', 'sky', 'weather'] },
  { gw: 'बरखा', hi: 'बारिश', en: 'rain', tags: ['barkha', 'बरखा', 'rain', 'weather'] },
  { gw: 'औडल / आँधि', hi: 'आँधी / तूफान', en: 'storm / gale', tags: ['audal', 'andhi', 'औडल', 'आँधि', 'storm', 'gale', 'weather'] },
  { gw: 'बादल', hi: 'बादल', en: 'cloud', tags: ['badal', 'बादल', 'cloud', 'weather'] },
  { gw: 'ज्वाळ', hi: 'कोहरा / धुंध', en: 'fog / mist', tags: ['jwal', 'ज्वाळ', 'fog', 'mist', 'weather'] },
  { gw: 'चटक घाम', hi: 'तेज धूप', en: 'bright harsh sunshine', tags: ['chatak gham', 'चटक घाम', 'bright sun', 'weather'] },
  { gw: 'जाड़ु / सिंगाणु', hi: 'जाड़ा / ठंड', en: 'cold', tags: ['jadu', 'singanu', 'जाड़ु', 'सिंगाणु', 'cold', 'weather'] },

  // ===========================================================================
  // भू-संज्ञा / Land terms (खेत-पाणी)
  // ===========================================================================
  { gw: 'पुंगडा / पुंगड़ी', hi: 'खेत', en: 'field', tags: ['pungda', 'पुंगडा', 'field', 'land', 'farm'] },
  { gw: 'तलाऊं', hi: 'सिंचित खेत', en: 'irrigated field', tags: ['talaun', 'तलाऊं', 'irrigated', 'field', 'land'] },
  { gw: 'उपराऊं', hi: 'असिंचित खेत (वर्षा-आधारित)', en: 'rain-fed / non-irrigated field', tags: ['uparaun', 'उपराऊं', 'unirrigated', 'rainfed', 'field', 'land'] },
  { gw: 'सेरा / सीरा', hi: 'नदी किनारे का समतल खेत', en: 'flat riverside field', tags: ['sera', 'sira', 'सेरा', 'सीरा', 'riverside field', 'land'] },
  { gw: 'बांजो / बंजर', hi: 'बंजर / परती ज़मीन', en: 'fallow / barren land', tags: ['banjo', 'banjar', 'बांजो', 'fallow', 'barren', 'land'] },
  { gw: 'घट्ट', hi: 'पनचक्की', en: 'water mill', tags: ['ghatt', 'घट्ट', 'water mill', 'land'] },
  { gw: 'नौला', hi: 'पारंपरिक पत्थर का जल-स्रोत', en: 'traditional stone water source / aquifer', tags: ['naula', 'नौला', 'water source', 'spring', 'land', 'culture'] },
  { gw: 'धारा', hi: 'पाणी की धारा / झरना', en: 'water spring / stream', tags: ['dhara', 'धारा', 'spring', 'stream', 'water'] },
  { gw: 'गधेरा', hi: 'छोटी नदी / नाला', en: 'small stream / brook', tags: ['gadhera', 'गधेरा', 'stream', 'brook', 'land'] },
  { gw: 'गाड़', hi: 'नदी', en: 'river', tags: ['gad', 'गाड़', 'river', 'water', 'land'] },
  { gw: 'डांडा', hi: 'पहाड़ी / चोटी', en: 'mountain / ridge', tags: ['danda', 'डांडा', 'mountain', 'ridge', 'land'] },
  { gw: 'बुग्याल', hi: 'अल्पाइन घास का मैदान', en: 'alpine meadow', tags: ['bugyal', 'बुग्याल', 'alpine meadow', 'pasture', 'land'] },
  { gw: 'खाळ', hi: 'दर्रा / पहाड़ी पास; तालाब भि', en: 'mountain pass; also a pond', tags: ['khal', 'खाळ', 'pass', 'pond', 'land'] },
  { gw: 'तोक', hi: 'गाँव कु तोक / छोटा हिस्सा', en: 'hamlet / sub-village cluster', tags: ['tok', 'तोक', 'hamlet', 'village', 'land'] },

  // ===========================================================================
  // भाव / Emotion words (अनूठा गढ़वाली शब्द)
  // ===========================================================================
  { gw: 'फाम', hi: 'याद / स्मृति', en: 'memory / remembrance', tags: ['pham', 'फाम', 'memory', 'remembrance', 'emotion'] },
  { gw: 'खुद', hi: 'अपनों कि याद / विरह', en: 'longing for loved ones (deep nostalgia)', tags: ['khud', 'खुद', 'longing', 'nostalgia', 'viraha', 'emotion'], note: 'गढ़वाली कु सबसे प्रसिद्ध भाव-शब्द — परदेस मा बैठ्यां पहाड़ी कि अपणा गाँव-घर-मनिखौं की याद।' },
  { gw: 'नराई', hi: 'मायूसी / उदासी', en: 'sadness / dejection', tags: ['narai', 'नराई', 'sadness', 'gloom', 'emotion'] },
  { gw: 'बाटुली', hi: 'व्याकुलता / बेचैनी', en: 'restlessness / anxious yearning', tags: ['batuli', 'बाटुली', 'restlessness', 'anxiety', 'emotion'] },
  { gw: 'ओछियाट', hi: 'ऊब / अरुचि', en: 'boredom / aversion', tags: ['ochhiyat', 'ओछियाट', 'boredom', 'emotion'] },
  { gw: 'फुसियाट', hi: 'फुसफुसाहट / गुस्से कि छटपटाहट', en: 'whisper / suppressed irritation', tags: ['phusiyat', 'फुसियाट', 'whisper', 'irritation', 'emotion'] },
  { gw: 'अमोखो', hi: 'असमंजस / दुविधा', en: 'dilemma / confusion', tags: ['amokho', 'अमोखो', 'dilemma', 'confusion', 'emotion'] },
  { gw: 'उकताट', hi: 'ऊबकर खीझ', en: 'fed-up irritation', tags: ['uktat', 'उकताट', 'irritation', 'emotion'] },
  { gw: 'उचाट', hi: 'मन कि अशांति / उदासी', en: 'mental restlessness / despondency', tags: ['uchat', 'उचाट', 'restlessness', 'emotion'] },
  { gw: 'कळकळी', hi: 'करुणा / मन कि टीस', en: 'compassion / inner ache', tags: ['kalkali', 'कळकळी', 'compassion', 'ache', 'emotion'] },
  { gw: 'रिस', hi: 'गुस्सा', en: 'anger', tags: ['ris', 'रिस', 'anger', 'gussa', 'emotion'] },
  { gw: 'खुसी', hi: 'खुशी', en: 'happiness', tags: ['khusi', 'खुसी', 'happiness', 'joy', 'emotion'] },

  // ===========================================================================
  // पेशा / Professions & roles (ग्राम्य जीवन)
  // ===========================================================================
  { gw: 'रैबारिया', hi: 'संदेशवाहक / दूत', en: 'messenger', tags: ['raibariya', 'रैबारिया', 'messenger', 'profession'] },
  { gw: 'पुछारी', hi: 'देव-पूछ करण वाला (ओरेकल)', en: 'oracle / one who questions deities', tags: ['puchhari', 'पुछारी', 'oracle', 'profession', 'culture'] },
  { gw: 'डंगरिया', hi: 'देवता का पात्र (जिस पर देव अवतरित होंद)', en: 'medium possessed by deity', tags: ['dangariya', 'डंगरिया', 'medium', 'oracle', 'culture'] },
  { gw: 'जगरिया', hi: 'जागर गायक — देव-कथा गायन वाला', en: 'jagar singer — sings deity narratives', tags: ['jagariya', 'जगरिया', 'jagar singer', 'culture', 'profession'] },
  { gw: 'पतरोल', hi: 'वन रक्षक / पटवारी', en: 'forest guard / patwari', tags: ['patrol', 'पतरोल', 'forest guard', 'profession'] },
  { gw: 'चिरान', hi: 'लकड़ी चीरण वाला', en: 'wood-sawer / carpenter', tags: ['chiran', 'चिरान', 'sawer', 'carpenter', 'profession'] },
  { gw: 'ग्वैर / ग्वाला', hi: 'चरवाहा', en: 'cowherd / shepherd', tags: ['gwair', 'gwala', 'ग्वैर', 'cowherd', 'shepherd', 'profession'] },
  { gw: 'ढोली', hi: 'ढोल वादक', en: 'drummer', tags: ['dholi', 'ढोली', 'drummer', 'culture', 'profession'] },
  { gw: 'दास / औजी', hi: 'पारंपरिक वाद्य वादक', en: 'traditional musician (Aauji community)', tags: ['das', 'auji', 'दास', 'औजी', 'musician', 'culture', 'profession'] },

  // ===========================================================================
  // असौंगा शब्द — Rare poetic Garhwali words (dhyani.com)
  // ===========================================================================
  { gw: 'ब्येया', hi: 'विवाह कु प्रसंग / शादी', en: 'wedding context / marriage', tags: ['byeya', 'ब्येया', 'wedding', 'marriage', 'rare'] },
  { gw: 'उबड्याँ', hi: 'उबड़-खाबड़', en: 'rough / uneven (terrain)', tags: ['ubdyan', 'उबड्याँ', 'rough', 'uneven', 'rare'] },
  { gw: 'म्याला', hi: 'मेला', en: 'fair / festival gathering', tags: ['myala', 'म्याला', 'fair', 'mela'] },
  { gw: 'फुरफुरा', hi: 'हल्की हवा कि हलचल / फड़फड़ाहट', en: 'flutter / soft wind movement', tags: ['phurphura', 'फुरफुरा', 'flutter', 'wind', 'rare'] },
  { gw: 'भुतगिला', hi: 'भुतैला / भयावह स्थान', en: 'haunted / eerie place', tags: ['bhutgila', 'भुतगिला', 'haunted', 'eerie', 'rare'] },
  { gw: 'सगंढ', hi: 'सघन / बहुत घना', en: 'dense / thick (forest etc.)', tags: ['sagandh', 'सगंढ', 'dense', 'thick', 'rare'] },
  { gw: 'खुरक्यूँन्', hi: 'खुजली / कुरेदन', en: 'itch / scraping urge', tags: ['khurkyun', 'खुरक्यूँन्', 'itch', 'rare'] },
  { gw: 'दमळैनि', hi: 'दबा हुआ क्रोध / कसक', en: 'suppressed anger / inner pang', tags: ['damalaini', 'दमळैनि', 'suppressed anger', 'rare', 'emotion'] },

  // ===========================================================================
  // खान-पान — पुरातन गढ़वाली व्यंजन (additional from dhyani.com)
  // ===========================================================================
  { gw: 'अट्वाणी', hi: 'अनेक प्रकार का अनाज मिलाकर बण्यां सत्तू-जैसा', en: 'multi-grain sattu-like preparation', tags: ['atwani', 'अट्वाणी', 'multigrain', 'sattu', 'food'] },
  { gw: 'अमसुटि', hi: 'खटास युक्त पारंपरिक व्यंजन', en: 'tangy traditional dish', tags: ['amsuti', 'अमसुटि', 'sour', 'food'] },
  { gw: 'ऊमी', hi: 'भुना हुआ हरा गेहूँ', en: 'roasted green wheat', tags: ['umi', 'ऊमी', 'roasted wheat', 'food'] },
  { gw: 'चबेना', hi: 'भुना/मिश्रित नाश्ता', en: 'mixed roasted snack', tags: ['chabena', 'चबेना', 'snack', 'food'] },
  { gw: 'कल्यौ', hi: 'सुबह का नाश्ता', en: 'morning breakfast', tags: ['kalyau', 'कल्यौ', 'breakfast', 'food'] },
  { gw: 'छंसेड़ो', hi: 'पारंपरिक स्थानीय व्यंजन', en: 'traditional local dish', tags: ['chhansedo', 'छंसेड़ो', 'food'] },
  { gw: 'समै', hi: 'पारंपरिक मीठा', en: 'traditional sweet', tags: ['samai', 'समै', 'sweet', 'food'] },

  // ===========================================================================
  // विलुप्तप्राय शब्द — Vanishing Garhwali words (dhyani.com)
  // ===========================================================================
  { gw: 'विलुप्तप्राय शब्द', hi: 'गढ़वाली कु लुप्त होणु वाला शब्द — संस्कृति का खजाना', en: 'vanishing Garhwali words — cultural treasure', tags: ['vanishing words', 'विलुप्त शब्द', 'lupta', 'culture', 'preservation'], note: 'दैनिक बोलचाल से लुप्त होणु वाला कुछ शब्द: ओबरा (अंधेरा कमरा), तिबारी (3-दरवाजों कु बैठक), जंदरी (हाथ की चक्की), डल्या (बांस कि टोकरी), मांगल्या (शुभ मांगलिक गीत), न्यासणु (कन्या-विदाई गीत), छ्वड़ा (नवविवाहित जोड़ा), क्वथली (अनाज कि मिट्टी कि कोठी), सिलबट्टा (पथ्थर कु पीसण कु यंत्र), डिकरा (बच्चा), मौ (पड़ोस), थाक (थकान), गुठ्यार (गोठ — पशुशाला), हीठ (नीचे), ऊंद (ऊपर — ऊंदा)।' },
  { gw: 'ओबरा', hi: 'अंधेरा भीतरी कमरा / भंडार', en: 'dark inner room / store', tags: ['obra', 'ओबरा', 'dark room', 'store', 'house', 'vanishing'] },
  { gw: 'तिबारी', hi: 'तीन दरवाजों वाली परंपरागत बैठक', en: 'traditional three-doored sitting hall', tags: ['tibari', 'तिबारी', 'sitting hall', 'architecture', 'culture'] },
  { gw: 'जंदरी', hi: 'हाथ की पथ्थर चक्की', en: 'hand-operated stone grinder', tags: ['jandri', 'जंदरी', 'hand mill', 'grinder', 'household'] },
  { gw: 'डल्या', hi: 'बांस की टोकरी', en: 'bamboo basket', tags: ['dalya', 'डल्या', 'basket', 'bamboo', 'household'] },
  { gw: 'मांगल्या', hi: 'मांगलिक/शुभ गीत', en: 'auspicious wedding songs', tags: ['mangalya', 'मांगल्या', 'auspicious songs', 'wedding', 'culture'] },
  { gw: 'क्वथली', hi: 'मिट्टी कि अनाज-कोठी', en: 'mud grain storage bin', tags: ['kwathli', 'क्वथली', 'grain bin', 'storage', 'household'] },
  { gw: 'गुठ्यार / ग्वठ्यार', hi: 'गोठ — पशुशाला (नीचे की मंजिल)', en: 'cattle shed (ground floor of traditional house)', tags: ['guthyar', 'गुठ्यार', 'cattle shed', 'goth', 'house', 'culture'] },
  { gw: 'सिलबट्टा / स्यूल', hi: 'पथ्थर कु पीसण कु यंत्र', en: 'stone grinder (pestle & slab)', tags: ['silbatta', 'syul', 'सिलबट्टा', 'grinder', 'household'] },
  { gw: 'डिकरा / न्यानु', hi: 'बच्चा', en: 'child', tags: ['dikra', 'nyanu', 'डिकरा', 'न्यानु', 'child'] },
  { gw: 'मौ', hi: 'पड़ोस / पास', en: 'neighbourhood / nearby', tags: ['mau', 'मौ', 'neighbourhood', 'place'] },
  { gw: 'हीठ', hi: 'नीचे', en: 'below / down', tags: ['hith', 'हीठ', 'below', 'down', 'direction'] },
  { gw: 'ऊंद / ऊंदा', hi: 'ऊपर', en: 'up / above', tags: ['und', 'ऊंद', 'up', 'above', 'direction'] },
];

