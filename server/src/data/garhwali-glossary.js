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
  { gw: 'मंडुवा / कोदा', hi: 'रागी / फिंगर मिलेट', en: 'finger millet (ragi)', tags: ['रागी', 'मंडुवा', 'ragi', 'millet', 'koda'] },
  { gw: 'झंगोरा', hi: 'सावां चावल / बार्नयार्ड बाजरा', en: 'barnyard millet', tags: ['झंगोरा', 'jhangora', 'savan'] },
  { gw: 'फाणु', hi: 'गहत की पारंपरिक दाल', en: 'traditional Garhwali lentil curry made from horse gram', tags: ['फाणु', 'फाणू', 'phaanu', 'gahat', 'गहत', 'dal'] },
  { gw: 'बाडि', hi: 'मंडुवा का पारंपरिक व्यंजन', en: 'Garhwali ragi flour dish', tags: ['बाडि', 'baadi', 'मंडुवा'] },
  { gw: 'काफुली', hi: 'पालक/हरी सब्जियों की पारंपरिक करी', en: 'spinach-based Garhwali curry', tags: ['काफुली', 'kafuli', 'पालक', 'spinach'] },
  { gw: 'गहत', hi: 'कुलथी दाल', en: 'horse gram', tags: ['गहत', 'gahat', 'kulthi', 'horse gram'] },
  { gw: 'चैनसू', hi: 'काले उरद की दाल', en: 'roasted black gram dal', tags: ['चैनसू', 'chainsoo', 'urad'] },
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
];
