// Curated creators for the homepage "Trending on Instagram" strip.
//
// HOW TO ADD A CREATOR:
// 1) Add a new object with a unique `handle` (without @).
// 2) Optional `avatar` can point to a small image in /public.
// 3) Keep `own: true` for the PahadiTube account to highlight it.
//
// NOTE:
// We intentionally use standard https profile links:
//   https://www.instagram.com/<handle>/
// Mobile OS deep-linking (Universal/App Links) opens the Instagram app when
// installed, otherwise it falls back to the browser.

const TRENDING_CREATORS = [
  {
    handle: 'pahaditube.323',
    bio: 'Pahadi culture studio',
    tags: ['culture', 'music', 'shorts'],
    verified: true,
    own: true,
  },
  {
    handle: 'hema_negi_karasi',
    bio: 'Live folk performance',
    tags: ['folk', 'jagar', 'dance'],
    verified: false,
    own: false,
  },
  {
    handle: 'karishmashah06',
    bio: 'Garhwali songs and vibes',
    tags: ['music', 'live', 'reels'],
    verified: false,
    own: false,
  },
  {
    handle: 'pahado_ka_washi',
    bio: 'Devbhumi reels',
    tags: ['devotional', 'culture'],
    verified: false,
    own: false,
  },
  {
    handle: 'sneha_ishu_31',
    bio: 'Trending pahadi dance',
    tags: ['dance', 'reels'],
    verified: false,
    own: false,
  },
];

export default TRENDING_CREATORS;
