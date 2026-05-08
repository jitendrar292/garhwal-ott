// Garhwali language learning data
// Each entry: { garhwali, hindi, english, pronunciation }

export const LEARN_CATEGORIES = [
  { id: 'greetings',  label: 'अभिवादन',       emoji: '🙏', labelEn: 'Greetings' },
  { id: 'family',     label: 'परिवार',         emoji: '👨‍👩‍👧', labelEn: 'Family' },
  { id: 'numbers',    label: 'गिनती',          emoji: '🔢', labelEn: 'Numbers' },
  { id: 'food',       label: 'खाना-पानी',      emoji: '🍚', labelEn: 'Food & Water' },
  { id: 'nature',     label: 'प्रकृति',         emoji: '🏔️', labelEn: 'Nature' },
  { id: 'daily',      label: 'रोज़मर्रा',        emoji: '🗣️', labelEn: 'Daily Phrases' },
  { id: 'animals',    label: 'जानवर',          emoji: '🐄', labelEn: 'Animals' },
  { id: 'body',       label: 'शरीर',           emoji: '💪', labelEn: 'Body Parts' },
  { id: 'colors',     label: 'रंग',            emoji: '🎨', labelEn: 'Colors' },
  { id: 'time',       label: 'समय',            emoji: '⏰', labelEn: 'Time & Days' },
];

