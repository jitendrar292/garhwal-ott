/**
 * Traditional Musical Instruments of Garhwal & Kumaon
 * Comprehensive guide to the folk instruments of Uttarakhand
 */
const GARHWALI_INSTRUMENTS = [
  {
    id: 'dhol',
    name: 'ढोल',
    english: 'Dhol',
    type: 'percussion',
    image: '🥁',
    region: 'Garhwal & Kumaon',
    description: 'The dhol is the heartbeat of every Garhwali celebration. It is a large, barrel-shaped drum played with two sticks — a thin bamboo stick (dagga) on the treble side and a curved heavy stick (thali) on the bass side. The drum body is carved from a single piece of sheesham or mango wood, with goatskin stretched over both ends.',
    culturalSignificance: 'No wedding, festival, or religious procession in Uttarakhand is complete without the dhol. The rhythmic patterns (taal) vary by occasion — the "Mangal" beat for weddings, "Jagar" beat for spirit invocations, and "Pandav Nritya" beat for the epic dance-drama. Dhol players (Auji/Dholi) hold a hereditary position in village society and are essential for all rituals.',
    playingStyle: 'The player hangs the dhol from a shoulder strap and strikes alternately on both sides. The bass side produces deep resonant booms while the treble side creates sharp, cutting rhythms. Master players can produce 15+ distinct sounds from a single instrument.',
    famousPlayers: 'Pritam Das Auji (legendary court drummer of Tehri), Mohan Upreti (documented dhol traditions), Ajay Rawat (contemporary fusion artist).'
  },
  {
    id: 'damau',
    name: 'दमाऊ',
    english: 'Damau (Kettledrum)',
    type: 'percussion',
    image: '🪘',
    region: 'Garhwal & Kumaon',
    description: 'The damau is a small copper kettledrum that always accompanies the dhol as its treble complement. Shaped like a bowl with a single goatskin head, it is played with two thin bamboo sticks. The copper body gives it a bright, metallic ring that cuts through the dhol\'s deep boom.',
    culturalSignificance: 'The dhol-damau pair is inseparable — they are considered "husband and wife" in Garhwali tradition. The damau provides the intricate rhythmic filigree over the dhol\'s foundation beat. In Jagar ceremonies, the damau\'s rapid patterns are believed to attract and guide ancestral spirits.',
    playingStyle: 'Played with both sticks striking rapidly in alternating patterns. The damau player must synchronize precisely with the dhol while adding complex ornamentations. Advanced techniques include rim shots, muted strokes, and the characteristic "rolling thunder" (ladi) that signals transitions.',
    famousPlayers: 'Traditionally played by Bajgi (Das) community members who inherit the skill. Notable: Keshav Das (Pauri), Surendra Auji (Chamoli).'
  },
  {
    id: 'ransingha',
    name: 'रणसिंगा',
    english: 'Ransingha (War Horn)',
    type: 'wind',
    image: '📯',
    region: 'Garhwal',
    description: 'The ransingha is a curved copper trumpet, typically 3-4 feet long, shaped like the letter "S" or "C". It produces a powerful, haunting drone that can be heard echoing across mountain valleys for kilometers. Made from hammered copper sheets joined together, it has no finger holes — sound variation comes purely from lip pressure and breathing.',
    culturalSignificance: 'Originally a war instrument used to signal armies across valleys (its name means "war-horn"), it now serves primarily in religious processions (jaat) and deity processions. When the ransingha sounds, it is believed that gods are approaching. During Nanda Devi Raj Jaat, multiple ransinghas create an otherworldly atmosphere as the procession crosses glacier passes.',
    playingStyle: 'The player must develop tremendous lung capacity and lip strength to produce the sustained drone note. Skilled players can produce 3-4 harmonic overtones. Playing is physically demanding — sessions rarely exceed 15-20 minutes at a stretch.',
    famousPlayers: 'A communal instrument rather than solo virtuoso tradition. Notable ensembles in Chandpur, Nagpur patti, and the Nanda Devi Raj Jaat troupe.'
  },
  {
    id: 'turhi',
    name: 'तुरही',
    english: 'Turhi (Straight Trumpet)',
    type: 'wind',
    image: '🎺',
    region: 'Garhwal & Kumaon',
    description: 'The turhi is a straight copper trumpet, 4-6 feet long, that produces a clear, piercing tone. Unlike the curved ransingha, the turhi is held straight out from the body, requiring considerable arm strength. It is typically played in pairs, with each instrument taking alternate phrases.',
    culturalSignificance: 'The turhi announces royal or divine presence. In the old Garhwal kingdom, it was sounded when the king left his palace. Today it precedes deity processions (devta ki jaat) as they travel between villages. The sound is considered auspicious — it purifies the air and drives away evil spirits.',
    playingStyle: 'Played in pairs for antiphonal effect. One turhi sounds a sustained note while the other rests, creating a continuous drone. The sound is produced by buzzing the lips into a cup-shaped mouthpiece.',
    famousPlayers: 'Part of the hereditary Bajgi ensemble tradition. Notable at Kedarnath, Tungnath, and Kartik Swami temple processions.'
  },
  {
    id: 'hurka',
    name: 'हुड़का',
    english: 'Hurka (Hourglass Drum)',
    type: 'percussion',
    image: '🪘',
    region: 'Kumaon & Garhwal',
    description: 'The hurka is a small hourglass-shaped drum held in one hand and played with the other. Made from hollowed wood with goatskin on both ends connected by leather lacing, it produces a variable-pitch sound when squeezed. It is light enough to be played while walking or dancing.',
    culturalSignificance: 'The hurka is the instrument of the Hurkiya — a storyteller-singer who narrates epic ballads (Hurkiya Bol) at agricultural festivals. During rice-planting season, the Hurkiya walks along paddy field edges, singing heroic tales to motivate workers. The tradition combines entertainment, history-keeping, and work motivation in one art form.',
    playingStyle: 'The player squeezes the leather laces connecting the two heads to change pitch — tighter squeeze = higher pitch. This allows the hurka to "speak" and follow the melodic contours of the narrative. The right hand strikes the drum while the left controls tension.',
    famousPlayers: 'Mohan Singh Rautela (Almora), Gopi Das (Pithoragarh). The Hurkiya Bol tradition is recognized by UNESCO as an intangible cultural heritage.'
  },
  {
    id: 'mashakbeen',
    name: 'मशकबीन',
    english: 'Mashakbeen (Bagpipe)',
    type: 'wind',
    image: '🎵',
    region: 'Garhwal',
    description: 'The mashakbeen is the Garhwali bagpipe — a goatskin bag with a blowpipe and a chanter (melody pipe). Unlike Scottish bagpipes, the Garhwali mashakbeen uses a simpler single-reed chanter and produces a softer, more nasal tone. The goatskin bag serves as an air reservoir allowing continuous sound.',
    culturalSignificance: 'The mashakbeen was associated with the courts and armies of the Garhwal kingdom. During the British colonial period, Garhwali regiments famously played mashakbeen alongside military drums. Today it is rare but preserved in a few families in Pauri and Chamoli districts. Its revival is a point of cultural pride.',
    playingStyle: 'The player inflates the goatskin bag through the blowpipe, then squeezes the bag with the arm to force air through the chanter while fingers play the melody. Circular breathing is not needed since the bag acts as a reservoir.',
    famousPlayers: 'Padma Shri Mohan Singh Gunjyal (last traditional mashakbeen master of Garhwal), Narendra Negi (attempted revival in concerts).'
  },
  {
    id: 'algoja',
    name: 'अलगोजा',
    english: 'Algoja (Twin Flutes)',
    type: 'wind',
    image: '🎶',
    region: 'Garhwal & Kumaon',
    description: 'The algoja consists of two bamboo flutes played simultaneously — one provides the drone note while the other plays the melody. Each flute has 5-6 finger holes. The player holds both flutes in the mouth at once, using circular breathing to maintain continuous sound.',
    culturalSignificance: 'The algoja is the shepherd\'s instrument — played in high-altitude meadows (bugyal) while grazing sheep and goats. Its haunting, double-toned sound carries across mountain valleys and is associated with pastoral solitude and the romance of hill life. Many Garhwali love songs reference the algoja as a symbol of longing.',
    playingStyle: 'The most challenging Garhwali instrument technically — requires circular breathing, independent finger coordination on two flutes simultaneously, and the ability to maintain a drone while playing melody. Master players can produce complex counterpoint between the two flutes.',
    famousPlayers: 'Shepherds of Chamoli and Rudraprayag are known masters. The tradition is declining as pastoral lifestyles diminish.'
  },
  {
    id: 'thali',
    name: 'थाली',
    english: 'Thali (Brass Plate)',
    type: 'percussion',
    image: '🍽️',
    region: 'Garhwal & Kumaon',
    description: 'The brass eating plate (thali) doubles as a percussion instrument in Garhwali folk music. Struck with a wooden spoon or metal rod, it produces a bright, ringing tone. Different sizes and thicknesses produce different pitches, allowing a set of thalis to create melodic percussion.',
    culturalSignificance: 'The thali represents the accessibility of Garhwali music — anyone with a kitchen plate can join in. During Harela and other festivals, women create complex rhythmic patterns by striking thalis in groups. The "Thali Naach" (plate dance) is a traditional women\'s performance where dancers spin and strike thalis simultaneously.',
    playingStyle: 'Held in one hand and struck with a metal ring or wooden stick in the other. Advanced players flip the thali between hands while maintaining rhythm. In group performances, interlocking patterns create rich polyrhythmic textures.',
    famousPlayers: 'A communal women\'s tradition rather than individual virtuoso performance. Notable at Harela, Ghee Sankranti, and wedding celebrations.'
  },
  {
    id: 'bansuri',
    name: 'बांसुरी (पहाड़ी)',
    english: 'Bansuri (Pahadi Flute)',
    type: 'wind',
    image: '🪈',
    region: 'Garhwal & Kumaon',
    description: 'The Pahadi bansuri is a transverse bamboo flute, shorter and higher-pitched than its plains counterpart. Made from the thin-walled ringal bamboo found at 2000-3000m altitude, it produces a bright, piercing tone suited to carrying across open mountain spaces. Typically 10-14 inches long with 6 finger holes.',
    culturalSignificance: 'Associated with Lord Krishna in Hindu tradition, the bansuri in Garhwal is primarily a pastoral instrument. Shepherds play it in high meadows, and its sound is woven into many folk songs as a symbol of mountain romance. The phrase "bansuri bajee" (the flute played) signals romance in Garhwali poetry.',
    playingStyle: 'Blown across the embouchure hole with the flute held to the side. The high altitude where ringal grows makes these flutes naturally higher-pitched. Players use half-holing and cross-fingering for microtones essential to Pahadi ragas.',
    famousPlayers: 'Gopal Babu Goswami (integrated bansuri into Garhwali recordings), Jagmohan (folk fusion). The instrument is common among shepherd communities of upper Garhwal.'
  },
  {
    id: 'daunr-thali',
    name: 'डौंर (नगाड़ा)',
    english: 'Daunr / Nagada (Temple Drum)',
    type: 'percussion',
    image: '🔔',
    region: 'Garhwal',
    description: 'The daunr (also called nagada) is a large, deep-pitched temple drum played during aarti and deity processions. Made from a hollowed tree trunk or large copper vessel with thick buffalo hide stretched over the top, it produces a thunderous boom that reverberates through valleys.',
    culturalSignificance: 'The daunr is exclusively a sacred instrument — never played for entertainment. It resides in the temple and is struck during morning/evening aarti, during deity jaat (processions), and to signal the beginning of important religious events. The Kedarnath daunr is said to be audible 5 km away and signals dawn worship to the entire valley.',
    playingStyle: 'Struck with a single heavy wooden mallet. The player times strikes to coincide with specific moments in the prayer ritual. During processions, a rhythmic pattern (often 3-beat or 7-beat cycles) coordinates with dhol and damau.',
    famousPlayers: 'Hereditary temple musicians (pujari families). The Kedarnath temple nagada tradition, Tungnath temple ensemble, and Kartik Swami temple procession are notable examples.'
  }
];

export const INSTRUMENT_TYPES = [
  { id: 'all', label: 'सभी वाद्य', english: 'All Instruments' },
  { id: 'percussion', label: 'ताल वाद्य', english: 'Percussion' },
  { id: 'wind', label: 'सुषिर वाद्य', english: 'Wind' },
];

export default GARHWALI_INSTRUMENTS;
