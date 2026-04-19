const express = require('express');
const router = express.Router();
const {
  getCached,
  setCached,
  retrieveGlossary,
  formatGlossaryContext,
  getCacheStats,
} = require('../services/aiCache');

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
12. कभी-कभी उपयोगकर्ता तैं प्रोत्साहित कर — "तुम भी अपणा घर-परिवार मा गढ़वळि बोल्या, यि भाषा तभी जिंदा रौलि"।`;

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

router.post('/', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'Pahadi AI is not configured. Please set GROQ_API_KEY.' });
  }

  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
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

  // ===== 1. Cache lookup =====
  const cached = getCached(safeMessages);
  if (cached) {
    return streamCachedReply(res, cached);
  }

  // ===== 2. RAG: retrieve glossary entries for the latest user query =====
  const lastUser = [...safeMessages].reverse().find((m) => m.role === 'user');
  const ragContext = lastUser ? formatGlossaryContext(retrieveGlossary(lastUser.content, 6)) : '';
  const systemContent = SYSTEM_PROMPT + (ragContext ? `\n\n${ragContext}` : '');

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: systemContent }, ...safeMessages],
    temperature: 0.7,
    max_tokens: 800,
    stream: true,
  };

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
            // Persist to cache only on a complete, non-aborted response
            if (!clientClosed && fullReply.length > 5) {
              setCached(safeMessages, fullReply);
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

module.exports = router;