const PHRASES = [
  // ── Greetings ──
  { id: 1,  category: 'greetings', garhwali: 'नमस्कार',         hindi: 'नमस्ते',           english: 'Hello / Greetings',       pronunciation: 'Na-mas-kaar' },
  { id: 2,  category: 'greetings', garhwali: 'क्या हाल छ?',     hindi: 'कैसे हो?',         english: 'How are you?',             pronunciation: 'Kya haal chha?' },
  { id: 3,  category: 'greetings', garhwali: 'ठीक छूं',         hindi: 'ठीक हूँ',          english: 'I am fine',               pronunciation: 'Theek chhoon' },
  { id: 4,  category: 'greetings', garhwali: 'भलो भयो',         hindi: 'अच्छा हुआ',        english: 'That\'s good',            pronunciation: 'Bhalo bhayo' },
  { id: 5,  category: 'greetings', garhwali: 'फेर मिलला',       hindi: 'फिर मिलेंगे',      english: 'See you again',           pronunciation: 'Pher milla' },
  { id: 6,  category: 'greetings', garhwali: 'थैंक यू / धन्यवाद', hindi: 'धन्यवाद',       english: 'Thank you',               pronunciation: 'Dhanyavaad' },
  { id: 7,  category: 'greetings', garhwali: 'माफ करया',        hindi: 'माफ करना',         english: 'I am sorry / Excuse me',  pronunciation: 'Maaf karya' },
  { id: 8,  category: 'greetings', garhwali: 'स्वागत छ तुमर',   hindi: 'तुम्हारा स्वागत है', english: 'Welcome',               pronunciation: 'Swaagat chha tumar' },
  { id: 9,  category: 'greetings', garhwali: 'राम-राम',         hindi: 'राम-राम',          english: 'Hello (traditional)',     pronunciation: 'Raam-Raam' },

  // ── Family ──
  { id: 10, category: 'family', garhwali: 'बाबा',   hindi: 'पिताजी',   english: 'Father',       pronunciation: 'Baabaa' },
  { id: 11, category: 'family', garhwali: 'आमा',    hindi: 'माँ',      english: 'Mother',       pronunciation: 'Aama' },
  { id: 12, category: 'family', garhwali: 'बड़ो भाई', hindi: 'बड़े भाई', english: 'Elder Brother', pronunciation: 'Bado Bhaai' },
  { id: 13, category: 'family', garhwali: 'बड़ि दीदी', hindi: 'बड़ी बहन', english: 'Elder Sister', pronunciation: 'Badi Deedi' },
  { id: 14, category: 'family', garhwali: 'छोटो भाई', hindi: 'छोटे भाई', english: 'Younger Brother', pronunciation: 'Chhoto Bhai' },
  { id: 15, category: 'family', garhwali: 'नौनि',   hindi: 'छोटी बहन / बच्ची', english: 'Younger Sister / Young Girl', pronunciation: 'Nauni' },
  { id: 16, category: 'family', garhwali: 'बुबू',   hindi: 'दादाजी',   english: 'Grandfather',  pronunciation: 'Buboo' },
  { id: 17, category: 'family', garhwali: 'ब्वारी', hindi: 'बहू',      english: 'Daughter-in-law', pronunciation: 'Bwaari' },
  { id: 18, category: 'family', garhwali: 'घरैणी', hindi: 'पत्नी',     english: 'Wife',         pronunciation: 'Gharaini' },
  { id: 19, category: 'family', garhwali: 'छौं',    hindi: 'बेटा',     english: 'Son',          pronunciation: 'Chhon' },
  { id: 20, category: 'family', garhwali: 'छ्वीं',  hindi: 'बेटी',     english: 'Daughter',     pronunciation: 'Chhween' },

  // ── Numbers ──
  { id: 21, category: 'numbers', garhwali: 'एक',    hindi: 'एक',    english: 'One',    pronunciation: 'Ek' },
  { id: 22, category: 'numbers', garhwali: 'दुई',   hindi: 'दो',    english: 'Two',    pronunciation: 'Dui' },
  { id: 23, category: 'numbers', garhwali: 'तीन',   hindi: 'तीन',   english: 'Three',  pronunciation: 'Teen' },
  { id: 24, category: 'numbers', garhwali: 'च्यार', hindi: 'चार',   english: 'Four',   pronunciation: 'Chyaar' },
  { id: 25, category: 'numbers', garhwali: 'पांच',  hindi: 'पाँच',  english: 'Five',   pronunciation: 'Paanch' },
  { id: 26, category: 'numbers', garhwali: 'छ',     hindi: 'छह',    english: 'Six',    pronunciation: 'Chha' },
  { id: 27, category: 'numbers', garhwali: 'सात',   hindi: 'सात',   english: 'Seven',  pronunciation: 'Saat' },
  { id: 28, category: 'numbers', garhwali: 'आठ',    hindi: 'आठ',    english: 'Eight',  pronunciation: 'Aath' },
  { id: 29, category: 'numbers', garhwali: 'नौ',    hindi: 'नौ',    english: 'Nine',   pronunciation: 'Nau' },
  { id: 30, category: 'numbers', garhwali: 'दस',    hindi: 'दस',    english: 'Ten',    pronunciation: 'Das' },
  { id: 31, category: 'numbers', garhwali: 'बीस',   hindi: 'बीस',   english: 'Twenty', pronunciation: 'Bees' },
  { id: 32, category: 'numbers', garhwali: 'पचास',  hindi: 'पचास',  english: 'Fifty',  pronunciation: 'Pachaas' },
  { id: 33, category: 'numbers', garhwali: 'सौ',    hindi: 'सौ',    english: 'Hundred', pronunciation: 'Sau' },

  // ── Food & Water ──
  { id: 34, category: 'food', garhwali: 'भात',      hindi: 'चावल',       english: 'Rice',          pronunciation: 'Bhaat' },
  { id: 35, category: 'food', garhwali: 'रोटी',     hindi: 'रोटी',       english: 'Bread / Roti',  pronunciation: 'Roti' },
  { id: 36, category: 'food', garhwali: 'दाल',      hindi: 'दाल',        english: 'Lentils',       pronunciation: 'Daal' },
  { id: 37, category: 'food', garhwali: 'पाणि',     hindi: 'पानी',       english: 'Water',         pronunciation: 'Paani' },
  { id: 38, category: 'food', garhwali: 'दूध',      hindi: 'दूध',        english: 'Milk',          pronunciation: 'Doodh' },
  { id: 39, category: 'food', garhwali: 'घ्यू',     hindi: 'घी',         english: 'Clarified Butter (Ghee)', pronunciation: 'Ghyoo' },
  { id: 40, category: 'food', garhwali: 'आलू के गुटके', hindi: 'आलू की सब्जी', english: 'Spiced potato dish', pronunciation: 'Aalu ke gutke' },
  { id: 41, category: 'food', garhwali: 'कंडाली का साग', hindi: 'बिच्छू घास की सब्जी', english: 'Nettle greens (Pahadi dish)', pronunciation: 'Kandaali ka saag' },
  { id: 42, category: 'food', garhwali: 'मड़वे की रोटी', hindi: 'रागी की रोटी', english: 'Finger millet flatbread', pronunciation: 'Madwe ki roti' },
  { id: 43, category: 'food', garhwali: 'भूख लागि',  hindi: 'भूख लगी है', english: 'I am hungry',   pronunciation: 'Bhookh laagi' },
  { id: 44, category: 'food', garhwali: 'प्यास लागि', hindi: 'प्यास लगी है', english: 'I am thirsty', pronunciation: 'Pyaas laagi' },

  // ── Nature ──
  { id: 45, category: 'nature', garhwali: 'पहाड़',    hindi: 'पहाड़',      english: 'Mountain',      pronunciation: 'Pahaad' },
  { id: 46, category: 'nature', garhwali: 'नदी',      hindi: 'नदी',       english: 'River',         pronunciation: 'Nadi' },
  { id: 47, category: 'nature', garhwali: 'जंगल',     hindi: 'जंगल',      english: 'Forest',        pronunciation: 'Jangal' },
  { id: 48, category: 'nature', garhwali: 'बर्फ',     hindi: 'बर्फ',      english: 'Snow',          pronunciation: 'Barf' },
  { id: 49, category: 'nature', garhwali: 'बादल',     hindi: 'बादल',      english: 'Cloud',         pronunciation: 'Baadal' },
  { id: 50, category: 'nature', garhwali: 'आकाश',     hindi: 'आसमान',     english: 'Sky',           pronunciation: 'Aakaash' },
  { id: 51, category: 'nature', garhwali: 'सूरज',     hindi: 'सूरज',      english: 'Sun',           pronunciation: 'Sooraj' },
  { id: 52, category: 'nature', garhwali: 'चाँद',     hindi: 'चाँद',      english: 'Moon',          pronunciation: 'Chaand' },
  { id: 53, category: 'nature', garhwali: 'गैणा',    hindi: 'तारा',      english: 'Star',          pronunciation: 'Gaina' },
  { id: 54, category: 'nature', garhwali: 'बारिश',    hindi: 'बारिश',     english: 'Rain',          pronunciation: 'Baarish' },

  // ── Daily Phrases ──
  { id: 55, category: 'daily', garhwali: 'कख जाण छ?',    hindi: 'कहाँ जा रहे हो?', english: 'Where are you going?', pronunciation: 'Kakh jaaN chha?' },
  { id: 56, category: 'daily', garhwali: 'मैं घर जाणू',  hindi: 'मैं घर जा रहा हूँ', english: 'I am going home',     pronunciation: 'Main ghar jaanoo' },
  { id: 57, category: 'daily', garhwali: 'तुमर नाम क्या छ?', hindi: 'तुम्हारा नाम क्या है?', english: 'What is your name?', pronunciation: 'Tumar naam kyaa chha?' },
  { id: 58, category: 'daily', garhwali: 'मेरो नाम ... छ', hindi: 'मेरा नाम ... है', english: 'My name is ...',      pronunciation: 'Mero naam ... chha' },
  { id: 59, category: 'daily', garhwali: 'कतु बजि छ?',   hindi: 'कितने बजे हैं?',   english: 'What time is it?',   pronunciation: 'Katu baji chha?' },
  { id: 60, category: 'daily', garhwali: 'मैं नि समझ्यों', hindi: 'मैं नहीं समझा',  english: 'I did not understand', pronunciation: 'Main ni samjhyon' },
  { id: 61, category: 'daily', garhwali: 'फेर बोल',      hindi: 'दोबारा बोलो',    english: 'Say it again',        pronunciation: 'Pher bol' },
  { id: 62, category: 'daily', garhwali: 'हाँ',          hindi: 'हाँ',            english: 'Yes',                 pronunciation: 'Haan' },
  { id: 63, category: 'daily', garhwali: 'नाँ / नि',     hindi: 'नहीं',           english: 'No',                  pronunciation: 'Naan / Ni' },
  { id: 64, category: 'daily', garhwali: 'ठीक छ',        hindi: 'ठीक है',         english: 'It\'s alright / OK',  pronunciation: 'Theek chha' },
  { id: 65, category: 'daily', garhwali: 'बहुत भलो',     hindi: 'बहुत अच्छा',     english: 'Very good',           pronunciation: 'Bahut bhalo' },
  { id: 66, category: 'daily', garhwali: 'मद्द कर',      hindi: 'मदद करो',        english: 'Please help',         pronunciation: 'Madd kar' },

  // ── Animals ──
  { id: 67, category: 'animals', garhwali: 'गाई',    hindi: 'गाय',    english: 'Cow',     pronunciation: 'Gaai' },
  { id: 68, category: 'animals', garhwali: 'भैंस',   hindi: 'भैंस',   english: 'Buffalo', pronunciation: 'Bhains' },
  { id: 69, category: 'animals', garhwali: 'बाघ',    hindi: 'बाघ',    english: 'Tiger',   pronunciation: 'Baagh' },
  { id: 70, category: 'animals', garhwali: 'हिरन',   hindi: 'हिरण',   english: 'Deer',    pronunciation: 'Hiran' },
  { id: 71, category: 'animals', garhwali: 'बाँदर',  hindi: 'बंदर',   english: 'Monkey',  pronunciation: 'Baandar' },
  { id: 72, category: 'animals', garhwali: 'घुघुती', hindi: 'कबूतर',  english: 'Dove / Pigeon (Pahadi icon)', pronunciation: 'Ghughuti' },
  { id: 73, category: 'animals', garhwali: 'माछ',    hindi: 'मछली',   english: 'Fish',    pronunciation: 'Maachh' },
  { id: 74, category: 'animals', garhwali: 'रिख',    hindi: 'भालू',   english: 'Bear',    pronunciation: 'Rikh' },
  { id: 75, category: 'animals', garhwali: 'बाखुलु', hindi: 'चिड़िया', english: 'Bird',   pronunciation: 'Baakhulu' },

  // ── Body Parts ──
  { id: 76, category: 'body', garhwali: 'सिर',  hindi: 'सिर',  english: 'Head',  pronunciation: 'Sir' },
  { id: 77, category: 'body', garhwali: 'आंख',  hindi: 'आँख',  english: 'Eye',   pronunciation: 'Aankh' },
  { id: 78, category: 'body', garhwali: 'कान',  hindi: 'कान',  english: 'Ear',   pronunciation: 'Kaan' },
  { id: 79, category: 'body', garhwali: 'नाक',  hindi: 'नाक',  english: 'Nose',  pronunciation: 'Naak' },
  { id: 80, category: 'body', garhwali: 'मुख',  hindi: 'मुँह', english: 'Mouth', pronunciation: 'Mukh' },
  { id: 81, category: 'body', garhwali: 'हाथ',  hindi: 'हाथ',  english: 'Hand',  pronunciation: 'Haath' },
  { id: 82, category: 'body', garhwali: 'पाँव', hindi: 'पैर',  english: 'Foot',  pronunciation: 'Paanv' },
  { id: 83, category: 'body', garhwali: 'दाँत', hindi: 'दाँत', english: 'Teeth', pronunciation: 'Daant' },
  { id: 84, category: 'body', garhwali: 'बाल',  hindi: 'बाल',  english: 'Hair',  pronunciation: 'Baal' },
  { id: 85, category: 'body', garhwali: 'ह्रदय', hindi: 'दिल', english: 'Heart', pronunciation: 'Hraday' },

  // ── Colors ──
  { id: 86, category: 'colors', garhwali: 'लाल',     hindi: 'लाल',    english: 'Red',    pronunciation: 'Laal' },
  { id: 87, category: 'colors', garhwali: 'नीळू',    hindi: 'नीला',   english: 'Blue',   pronunciation: 'Neeluu' },
  { id: 88, category: 'colors', garhwali: 'हरो',     hindi: 'हरा',    english: 'Green',  pronunciation: 'Haro' },
  { id: 89, category: 'colors', garhwali: 'पीलो',    hindi: 'पीला',   english: 'Yellow', pronunciation: 'Peelo' },
  { id: 90, category: 'colors', garhwali: 'सफेद',    hindi: 'सफ़ेद',   english: 'White',  pronunciation: 'Safed' },
  { id: 91, category: 'colors', garhwali: 'कालो',    hindi: 'काला',   english: 'Black',  pronunciation: 'Kaalo' },
  { id: 92, category: 'colors', garhwali: 'नारंगी',  hindi: 'नारंगी', english: 'Orange', pronunciation: 'Naarangi' },
  { id: 93, category: 'colors', garhwali: 'गुलाबी',  hindi: 'गुलाबी', english: 'Pink',   pronunciation: 'Gulaabi' },

  // ── Time & Days ──
  { id: 94,  category: 'time', garhwali: 'आज',      hindi: 'आज',      english: 'Today',     pronunciation: 'Aaj' },
  { id: 95,  category: 'time', garhwali: 'काल',     hindi: 'कल',      english: 'Yesterday / Tomorrow', pronunciation: 'Kaal' },
  { id: 96,  category: 'time', garhwali: 'परसों',   hindi: 'परसों',   english: 'Day after/before', pronunciation: 'Parson' },
  { id: 97,  category: 'time', garhwali: 'फजर / बिणसार', hindi: 'सुबह', english: 'Morning', pronunciation: 'Fajar / Binsaar' },
  { id: 98,  category: 'time', garhwali: 'सांझ',    hindi: 'शाम',     english: 'Evening',   pronunciation: 'Saanjh' },
  { id: 99,  category: 'time', garhwali: 'रात',     hindi: 'रात',     english: 'Night',     pronunciation: 'Raat' },
  { id: 100, category: 'time', garhwali: 'सोमवार',  hindi: 'सोमवार',  english: 'Monday',    pronunciation: 'Somvaar' },
  { id: 101, category: 'time', garhwali: 'मंगलवार', hindi: 'मंगलवार', english: 'Tuesday',   pronunciation: 'Mangalvaar' },
  { id: 102, category: 'time', garhwali: 'बुधवार',  hindi: 'बुधवार',  english: 'Wednesday', pronunciation: 'Budhvaar' },
  { id: 103, category: 'time', garhwali: 'बीरवार',  hindi: 'गुरुवार', english: 'Thursday',  pronunciation: 'Beervaar' },
  { id: 104, category: 'time', garhwali: 'शुक्रवार', hindi: 'शुक्रवार', english: 'Friday',  pronunciation: 'Shukravaar' },
  { id: 105, category: 'time', garhwali: 'शनिवार',  hindi: 'शनिवार',  english: 'Saturday',  pronunciation: 'Shanivaar' },
  { id: 106, category: 'time', garhwali: 'रविवार',  hindi: 'रविवार',  english: 'Sunday',    pronunciation: 'Ravivaar' },

  // ── Extra from Himlingo dictionary ──
  // Greetings
  { id: 107, category: 'greetings', garhwali: 'खुसाली छ?',    hindi: 'खुशी है?',         english: 'Are you happy / well?',   pronunciation: 'Khusaali chha?' },
  { id: 108, category: 'greetings', garhwali: 'जय हो',         hindi: 'जय हो',            english: 'Victory / Blessings',     pronunciation: 'Jay ho' },
  // Family (himlingo-sourced)
  { id: 109, category: 'family', garhwali: 'भतार',    hindi: 'पति',     english: 'Husband',       pronunciation: 'Bhataar' },
  { id: 110, category: 'family', garhwali: 'सुड्याणी', hindi: 'पत्नी',   english: 'Wife (alt.)',   pronunciation: 'Sudyaani' },
  { id: 111, category: 'family', garhwali: 'नाति',    hindi: 'नाती / पोता', english: 'Grandson',   pronunciation: 'Naati' },
  { id: 112, category: 'family', garhwali: 'लौडु',    hindi: 'लड़का / बच्चा', english: 'Boy / Child', pronunciation: 'Laaudu' },
  // Nature (himlingo-sourced)
  { id: 113, category: 'nature', garhwali: 'पाड़',     hindi: 'पहाड़',   english: 'Mountain (local)', pronunciation: 'Paad' },
  { id: 114, category: 'nature', garhwali: 'खाळ',     hindi: 'नाला / खड्ड', english: 'Stream / Ravine', pronunciation: 'Khaal' },
  { id: 115, category: 'nature', garhwali: 'बुरांस',  hindi: 'बुरांश',  english: 'Rhododendron (Uttarakhand flower)', pronunciation: 'Buraans' },
  { id: 116, category: 'nature', garhwali: 'भ्यूँ',   hindi: 'ज़मीन',   english: 'Land / Earth',  pronunciation: 'Bhyoon' },
  // Daily phrases (himlingo-sourced)
  { id: 117, category: 'daily', garhwali: 'भलि तरां',  hindi: 'अच्छी तरह से', english: 'Properly / Well done', pronunciation: 'Bhali taraa' },
  { id: 118, category: 'daily', garhwali: 'दगड़ी',    hindi: 'साथी / दोस्त', english: 'Friend / Companion', pronunciation: 'Dagdi' },
  { id: 119, category: 'daily', garhwali: 'आज्ञा छ', hindi: 'आज्ञा है / ठीक है', english: 'As you say / Agreed', pronunciation: 'Aagna chha' },
  { id: 120, category: 'daily', garhwali: 'कख रौन्दा?', hindi: 'कहाँ रहते हो?', english: 'Where do you live?', pronunciation: 'Kakh raunda?' },
];

export default PHRASES;
