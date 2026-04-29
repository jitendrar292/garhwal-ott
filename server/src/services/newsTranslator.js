// News Translator — converts Hindi/English news articles to Garhwali.
//
// Uses the same multi-provider AI fallback chain as chat.js:
// OpenAI → Groq → Gemini (non-streaming, JSON mode).

const TRANSLATION_PROMPT = `तू एक पेशेवर समाचार अनुवादक छै। तेरु काम छ Hindi/English समाचार लेख तैं शुद्ध गढ़वळि (Garhwali) भाषा मा अनुवाद करणु।

## नियम:
1. **शीर्षक (title)**: छोटू, आकर्षक, शुद्ध गढ़वळि मा। हिंदी क्रियाएं मत लगा — "है" → "छ", "हैं" → "छन", "का/की/के" → "कु/कि/का"।
2. **सारांश (summary)**: 1-2 वाक्य मा खबर कु सार गढ़वळि मा।
3. **मुख्य भाग (body)**: पूरा लेख गढ़वळि मा अनुवाद कर। तथ्य बिल्कुल वही रख, कुछ ना जोड़ और ना हटा।
4. **श्रेणी (category)**: खबर कि श्रेणी अंग्रेजी मा दे — "uttarakhand", "politics", "weather", "disaster", "culture", "sports", "general" मा सी एक।
5. **स्थानीय शब्द**: जहाँ हो सके गढ़वळि शब्द इस्तेमाल कर (जन: पाणि, मनखि, ब्वे, गौं, पहाड़, आदि)।
6. **व्याकरण**: शुद्ध गढ़वळि व्याकरण — "छ/छन/छूं", "रौ/रौंदु/रौंदी", "कर्दु/कर्दी", "होलु/होली"।
7. तथ्यों मा कोई बदलाव ना कर — नाम, तारीख, संख्या, स्थान सब वैसे ही रख।

## JSON Output (strictly this format):
{
  "title": "गढ़वळि शीर्षक",
  "summary": "गढ़वळि सारांश",
  "body": "गढ़वळि मा पूरा लेख",
  "category": "uttarakhand"
}`;

// ── Provider configs ──

const PROVIDERS = [
  {
    name: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-5-mini',
    fallbackModel: process.env.OPENAI_FALLBACK_MODEL || 'gpt-4.1-mini',
    getKey: () => process.env.OPENAI_API_KEY,
    buildRequest: (model, messages) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    }),
  },
  {
    name: 'groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    getKey: () => process.env.GROQ_API_KEY,
    buildRequest: (model, messages) => ({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    }),
  },
  {
    name: 'gemini',
    getKey: () => process.env.GEMINI_API_KEY,
    buildGeminiRequest: (messages) => {
      const model = (process.env.GEMINI_MODEL || 'gemini-2.0-flash')
        .trim().toLowerCase().replace(/\s+/g, '-');
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
      return {
        url,
        options: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: messages.map((m) => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }],
            })),
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json',
            },
          }),
        },
      };
    },
  },
];

/**
 * Translate a single news article to Garhwali using LLM providers.
 * @param {Object} article - { title, summary, body, source, lang }
 * @returns {Promise<{title, summary, body, category}|null>}
 */
async function translateToGarhwali(article) {
  const userMessage = `अनुवाद कर (${article.lang === 'en' ? 'English' : 'Hindi'} → गढ़वळि):

शीर्षक: ${article.title}
सारांश: ${article.summary || ''}
मुख्य भाग: ${article.body || article.summary || ''}
स्रोत: ${article.source}

JSON मा जवाब दे।`;

  const messages = [
    { role: 'system', content: TRANSLATION_PROMPT },
    { role: 'user', content: userMessage },
  ];

  // Try OpenAI-compatible providers first
  for (const provider of PROVIDERS) {
    const key = provider.getKey();
    if (!key) {
      console.log(`[newsTranslator] Skipping ${provider.name} — no API key`);
      continue;
    }

    try {
      if (provider.name === 'gemini') {
        return await tryGemini(provider, messages);
      }

      // OpenAI / Groq path
      const models = [provider.model, provider.fallbackModel].filter(Boolean);
      for (const model of models) {
        const result = await tryOpenAICompatible(provider, model, messages);
        if (result) return result;
      }
    } catch (err) {
      console.warn(`[newsTranslator] ${provider.name} failed: ${err.message}`);
    }
  }

  console.error('[newsTranslator] All providers failed for:', article.title);
  return null;
}

async function tryOpenAICompatible(provider, model, messages) {
  const reqOpts = provider.buildRequest(model, messages);
  const resp = await fetch(provider.url, reqOpts);

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    console.warn(`[newsTranslator] ${provider.name}/${model} ${resp.status}: ${errText.slice(0, 200)}`);
    if (resp.status === 429 || resp.status === 402) return null; // rate limited, try next
    return null;
  }

  const data = await resp.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  return parseTranslationJSON(content, provider.name);
}

async function tryGemini(provider, messages) {
  const { url, options } = provider.buildGeminiRequest(messages);
  const resp = await fetch(url, options);

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    console.warn(`[newsTranslator] gemini ${resp.status}: ${errText.slice(0, 200)}`);
    return null;
  }

  const data = await resp.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!content) return null;

  return parseTranslationJSON(content, 'gemini');
}

function parseTranslationJSON(content, providerName) {
  try {
    // Strip markdown code fences if present
    const cleaned = content.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.title || !parsed.body) {
      console.warn(`[newsTranslator] ${providerName} returned incomplete JSON`);
      return null;
    }

    return {
      title: String(parsed.title).trim(),
      summary: String(parsed.summary || '').trim(),
      body: String(parsed.body).trim(),
      category: String(parsed.category || 'general').trim().toLowerCase(),
    };
  } catch (err) {
    console.warn(`[newsTranslator] ${providerName} JSON parse error: ${err.message}`);
    console.warn(`[newsTranslator] Raw content: ${content.slice(0, 300)}`);
    return null;
  }
}

/**
 * Translate an array of articles, with concurrency control.
 * @param {Array} articles - Crawled articles
 * @param {number} concurrency - Max parallel translations (default 2)
 * @returns {Promise<Array>} Successfully translated articles
 */
async function translateBatch(articles, concurrency = 2) {
  const results = [];

  // Process in batches to respect rate limits
  for (let i = 0; i < articles.length; i += concurrency) {
    const batch = articles.slice(i, i + concurrency);
    const translations = await Promise.allSettled(
      batch.map(async (article) => {
        const translated = await translateToGarhwali(article);
        if (!translated) return null;
        return {
          ...translated,
          source: article.source,
          sourceUrl: article.sourceUrl,
          originalLang: article.lang,
        };
      })
    );

    for (const result of translations) {
      if (result.status === 'fulfilled' && result.value) {
        results.push(result.value);
      }
    }

    // Brief pause between batches to avoid rate limits
    if (i + concurrency < articles.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`[newsTranslator] Translated ${results.length}/${articles.length} articles`);
  return results;
}

module.exports = { translateToGarhwali, translateBatch };
