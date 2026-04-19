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
  { gw: 'ज्यू रौ, ज्यू बचि रौ', hi: 'जीते रहो, जीते बचे रहो (आशीर्वाद)', en: 'live long (blessing)', tags: ['blessing', 'jiyo', 'aashirwad', 'आशीर्वाद'] },
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
];
