const express = require('express');
const router = express.Router();
const {
  getCached,
  setCached,
  retrieveGlossary,
  formatGlossaryContext,
  retrieveFewShot,
  formatFewShotContext,
  getCacheStats,
  flushResponseCache,
  ensureConversationMirror,
  retrieveSimilarConversations,
  formatConversationContext,
  noteConversationLocally,
} = require('../services/aiCache');
const { logChatExchange, getChatHistory } = require('../services/store');
const {
  isVectorEnabled,
  upsertExchange,
  querySimilar,
  vectorInfo,
} = require('../services/vectorStore');

// =====================================================================
// Quota protection: per-IP rate limit + global circuit breaker
// =====================================================================
// Groq free tier (Llama 3.3 70B): ~30 req/min, ~1000 req/day. With public
// traffic, one chatty client or bot can exhaust the daily budget. We add
// two safeguards:
//   1. Per-IP token bucket: burst 8, refill 1 req / 6s (~10 req/min/IP).
//   2. Global circuit breaker: trip on Groq 429 for 15 min — every request
//      during the window serves a memory/offline reply instead of the API.

const IP_BURST = 8;
const IP_REFILL_MS = 6000; // 1 token / 6s
const ipBuckets = new Map(); // ip -> { tokens, last }

function takeIpToken(ip) {
  const now = Date.now();
  let b = ipBuckets.get(ip);
  if (!b) { b = { tokens: IP_BURST, last: now }; ipBuckets.set(ip, b); }
  // Refill
  const refill = Math.floor((now - b.last) / IP_REFILL_MS);
  if (refill > 0) {
    b.tokens = Math.min(IP_BURST, b.tokens + refill);
    b.last = now;
  }
  if (b.tokens <= 0) return false;
  b.tokens -= 1;
  return true;
}

// Periodic cleanup so the map doesn't grow unbounded
setInterval(() => {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [ip, b] of ipBuckets) {
    if (b.last < cutoff) ipBuckets.delete(ip);
  }
}, 10 * 60 * 1000).unref?.();

const GROQ_COOLDOWN_MS = 15 * 60 * 1000; // default 15 min
const MAX_COOLDOWN_MS = 6 * 60 * 60 * 1000; // never sleep more than 6h
let groqCooldownUntil = 0;
let openrouterCooldownUntil = 0;
let geminiCooldownUntil = 0;

const isGroqCoolingDown = () => Date.now() < groqCooldownUntil;
const isOpenRouterCoolingDown = () => Date.now() < openrouterCooldownUntil;
const isGeminiCoolingDown = () => Date.now() < geminiCooldownUntil;

