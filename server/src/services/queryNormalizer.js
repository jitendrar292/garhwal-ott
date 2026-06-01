// Query Normalization Layer
//
// Canonicalizes user queries BEFORE they are sent to the vector embedder
// (Upstash), so that surface variants of the same question produce
// embeddings that are closer in cosine space → better cache hit rate.
//
// Example intent cluster that should all resolve to a single vector lookup:
//   "What does 'kafuli' mean?"
//   "kafuli ka matlab kya hai"
//   "kafuli kya hoti hai — bata do"
//   "kafuuli meaning"
//
// Two pipeline variants:
//
//   normalizeQuery(text)       — sync, whitespace-based tokenization.
//                                Always available, used as the fallback.
//
//   normalizeQueryAsync(text)  — async, uses the GBM SentencePiece tokenizer
//                                (somu9/gbm-tokenizer) for Devanagari-heavy
//                                queries.  Falls back to normalizeQuery() when
//                                the GBM sidecar is unavailable.
//
// Sync pipeline (order matters):
//   1. Lowercase + Unicode NFC
//   2. Strip punctuation (keep Devanagari, Latin, digits, spaces)
//   3. Tokenize on whitespace
//   4. Drop filler / stop-words (EN + HI + Romanized GW)
//   5. Apply lemma map (inflected → root form)
//   6. Collapse repeated Latin letters ("duuur" → "dur")
//   7. Deduplicate adjacent identical tokens
//   8. Rejoin + trim
//
// Async pipeline — same steps, but step 3 is replaced for Devanagari text:
//   3ʙ. GBM SentencePiece tokenization → extract word-initial pieces (▁ prefix)
//       as natural word stems ("गढ़वळि" → stem "गढ़", "टोकनिज़र" → stem "टोकन").
//       This produces tighter, more consistent Devanagari embeddings.
//
// The output is human-readable and still understandable — it is a shorter,
// root-form version of the query, not a hash.  Multilingual embedders like
// bge-m3 and mxbai-embed-large score normalized forms significantly closer
// to each other than their raw counterparts.
//
// IMPORTANT: normalization is one-way.  The original raw query must be
// preserved separately for display / metadata purposes (see chat.js
// `persistExchange` which passes rawQ via extraMeta).

const { tokenize: gbmTokenize } = require('./gbmTokenizer');

// ---------------------------------------------------------------------------
// Filler / stop-words — carry no semantic content in cultural Q&A queries.
// Stripping them tightens the embedding so topic-words dominate similarity.
// ---------------------------------------------------------------------------
const FILLERS = new Set([
  // ── English ──
  'a', 'an', 'the',
  'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had',
  'do', 'does', 'did',
  'will', 'would', 'could', 'should', 'may', 'can', 'shall', 'might',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its',
  'what', 'how', 'when', 'where', 'who', 'which', 'why',
  'tell', 'please', 'kindly', 'give', 'explain', 'describe', 'show',
  'want', 'need', 'know', 'like', 'just', 'some', 'any', 'no',
  'about', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from',
  'and', 'or', 'but', 'so', 'if', 'then', 'that', 'this', 'these', 'those',
  'up', 'out', 'as',

  // ── Hindi (Devanagari) ──
  'क्या', 'कैसे', 'कब', 'कहाँ', 'कहां', 'कौन', 'क्यों',
  'मुझे', 'मैं', 'हम', 'आप', 'तुम', 'तू', 'हमें',
  'बता', 'बताओ', 'बताइए', 'बतावा', 'बतादो',
  'जरा', 'थोड़ा', 'कृपया', 'प्लीज',
  'है', 'हैं', 'था', 'थी', 'हो', 'हूं', 'हूँ', 'होता', 'होती', 'होते',
  'का', 'की', 'के', 'से', 'को', 'पर', 'मे', 'में', 'पे',
  'और', 'या', 'भी', 'तो', 'ही', 'न', 'नहीं', 'नही',
  'बारे', 'बारा', 'जी', 'यार', 'भाई', 'दोस्त',
  'एक', 'कुछ', 'कोई', 'सब', 'सभी', 'पूरा', 'पूरी',
  'नया', 'नई', 'अच्छा', 'अच्छी',

  // ── Romanized Hindi / Garhwali ──
  'kya', 'kaise', 'kab', 'kahan', 'kaun', 'kyun', 'kyunki',
  'mujhe', 'main', 'hum', 'aap', 'tum', 'tu', 'humein',
  'bata', 'batao', 'bataiye', 'batava', 'batado',
  'jara', 'thoda', 'krpya', 'please',
  'hai', 'hain', 'tha', 'thi', 'ho', 'hun', 'hoon', 'hota', 'hoti',
  'ka', 'ki', 'ke', 'se', 'ko', 'par', 'me', 'mein', 'pe',
  'aur', 'ya', 'bhi', 'to', 'hi', 'na', 'nahi',
  'baare', 'baara', 'ji', 'yaar', 'bhai', 'dost',
  'ek', 'kuch', 'koi', 'sab', 'sabhi', 'pura', 'puri',
]);

