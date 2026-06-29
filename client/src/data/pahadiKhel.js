// Traditional Pahadi games and sports from Uttarakhand
// Each entry covers one game with rules, equipment, and cultural context.

export const PAHADI_KHEL = [
  {
    id: 'gilli-danda',
    name: 'Gilli Danda',
    nameLocal: 'गुल्ली-डंडा',
    type: 'Outdoor',
    players: '2–10',
    age: '6+',
    region: 'All Uttarakhand',
    emoji: '🏏',
    bg: 'from-amber-600 to-orange-800',
    tagline: 'पहाड़ का क्रिकेट',
    description:
      'Often called the ancient ancestor of cricket, Gilli Danda involves a small tapered wooden piece (gilli) and a longer stick (danda). The gilli is balanced on a stone, flipped into the air with the danda tip, and then struck as far as possible. Score is measured in hand-lengths. It was the defining summer game across every village.',
    equipment: ['Gilli — small tapered wood piece (~15 cm)', 'Danda — longer wooden stick (~60–90 cm)'],
    howToPlay: [
      'Place the gilli on a small stone or in a shallow pit',
      'Use the danda tip to flip the gilli into the air',
      'Strike it mid-air as far as you can',
      'Fielding team can catch it (striker is out) or throw it back to the pit',
      'Score is measured in hand-lengths from the pit to where the gilli landed',
    ],
    culturalNote:
      'Played during harvest season when fields were clear. Elders say it trained the hand-eye coordination essential for farming and hunting in hilly terrain.',
  },
  {
    id: 'kanche',
    name: 'Kanche (Marbles)',
    nameLocal: 'कंचे',
    type: 'Outdoor / Ground',
    players: '2–6',
    age: '5+',
    region: 'All Uttarakhand',
    emoji: '🔵',
    bg: 'from-blue-600 to-indigo-800',
    tagline: 'रंगीन पत्थरों का खेल',
    description:
      'Kanche (marbles) was the most universal childhood game across Pahadi communities. Children collected coloured glass marbles or smooth river pebbles. The games required precision, prediction, and spatial strategy — teaching geometry in the guise of play.',
    equipment: ['Glass marbles — 10–20 per player', 'Flat dirt or stone surface'],
    howToPlay: [
      'Draw a circle in the dirt (the "taal")',
      'Each player puts 3–5 marbles inside the circle',
      'Players shoot their "aaker" marble from the edge to knock others out',
      'Marbles knocked outside the circle are won by the shooter',
      'Last player to have marbles in the taal loses',
    ],
    culturalNote:
      'Winning a particularly prized marble was a major event. Older boys collected them like currency, trading at school gates and village paths.',
  },
  {
    id: 'pithoo',
    name: 'Pithoo (Seven Stones)',
    nameLocal: 'पिठ्ठू / सात पत्थर',
    type: 'Outdoor',
    players: '6–14 (two teams)',
    age: '7+',
    region: 'All Uttarakhand',
    emoji: '🪨',
    bg: 'from-stone-600 to-gray-800',
    tagline: 'दो टीम, सात पत्थर',
    description:
      'Pithoo requires stacking seven flat stones in a pile. One team tries to knock it down with a soft ball, then must reassemble the stack while dodging the fielding team\'s throws. It demands speed, teamwork, and tactical running.',
    equipment: ['7 flat stones of similar size', 'Soft rubber or cloth ball'],
    howToPlay: [
      'One team stacks 7 stones, the other defends',
      'Hitting team gets three throws to knock the stack from a set distance',
      'Once knocked, hitters must reassemble the stack before being hit by the ball',
      'Successfully rebuilding the stack scores a point; being hit by ball scores for defenders',
    ],
    culturalNote:
      'Games often brought rival mohallas (neighbourhoods) together. Seven stones symbolically represented seven directions of protection in local belief.',
  },
  {
    id: 'lato',
    name: 'Latto (Spinning Top)',
    nameLocal: 'लट्टू / लाटो',
    type: 'Outdoor',
    players: '2–8',
    age: '6+',
    region: 'All Uttarakhand',
    emoji: '🌀',
    bg: 'from-purple-700 to-violet-900',
    tagline: 'घूमता हुआ जादू',
    description:
      'Latto (spinning top) was hand-carved from hardwood in Pahadi villages and spun using a rough string. Boys competed on longest spin, landing on an opponent\'s top to crack it, or transferring a spinning top from string to palm without it stopping.',
    equipment: ['Wooden latto hand-carved from hardwood', 'Rough string (sutli) for winding and throwing'],
    howToPlay: [
      'Wind the string tightly around the latto from tip to top',
      'Throw the latto down while pulling the string sharply to release it',
      'The top spins on its iron nail tip',
      'Challenges: land on opponents\' top, spin longest, or transfer to palm while spinning',
    ],
    culturalNote:
      'Latto carving was itself an art — shape, weight balance, and nail placement determined spin quality. Some families had secret carving patterns passed through generations.',
  },
  {
    id: 'oonch-neech',
    name: 'Oonch Neech',
    nameLocal: 'ऊँच-नीच',
    type: 'Outdoor',
    players: '4–15',
    age: '5+',
    region: 'All Uttarakhand',
    emoji: '🏃',
    bg: 'from-green-600 to-teal-800',
    tagline: 'पहाड़ी टैग',
    description:
      'A tag game uniquely adapted to hilly terrain. The "it" player calls "Oonch!" (high) or "Neech!" (low) — players must immediately get to a high point (rock, step, wall) or low point (ground). Being caught in the wrong position makes you the new "it". The hills made this game thrillingly unpredictable.',
    equipment: ['None — just terrain with different heights'],
    howToPlay: [
      'Choose one player to be "it"',
      '"It" calls "Oonch!" or "Neech!" at any moment',
      'All other players must immediately be at the correct elevation',
      'Anyone at the wrong height is tagged and becomes "it"',
    ],
    culturalNote:
      'This game fully exploited Uttarakhand\'s terrain. Flat-land versions are far less exciting. Village playing spots had beloved rocks and ledges with names.',
  },
  {
    id: 'kabaddi-pahadi',
    name: 'Pahadi Kabaddi',
    nameLocal: 'पहाड़ी कब्बड्डी',
    type: 'Contact Sport',
    players: '12 (6 per team)',
    age: '10+',
    region: 'All Uttarakhand',
    emoji: '🤼',
    bg: 'from-red-700 to-rose-900',
    tagline: 'दम साधो, विजय पाओ',
    description:
      'The Pahadi variant of Kabaddi is played on slightly sloped threshing floors or village commons. It follows the same raid-and-hold rules but uses natural boundaries instead of court lines — rocks, trees, and ditches as edges. District competitions at major melas drew massive crowds.',
    equipment: ['Open ground — threshing floor or village common', 'Natural boundaries (no painted lines needed)'],
    howToPlay: [
      'Two teams of 6 take opposite halves',
      'A raider enters the opponent\'s half chanting "kabaddi kabaddi"',
      'Raider must tag opponents and return without stopping the chant',
      'If held until the raider takes a breath, the raider is out',
      'Tagged opponents who do not hold the raider are eliminated',
    ],
    culturalNote:
      'Kabaddi was the premier sport for young men. Winners at mela-level competitions became local celebrities for an entire year.',
  },
  {
    id: 'pakdam-pakdai',
    name: 'Pakdam Pakdai (Chain Tag)',
    nameLocal: 'पकड़म-पकड़ाई',
    type: 'Outdoor',
    players: '6–20',
    age: '5+',
    region: 'All Uttarakhand',
    emoji: '🏃‍♂️',
    bg: 'from-cyan-600 to-blue-800',
    tagline: 'भागो या पकड़ो',
    description:
      'Classic chain tag — but each caught player joins hands with the catcher, forming a growing chain. The chain must stay connected while chasing remaining players, making coordination essential. In hilly terrain, coordinating a chain of six kids running downhill became hilariously difficult.',
    equipment: ['None'],
    howToPlay: [
      'One player starts as "it"',
      'Tagged players join the chain by holding hands',
      'The growing chain must stay connected while catching everyone else',
      'Last uncaught player wins and starts the next round',
    ],
    culturalNote:
      'Some village variants allowed chains to split into smaller groups once the chain reached six players — making the final moments chaotic and unpredictable.',
  },
  {
    id: 'bante',
    name: 'Bante (Clay Balls)',
    nameLocal: 'बाँटे',
    type: 'Outdoor',
    players: '2–6',
    age: '6+',
    region: 'Garhwal · Kumaon',
    emoji: '🟤',
    bg: 'from-amber-800 to-yellow-900',
    tagline: 'माटी से बने खिलौने',
    description:
      'Before glass marbles arrived, Pahadi children made clay balls (bante) from the distinctive red-brown river clay. Sun-dried and sometimes painted with natural pigments, they were used in marble-style games. The art of making a perfectly round bante was itself prized.',
    equipment: ['Local river clay', 'Flat drying surface', 'Natural pigments (optional)'],
    howToPlay: [
      'Roll clay between palms into as perfect a sphere as possible',
      'Sun-dry for 2–3 days',
      'Play identical to kanche (marbles) rules',
      'Made fresh each season — they crack over winter',
    ],
    culturalNote:
      'Making bante was a rainy-season group activity. The same clay that made paths slippery was transformed into toys — resourcefulness as a way of life.',
  },
];

export default PAHADI_KHEL;
