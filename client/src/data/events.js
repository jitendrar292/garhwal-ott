// Cultural events across Uttarakhand — Theatre, Art, Music, University fests,
// fashion shows and folk celebrations. Used by the home page Events row.
//
// Each event is shown as a card. The component splits this list into
// "upcoming" (date >= today) and "recent" (within the last ~120 days) and
// renders both. Add new entries here; the UI does the filtering.
//
// Field schema:
//   id          — unique slug
//   name        — display title (English / Hinglish)
//   nameLocal   — title in Devanagari (optional)
//   date        — ISO `YYYY-MM-DD` (start date)
//   endDate     — ISO `YYYY-MM-DD` (optional, multi-day)
//   location    — city / venue
//   organizer   — host (university, dept, society)
//   category    — 'theatre' | 'music' | 'fashion' | 'fest' | 'art' | 'literary'
//   emoji       — one decorative emoji
//   bg          — Tailwind gradient classes for the card
//   description — 1–2 line blurb
//   link        — optional URL (YouTube channel, registration page, etc.)

const EVENTS = [
  // ===== APRIL 2026 =====
  {
    id: 'ramman-fest-2026',
    name: 'Ramman Festival',
    nameLocal: 'रम्माण',
    date: '2026-04-25',
    endDate: '2026-04-26',
    location: 'Saloor-Dungra, Chamoli',
    organizer: 'Bhumiyal Devta Mandir Samiti',
    category: 'fest',
    emoji: '🎭',
    bg: 'from-amber-600 to-red-800',
    description:
      'UNESCO-listed masked theatre & ritual of the Salur-Dungra villages — Mahabharata episodes, regional history and Bhumiyal Devta worship over two nights.',
  },
  {
    id: 'hnbgu-rangmanch-april-2026',
    name: 'Rangmanch — Spring Theatre Week',
    nameLocal: 'रंगमंच',
    date: '2026-04-28',
    endDate: '2026-05-02',
    location: 'HNB Garhwal University, Srinagar',
    organizer: 'Theatre Department, HNBGU',
    category: 'theatre',
    emoji: '🎭',
    bg: 'from-purple-700 to-indigo-900',
    description:
      'Five evenings of student productions — original Garhwali plays, street theatre and a tribute night to regional playwrights. Open to public.',
    link: 'https://youtube.com/@theatredepartment_hnbgu',
  },

  // ===== MAY 2026 =====
  {
    id: 'pahadi-fashion-show-2026',
    name: 'Pahadi Fashion Show',
    nameLocal: 'पहाड़ी फैशन शो',
    date: '2026-05-10',
    location: 'Srinagar Garhwal',
    organizer: 'Pahadi Couture Collective',
    category: 'fashion',
    emoji: '👗',
    bg: 'from-pink-600 to-fuchsia-800',
    description:
      'Designers from across the hills showcase Pichora, Bhotia weaves and contemporary Pahadi silhouettes on the runway.',
  },
  {
    id: 'nsn-festival-2026',
    name: 'Narendra Singh Negi Festival',
    nameLocal: 'नरेन्द्र सिंह नेगी महोत्सव',
    date: '2026-05-15',
    endDate: '2026-05-17',
    location: 'Pauri & Srinagar',
    organizer: 'Garhwali Sangeet Samaj',
    category: 'music',
    emoji: '🎤',
    bg: 'from-emerald-600 to-teal-800',
    description:
      'Three-day celebration of Garhwali music legend Narendra Singh Negi — live concerts, listening sessions and a young-artist showcase.',
  },
  {
    id: 'hnbgu-youth-fest-2026',
    name: 'HNBGU Youth Festival',
    nameLocal: 'युवा महोत्सव',
    date: '2026-05-22',
    endDate: '2026-05-24',
    location: 'HNB Garhwal University, Srinagar',
    organizer: 'HNBGU Cultural Council',
    category: 'fest',
    emoji: '🎉',
    bg: 'from-orange-500 to-rose-700',
    description:
      'Inter-college fest — folk dance, Pahadi band night, mono-act, mehendi, rangoli and a Garhwali poetry slam.',
  },

  // ===== JUNE 2026 =====
  {
    id: 'doon-art-biennale-2026',
    name: 'Doon Art Biennale',
    nameLocal: 'दून कला महोत्सव',
    date: '2026-06-05',
    endDate: '2026-06-12',
    location: 'Dehradun',
    organizer: 'Uttarakhand Lalit Kala Akademi',
    category: 'art',
    emoji: '🎨',
    bg: 'from-cyan-600 to-blue-800',
    description:
      'Week-long visual arts showcase — Aipan, Pahadi miniatures, contemporary canvases and live mural sessions.',
  },
  {
    id: 'kumaon-lit-fest-2026',
    name: 'Kumaon Literary Festival',
    nameLocal: 'कुमाऊँ साहित्य महोत्सव',
    date: '2026-06-20',
    endDate: '2026-06-22',
    location: 'Almora',
    organizer: 'Kumaon Sahitya Sabha',
    category: 'literary',
    emoji: '📚',
    bg: 'from-yellow-600 to-amber-800',
    description:
      'Readings, panels and book launches focused on Kumaoni and Garhwali writing — with open-mic Pahadi poetry every evening.',
  },

  // ===== RECENT / PAST (still surfaced for ~4 months) =====
  {
    id: 'phool-dei-srinagar-2026',
    name: 'Phool Dei Celebrations',
    nameLocal: 'फूल देई',
    date: '2026-03-14',
    location: 'Srinagar Garhwal',
    organizer: 'Local Mahila Mangal Dal',
    category: 'fest',
    emoji: '🌸',
    bg: 'from-pink-500 to-rose-700',
    description:
      'Children went door-to-door scattering blossoms on thresholds — a soft Chaitra welcome to spring across the hills.',
  },
  {
    id: 'hnbgu-natak-feb-2026',
    name: '"Bujha Diya" — One-Act Play',
    nameLocal: 'बुझा दिया',
    date: '2026-02-18',
    location: 'HNB Garhwal University, Srinagar',
    organizer: 'Theatre Department, HNBGU',
    category: 'theatre',
    emoji: '🎭',
    bg: 'from-slate-700 to-zinc-900',
    description:
      'Student-led Garhwali adaptation exploring migration from the hills. Streamed on the department\'s YouTube channel.',
    link: 'https://youtube.com/@theatredepartment_hnbgu',
  },
  {
    id: 'doon-music-conf-2026',
    name: 'Doon Music Conference',
    nameLocal: 'दून संगीत सम्मेलन',
    date: '2026-01-25',
    endDate: '2026-01-27',
    location: 'Dehradun',
    organizer: 'Uttarakhand Sangeet Natak Akademi',
    category: 'music',
    emoji: '🎼',
    bg: 'from-indigo-600 to-purple-900',
    description:
      'Classical, semi-classical and Pahadi folk artists shared the stage across three nights at the Town Hall lawns.',
  },
];

export default EVENTS;
