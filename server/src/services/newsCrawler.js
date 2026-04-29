// News Crawler — fetches Uttarakhand / India news from RSS feeds.
//
// Uses rss-parser to pull articles, deduplicates against already-published
// CMS articles, and returns cleaned { title, summary, body, source, link }.

const Parser = require('rss-parser');

const parser = new Parser({
  timeout: 15_000,
  headers: { 'User-Agent': 'PahadiTube-NewsAgent/1.0' },
  maxRedirects: 3,
});

// RSS feeds to crawl — Uttarakhand-focused + general Hindi news
const RSS_FEEDS = [
  // Amar Ujala Uttarakhand
  { url: 'https://www.amarujala.com/rss/uttarakhand.xml', source: 'Amar Ujala', lang: 'hi' },
  // Dainik Jagran Uttarakhand
  { url: 'https://www.jagran.com/rss/uttarakhand-news.xml', source: 'Dainik Jagran', lang: 'hi' },
  // NDTV India (Hindi)
  { url: 'https://feeds.feedburner.com/ndabordi', source: 'NDTV India', lang: 'hi' },
  // Hindustan Times (English)
  { url: 'https://www.hindustantimes.com/feeds/rss/cities/dehradun/rssfeed.xml', source: 'Hindustan Times', lang: 'en' },
  // Live Hindustan Uttarakhand
  { url: 'https://feed.livehindustan.com/rss/4430', source: 'Live Hindustan', lang: 'hi' },
];

/**
 * Fetch news articles from all configured RSS feeds.
 * @param {Object} opts
 * @param {number} opts.maxPerFeed  Max articles per feed (default 5)
 * @param {number} opts.maxAge      Max article age in hours (default 24)
 * @returns {Promise<Array<{title, summary, body, source, sourceUrl, lang, pubDate}>>}
 */
async function crawlNews({ maxPerFeed = 5, maxAge = 24 } = {}) {
  const cutoff = Date.now() - maxAge * 60 * 60 * 1000;
  const results = [];

  const feedPromises = RSS_FEEDS.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || [])
        .filter((item) => {
          if (!item.title) return false;
          const pubDate = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
          return pubDate >= cutoff;
        })
        .slice(0, maxPerFeed)
        .map((item) => ({
          title: cleanText(item.title),
          summary: cleanText(item.contentSnippet || item.content || '').slice(0, 500),
          body: cleanText(item.content || item.contentSnippet || '').slice(0, 2000),
          source: feed.source,
          sourceUrl: item.link || '',
          lang: feed.lang,
          pubDate: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
        }));

      return items;
    } catch (err) {
      console.warn(`[newsCrawler] Failed to fetch ${feed.source}: ${err.message}`);
      return [];
    }
  });

  const feedResults = await Promise.allSettled(feedPromises);
  for (const result of feedResults) {
    if (result.status === 'fulfilled') {
      results.push(...result.value);
    }
  }

  // Sort by publish date (newest first)
  results.sort((a, b) => b.pubDate - a.pubDate);

  console.log(`[newsCrawler] Crawled ${results.length} articles from ${RSS_FEEDS.length} feeds`);
  return results;
}

/**
 * Filter out articles that already exist in the CMS (by fuzzy title match).
 * @param {Array} crawled  - Crawled articles
 * @param {Array} existing - Existing CMS articles (from loadNews)
 * @returns {Array} Only new articles
 */
function deduplicateArticles(crawled, existing) {
  const existingTitles = new Set(
    existing.map((a) => normalizeTitle(a.title))
  );

  return crawled.filter((article) => {
    const norm = normalizeTitle(article.title);
    // Check exact and substring overlap
    if (existingTitles.has(norm)) return false;
    for (const et of existingTitles) {
      if (norm.length > 10 && et.length > 10) {
        // If 70%+ of words overlap, consider it duplicate
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

// ── Helpers ──

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<[^>]+>/g, '')        // strip HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')           // collapse whitespace
    .trim();
}

function normalizeTitle(title) {
  return (title || '')
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, '') // keep alphanumeric + Devanagari
    .replace(/\s+/g, ' ')
    .trim();
}

module.exports = { crawlNews, deduplicateArticles, RSS_FEEDS };