// ---------------------------------------------------------------------------
// Lemma map — inflected/variant form → canonical root.
// Applied after filler removal so the token set is already smaller.
// Covers the most common patterns in Garhwali cultural Q&A:
//   Hindi verb conjugations, English -ing/-ed/-s/-tion forms, and
//   synonym clusters that should resolve to the same concept word.
// ---------------------------------------------------------------------------
const LEMMA_MAP = {
  // ── Hindi verb inflections → root ──
  'बनाएं': 'बना', 'बनाते': 'बना', 'बनाती': 'बना', 'बनाता': 'बना',
  'बनाना': 'बना', 'बनाओ': 'बना', 'बनाइए': 'बना', 'बनाई': 'बना', 'बनाकर': 'बना',
  'करना': 'कर', 'करते': 'कर', 'करती': 'कर', 'करता': 'कर',
  'करें': 'कर', 'करो': 'कर', 'करिए': 'कर', 'करके': 'कर', 'किया': 'कर', 'की': 'कर',
  'जाना': 'जा', 'जाते': 'जा', 'जाती': 'जा', 'जाता': 'जा', 'जाएं': 'जा', 'जाओ': 'जा',
  'होना': 'हो', 'होते': 'हो', 'होती': 'हो', 'होता': 'हो', 'हुआ': 'हो', 'हुई': 'हो',
  'खाना': 'खा', 'खाते': 'खा', 'खाती': 'खा', 'खाता': 'खा', 'खाओ': 'खा',
  'देना': 'दे', 'देते': 'दे', 'देती': 'दे', 'देता': 'दे', 'दिया': 'दे', 'दिए': 'दे',
  'लेना': 'ले', 'लेते': 'ले', 'लेती': 'ले', 'लेता': 'ले', 'लिया': 'ले', 'लिए': 'ले',
  'सिखाना': 'सिखा', 'सिखाओ': 'सिखा', 'सिखाइए': 'सिखा', 'सिखाते': 'सिखा',
  'सीखना': 'सीख', 'सीखते': 'सीख', 'सीखता': 'सीख', 'सीखो': 'सीख',
  'पूछना': 'पूछ', 'पूछते': 'पूछ', 'पूछता': 'पूछ', 'पूछो': 'पूछ',
  'बोलना': 'बोल', 'बोलते': 'बोल', 'बोलता': 'बोल', 'बोलो': 'बोल',
  'पढ़ना': 'पढ़', 'पढ़ते': 'पढ़', 'पढ़ता': 'पढ़',
  'लिखना': 'लिख', 'लिखते': 'लिख', 'लिखता': 'लिख',

  // ── Meaning / explanation synonyms → 'matlab' ──
  'अर्थ': 'matlab', 'मतलब': 'matlab', 'मायना': 'matlab',
  'meaning': 'matlab', 'arth': 'matlab',

  // ── Translation synonyms → 'translate' ──
  'अनुवाद': 'translate', 'anuvad': 'translate', 'translation': 'translate',
  'translating': 'translate', 'translated': 'translate', 'translations': 'translate',
  'garhwali mein': 'translate', 'garhwali ma': 'translate',

  // ── English verb inflections → root ──
  'returning': 'return', 'returns': 'return', 'returned': 'return',
  'getting': 'get', 'gets': 'get', 'got': 'get',
  'making': 'make', 'makes': 'make', 'made': 'make',
  'going': 'go', 'goes': 'go', 'went': 'go',
  'saying': 'say', 'says': 'say', 'said': 'say',
  'teaching': 'teach', 'taught': 'teach', 'teaches': 'teach',
  'learning': 'learn', 'learned': 'learn', 'learnt': 'learn', 'learns': 'learn',
  'celebrating': 'celebrate', 'celebration': 'celebrate', 'celebrations': 'celebrate',
  'cooking': 'cook', 'cooked': 'cook', 'recipe': 'cook', 'recipes': 'cook',
  'singing': 'sing', 'sang': 'sing', 'song': 'sing', 'songs': 'sing',
  'writing': 'write', 'wrote': 'write', 'written': 'write',
  'knowing': 'know', 'knew': 'know', 'knowledge': 'know',
  'speaking': 'speak', 'spoke': 'speak', 'spoken': 'speak',
  'talking': 'talk', 'talked': 'talk',
  'telling': 'tell', 'told': 'tell',
  'showing': 'show', 'showed': 'show', 'shown': 'show',
  'celebrating': 'celebrate',
  'performs': 'perform', 'performing': 'perform', 'performed': 'perform',
  'festivals': 'festival', 'festival': 'festival',
  'dishes': 'dish', 'foods': 'food',
};

