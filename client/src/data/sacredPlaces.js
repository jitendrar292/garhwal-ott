/**
 * Sacred & Historical Places of Uttarakhand (Garhwal & Kumaon)
 * Cultural heritage sites with legends, significance, and visitor information
 */
const SACRED_PLACES = [
  {
    id: 'kedarnath',
    name: 'केदारनाथ',
    english: 'Kedarnath Temple',
    type: 'temple',
    district: 'Rudraprayag',
    altitude: '3,583m',
    emoji: '🕉️',
    legend: 'After the Mahabharata war, the Pandavas sought Lord Shiva\'s forgiveness for killing their kin. Shiva, unwilling to forgive easily, disguised himself as a bull (Nandi) and fled to the mountains. When cornered at Kedarnath, he dove into the ground. Bheem grabbed the bull\'s hump — which remained above ground and is worshipped as the Jyotirlinga. The other body parts appeared at four other locations (Panch Kedar).',
    significance: 'One of the twelve Jyotirlingas, the northernmost. One of the Char Dham. Built by Adi Shankaracharya in 8th century CE over a pre-existing shrine. The temple survived the catastrophic 2013 flood when a large boulder diverted the debris flow — locals believe it was divine protection.',
    architecture: 'Massive stone structure in North Indian Nagara style. Built of large grey slabs of stone without mortar. The conical shikhar rises above a mandapa with beautiful pillar carvings. The inner sanctum houses the triangular-shaped rock formation (the "hump of Nandi").',
    bestTime: 'May to June, September to October (temple closed November-April due to snow)',
    garhwaliConnection: 'Kedarnath is central to Garhwali identity. The Kedarnath Rawal (head priest) is always from Karnataka (appointed by Shankaracharya tradition), but the teerth purohits and support staff are local Garhwali Brahmins. The doli (palanquin) carriers are a hereditary Garhwali community.'
  },
  {
    id: 'badrinath',
    name: 'बद्रीनाथ',
    english: 'Badrinath Temple',
    type: 'temple',
    district: 'Chamoli',
    altitude: '3,133m',
    emoji: '🙏',
    legend: 'Lord Vishnu was meditating in the harsh cold at this spot. Goddess Lakshmi, to protect him from the elements, took the form of a Badri tree (jujube) and sheltered him for thousands of years. When Vishnu finally opened his eyes and saw her devotion, he named the place "Badri-nath" — Lord of the Badri tree.',
    significance: 'One of the Char Dham, the holiest Vaishnavite shrine in the Himalayas. The temple is mentioned in the Padma Purana and Skanda Purana. Adi Shankaracharya rediscovered the murti (idol) submerged in the Narad Kund hot spring and established the current temple in 9th century CE.',
    architecture: 'A colorful painted facade with a small cupola of gilded roof (distinctly different from South Indian temples). Built in stone with a tall entrance portal. The idol of Vishnu is carved in black Saligrama stone in padmasana (meditative) posture — unusual as Vishnu is typically shown reclining or standing.',
    bestTime: 'May to June, September to November (temple closed during winter)',
    garhwaliConnection: 'The Dimri (panda) families of Badrinath are hereditary pilgrimage priests from Garhwal who maintain genealogy records (pothis) of millions of Hindu families. The journey to Badrinath historically passed through dozens of Garhwali villages, forming the economic backbone of the region.'
  },
  {
    id: 'tungnath',
    name: 'तुंगनाथ',
    english: 'Tungnath Temple',
    type: 'temple',
    district: 'Rudraprayag',
    altitude: '3,680m',
    emoji: '⛰️',
    legend: 'When Shiva dove underground at Kedarnath, his arms appeared at Tungnath — the highest of the Panch Kedar temples. The Pandavas built this temple at the spot where Shiva\'s arms (bahu) emerged. The trek to Tungnath passes through rhododendron forests that bloom blood-red in spring.',
    significance: 'The highest Shiva temple in the world. Part of the Panch Kedar circuit. Over 1000 years old. Despite being above treeline, the temple has survived centuries of extreme weather. A further 1.5 km trek leads to Chandrashila peak (4,000m) with 360-degree Himalayan panorama.',
    architecture: 'Compact stone structure in classic North Indian mountain temple style. Small mandapa with shikhar. Stone pillars with simple geometric carvings. The surrounding area has ruins of smaller subsidiary shrines, suggesting a once-larger temple complex.',
    bestTime: 'April to June, September to November (easy 3.5 km trek from Chopta)',
    garhwaliConnection: 'The Chopta-Tungnath-Chandrashila trek is Garhwal\'s most popular pilgrimage-trekking combination. The temple is maintained by local Garhwali priests from surrounding villages. The buransh (rhododendron) juice sold along the trail is a beloved Garhwali seasonal drink.'
  },
  {
    id: 'jageshwar',
    name: 'जागेश्वर',
    english: 'Jageshwar Temple Complex',
    type: 'temple',
    district: 'Almora',
    altitude: '1,870m',
    emoji: '🛕',
    legend: 'According to the Shiva Purana, this is where Shiva meditated after being cursed by the Seven Sages (Saptarishi). The sages\' wives had been enchanted by Shiva\'s beauty, causing the sages to curse him. In penance, Shiva retired to this dense deodar forest for meditation, and the original lingam appeared spontaneously from the ground.',
    significance: 'A cluster of 124 ancient stone temples dating from 7th to 14th century CE — the largest temple cluster in Uttarakhand. Mentioned in ancient texts as one of the twelve Jyotirlingas (contested). The Archaeological Survey of India (ASI) has classified it as a monument of national importance.',
    architecture: 'Stunning examples of Nagara-style temple architecture spanning 700 years of evolution. The oldest temples (7th century) are simple single-cell shrines. Later temples have elaborately carved doorways, ceiling panels, and shikhars. All set amidst ancient deodar trees with the Jata Ganga stream flowing through.',
    bestTime: 'Year-round (accessible in all seasons; most pleasant March-May, September-November)',
    garhwaliConnection: 'Located in the Kumaon region but deeply connected to the shared Garhwali-Kumaoni religious tradition. The Maha Shivaratri celebration here draws devotees from across Uttarakhand. The dense deodar forest setting reflects the Pahadi belief that God dwells most powerfully in undisturbed forests.'
  },
  {
    id: 'srinagar-garhwal',
    name: 'श्रीनगर (गढ़वाल)',
    english: 'Srinagar – Ancient Capital of Garhwal',
    type: 'historical',
    district: 'Pauri',
    altitude: '560m',
    emoji: '🏰',
    legend: 'Srinagar was founded as the capital of the Parmar dynasty (later Panwar/Shah) who ruled Garhwal for over 900 years. The city on the banks of the Alaknanda was considered invincible — protected by river on one side and mountains on three. It fell to the Gorkhas in 1803 after a siege, marking the end of independent Garhwal.',
    significance: 'Capital of the Garhwal Kingdom from 14th to early 19th century. Seat of the Panwar dynasty. Now a university town (HNB Garhwal University). The old palace ruins, royal temples, and historical gardens tell the story of a sophisticated hill court that patronized arts, music, and Sanskrit learning.',
    architecture: 'The old town retains narrow lanes, traditional Garhwali wooden houses with carved balconies (jharokha), and several Panwar-era temples. The Kamleshwar temple (Shiva) near the river is the most important surviving royal temple with fine stone carvings.',
    bestTime: 'Year-round (pleasant climate at 560m)',
    garhwaliConnection: 'Srinagar is the emotional heart of Garhwali history. Every folk ballad (Jagar, Hurkiya Bol) references Srinagar as the royal court. The city is name-checked in virtually every Garhwali warrior epic (including Ranu Rout, Madho Mahesh). Today it remains a center of Garhwali cultural organizations and university-based research.'
  },
  {
    id: 'chandrabadni',
    name: 'चन्द्रबदनी',
    english: 'Chandrabadni Temple',
    type: 'temple',
    district: 'Tehri',
    altitude: '2,277m',
    emoji: '🌙',
    legend: 'When Sati (Shiva\'s first wife) immolated herself in her father Daksha\'s yajna fire, the grief-stricken Shiva carried her burning body across the heavens. Wherever her body parts fell, Shakti Peethas arose. At Chandrabadni, her torso (dhad) fell, making it one of the 52 Shakti Peethas. A natural Sri Yantra pattern is visible on the rock at the summit.',
    significance: 'One of the three Siddha Peethas in Garhwal (along with Surkanda Devi and Kunjapuri). The naturally occurring Sri Yantra geometric pattern on the hilltop rock is considered miraculous. The temple has strong Tantric associations and is a center for Shakti worship in the Garhwali tradition.',
    architecture: 'Simple stone temple at the summit with the naturally patterned rock as the focal point. No idol worship — the yantra pattern on the ground IS the deity. Surrounding area has tridents (trishul) planted by devotees. 360-degree views of the Himalayan range and Tehri Dam.',
    bestTime: 'Year-round; special celebrations during Navratri (March-April and September-October)',
    garhwaliConnection: 'Chandrabadni is central to the Garhwali Devi worship tradition. In Jagar ceremonies, Chandrabadni Devi is one of the most commonly invoked deities. Local women make annual pilgrimages here during Navratri. Ghost stories (bhoot kathas) are associated with the surrounding forest, where Bhairav is believed to patrol.'
  },
  {
    id: 'devalgarh',
    name: 'देवलगढ़',
    english: 'Devalgarh Fort',
    type: 'historical',
    district: 'Pauri',
    altitude: '1,500m',
    emoji: '🏯',
    legend: 'Devalgarh was the first capital of the Panwar dynasty before they moved to Srinagar. According to legend, King Kanak Pal (ancestor of the Panwars) was granted this fortress by a local chieftain after Kanak Pal defeated a demon that was terrorizing the valley. The grateful people crowned him king, beginning 900 years of Panwar rule.',
    significance: 'The original capital of the Garhwal Kingdom (7th-14th century). Ruins of the ancient fort, royal palace, and temples still exist. The Rajrajeshwari temple here is one of the oldest surviving structures in Garhwal. Archaeological excavations have revealed coins, pottery, and inscriptions from the early medieval period.',
    architecture: 'Hilltop fortification with concentric stone walls following natural contours. The surviving Rajrajeshwari temple has elaborately carved stone doorframe with figures of river goddesses, attendants, and floral motifs typical of 9th-10th century North Indian style.',
    bestTime: 'October to March (pleasant weather, clear views)',
    garhwaliConnection: 'Devalgarh represents the origin story of Garhwali political identity. The Panwar dynasty that began here went on to create a unified Garhwal state. Local villagers still celebrate the founding legend during an annual mela. The nearby Dhari Devi temple on the Alaknanda is one of Garhwal\'s most powerful Siddha shrines.'
  },
  {
    id: 'kartik-swami',
    name: 'कार्तिक स्वामी',
    english: 'Kartik Swami Temple',
    type: 'temple',
    district: 'Rudraprayag',
    altitude: '3,048m',
    emoji: '✨',
    legend: 'Lord Kartikeya (Skanda/Murugan), son of Shiva and Parvati, was upset when his younger brother Ganesha won a competition by circling their parents (representing the universe) while Kartikeya circled the actual world. Feeling cheated, Kartikeya left for the southern mountains. But he paused here in Garhwal, looking back one last time at his parents\' abode (Kailash) before departing.',
    significance: 'One of the very few temples dedicated to Lord Kartikeya in North India (he is worshipped primarily in South India as Murugan). The panoramic view from the temple includes Kedarnath, Badrinath, Chaukhamba, Nanda Devi, and Trisul peaks — making it one of the finest Himalayan viewpoints in Garhwal.',
    architecture: 'Small but beautifully situated stone temple at the cliff edge. A steep stone staircase leads to the final summit. The temple houses a peacock-mounted idol of Kartikeya (his vehicle is the peacock). Prayer flags and tridents surround the temple.',
    bestTime: 'March to May, September to November (3 km trek from Kanakchauri village)',
    garhwaliConnection: 'Kartik Swami is beloved by Garhwali trekkers and photographers for its unmatched Himalayan panorama. The trek passes through local Garhwali villages where traditional architecture is well-preserved. The annual Kartik Purnima mela draws thousands from surrounding valleys.'
  },
  {
    id: 'binsar',
    name: 'बिनसर',
    english: 'Binsar (Ancient Retreat)',
    type: 'historical',
    district: 'Almora',
    altitude: '2,420m',
    emoji: '🌲',
    legend: 'Binsar was the summer capital of the Chand dynasty kings of Kumaon. The name derives from "Bineshwar" — Lord Shiva of the forest (vana + Ishwar). The ancient Bineshwar Mahadev temple in the forest predates the Chand dynasty and is believed to have been established by a 10th-century king who meditated here after renouncing his throne.',
    significance: 'A vast oak and rhododendron forest now protected as a wildlife sanctuary. The Binsar zero-point offers a 300 km panoramic view of the Himalayan range — from Kedarnath in the west to Api-Nampa in Nepal in the east. The area contains ruins of Chand-era summer palaces and hunting lodges.',
    architecture: 'The Bineshwar temple complex includes three temples (Shiva, Ganesh, and a goddess shrine) with carved stone panels showing Kumaoni artistic traditions. Chand-era ruins are scattered through the forest. British-era bungalows (now heritage stays) dot the area.',
    bestTime: 'Year-round; October-November for clearest Himalayan views; April-May for rhododendron blooms',
    garhwaliConnection: 'While technically in Kumaon, Binsar represents the shared Garhwali-Kumaoni heritage. The oak forests here are identical to those in Garhwal, and the cultural traditions (Jagar, folk songs, agricultural calendar) are continuous across the border. The wildlife sanctuary protects endangered Himalayan fauna including leopard, barking deer, and over 200 bird species.'
  },
  {
    id: 'lakhamandal',
    name: 'लाखामण्डल',
    english: 'Lakhamandal',
    type: 'historical',
    district: 'Dehradun',
    altitude: '1,372m',
    emoji: '🏛️',
    legend: 'According to Mahabharata tradition, this is "Lakshagriha" — the House of Lac where Duryodhana attempted to burn the Pandavas alive. The Pandavas escaped through a tunnel that locals believe leads to the nearby river. Inscriptions found here dating to 7th-8th century CE confirm this was an important pilgrimage site even in ancient times.',
    significance: 'Archaeological excavations have revealed a major ancient temple site with inscriptions from 6th-12th century CE. The site contains a Shiva temple with one of the largest collections of ancient Shiva Lingas in India — over 1000 lingas carved in various sizes surround the main temple. Recently excavated structures suggest this was a significant town on the ancient trade route.',
    architecture: 'The main temple follows early Nagara style with a square sanctum and curvilinear shikhar. The unique feature is the "field of lingas" — over a thousand stone lingas of varying sizes arranged in groups. Carved panels show Shiva, Vishnu, and various deities in 7th-century Pratihara style.',
    bestTime: 'Year-round (accessible by road from Mussoorie/Dehradun)',
    garhwaliConnection: 'Lakhamandal connects Garhwal to the Mahabharata epic tradition — a source of immense cultural pride. Many Garhwali warrior ballads reference Pandava ancestry. The site proves that sophisticated urban civilization existed in these valleys over 1500 years ago, countering the misconception that hill regions were always isolated.'
  }
];

export const PLACE_TYPES = [
  { id: 'all', label: 'सभी स्थान', english: 'All Places' },
  { id: 'temple', label: 'मन्दिर', english: 'Temples' },
  { id: 'historical', label: 'ऐतिहासिक', english: 'Historical' },
];

export default SACRED_PLACES;