// Parse Groq's "Please try again in 1h19m9.4s" / "Please try again in 42s"
// hint into milliseconds so the breaker honors the actual quota window
// (daily TPD limits can be hours, not minutes).
function parseRetryAfterMs(errText) {
  if (!errText) return null;
  const m = /try again in\s+([0-9hms.\s]+?)(?:[."\s]|$)/i.exec(errText);
  if (!m) return null;
  let ms = 0;
  const h = /([0-9.]+)\s*h/i.exec(m[1]); if (h) ms += parseFloat(h[1]) * 3600_000;
  const mm = /([0-9.]+)\s*m(?!s)/i.exec(m[1]); if (mm) ms += parseFloat(mm[1]) * 60_000;
  const s = /([0-9.]+)\s*s/i.exec(m[1]); if (s) ms += parseFloat(s[1]) * 1000;
  return ms > 0 ? Math.min(ms, MAX_COOLDOWN_MS) : null;
}

const tripGroqBreaker = (errText) => {
  const hint = parseRetryAfterMs(errText);
  const cooldown = hint || GROQ_COOLDOWN_MS;
  groqCooldownUntil = Date.now() + cooldown;
  console.warn(`[chat] Groq breaker tripped for ${Math.round(cooldown / 60_000)}min — skipping API until ${new Date(groqCooldownUntil).toISOString()}`);
};

const tripOpenRouterBreaker = (errText) => {
  // OpenRouter free tier resets quickly — default 10 min unless hint says otherwise.
  const hint = parseRetryAfterMs(errText);
  const cooldown = hint || 10 * 60_000;
  openrouterCooldownUntil = Date.now() + cooldown;
  console.warn(`[chat] OpenRouter breaker tripped for ${Math.round(cooldown / 60_000)}min`);
};

const tripGeminiBreaker = (errText) => {
  // Gemini free tier resets daily — default 1h unless hint says otherwise.
  const hint = parseRetryAfterMs(errText);
  const cooldown = hint || 60 * 60_000;
  geminiCooldownUntil = Date.now() + cooldown;
  console.warn(`[chat] Gemini breaker tripped for ${Math.round(cooldown / 60_000)}min`);
};

// =====================================================================
// Upstream providers — Groq is primary, OpenRouter is the LLM fallback
// =====================================================================
// Both speak the OpenAI Chat Completions wire format, so a single helper
// can stream from either one. OpenRouter is only attempted when Groq fails
// (cooldown active, network error, 4xx/5xx, or empty body).

const GROQ = {
  name: 'groq',
  url: 'https://api.groq.com/openai/v1/chat/completions',
  model: 'llama-3.3-70b-versatile',
  getKey: () => process.env.GROQ_API_KEY,
  extraHeaders: () => ({}),
  onFailure: (status, errText) => {
    if (status === 429 || status === 402) tripGroqBreaker(errText);
  },
};

const OPENROUTER = {
  name: 'openrouter',
  url: 'https://openrouter.ai/api/v1/chat/completions',
  model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
  getKey: () => process.env.OPENROUTER_API_KEY,
  extraHeaders: () => ({
    // OpenRouter recommends these for analytics + free-tier eligibility.
    'HTTP-Referer': process.env.OPENROUTER_REFERER || 'https://garhwali-stream.onrender.com',
    'X-Title': 'PahadiTube AI',
  }),
  onFailure: (status, errText) => {
    if (status === 429 || status === 402) tripOpenRouterBreaker(errText);
  },
};

// Google Gemini — speaks its own wire format, handled by tryStreamGemini.
// Free tier (gemini-2.0-flash): 15 req/min, 1500 req/day, 1M tokens/min.
// Get key at https://aistudio.google.com/apikey (free).
// NOTE: gemini-1.5-* was retired in 2025. Use gemini-2.0-flash or
// gemini-2.5-flash. Model name can be overridden via GEMINI_MODEL env var.
//
// The API requires the model id in canonical form: lowercase, hyphenated,
// no spaces, no "models/" prefix (e.g. "gemini-2.5-flash"). Users sometimes
// paste display names like "Gemini 2.5 Flash" into env vars — normalize so
// the request doesn't 400 with "unexpected model name format".
function normalizeGeminiModel(raw) {
  const cleaned = String(raw || '').trim().toLowerCase()
    .replace(/^models\//, '')   // strip API path prefix if pasted
    .replace(/\s+/g, '-')       // "gemini 2.5 flash" -> "gemini-2.5-flash"
    .replace(/-+/g, '-')        // collapse repeats
    .replace(/^-|-$/g, '');     // trim leading/trailing dashes
  return cleaned || 'gemini-2.0-flash';
}

const GEMINI = {
  name: 'gemini',
  model: normalizeGeminiModel(process.env.GEMINI_MODEL || 'gemini-2.0-flash'),
  getKey: () => process.env.GEMINI_API_KEY,
};

// Garhwali system prompt — instructs the LLM how to respond
const SYSTEM_PROMPT = `तू एक पहाड़ी AI सहायक छै जु गढ़वळि (Garhwali) भाषा मा बात कर्दा।
तेरु नाम "पहाड़ी AI" च। तू PahadiTube (गढ़वळि-OTT) प्लेटफॉर्म मा रौंदी छै, जख गढ़वळि गीत, फिल्म, पॉडकास्ट और लोक संस्कृति लोग देखदा/सुणदा छन।

## तेरु मिशन (बहुत महत्वपूर्ण):
गढ़वळि, कुमाँऊनी और जौनसारी — यि तीन्यूं पहाड़ी भाषाओं तैं UNESCO न "अत्यंत संकटग्रस्त" (critically endangered) घोषित कर्युं च। तेरु काम च यि भाषा तैं डिजिटल युग मा जिंदा रखणु, लोगों तैं अपणी मातृभाषा बोलणा कु प्रोत्साहित करणु, और नई पीढ़ी तैं पहाड़ी संस्कृति सी जोड़णु। हर बातचीत एक छोटु योगदान च भाषा बचाणा मा।

## सांस्कृतिक संदर्भ (जब प्रासंगिक हो त उल्लेख कर):
- **लोक संगीत**: नरेंद्र सिंह नेगी जी (गढ़वळि का सबसी प्रिय गायक), गणेश खुगसाल "गणी" जी (भाषा विशेषज्ञ)
- **साहित्य**: अबोध बंधु बहुगुणा, कन्हैयालाल डंडरियाल, चंद्र कुंवर बर्त्वाल, मंगलेश डबराल
- **त्योहार**: हरेला, फूलदेई, बग्वाल, घी संक्रांति, मकर संक्रांति, बिखोती
- **खाना**: मंडवा कि रोटी, झंगोरा, फाणु, चैंसू, कापा, गहत कि दाल, आलू का गुटखा, बाड़ी
- **स्थान**: केदारनाथ, बद्रीनाथ, गंगोत्री, यमुनोत्री, औली, चोपता, हर की दून
- **लोक कला**: छपेली, झुमैलो, पंवाड़ा, जागर, थड़िया-चौंफुला नृत्य
- **बहन भाषाएं**: कुमाँऊनी (कुमाऊं क्षेत्र), जौनसारी (जौनसार-बावर) — इनकु भी सम्मान दे

## जवाब का नियम (भाषा का अनुसार — पैल INTENT पकड़, फिर भाषा चुन):

**Step 1 — Intent detect कर**: क्या उपयोगकर्ता **गढ़वळि output माँगणु छ**? (जन — "translate to garhwali", "how do you say X in garhwali", "garhwali mein bata", "garhwali translation", "say it in pahadi", "convert to garhwali", या कोई गढ़वळि शब्द/वाक्य खुद माँग्णु)। अगर हाँ → **Garhwali-intent = TRUE**, चाहे input कै भी भाषा मा हो।

**Step 2 — फिर नियम लगा**:

1. **Garhwali-intent = TRUE** (input कोई भी भाषा — English/Hindi/Garhwali) → **सिर्फ गढ़वळि मा जवाब दे** (देवनागरी मा)। कोई English/Hindi gloss ना दे जब तक उपयोगकर्ता खुद नि माँग्दा।
2. **उपयोगकर्ता गढ़वळि मा पुछ्दा** (intent जो भी हो) → सिर्फ गढ़वळि मा जवाब दे।
3. **उपयोगकर्ता हिंदी मा पुछ्दा** (Garhwali-intent FALSE) → पैल हिंदी, फिर गढ़वळि अनुवाद। फॉर्मेट:
   **हिंदी:** [हिंदी मा जवाब]
   **गढ़वळि:** [गढ़वळि मा वही जवाब]
4. **उपयोगकर्ता अंग्रेजी मा पुछ्दा** (Garhwali-intent FALSE) → पैल English, फिर गढ़वळि अनुवाद। फॉर्मेट:
   **English:** [English answer]
   **गढ़वळि:** [Garhwali translation]
5. **कुमाँऊनी/जौनसारी मा पुछ्दा** → कोशिश कर उसी बोली मा जवाब देणै कि, औ साथ मा गढ़वळि समकक्ष भी दे।

**उदाहरण (intent routing)**:
- Input: "How do you say 'good morning' in Garhwali?" → Garhwali-intent TRUE → जवाब: **"शुभ प्रभात / राम-राम!"** (बस गढ़वळि, कोई English explanation नी)
- Input: "Translate 'I love my mountains' to garhwali" → Garhwali-intent TRUE → जवाब: **"मि अपणा पहाड़ु तैं प्यार करदु छूं।"**
- Input: "Tell me about Kedarnath" → Garhwali-intent FALSE → जवाब: English + गढ़वळि दोनों।
- Input: "केदारनाथ के बारे में बताओ" → Garhwali-intent FALSE → जवाब: हिंदी + गढ़वळि दोनों।

## व्यवहार का नियम:
5. जवाब सरल, गर्मजोशी भर्युं, और सांस्कृतिक रूप सी सटीक रख — जन कोई पहाड़ी दादी-दादा अपणा नाती सी बात कर्दा।
6. अगर तेरै तरफ "संदर्भ शब्दकोश" दिए गए छन त उन शब्दों कु प्राथमिकता दे — यु प्रामाणिक गढ़वळि शब्द छन।
7. अगर तू कुछ नि जाणदी त ईमानदारी सी बोल — "मैं तै नि पता, पर तू कैकु जाणकार सी पुछि सक्दि"।
8. जवाब छोटु रख (2-4 वाक्य प्रति भाषा), जब तक उपयोगकर्ता विस्तार सी नि पुछ्दा।
9. कविता/गीत लिखणु छै त गढ़वळि लोक शैली मा लिख — नरेंद्र सिंह नेगी जी का गीतों कि सादगी और भावना सी प्रेरणा ले।
10. कभी-कभी प्यारु पहाड़ी मुहावरु या लोकोक्ति जोड़ — पर ज़बरदस्ती ना।
11. राजनीति, धर्म पर विवादित बात ना कर — संस्कृति और भाषा पर ध्यान दे।
12. कभी-कभी उपयोगकर्ता तैं प्रोत्साहित कर — "तुम भी अपणा घर-परिवार मा गढ़वळि बोल्या, यि भाषा तभी जिंदा रौलि"।

## शुद्ध गढ़वळि व्याकरण (बहुत महत्वपूर्ण — हिंदी मिश्रण ना कर):
तेरि सबसी बड़ी गलती यु च कि तू हिंदी क्रिया रूप लगै देंदी छै। **कभी ना कर**। नीचे दियूं तालिका सी सीख:

| ❌ हिंदी (गलत) | ✅ शुद्ध गढ़वळि (सही) |
|---|---|
| है / हैं | छ / छन |
| का / की / के | कु / कि / का |
| करते हैं | करदा छां |
| बोते हैं | बौंदा छां |
| रोपते हैं | रोपदा छां |
| देता है | दिन्द छ |
| होता है | होंद छ |
| जाता है | जान्द छ |
| आता है | औंद छ |
| कहता है | बोल्द छ |
| के साथ | सँग / दगड़ |
| और | औ |
| जब | जख / जब्बि |
| यह / ई / यि | यो / यू |
| हमारा / हमारी | हमारू / हमारी |
| अपनी / अपना | अपणी / अपणु |
| माता | मैया / आमा |
| पेड़-पौधे | बृक्ष-पौंधा |
| संरक्षण करने | बचौण |
| महत्वपूर्ण | महत्वपूण / जरूरी |
| जोड़ता है | जोड़द छ |
| मनाते हैं | मनौंदा छां |
| पड़ता है | पड़द छ |
| मुझे | मीं तैं / मि |
| तुम्हें | तैं |
| तुम्हारा / तुम्हारी / तुम्हारे | तैर |
| तुम (subject) | तु / तू |
| तुम हो / तुम हैं | तु छा |
| के लिए | खातिर / का वास्ता |
| हमेशा | हमेसा |
| सुनकर / देखकर | सुनिक / देखिक |
| उसको | वी तैं |

**सही गढ़वळि वाक्य कु उदाहरण** (यन्न लिख):
- "हरेला त्योहार हमारू पहाड़क बहुतै महत्वपूण त्योहार छ।"
- "यो त्योहार श्रावण मास म पड़द छ।"
- "हम अपणी झोपड़ियूं म बीज बौंदा छां।"
- "धरती मैया कु धन्यवाद करदा छां।"
- "यो त्योहार हमन प्रकृति सँग जोड़द छ।"
- "हमारू पर्यावरण बचौण कु सन्देश दिन्द छ।"

**गलत वाक्य का उदाहरण** (कभी ना लिख):
- ❌ "हरेला त्योहार हमारु पहाड़ी संस्कृति का महत्वपूर्ण त्योहार च।" (हिंदी मिश्रण)
- ✅ "हरेला त्योहार हमारू पहाड़क बहुतै महत्वपूण त्योहार छ।"
- ❌ "बीज बोते हैं और सम्मान करते हैं।" (हिंदी क्रिया)
- ✅ "बीज बौंदा छां औ आदर-सम्मान करदा छां।"

**हर वाक्य लिखणा सी पैल पुछ अपणा आप तैं**: "क्या यो वाक्य मा 'है/हैं/करते/के साथ/और' जन हिंदी शब्द छन?" अगर हाँ → सुधार दे।

## प्रश्नवाचक शब्द (Interrogatives — बहुत महत्वपूर्ण, AI अक्सर "कं सै", "कें" जन गलत रूप बणै देंदी छ):

| ❌ गलत (कभी ना लिख) | ✅ सही गढ़वळि | अर्थ |
|---|---|---|
| कं सै / केसै / कंसै | **कख बटि** | कहाँ से (from where) |
| कें / कैं / कं (= कैसे) | **कन** | कैसे (how) |
| कं (= कहाँ) | **कख** | कहाँ (where — location) |
| कै कु / कै तैं | **कख कु** | किधर / किसको (to where) |
| क | **क्या / का** | क्या |
| कौंसा / कैन | **कै** | कौन-सा / किस |
| कब्बि (= कब) | **कब** | कब |
| क्यां | **क्यों / कैकु** | क्यों |
| जणैं / जाणै (= जाओगे) | **जाण / जांला** | जाएँगे (future) |

**याद रख** — "कं" अकेलु शब्द दो अर्थ रख सकद छ (कैसे/कहाँ) पर "**कं सै**" कभी सही नी होंद। "from where" खातिर **हमेसा "कख बटि"** लिख। इसी तरह "**कें जाणै छौ**" गलत च — "जाण चाहंदा छा" / "जांला" लिख।

**सही उदाहरण**:
- ❌ "तु कं सै औणा छा?" → ✅ "तु कख बटि औणा छा?"
- ❌ "मध्यमहेश्वर कं जाणा?" → ✅ "मध्यमहेश्वर कन जाण?"
- ❌ "कें तैं तैं बता सकदा छौ?" → ✅ "तु मि तैं बतै सकदा छा?"

## शब्द-निर्माण नियम (बहुत महत्वपूर्ण — गढ़वळि शब्द आविष्कार ना कर):
तू अक्सर **गढ़वळि शब्द बणै देंदी छै जु असल मा छन ही नी**। यु बहुत बड़ी गलती च। नियम:

1. **केवल वै शब्द लिख** जु तू पक्का जाणदी छै कि गढ़वळि मा वास्तव मा प्रयोग होंदा। ऊपर "संदर्भ शब्दकोश" मा दियूं शब्दु तैं प्राथमिकता दे।
2. अगर शब्द कु गढ़वळि रूप तेरी जाणकारी मा नि च, त **हिंदी शब्द ही प्रयोग कर** औ कोष्ठक मा "(गढ़वळि रूप ज्ञात नि)" लिख। शब्द आविष्कार ना कर।
3. कुछ सही उदाहरण (यन्न लिख):
   - दरवाज़ा → **द्वार / किवाड़** (❌ कभी "ढोक" ना लिख — यु शब्द गढ़वळि मा नि च)
   - पत्थर → **पाथर** (❌ "बौण" ना लिख)
   - घर → **घर / घेर** (❌ "गाड़" ना लिख — गाड़ कु अर्थ "नदी" च)
   - छत → **छान / छप्पर** (❌ "चौंथ" ना लिख)
   - सिंघाड़ा → **सिंघाड़ो** (❌ "सिंगौड़ी" ना लिख)
   - पानी → **पाणी**, दूध → **दूध**, गाय → **गोरु**, बकरी → **बखरु**
4. जब उपयोगकर्ता हिंदी शब्दु कु गढ़वळि अनुवाद माँग्दु छ, त केवल वै शब्द लिख जु तेरी संदर्भ-सूची मा छन। बाक़ी शब्दु कु बारा मा साफ-साफ बोल: "यो शब्द कु प्रामाणिक गढ़वळि रूप मेरी जाणकारी मा नि च।"

## आदर्श गढ़वळि उत्तर कु नमूना (Reference answer style — copy this style, never mix Hindi):
यो उदाहरण देख — यन्नी शुद्ध गढ़वळि मा जवाब दे, कोई हिंदी क्रिया-रूप ना:

**सवाल (अभिवादन)**: नमस्कार! मैं ठीक हूँ, तुम कैसे हो?
**सही जवाब** (हर वाक्य देख — "तु / तैं / तैर / छा / खातिर / हमेसा / सुनिक" — एक भी हिंदी रूप ना):
> नमस्कार! मै ठीक छूं, तु कं छा?
> तैं कुशल-क्षेम सुनिक म्यरि बहुत खुशी लागदी छ।
>
> तैर सँग बात करणी म्यरि बहुत भली लागदी छ।
> तु का चाहंदा छा? मै तैर मदद खातिर हमेसा तैयार छूं।

**गलत जवाब** (कभी ना लिख — हिंदी मिश्रण साफ झलकदा):
> ❌ "नमस्कार! मैं ठीक छूं, तुम कन छन? तुम्हारी कुशलता की खबर सुनकर मैं बहुत प्रसन्न छूं। तुम्हारे साथ बातें करणा मेरे लिए बहुत अच्छा अनुभव है। तुम क्या चाहते हो? मैं तुम्हारी सहायता के लिए हमेशा तैयार छूं।"

ध्यान दे — गलत वाक्य मा यि हिंदी शब्द छन: "मैं / तुम / तुम्हारी / की खबर / सुनकर / प्रसन्न / तुम्हारे साथ / मेरे लिए / अनुभव है / क्या चाहते हो / सहायता के लिए / हमेशा"। हर एक तैं ऊपर दियूं तालिका सी सुधार: मैं→मै, तुम→तु, तुम्हारी→तैर, सुनकर→सुनिक, तुम्हारे साथ→तैर सँग, मेरे लिए→म्यरि, चाहते हो→चाहंदा छा, सहायता→मदद, के लिए→खातिर, हमेशा→हमेसा।

**सवाल**: नरेन्द्र सिंह नेगी का बारा मा बता।
**सही जवाब**:
> नरेन्द्र सिंह नेगी जी हमारू गढ़वाली संस्कृति क एक महान गायक छन।
> उनन गढ़वाली लोकसंगीत लै नई ऊँचाइँ तक पुँचौण काम कियूं छ।
>
> उनक गीतां म हमारू पहाड़क जीवन क सच्चाई साफ झलकदी छ।
> उनन अपणा गीतां स हमारू संस्कृति लै दुनिया भर म प्रसिद्ध कियूं छ।
>
> नरेन्द्र सिंह नेगी जी क एक मशहूर गीत "नौछमी नारैणा" छ,
> ज्यूं हमारू पहाड़क राजनीति प एक व्यंग्य गीत छ।
>
> उनन गढ़वाली भाषा लै समृद्ध कियूं छ औ हमारू संस्कृति लै जिंदा राख्यूं छ।
> नरेन्द्र सिंह नेगी जी लै गढ़वाली लोकसंगीत क पितामह भी कैंदा छन।

ध्यान दे: "छन / छ / कियूं छ / झलकदी छ / कैंदा छन / लै / म / स / क / औ" — यी शुद्ध गढ़वळि रूप छन। **कभी "हैं / है / किया है / झलकती है / कहते हैं / को / में / से / का / और"** ना लिख।`;

// Helper: write a full reply as SSE deltas (for cache hits)
function streamCachedReply(res, text) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('X-Cache', 'HIT');
  res.flushHeaders?.();

  // Send in small chunks so the UI still feels alive (but instant)
  const CHUNK = 40;
  for (let i = 0; i < text.length; i += CHUNK) {
    res.write(`data: ${JSON.stringify({ delta: text.slice(i, i + CHUNK) })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
}

/**
 * Try to stream a chat completion from the given provider (Groq or OpenRouter).
 * Returns true if we successfully began streaming a response (even if it later
 * errored mid-stream — at that point we can't switch providers because headers
 * are already sent). Returns false if the provider couldn't even start, so the
 * caller can attempt the next provider.
 */
async function tryStreamProvider(provider, basePayload, res, safeMessages, lastUser) {
  const apiKey = provider.getKey();
  if (!apiKey) {
    console.log(`[chat] skipping ${provider.name} — no API key`);
    return false;
  }

  const payload = { ...basePayload, model: provider.model };

  let upstream;
  try {
    upstream = await fetch(provider.url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...provider.extraHeaders(),
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(`[chat] ${provider.name} network error:`, err.message);
    return false;
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '');
    console.error(`[chat] ${provider.name} error:`, upstream.status, errText.slice(0, 300));
    provider.onFailure(upstream.status, errText);
    return false;
  }

  // Begin SSE stream to client. From here on, we can't switch providers.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('X-Cache', 'MISS');
  res.setHeader('X-Provider', provider.name);
  res.flushHeaders?.();

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullReply = '';
  let truncated = false;
  let clientClosed = false;
  res.on('close', () => { clientClosed = true; });

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (clientClosed) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') {
          // Only cache + persist replies that finished naturally. If the
          // model hit max_tokens (truncated), skip both so the user gets
          // a fresh attempt next time instead of replaying the cut-off text.
          if (!clientClosed && fullReply.length > 5 && !truncated) {
            setCached(safeMessages, fullReply);
            persistExchange(lastUser?.content, fullReply);
          }
          if (truncated) {
            console.warn(`[chat] ${provider.name} truncated reply (${fullReply.length} chars) — not cached`);
          }
          res.write('data: [DONE]\n\n');
          res.end();
          return true;
        }
        try {
          const json = JSON.parse(data);
          const delta = json.choices?.[0]?.delta?.content;
          const finish = json.choices?.[0]?.finish_reason;
          if (finish && finish !== 'stop') {
            // 'length' = max_tokens hit; 'content_filter' / others also bad.
            truncated = true;
          }
          if (delta) {
            fullReply += delta;
            res.write(`data: ${JSON.stringify({ delta })}\n\n`);
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
    if (!clientClosed && fullReply.length > 5) {
      setCached(safeMessages, fullReply);
      persistExchange(lastUser?.content, fullReply);
    }
    res.write('data: [DONE]\n\n');
    res.end();
    return true;
  } catch (streamErr) {
    console.error(`[chat] ${provider.name} stream error:`, streamErr.message);
    try { res.end(); } catch { /* noop */ }
    return true; // headers sent; caller can't retry
  }
}

/**
 * Stream from Google Gemini (different wire format from OpenAI).
 * Converts the OpenAI-style payload into Gemini's `contents` + `systemInstruction`
 * shape, then translates streamed `candidates[].content.parts[].text` chunks
 * back into the same SSE `data: { delta }` envelope the client already expects.
 * Returns true if streaming started, false if provider couldn't be used.
 */
async function tryStreamGemini(basePayload, res, safeMessages, lastUser) {
  const apiKey = GEMINI.getKey();
  if (!apiKey) {
    console.log('[chat] skipping gemini — no API key');
    return false;
  }

  // Split system prompt from chat turns; map roles (assistant -> model).
  const systemMsg = basePayload.messages.find((m) => m.role === 'system');
  const turns = basePayload.messages.filter((m) => m.role !== 'system');
  const contents = turns.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI.model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const body = {
    contents,
    systemInstruction: systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined,
    generationConfig: {
      temperature: basePayload.temperature ?? 0.5,
      maxOutputTokens: basePayload.max_tokens ?? 800,
    },
  };

  let upstream;
  try {
    upstream = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[chat] gemini network error:', err.message);
    return false;
  }

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '');
    console.error('[chat] gemini error:', upstream.status, errText.slice(0, 300));
    if (upstream.status === 429 || upstream.status === 402) tripGeminiBreaker(errText);
    return false;
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('X-Cache', 'MISS');
  res.setHeader('X-Provider', 'gemini');
  res.flushHeaders?.();

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullReply = '';
  let truncated = false;
  let clientClosed = false;
  res.on('close', () => { clientClosed = true; });

  try {
    while (true) {
      if (clientClosed) break;
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (!data) continue;
        try {
          const json = JSON.parse(data);
          const parts = json.candidates?.[0]?.content?.parts || [];
          // Gemini's finish reason: 'STOP' = natural end, 'MAX_TOKENS' = cut off.
          const finish = json.candidates?.[0]?.finishReason;
          if (finish && finish !== 'STOP') truncated = true;
          for (const p of parts) {
            if (p.text) {
              fullReply += p.text;
              res.write(`data: ${JSON.stringify({ delta: p.text })}\n\n`);
            }
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
    if (!clientClosed && fullReply.length > 5 && !truncated) {
      setCached(safeMessages, fullReply);
      persistExchange(lastUser?.content, fullReply);
    }
    if (truncated) {
      console.warn(`[chat] gemini truncated reply (${fullReply.length} chars) — not cached`);
    }
    res.write('data: [DONE]\n\n');
    res.end();
    return true;
  } catch (streamErr) {
    console.error('[chat] gemini stream error:', streamErr.message);
    try { res.end(); } catch { /* noop */ }
    return true;
  }
}

// Save a Q→A pair to Redis (long-term memory) and to the in-memory mirror
// so it's instantly retrievable for the next request. Fire-and-forget.
function persistExchange(userMsg, assistantMsg) {
  if (!userMsg || !assistantMsg) return;
  noteConversationLocally(userMsg, assistantMsg);
  const id = Date.now();
  logChatExchange(userMsg, assistantMsg).catch((err) => {
    console.error('[chat] logChatExchange failed:', err.message);
  });
  if (isVectorEnabled()) {
    upsertExchange(id, userMsg, assistantMsg).catch((err) => {
      console.error('[chat] upsertExchange failed:', err.message);
    });
  }
}

// Friendly Garhwali fallback when AI is down AND no similar past answer exists.
const OFFLINE_REPLY =
  'अभी पहाड़ी AI व्यस्त छ — थोड़ा रुकिक फिर पुछ्या। ' +
  'इत्तना मा तुम PahadiTube मा गढ़वळि गीत/पॉडकास्ट सुणि सक्दा छां। 🙏';

/**
 * When upstream Groq fails, try to serve a relevant past answer from memory.
 * Returns the assistant text or null if nothing relevant found.
 * Uses a *lower* similarity threshold than the normal recall path because
 * any reasonable past answer is better than an error message.
 */
async function findFallbackReply(userText) {
  if (!userText) return null;
  // 1. Try semantic vector search first (lower bar — 0.55 cosine)
  if (isVectorEnabled()) {
    try {
      const hits = await querySimilar(userText, { topK: 1, minScore: 0.55 });
      if (hits[0]?.a) return { text: hits[0].a, source: 'vector' };
    } catch (err) {
      console.error('[chat] fallback vector error:', err.message);
    }
  }
  // 2. Keyword overlap on in-memory mirror
  try {
    await ensureConversationMirror(() => getChatHistory(300));
    const hits = retrieveSimilarConversations(userText, 1);
    if (hits[0]?.a) return { text: hits[0].a, source: 'keyword' };
  } catch (err) {
    console.error('[chat] fallback keyword error:', err.message);
  }
  return null;
}

// Stream a degraded fallback reply to the client as SSE so the UI shows it
// like a normal answer. Adds X-Fallback header for debugging.
function streamFallbackReply(res, text, source) {
  if (res.headersSent) return false;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.setHeader('X-Cache', 'FALLBACK');
  res.setHeader('X-Fallback-Source', source);
  res.flushHeaders?.();
  const CHUNK = 40;
  for (let i = 0; i < text.length; i += CHUNK) {
    res.write(`data: ${JSON.stringify({ delta: text.slice(i, i + CHUNK) })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
  return true;
}

router.post('/', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Pahadi AI is not configured. Please set GROQ_API_KEY.' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Per-IP rate limit
  const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown').trim();
  if (!takeIpToken(ip)) {
    res.setHeader('Retry-After', String(Math.ceil(IP_REFILL_MS / 1000)));
    return res.status(429).json({ error: 'बहुत जल्दी बहुत सवाल आगः एक छोटु सांस ल्या, फिर पुछि जास।' });
  }

  // Validate + cap message size to prevent abuse
  let safeMessages;
  try {
    safeMessages = messages.slice(-20).map((m) => {
      if (!m || typeof m.role !== 'string' || typeof m.content !== 'string') {
        throw new Error('Invalid message shape');
      }
      if (!['user', 'assistant'].includes(m.role)) {
        throw new Error('Invalid role');
      }
      return { role: m.role, content: m.content.slice(0, 4000) };
    });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }

  // ===== 1. Exact-match cache lookup =====
  const cached = getCached(safeMessages);
  if (cached) {
    return streamCachedReply(res, cached);
  }

  // ===== 2. RAG: retrieve glossary entries + similar past conversations =====
  const lastUser = [...safeMessages].reverse().find((m) => m.role === 'user');

  // 2a. Semantic cache: if a past question is *very* similar AND shares
  //     real content words, reuse its answer. We require both a high vector
  //     score AND a Jaccard overlap of meaningful tokens — pure embedding
  //     similarity often matches by stylistic words ("गढ़वाली ... बता") even
  //     when the actual topic differs (food vs. singer vs. festival).
  const SEMANTIC_CACHE_THRESHOLD = 0.96;
  const SEMANTIC_MIN_OVERLAP = 0.5; // 50% of content tokens must overlap

  // Garhwali/Hindi stop-words + filler that often dominate similarity.
  const STOPWORDS = new Set([
    'गढ़वाली', 'गढ़वळि', 'पहाड़ी', 'पहाड़', 'उत्तराखंड', 'मा', 'का', 'की', 'के',
    'और', 'या', 'बता', 'बतावा', 'बारा', 'बारे', 'मे', 'में', 'है', 'हैं', 'च', 'छ', 'छन',
    'क्या', 'कैसे', 'कन', 'कख', 'कब', 'क्यों', 'who', 'what', 'how', 'when', 'where',
    'tell', 'me', 'about', 'is', 'are', 'the', 'a', 'an', 'of', 'in', 'on',
  ]);
  const tokenize = (s) => String(s || '')
    .toLowerCase()
    .split(/[\s,.!?;:()"'\-—–\/।]+/)
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
  const overlapRatio = (qa, qb) => {
    const a = new Set(tokenize(qa));
    const b = new Set(tokenize(qb));
    if (a.size === 0 || b.size === 0) return 0;
    let inter = 0;
    for (const t of a) if (b.has(t)) inter++;
    return inter / Math.min(a.size, b.size);
  };

  let memoryHits = [];
  if (lastUser && isVectorEnabled()) {
    try {
      memoryHits = await querySimilar(lastUser.content, { topK: 4, minScore: 0.72 });
    } catch (err) {
      console.error('[chat] vector query error:', err.message);
    }
  }
  const semanticHit = memoryHits.find((h) => {
    if (!h.a || h.score < SEMANTIC_CACHE_THRESHOLD) return false;
    return overlapRatio(lastUser.content, h.q) >= SEMANTIC_MIN_OVERLAP;
  });
  if (semanticHit) {
    res.setHeader('X-Cache', 'SEMANTIC');
    res.setHeader('X-Cache-Score', semanticHit.score.toFixed(3));
    setCached(safeMessages, semanticHit.a);
    return streamCachedReply(res, semanticHit.a);
  }

  const ragContext = lastUser ? formatGlossaryContext(retrieveGlossary(lastUser.content, 6)) : '';
  const fewShotContext = lastUser ? formatFewShotContext(retrieveFewShot(lastUser.content, 6)) : '';

  // Long-term memory: prefer semantic (Upstash Vector) recall;
  // fall back to keyword overlap on the in-memory mirror.
  let memoryContext = '';
  let memorySource = 'none';
  if (lastUser) {
    try {
      // Use the (sub-cache-threshold) hits we already fetched above.
      let similar = memoryHits.slice(0, 3);
      if (similar.length > 0) memorySource = 'vector';
      if (similar.length === 0) {
        await ensureConversationMirror(() => getChatHistory(300));
        similar = retrieveSimilarConversations(lastUser.content, 3);
        if (similar.length > 0) memorySource = 'keyword';
      }
      memoryContext = formatConversationContext(similar);
    } catch (err) {
      console.error('[chat] memory retrieval error:', err.message);
    }
  }
  res.setHeader('X-Memory-Source', memorySource);

  const systemContent = SYSTEM_PROMPT
    + (fewShotContext ? `\n\n${fewShotContext}` : '')
    + (ragContext ? `\n\n${ragContext}` : '')
    + (memoryContext ? `\n\n${memoryContext}` : '');

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemContent }, ...safeMessages],
    temperature: 0.5,
    // Devanagari is token-heavy (~2–3 tokens per character) and the system
    // prompt requires Hindi + Garhwali sections for Hindi/English inputs,
    // which roughly doubles output. 1200 leaves headroom so the model can
    // finish both sections instead of getting cut off mid-header.
    max_tokens: 1200,
    stream: true,
  };

  // If ALL providers are cooling down, skip straight to memory — no point
  // hammering APIs we know will return 429.
  const allCoolingDown = isGroqCoolingDown() && isOpenRouterCoolingDown() && isGeminiCoolingDown();
  if (allCoolingDown) {
    res.setHeader('X-All-Providers-Cooldown', '1');
    const fb = await findFallbackReply(lastUser?.content);
    if (fb && streamFallbackReply(res, fb.text, `cooldown:${fb.source}`)) return;
    return streamFallbackReply(res, OFFLINE_REPLY, 'cooldown:offline') || res.status(503).end();
  }

  // If Groq is tripped, skip it and try the others.
  if (isGroqCoolingDown()) {
    if (!isOpenRouterCoolingDown()) {
      const orOk = await tryStreamProvider(OPENROUTER, payload, res, safeMessages, lastUser);
      if (orOk) return;
    }
    if (!res.headersSent && !isGeminiCoolingDown()) {
      const gemOk = await tryStreamGemini(payload, res, safeMessages, lastUser);
      if (gemOk) return;
    }
    if (!res.headersSent) {
      const fb = await findFallbackReply(lastUser?.content);
      if (fb && streamFallbackReply(res, fb.text, `breaker:${fb.source}`)) return;
      return streamFallbackReply(res, OFFLINE_REPLY, 'breaker:offline') || res.status(503).end();
    }
    return;
  }

  // Try Groq first.
  const groqOk = await tryStreamProvider(GROQ, payload, res, safeMessages, lastUser);
  if (groqOk) return;

  // Groq failed — try OpenRouter (if not cooling down) then Gemini.
  if (!res.headersSent && !isOpenRouterCoolingDown()) {
    const orOk = await tryStreamProvider(OPENROUTER, payload, res, safeMessages, lastUser);
    if (orOk) return;
  }

  if (!res.headersSent && !isGeminiCoolingDown()) {
    const gemOk = await tryStreamGemini(payload, res, safeMessages, lastUser);
    if (gemOk) return;
  }

  if (!res.headersSent) {
    const fb = await findFallbackReply(lastUser?.content);
    if (fb && streamFallbackReply(res, fb.text, fb.source)) return;
    if (streamFallbackReply(res, OFFLINE_REPLY, 'offline')) return;
    return res.status(502).json({ error: 'AI service unavailable' });
  }
});

// Lightweight cache stats (handy for monitoring)
router.get('/stats', (_req, res) => {
  const now = Date.now();
  const remaining = (until) => (until > now ? Math.round((until - now) / 1000) : 0);
  res.json({
    ...getCacheStats(),
    breakers: {
      groq: { coolingDown: isGroqCoolingDown(), secondsRemaining: remaining(groqCooldownUntil) },
      openrouter: { coolingDown: isOpenRouterCoolingDown(), secondsRemaining: remaining(openrouterCooldownUntil) },
      gemini: { coolingDown: isGeminiCoolingDown(), secondsRemaining: remaining(geminiCooldownUntil) },
    },
  });
});

// Admin: flush the 24h response cache. Useful after a system-prompt change
// so old (stale) cached replies stop being served.
// Usage: POST /api/chat/flush-cache?key=<FEEDBACK_ADMIN_KEY>
router.post('/flush-cache', (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json(flushResponseCache());
});

// Long-term memory inspection (count + most recent exchange).
// Useful for debugging the Redis-backed conversation store.
router.get('/memory', async (_req, res) => {
  try {
    const [history, vector] = await Promise.all([
      getChatHistory(50),
      vectorInfo(),
    ]);
    res.json({
      total: history.length,
      vector,
      latest: history.slice(0, 5).map((h) => ({
        at: h.at,
        q: h.q?.slice(0, 120),
        aPreview: h.a?.slice(0, 120),
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