// ---------------------------------------------------------------------------
// Collapse repeated Latin letters.
// "duur" / "dur" / "duuur"  →  "dur"
// Devanagari characters are not ASCII a-z so they are left untouched.
// ---------------------------------------------------------------------------
function collapseRoman(text) {
  return String(text || '').replace(/([a-z])\1+/g, '$1');
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Normalize a user query for embedding / vector lookup.
 *
 * @param {string} text  Raw user query (any language mix)
 * @returns {string}     Normalized canonical form, still human-readable
 *
 * Example:
 *   "बता do — kafuuli ka arth kya hota hai?"
 *   → "kafuli arth"
 *
 *   "How is garhwali kafuli dish made?"
 *   → "garhwali kafuli dish make"
 */
function normalizeQuery(text) {
  if (!text || typeof text !== 'string') return '';

  // 1. Lowercase + Unicode NFC (canonical composition)
  let s = text.toLowerCase().normalize('NFC');

  // 2. Strip punctuation — keep Devanagari (\p{Script=Devanagari}),
  //    Latin letters, digits, and spaces. Everything else (?, !, ।, —, …) → space.
  s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');

  // 3. Tokenize on whitespace
  const raw = s.split(/\s+/).filter((t) => t.length >= 2);

  // 4. Filter fillers, 5. Lemmatize, 6. Collapse Roman
  const tokens = raw
    .filter((t) => !FILLERS.has(t))
    .map((t) => LEMMA_MAP[t] || t)
    .map((t) => collapseRoman(t))
    .filter((t) => t.length >= 2);

  // 7. Deduplicate adjacent identical tokens (lemma folding can create them)
  const deduped = tokens.filter((t, i) => i === 0 || t !== tokens[i - 1]);

  // 8. Rejoin — if everything was filtered (pure stop-word input), return
  //    the first pass instead of an empty string.
  const result = deduped.join(' ').trim();
  return result || raw.join(' ').trim() || s.trim();
}

// ---------------------------------------------------------------------------
// Async variant — uses GBM SentencePiece tokenizer for Devanagari-heavy text.
//
// For a query like "गढ़वळि टोकनिज़र कसो बण्यो छ?":
//   Whitespace tokens: ['गढ़वळि', 'टोकनिज़र', 'कसो', 'बण्यो', 'छ']
//   GBM stems:         ['गढ़',    'टोकन',     'कसो', 'बण्',  'छ']
//
// Shorter stems match across surface inflections and produce embeddings that
// are closer in cosine space → higher vector cache hit rate for Garhwali Q&A.
//
// Falls back to the sync normalizeQuery() when:
//   • the GBM sidecar is not running (Python unavailable, model not found)
//   • the sidecar times out (> 500 ms)
//   • the text has < 20% Devanagari characters (Latin/Romanized queries
//     are already well-served by the whitespace pipeline)
// ---------------------------------------------------------------------------

const DEVANAGARI_RE = /\p{Script=Devanagari}/gu;

/**
 * Normalize a user query using the GBM Garhwali tokenizer when the query
 * contains significant Devanagari content.  Async; always resolves (never
 * rejects) — returns the sync normalizeQuery() result as the fallback.
 *
 * @param {string} text  Raw user query
 * @returns {Promise<string>}
 */
async function normalizeQueryAsync(text) {
  if (!text || typeof text !== 'string') return '';

  // Quick heuristic: count Devanagari chars vs total non-space chars.
  // Below the threshold we skip GBM (avoids unnecessary sidecar round-trips
  // for purely English / Romanized queries).
  const nonSpace = text.replace(/\s/g, '').length;
  const devanagariCount = (text.match(DEVANAGARI_RE) || []).length;
  const hasSignificantDevanagari = nonSpace > 0 && devanagariCount / nonSpace >= 0.2;

  if (hasSignificantDevanagari) {
    try {
      const normalized = text.toLowerCase().normalize('NFC');
      const result = await gbmTokenize(normalized);

      if (result && result.stems.length > 0) {
        // Apply filler removal, lemmatization, and deduplication on GBM stems.
        const tokens = result.stems
          .filter((t) => t.length >= 2)
          .filter((t) => !FILLERS.has(t))
          .map((t) => LEMMA_MAP[t] || t)
          .map((t) => collapseRoman(t))
          .filter((t) => t.length >= 2);

        const deduped = tokens.filter((t, i) => i === 0 || t !== tokens[i - 1]);
        const out = deduped.join(' ').trim();
        if (out) return out;
      }
    } catch (_) {
      // Sidecar error — fall through to sync fallback
    }
  }

  return normalizeQuery(text);
}

module.exports = { normalizeQuery, normalizeQueryAsync };
