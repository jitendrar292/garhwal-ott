// News Agent — automated pipeline: crawl → translate → publish.
//
// Endpoints:
//   POST /api/news-agent/run      → trigger one crawl+translate+publish cycle (admin)
//   GET  /api/news-agent/status   → last run info (admin)
//   POST /api/news-agent/config   → update RSS feeds / settings (admin)
//
// Designed to be triggered by:
//   1. Manual admin button in NewsAdminPage
//   2. External cron (Render cron job, GitHub Actions, or curl)
//   3. Internal setInterval (optional, off by default)

const express = require('express');
const router = express.Router();
const { crawlNews, deduplicateArticles } = require('../services/newsCrawler');
const { translateBatch } = require('../services/newsTranslator');
const { loadNews } = require('./news');
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');
const { sendNotificationToAll } = require('../services/push');

const REDIS_KEY = 'pahadi_news';
const MAX_NEWS = 200;

// ── Run state ──
let lastRun = {
  status: 'idle',     // 'idle' | 'running' | 'completed' | 'error'
  startedAt: null,
  completedAt: null,
  articlesFound: 0,
  articlesNew: 0,
  articlesTranslated: 0,
  articlesPublished: 0,
  errors: [],
};

// Lock to prevent concurrent runs
let isRunning = false;

