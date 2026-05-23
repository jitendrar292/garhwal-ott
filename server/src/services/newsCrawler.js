// News Crawler — fetches Uttarakhand / India news from RSS feeds.
//
// Uses rss-parser to pull articles, deduplicates against already-published
// CMS articles, and returns cleaned { title, summary, body, source, link }.
// After RSS parsing, scrapes full article text from source URLs.

const Parser = require('rss-parser');
const { URL } = require('url');

const parser = new Parser({
  timeout: 15_000,
  headers: { 'User-Agent': 'PahadiTube-NewsAgent/1.0' },
  maxRedirects: 3,
});

// RSS feeds to crawl — Uttarakhand-focused + general Hindi/English news.
// Verified working as of May 2026 (dead feeds removed).
const RSS_FEEDS = [
  // Amar Ujala Uttarakhand (Hindi) — 40+ items, very reliable
  { url: 'https://www.amarujala.com/rss/uttarakhand.xml', source: 'Amar Ujala', lang: 'hi' },
  // Times of India Uttarakhand (English) — 8+ items
  { url: 'https://timesofindia.indiatimes.com/rssfeeds/4118073.cms', source: 'Times of India', lang: 'en' },
  // News18 Hindi Uttarakhand — 200+ items, very active
  { url: 'https://hindi.news18.com/rss/khabar/state/uttarakhand.xml', source: 'News18 Hindi', lang: 'hi' },
  // NDTV Hindi — national Hindi news (Uttarakhand stories surface here)
  { url: 'https://feeds.feedburner.com/ndtvkhabar-latest', source: 'NDTV Hindi', lang: 'hi' },
];

/**
 * Fetch news articles from all configured RSS feeds.
 * @param {Object} opts
 * @param {number} opts.maxPerFeed  Max articles per feed (default 5)
 * @param {number} opts.maxAge      Max article age in hours (default 24)
 * @returns {Promise<Array<{title, summary, body, source, sourceUrl, lang, pubDate}>>}
 */
async function crawlNews({ maxPerFeed = 10, maxAge = 48 } = {}) {
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

      // Try to fetch full article text from source URLs
      const enriched = await Promise.all(
        items.map(async (item) => {
          if (!item.sourceUrl) return item;
          try {
            const fullBody = await scrapeArticleBody(item.sourceUrl);
            if (fullBody && fullBody.length > item.body.length) {
              return { ...item, body: fullBody.slice(0, 5000) };
            }
          } catch (e) {
            // Fall back to RSS content
          }
          return item;
        })
      );

      return enriched;
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

  // Balance across sources: round-robin pick so no single source dominates
  const balanced = balanceSources(results);

  console.log(`[newsCrawler] Crawled ${balanced.length} articles from ${RSS_FEEDS.length} feeds (balanced across sources)`);
  return balanced;
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

// ── Full article scraper ──

/**
 * Scrape the full article text from a news page.
 * Uses plain fetch + regex extraction — no heavy browser deps.
 */
async function scrapeArticleBody(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

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

    // Strategy: extract from common article body selectors via regex
    // Look for <article>, article-body, story-detail, etc.
    let body = '';

    // Try JSON-LD first (many Hindi news sites embed structured data)
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const block of jsonLdMatch) {
        try {
          const jsonStr = block.replace(/<\/?script[^>]*>/gi, '');
          const ld = JSON.parse(jsonStr);
          const articleBody = ld.articleBody || ld.description;
          if (articleBody && articleBody.length > 100) {
            body = articleBody;
            break;
          }
        } catch { /* ignore parse errors */ }
      }
    }

    // Fallback: extract <p> tags from article/story containers
    if (!body || body.length < 100) {
      // Match common article container patterns
      const containerMatch = html.match(
        /<(?:article|div)[^>]*(?:class|id)="[^"]*(?:article[_-]?body|story[_-]?detail|content[_-]?area|post[_-]?content|entry[_-]?content|article[_-]?content|story[_-]?content|main[_-]?content)[^"]*"[^>]*>([\s\S]*?)<\/(?:article|div)>/i
      );

      const searchArea = containerMatch ? containerMatch[1] : html;

      // Extract all <p> tag contents
      const paragraphs = [];
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(searchArea)) !== null) {
        const text = cleanText(pMatch[1]);
        // Filter out short/junk paragraphs (ads, captions, etc.)
        if (text.length > 30 && !text.match(/^(also read|ये भी पढ़ें|और पढ़ें|photo|image|advertisement|विज्ञापन)/i)) {
          paragraphs.push(text);
        }
      }

      if (paragraphs.length > 0) {
        body = paragraphs.join('\n\n');
      }
    }

    if (body && body.length > 100) {
      console.log(`[newsCrawler] Scraped ${body.length} chars from ${new URL(url).hostname}`);
      return cleanText(body);
    }

    return null;
  } catch (err) {
    console.warn(`[newsCrawler] Scrape failed for ${url}: ${err.message}`);
    return null;
  }
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

/**
 * Balance articles across sources using round-robin so no single source
 * dominates the output. Within each source, articles stay sorted by date.
 */
function balanceSources(articles) {
  // Group by source, skip sources with no articles
  const bySource = {};
  for (const a of articles) {
    if (!bySource[a.source]) bySource[a.source] = [];
    bySource[a.source].push(a);
  }

  const sources = Object.keys(bySource).filter((s) => bySource[s].length > 0);
  const balanced = [];

  // Each pass takes one article from every non-empty source (round-robin).
  // Loop until all source queues are drained.
  let anyLeft = true;
  while (anyLeft) {
    anyLeft = false;
    for (const src of sources) {
      if (bySource[src].length > 0) {
        balanced.push(bySource[src].shift());
        anyLeft = true;
      }
    }
  }

  return balanced;
}

module.exports = { crawlNews, deduplicateArticles, RSS_FEEDS };
