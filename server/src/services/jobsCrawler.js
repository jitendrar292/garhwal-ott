// Jobs & Events Crawler — scrapes Uttarakhand govt job sites and event listings.
//
// Uses AI (same multi-provider chain as newsTranslator) to extract structured
// job/event data from scraped HTML pages and RSS feeds.

const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 15_000,
  headers: { 'User-Agent': 'PahadiTube-JobsAgent/1.0' },
  maxRedirects: 3,
});

// ── Job Sources ──
const JOB_SOURCES = [
  // UKPSC
  { url: 'https://psc.uk.gov.in', name: 'UKPSC', type: 'scrape' },
  // UKSSSC
  { url: 'https://sssc.uk.gov.in', name: 'UKSSSC', type: 'scrape' },
  // Employment News / NCS
  { url: 'https://www.ncs.gov.in/content-repository/rss/jobs-uttarakhand', name: 'NCS Portal', type: 'rss' },
  // Sarkari Result (Uttarakhand tagged)
  { url: 'https://www.sarkariresult.com/rss.php', name: 'Sarkari Result', type: 'rss' },
  // FreeJobAlert
  { url: 'https://www.freejobalert.com/feed/', name: 'FreeJobAlert', type: 'rss' },
];

// ── Event Sources ──
const EVENT_SOURCES = [
  { url: 'https://uttarakhandtourism.gov.in', name: 'UK Tourism', type: 'scrape' },
];

// AI providers (same as newsTranslator)
const PROVIDERS = [
  {
    name: 'groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
    getKey: () => process.env.GROQ_API_KEY,
  },
  {
    name: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
    getKey: () => process.env.OPENAI_API_KEY,
  },
  {
    name: 'gemini',
    getKey: () => process.env.GEMINI_API_KEY,
  },
];

const JOBS_EXTRACTION_PROMPT = `You are a government job listing extractor for Uttarakhand, India. 
Given raw text from a government job website or RSS feed, extract ALL job listings you can find.

Return a JSON array of jobs. Each job object must have:
{
  "title": "Job title in English",
  "titleLocal": "Job title in Hindi",
  "department": "Recruiting organization name",
  "location": "Posting location (default: Uttarakhand)",
  "vacancies": number or 0 if unknown,
  "lastDate": "YYYY-MM-DD format deadline (must be in the future)",
  "salary": "Salary range string or empty",
  "eligibility": "Brief eligibility criteria",
  "category": "state|central|police|defence|teaching|psu",
  "link": "Official notification URL if available",
  "emoji": "Relevant emoji (📋📚👮🌲🏛️🏘️🏔️🎖️🏭💼🔬🏥💊🚰🎓)",
  "featured": true if vacancies >= 100 or from a major commission
}

Rules:
- Only include Uttarakhand-related jobs (state govt, central posts in UK, etc.)
- Skip expired jobs (lastDate must be today or later; today is ${new Date().toISOString().slice(0, 10)})
- If lastDate is unclear, estimate based on context (usually 30-45 days from posting)
- Return ONLY the JSON array, no markdown fences or explanation
- If no valid jobs found, return []`;

const EVENTS_EXTRACTION_PROMPT = `You are an Uttarakhand cultural events extractor.
Given raw text from tourism or event websites, extract upcoming events, festivals, and melas.

Return a JSON array of events. Each event object must have:
{
  "name": "Event name in English",
  "nameLocal": "Event name in Hindi/Garhwali",
  "date": "YYYY-MM-DD (start date)",
  "endDate": "YYYY-MM-DD or null",
  "location": "City/town, District",
  "organizer": "Organizing body or empty",
  "category": "fest|music|theatre|fashion|art|literary|religious|mela",
  "emoji": "Relevant emoji",
  "description": "1-2 sentence description",
  "link": "URL if available"
}

Rules:
- Only include events in Uttarakhand
- Only future events (today is ${new Date().toISOString().slice(0, 10)})
- Return ONLY the JSON array, no markdown
- If no events found, return []`;

/**
 * Crawl jobs from configured sources.
 * @returns {Promise<Array>} Raw extracted jobs
 */
