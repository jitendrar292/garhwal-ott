const NodeCache = require('node-cache');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Cache results for 6 hours to save API quota (free tier = 10,000 units/day)
const cache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 });

// Fallback cache that never expires — stores last good response
const fallbackCache = new NodeCache({ stdTTL: 0 });

const CATEGORY_QUERIES = {
  movies: 'Garhwali full movie',
  songs: 'Garhwali latest songs',
  comedy: 'Garhwali comedy',
  devotional: 'Garhwali devotional bhajan',
  trending: 'Garhwali trending songs OR comedy',
};

async function fetchFromYouTube(query, pageToken = '', maxResults = 12) {
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    throw new Error('YouTube API key is not configured');
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: String(Math.min(Math.max(maxResults, 1), 50)),
    key: API_KEY,
    videoEmbeddable: 'true',
    order: 'relevance',
  });

  if (pageToken) {
    params.set('pageToken', pageToken);
  }

  const url = `${YOUTUBE_API_BASE}/search?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('YouTube API error:', response.status, errorBody);

    // If quota exceeded (403), return fallback data
    if (response.status === 403) {
      throw new Error('QUOTA_EXCEEDED');
    }
    throw new Error(`YouTube API returned ${response.status}`);
  }

  const data = await response.json();

  return {
    videos: (data.items || []).map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    })),
    nextPageToken: data.nextPageToken || null,
    prevPageToken: data.prevPageToken || null,
    totalResults: data.pageInfo?.totalResults || 0,
  };
}

async function searchVideos(query, pageToken = '', maxResults = 12) {
  const cacheKey = `search:${query}:${pageToken}:${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const result = await fetchFromYouTube(query, pageToken, maxResults);
    cache.set(cacheKey, result);
    fallbackCache.set(cacheKey, result);
    return result;
  } catch (err) {
    // Return fallback data if quota exceeded
    const fallback = fallbackCache.get(cacheKey);
    if (fallback) {
      console.log('Serving fallback cache for:', cacheKey);
      return fallback;
    }
    throw err;
  }
}

async function getVideosByCategory(category, pageToken = '', maxResults = 12) {
  const query = CATEGORY_QUERIES[category];
  if (!query) throw new Error('Unknown category');

  const cacheKey = `category:${category}:${pageToken}:${maxResults}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const result = await fetchFromYouTube(query, pageToken, maxResults);
    cache.set(cacheKey, result);
    fallbackCache.set(cacheKey, result);
    return result;
  } catch (err) {
    const fallback = fallbackCache.get(cacheKey);
    if (fallback) {
      console.log('Serving fallback cache for:', cacheKey);
      return fallback;
    }
    throw err;
  }
}

module.exports = { searchVideos, getVideosByCategory };
