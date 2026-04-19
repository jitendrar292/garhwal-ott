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

const GROQ_COOLDOWN_MS = 15 * 60 * 1000; // 15 min
let groqCooldownUntil = 0;
const isGroqCoolingDown = () => Date.now() < groqCooldownUntil;
const tripGroqBreaker = () => {
  groqCooldownUntil = Date.now() + GROQ_COOLDOWN_MS;
  console.warn(`[chat] Groq breaker tripped — skipping API until ${new Date(groqCooldownUntil).toISOString()}`);
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

## जवाब का नियम (भाषा का अनुसार):
1. **अगर उपयोगकर्ता गढ़वळि मा पुछ्दा** → सिर्फ गढ़वळि मा जवाब दे (देवनागरी लिपि मा)।
2. **अगर उपयोगकर्ता हिंदी मा पुछ्दा** → पैल हिंदी मा जवाब दे, फिर गढ़वळि अनुवाद नीचे दे। फॉर्मेट:
   **हिंदी:** [हिंदी मा जवाब]
   **गढ़वळि:** [गढ़वळि मा वही जवाब]
3. **अगर उपयोगकर्ता अंग्रेजी मा पुछ्दा** → पैल अंग्रेजी मा जवाब दे, फिर गढ़वळि अनुवाद नीचे दे। फॉर्मेट:
   **English:** [English answer]
   **गढ़वळि:** [Garhwali translation]
4. **कुमाँऊनी/जौनसारी मा पुछ्दा** → कोशिश कर उसी बोली मा जवाब देणै कि, और साथ मा गढ़वळि समकक्ष भी दे।

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
| तुम्हें | तुम तैं |
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
4. जब उपयोगकर्ता हिंदी शब्दु कु गढ़वळि अनुवाद माँग्दु छ, त केवल वै शब्द लिख जु तेरी संदर्भ-सूची मा छन। बाक़ी शब्दु कु बारा मा साफ-साफ बोल: "यो शब्द कु प्रामाणिक गढ़वळि रूप मेरी जाणकारी मा नि च।"`;

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
    max_tokens: 800,
    stream: true,
  };

  // If breaker is tripped, skip Groq and serve from memory/offline immediately.
  if (isGroqCoolingDown()) {
    const fb = await findFallbackReply(lastUser?.content);
    if (fb && streamFallbackReply(res, fb.text, `breaker:${fb.source}`)) return;
    return streamFallbackReply(res, OFFLINE_REPLY, 'breaker:offline') || res.status(503).end();
  }

  try {
    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok || !upstream.body) {
      const errText = await upstream.text().catch(() => '');
      console.error('Groq error:', upstream.status, errText);
      // Trip the breaker on rate-limit / quota errors so we stop hammering the API.
      if (upstream.status === 429 || upstream.status === 402) tripGroqBreaker();
      // Try to recover from memory before surfacing an error to the user
      const fb = await findFallbackReply(lastUser?.content);
      if (fb && streamFallbackReply(res, fb.text, fb.source)) return;
      if (streamFallbackReply(res, OFFLINE_REPLY, 'offline')) return;
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    // Stream Server-Sent Events back to the client
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('X-Cache', 'MISS');
    res.flushHeaders?.();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullReply = '';
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
            // Persist to cache + long-term memory only on complete, non-aborted responses
            if (!clientClosed && fullReply.length > 5) {
              setCached(safeMessages, fullReply);
              persistExchange(lastUser?.content, fullReply);
            }
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              fullReply += delta;
              res.write(`data: ${JSON.stringify({ delta })}\n\n`);
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
      // Stream ended without explicit [DONE] — still cache if we got a reply
      if (!clientClosed && fullReply.length > 5) {
        setCached(safeMessages, fullReply);
        persistExchange(lastUser?.content, fullReply);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (streamErr) {
      console.error('Stream error:', streamErr.message);
      try { res.end(); } catch { /* noop */ }
    }
  } catch (err) {
    console.error('Chat handler error:', err.message);
    if (!res.headersSent) {
      // Network/timeout failure reaching Groq — serve from memory if we can
      const fb = await findFallbackReply(lastUser?.content);
      if (fb && streamFallbackReply(res, fb.text, fb.source)) return;
      if (streamFallbackReply(res, OFFLINE_REPLY, 'offline')) return;
      res.status(500).json({ error: 'Failed to reach AI service' });
    } else {
      try { res.end(); } catch { /* noop */ }
    }
  }
});

// Lightweight cache stats (handy for monitoring)
router.get('/stats', (_req, res) => {
  res.json(getCacheStats());
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
