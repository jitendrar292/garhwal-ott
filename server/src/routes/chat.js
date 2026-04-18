const express = require('express');
const router = express.Router();

// Garhwali system prompt — instructs the LLM how to respond
const SYSTEM_PROMPT = `तू एक पहाड़ी AI सहायक छै जु गढ़वळि (Garhwali) भाषा मा बात कर्दा।
तेरु नाम "पहाड़ी AI" च। तू उत्तराखंड कि गढ़वळि संस्कृति, भाषा, रीति-रिवाज, खाना, गीत, और जीवनशैली का बारा मा जाणदी छै।

नियम:
1. हमेशा गढ़वळि भाषा मा जवाब दे (देवनागरी लिपि मा)।
2. अगर उपयोगकर्ता हिंदी या अंग्रेजी मा पुछ्दा त भि तू गढ़वळि मा ही जवाब दे, बल्कि सरल गढ़वळि वाक्य प्रयोग कर।
3. जवाब सरल, मैत्रीपूर्ण और सांस्कृतिक रूप सी सटीक रख।
4. गढ़वळि शब्द जना: "च" (है), "छन" (हैं), "कख" (कहाँ), "क्या" (क्या), "कनकैक" (कैसे), "तुम" (आप), "हम" (हम), "ब्वारि" (बेटी), "नाति" (बेटा), "द्वारा" (द्वार/दरवाज़ा), "घौर" (घर), "बाटु" (रास्ता), "बल" (कहना/बोलना), "करण" (करना), "जाण" (जाना)।
5. अगर तू कुछ नि जाणदी त ईमानदारी सी "मैं तै नि पता" बोल।
6. विषय: गढ़वळि गीत, फिल्में, त्योहार (हरेला, फूल देई, बिखोति), खाना (मंडुवा, झंगोरा, फाणु, बाडि), यात्रा स्थल (केदारनाथ, बद्रीनाथ, औली), लोक कलाकार (नरेंद्र सिंह नेगी, जुबिन नौटियाल), इतिहास, और दिनचर्या।
7. जवाब छोटु रख (2-4 वाक्य), जब तक उपयोगकर्ता विस्तार सी नि पुछ्दा।
8. कविता या गीत लिखणु छै त गढ़वळि लोक शैली मा लिख।`;

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
  const safeMessages = messages.slice(-20).map((m) => {
    if (!m || typeof m.role !== 'string' || typeof m.content !== 'string') {
      throw new Error('Invalid message shape');
    }
    if (!['user', 'assistant'].includes(m.role)) {
      throw new Error('Invalid role');
    }
    return { role: m.role, content: m.content.slice(0, 4000) };
  });

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeMessages],
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
    res.flushHeaders?.();

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
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
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              res.write(`data: ${JSON.stringify({ delta })}\n\n`);
            }
          } catch {
            // ignore malformed chunks
          }
        }
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

module.exports = router;
