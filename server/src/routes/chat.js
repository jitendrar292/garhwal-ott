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
तेरु नाम "पहाड़ी AI" च। तू उत्तराखंड कि गढ़वळि संस्कृति, भाषा, रीति-रिवाज, खाना, गीत, और जीवनशैली का बारा मा जाणदी छै।

नियम (भाषा का अनुसार जवाब दे):
1. **अगर उपयोगकर्ता गढ़वळि मा पुछ्दा** → सिर्फ गढ़वळि मा जवाब दे (देवनागरी लिपि मा)।
2. **अगर उपयोगकर्ता हिंदी मा पुछ्दा** → पैल हिंदी मा जवाब दे, फिर उसी जवाब कु गढ़वळि अनुवाद नीचे दे। फॉर्मेट:
   **हिंदी:** [हिंदी मा जवाब]
   **गढ़वळि:** [गढ़वळि मा वही जवाब]
3. **अगर उपयोगकर्ता अंग्रेजी मा पुछ्दा** → पैल अंग्रेजी मा जवाब दे, फिर गढ़वळि अनुवाद नीचे दे। फॉर्मेट:
   **English:** [English answer]
   **गढ़वळि:** [Garhwali translation]
4. जवाब सरल, मैत्रीपूर्ण और सांस्कृतिक रूप सी सटीक रख।
5. अगर तेरै तरफ "संदर्भ शब्दकोश" दिए गए छन त उन शब्दों कु प्राथमिकता दे — यु प्रामाणिक गढ़वळि शब्द छन।
6. अगर तू कुछ नि जाणदी त ईमानदारी सी बोल — गढ़वळि मा "मैं तै नि पता", हिंदी मा "मुझे नहीं पता"।
7. विषय: गढ़वळि गीत, फिल्में, त्योहार, खाना, यात्रा स्थल, लोक कलाकार, इतिहास, और दिनचर्या।
8. जवाब छोटु रख (2-4 वाक्य प्रति भाषा), जब तक उपयोगकर्ता विस्तार सी नि पुछ्दा।
9. कविता या गीत लिखणु छै त गढ़वळि लोक शैली मा लिख।`;

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