// ── Admin auth helper ──
function checkAdmin(req, res) {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ── Trigger a run ──
router.post('/run', async (req, res) => {
  if (!checkAdmin(req, res)) return;

  if (isRunning) {
    return res.status(409).json({ error: 'Agent is already running', lastRun });
  }

  // Accept optional overrides from request body
  const { maxPerFeed = 3, maxAge = 24, maxArticles = 5, dryRun = false } = req.body || {};

  // Start the pipeline asynchronously so we can respond immediately
  res.json({ message: 'News agent started', status: 'running' });

  // Run pipeline in background
  runPipeline({ maxPerFeed, maxAge, maxArticles, dryRun }).catch((err) => {
    console.error('[newsAgent] Unhandled pipeline error:', err);
  });
});

// ── Status ──
router.get('/status', (req, res) => {
  if (!checkAdmin(req, res)) return;
  res.json({ lastRun });
});

// ── The main pipeline ──
async function runPipeline({ maxPerFeed = 3, maxAge = 24, maxArticles = 5, dryRun = false } = {}) {
  if (isRunning) return;
  isRunning = true;

  lastRun = {
    status: 'running',
    startedAt: Date.now(),
    completedAt: null,
    articlesFound: 0,
    articlesNew: 0,
    articlesTranslated: 0,
    articlesPublished: 0,
    errors: [],
  };

  try {
    // Step 1: Crawl
    console.log('[newsAgent] Step 1/3: Crawling news feeds...');
    const crawled = await crawlNews({ maxPerFeed, maxAge });
    lastRun.articlesFound = crawled.length;

    if (crawled.length === 0) {
      lastRun.status = 'completed';
      lastRun.completedAt = Date.now();
      console.log('[newsAgent] No articles found. Done.');
      isRunning = false;
      return;
    }

    // Step 2: Deduplicate
    console.log('[newsAgent] Step 2/3: Deduplicating...');
    const existing = await loadNews();
    let newArticles = deduplicateArticles(crawled, existing);
    lastRun.articlesNew = newArticles.length;

    if (newArticles.length === 0) {
      lastRun.status = 'completed';
      lastRun.completedAt = Date.now();
      console.log('[newsAgent] All articles already exist. Done.');
      isRunning = false;
      return;
    }

    // Limit articles per run to control API costs
    newArticles = newArticles.slice(0, maxArticles);

    // Step 3: Translate to Garhwali
    console.log(`[newsAgent] Step 3/3: Translating ${newArticles.length} articles to Garhwali...`);
    const translated = await translateBatch(newArticles, 2);
    lastRun.articlesTranslated = translated.length;

    if (translated.length === 0) {
      lastRun.status = 'completed';
      lastRun.completedAt = Date.now();
      console.log('[newsAgent] Translation failed for all articles. Done.');
      isRunning = false;
      return;
    }

    if (dryRun) {
      lastRun.status = 'completed';
      lastRun.completedAt = Date.now();
      lastRun.articlesPublished = 0;
      console.log(`[newsAgent] Dry run — ${translated.length} articles translated but not published.`);
      // Attach translated articles to lastRun for inspection
      lastRun.preview = translated;
      isRunning = false;
      return;
    }

    // Step 4: Publish to CMS
    console.log(`[newsAgent] Publishing ${translated.length} articles...`);
    const articles = await loadNews();
    let published = 0;

    for (const t of translated) {
      const article = {
        id: Date.now() + published, // ensure unique IDs
        title: t.title,
        summary: t.summary,
        body: buildArticleBody(t),
        category: t.category || 'uttarakhand',
        imageUrl: '',
        createdAt: Date.now(),
        autoGenerated: true,
        source: t.source,
        sourceUrl: t.sourceUrl,
      };

      articles.unshift(article);
      published++;

      // Send push notification for each article
      sendNotificationToAll({
        title: article.title.slice(0, 80),
        body: (article.summary || article.body).slice(0, 160),
        url: '/news',
        tag: `news-${article.id}`,
        icon: '/icons/icon-192-v2.png',
      }).catch((e) => console.error('[newsAgent] push error:', e.message));
    }

    // Trim to max and save
    if (articles.length > MAX_NEWS) articles.length = MAX_NEWS;
    await saveNewsDirectly(articles);

    lastRun.articlesPublished = published;
    lastRun.status = 'completed';
    lastRun.completedAt = Date.now();
    console.log(`[newsAgent] Done! Published ${published} Garhwali news articles.`);
  } catch (err) {
    console.error('[newsAgent] Pipeline error:', err);
    lastRun.status = 'error';
    lastRun.completedAt = Date.now();
    lastRun.errors.push(err.message);
  } finally {
    isRunning = false;
  }
}

// ── Helpers ──

function buildArticleBody(translated) {
  let body = translated.body;
  // Add source attribution at the bottom
  if (translated.source) {
    body += `\n\n---\n📰 स्रोत: ${translated.source}`;
    if (translated.sourceUrl) {
      body += ` | [मूल लेख](${translated.sourceUrl})`;
    }
  }
  if (translated.originalLang) {
    body += `\n🤖 यू लेख AI द्वारा ${translated.originalLang === 'hi' ? 'हिंदी' : 'अंग्रेजी'} सी गढ़वळि मा अनुवाद कर्युं गयुं छ।`;
  }
  return body;
}

// Direct save to Redis (bypasses the news route's internal state)
let memNews = [];
async function saveNewsDirectly(list) {
  memNews = list;
  if (isRedisEnabled()) {
    await redisSetJSON(REDIS_KEY, list, 365 * 24 * 3600);
  }
}

// ── Optional: internal cron (disabled by default) ──
// Set NEWS_AGENT_CRON_HOURS env var to enable (e.g. "6" for every 6 hours).
const cronHours = parseInt(process.env.NEWS_AGENT_CRON_HOURS, 10);
if (cronHours > 0) {
  const intervalMs = cronHours * 60 * 60 * 1000;
  console.log(`[newsAgent] Auto-run enabled: every ${cronHours}h`);
  setInterval(() => {
    console.log('[newsAgent] Cron triggered');
    runPipeline({ maxPerFeed: 3, maxAge: cronHours + 1, maxArticles: 5 }).catch((err) => {
      console.error('[newsAgent] Cron error:', err);
    });
  }, intervalMs);

  // Also run once on startup (delayed by 30s to let the server warm up)
  setTimeout(() => {
    console.log('[newsAgent] Initial run on startup');
    runPipeline({ maxPerFeed: 3, maxAge: 24, maxArticles: 5 }).catch((err) => {
      console.error('[newsAgent] Startup run error:', err);
    });
  }, 30_000);
}

module.exports = router;
module.exports.runPipeline = runPipeline;