async function crawlJobs() {
  const allText = [];

  // Crawl RSS feeds
  const rssFeeds = JOB_SOURCES.filter((s) => s.type === 'rss');
  const rssPromises = rssFeeds.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, 15);
      const text = items.map((item) =>
        `[${feed.name}] ${item.title || ''} | ${item.contentSnippet || ''} | Link: ${item.link || ''}`
      ).join('\n');
      if (text) allText.push({ source: feed.name, text });
    } catch (err) {
      console.warn(`[jobsCrawler] RSS failed for ${feed.name}: ${err.message}`);
    }
  });

  // Scrape websites
  const scrapeFeeds = JOB_SOURCES.filter((s) => s.type === 'scrape');
  const scrapePromises = scrapeFeeds.map(async (site) => {
    try {
      const text = await scrapePageText(site.url);
      if (text && text.length > 50) {
        allText.push({ source: site.name, text: text.slice(0, 8000) });
      }
    } catch (err) {
      console.warn(`[jobsCrawler] Scrape failed for ${site.name}: ${err.message}`);
    }
  });

  await Promise.allSettled([...rssPromises, ...scrapePromises]);

  if (allText.length === 0) {
    console.log('[jobsCrawler] No content fetched from any source');
    return [];
  }

  // Use AI to extract structured jobs from raw text
  const combined = allText.map((t) => `--- Source: ${t.source} ---\n${t.text}`).join('\n\n');
  const jobs = await extractWithAI(combined, 'jobs');
  console.log(`[jobsCrawler] Extracted ${jobs.length} jobs from ${allText.length} sources`);
  return jobs;
}

/**
 * Crawl events from configured sources.
 * @returns {Promise<Array>} Raw extracted events
 */
async function crawlEvents() {
  const allText = [];

  for (const site of EVENT_SOURCES) {
    try {
      const text = await scrapePageText(site.url);
      if (text && text.length > 50) {
        allText.push({ source: site.name, text: text.slice(0, 8000) });
      }
    } catch (err) {
      console.warn(`[jobsCrawler] Event scrape failed for ${site.name}: ${err.message}`);
    }
  }

  if (allText.length === 0) return [];

  const combined = allText.map((t) => `--- Source: ${t.source} ---\n${t.text}`).join('\n\n');
  const events = await extractWithAI(combined, 'events');
  console.log(`[jobsCrawler] Extracted ${events.length} events from ${allText.length} sources`);
  return events;
}

/**
 * Scrape visible text from a web page.
 */
async function scrapePageText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PahadiTube-Bot/1.0)',
        Accept: 'text/html',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!resp.ok) return null;
    const html = await resp.text();

    // Strip scripts, styles, and tags; keep text
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/**
 * Use AI to extract structured data from raw text.
 * @param {string} text - Raw scraped text
 * @param {'jobs'|'events'} type - What to extract
 * @returns {Promise<Array>}
 */
async function extractWithAI(text, type) {
  const systemPrompt = type === 'jobs' ? JOBS_EXTRACTION_PROMPT : EVENTS_EXTRACTION_PROMPT;
  const userMessage = `Extract ${type} from this content:\n\n${text.slice(0, 12000)}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  for (const provider of PROVIDERS) {
    const key = provider.getKey();
    if (!key) continue;

    try {
      let content;
      if (provider.name === 'gemini') {
        content = await callGemini(messages);
      } else {
        content = await callOpenAICompatible(provider, messages);
      }

      if (!content) continue;

      // Parse JSON response
      const cleaned = content.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (err) {
      console.warn(`[jobsCrawler] ${provider.name} extraction failed: ${err.message}`);
    }
  }

  console.error('[jobsCrawler] All AI providers failed for extraction');
  return [];
}

async function callOpenAICompatible(provider, messages) {
  const resp = await fetch(provider.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${provider.getKey()}`,
    },
    body: JSON.stringify({
      model: provider.model,
      messages,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    console.warn(`[jobsCrawler] ${provider.name} ${resp.status}: ${errText.slice(0, 200)}`);
    return null;
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content || null;
}

async function callGemini(messages) {
  const model = (process.env.GEMINI_MODEL || 'gemini-2.0-flash').trim().toLowerCase().replace(/\s+/g, '-');
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!resp.ok) return null;
  const data = await resp.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

/**
 * Deduplicate jobs against existing ones (by title similarity).
 */
function deduplicateJobs(crawled, existing) {
  const existingTitles = new Set(
    existing.map((j) => normalizeTitle(j.title))
  );

  return crawled.filter((job) => {
    if (!job.title) return false;
    const norm = normalizeTitle(job.title);
    if (existingTitles.has(norm)) return false;
    // Check 70% word overlap
    for (const et of existingTitles) {
      if (norm.length > 10 && et.length > 10) {
        const words1 = new Set(norm.split(/\s+/));
        const words2 = new Set(et.split(/\s+/));
        const overlap = [...words1].filter((w) => words2.has(w)).length;
        const maxLen = Math.max(words1.size, words2.size);
        if (maxLen > 0 && overlap / maxLen > 0.7) return false;
      }
    }
    return true;
  });
}

function normalizeTitle(t) {
  return (t || '').toLowerCase().replace(/[^a-z0-9\u0900-\u097f\s]/g, '').replace(/\s+/g, ' ').trim();
}

module.exports = { crawlJobs, crawlEvents, deduplicateJobs, JOB_SOURCES, EVENT_SOURCES };
