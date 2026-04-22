// Garhwali tone helper for browser TTS.
//
// The Web Speech API has no Garhwali voice — closest match is hi-IN.
// To make playback sound "pahadi" instead of plain Hindi, we:
//   1. Substitute high-frequency Hindi words with Garhwali equivalents
//      (Devanagari) before sending the text to the synthesizer. The list
//      is drawn from languageshome.com/New/english-garhwali (transliterated
//      to Devanagari).
//   2. Pick the best Indian Hindi voice available (prefer female / "Lekha"-
//      style natural voices when present).
//   3. Apply a slower rate + slightly higher pitch so the cadence reads
//      as the sing-song Pahadi tone rather than flat Hindi.

// Whole-word replacements. Keys must be matched as standalone tokens so we
// don't mangle compounds. Order matters — longer phrases first.
const SUBSTITUTIONS = [
  // Phrases (must come before single-word swaps)
  ['कैसे हो', 'कन छा'],
  ['कैसे हैं', 'कन छन'],
  ['कैसे हो आप', 'तुम कन छा'],
  ['क्या हाल', 'क्या हाल'],
  ['ठीक हूँ', 'ठीक छौं'],
  ['ठीक हैं', 'ठीक छन'],
  ['कहाँ जा', 'खक जाणु'],
  ['कहाँ है', 'खक च'],
  ['कहाँ हो', 'खक छा'],
  ['क्या नाम', 'क्या नाम'],
  ['तुम्हारा नाम', 'त्यार नाम'],
  ['आपका नाम', 'त्यार नाम'],
  ['मेरा नाम', 'म्यार नाम'],

  // Pronouns
  ['मैं', 'मि'],
  ['मुझे', 'मिथै'],
  ['मुझको', 'मिथै'],
  ['मेरा', 'म्यार'],
  ['मेरी', 'म्यारि'],
  ['मेरे', 'म्यारा'],
  ['हम', 'हम'],
  ['हमारा', 'हमारु'],
  ['तू', 'तू'],
  ['तुम', 'तुम'],
  ['तुम्हारा', 'त्यार'],
  ['तुम्हारी', 'त्यारि'],
  ['तुम्हारे', 'त्यारा'],
  ['आप', 'तुम'],
  ['आपका', 'त्यार'],
  ['वह', 'वू'],
  ['वो', 'वू'],
  ['उसने', 'वैल'],
  ['उसको', 'वैथै'],
  ['उन्होंने', 'वुनुल'],
  ['ये', 'यू'],
  ['यह', 'यू'],
  ['वहाँ', 'वख'],
  ['यहाँ', 'यख'],

  // Question words
  ['कैसे', 'कन'],
  ['कैसा', 'कनु'],
  ['कैसी', 'कनि'],
  ['कहाँ', 'खक'],
  ['क्यों', 'किलै'],
  ['कौन', 'कु'],
  ['कितना', 'कदगा'],
  ['कितने', 'कदगा'],
  ['कितनी', 'कदगि'],

  // Copula / common verbs (very high frequency — biggest tonal effect)
  ['है', 'च'],
  ['हैं', 'छन'],
  ['हूँ', 'छौं'],
  ['हो', 'छा'],
  ['था', 'छयो'],
  ['थी', 'छै'],
  ['थे', 'छया'],

  // Action verbs
  ['खाना', 'खाणु'],
  ['पीना', 'पीणु'],
  ['जाना', 'जाणु'],
  ['आना', 'आणु'],
  ['सोना', 'स्योणु'],
  ['चलना', 'हिटण'],
  ['दौड़ना', 'भगण'],
  ['बैठना', 'ब्यठण'],
  ['बोलना', 'बोलण'],
  ['देखना', 'द्यखण'],
  ['सुनना', 'सुणण'],
  ['करना', 'करण'],

  // Common nouns
  ['पानी', 'पाणी'],
  ['रास्ता', 'बाटु'],
  ['लड़का', 'नौनू'],
  ['लड़की', 'नौनी'],
  ['बच्चा', 'चेलु'],
  ['माँ', 'ब्वै'],
  ['पिता', 'बुबा'],
  ['बहुत', 'भौत'],
  ['अच्छा', 'भलु'],
  ['अच्छी', 'भलि'],
  ['थोड़ा', 'थोड़ु'],
  ['कल', 'ब्याळि'],
  ['आज', 'आज'],

  // Greetings
  ['नमस्ते', 'नमस्कार'],
  ['धन्यवाद', 'धन्यवाद'],
];

// Compile once: build a single regex that matches any key as a whole word.
// Devanagari has no \b — we approximate word boundaries via lookarounds that
// exclude Devanagari letter / vowel-sign characters.
const DEV_LETTER = '\\u0900-\\u097F';
const NOT_DEV = `(?<![${DEV_LETTER}])`;
const NOT_DEV_AFTER = `(?![${DEV_LETTER}])`;

const SUB_MAP = new Map(SUBSTITUTIONS);
const SUB_REGEX = new RegExp(
  `${NOT_DEV}(${SUBSTITUTIONS
    .map(([k]) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')})${NOT_DEV_AFTER}`,
  'g'
);

/**
 * Convert Hindi-leaning Devanagari text to Garhwali Devanagari for TTS.
 * Markdown markers, code fences, and emoji are stripped so the synthesizer
 * doesn't read them out literally.
 */
export function toGarhwaliSpeech(text) {
  if (!text) return '';
  const cleaned = text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*?([^*]+)\*\*?/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.replace(SUB_REGEX, (m) => SUB_MAP.get(m) || m);
}

/**
 * Pick the best available voice for Pahadi-flavored Hindi TTS. Prefers
 * Indian hi-IN voices, then any hi-* voice, then the platform default.
 */
export function pickPahadiVoice() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;

  const score = (v) => {
    let s = 0;
    const lang = (v.lang || '').toLowerCase();
    const name = (v.name || '').toLowerCase();
    if (lang === 'hi-in') s += 100;
    else if (lang.startsWith('hi')) s += 60;
    else if (lang.startsWith('mr') || lang.startsWith('ne')) s += 30; // Marathi/Nepali fallback
    // Prefer female / natural voices — they carry the sing-song cadence better
    if (/female|swara|kalpana|lekha|priya|aditi|veena|natural/i.test(name)) s += 20;
    if (/google/i.test(name)) s += 8;
    if (/local/i.test(v.localService ? 'local' : '')) s += 4;
    return s;
  };

  return voices.slice().sort((a, b) => score(b) - score(a))[0] || null;
}

// Prosody tuned to mimic Pahadi sing-song delivery: slightly slower than
// neutral, slightly higher pitch.
export const PAHADI_RATE = 0.88;
export const PAHADI_PITCH = 1.12;
