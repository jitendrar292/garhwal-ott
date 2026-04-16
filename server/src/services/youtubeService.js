const NodeCache = require('node-cache');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Cache results for 6 hours to save API quota (free tier = 10,000 units/day)
const cache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 });

// Fallback cache that never expires — stores last good response
const fallbackCache = new NodeCache({ stdTTL: 0 });

// Static fallback data when API quota is exhausted and no cache exists
const STATIC_FALLBACK = {
  movies: {
    videos: [
      { id: 'QY3LsR_B5rM', title: 'Garhwali Full Movie - Chakrachal', thumbnail: 'https://i.ytimg.com/vi/QY3LsR_B5rM/hqdefault.jpg', channelTitle: 'Garhwali Movies', publishedAt: '2024-01-01', description: '' },
      { id: 'xkJZSKO2x_E', title: 'Pahadi Movie - Meri Bassai', thumbnail: 'https://i.ytimg.com/vi/xkJZSKO2x_E/hqdefault.jpg', channelTitle: 'Pahadi Films', publishedAt: '2024-01-01', description: '' },
      { id: 'dK9G5xPtgTk', title: 'Garhwali Film - Gajya Gooru', thumbnail: 'https://i.ytimg.com/vi/dK9G5xPtgTk/hqdefault.jpg', channelTitle: 'Garhwali Cinema', publishedAt: '2024-01-01', description: '' },
      { id: 'LWJzMsYyR-0', title: 'Uttarakhandi Movie - Jagar', thumbnail: 'https://i.ytimg.com/vi/LWJzMsYyR-0/hqdefault.jpg', channelTitle: 'UK Films', publishedAt: '2024-01-01', description: '' },
      { id: 'y8E85M-_mCU', title: 'New Garhwali Movie 2024', thumbnail: 'https://i.ytimg.com/vi/y8E85M-_mCU/hqdefault.jpg', channelTitle: 'Garhwali Movies', publishedAt: '2024-01-01', description: '' },
      { id: 'kLKtJlqxLHE', title: 'Garhwali Film - Sauras', thumbnail: 'https://i.ytimg.com/vi/kLKtJlqxLHE/hqdefault.jpg', channelTitle: 'Pahadi Cinema', publishedAt: '2024-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 6,
  },
  songs: {
    videos: [
      { id: 'eWL8gLW-6gE', title: 'Latest Garhwali Song 2024', thumbnail: 'https://i.ytimg.com/vi/eWL8gLW-6gE/hqdefault.jpg', channelTitle: 'Pahadi Songs', publishedAt: '2024-01-01', description: '' },
      { id: 'KfJd1T5SQhc', title: 'Superhit Garhwali DJ Song', thumbnail: 'https://i.ytimg.com/vi/KfJd1T5SQhc/hqdefault.jpg', channelTitle: 'Garhwali Hits', publishedAt: '2024-01-01', description: '' },
      { id: 'ZzQx0k2jFCA', title: 'Pahadi Love Song - Meri Maya', thumbnail: 'https://i.ytimg.com/vi/ZzQx0k2jFCA/hqdefault.jpg', channelTitle: 'Pahadi Music', publishedAt: '2024-01-01', description: '' },
      { id: '5bKHCVjpaGE', title: 'Garhwali Folk Song - Chaita Ki Chaitwal', thumbnail: 'https://i.ytimg.com/vi/5bKHCVjpaGE/hqdefault.jpg', channelTitle: 'Folk Music UK', publishedAt: '2024-01-01', description: '' },
      { id: 'v3hNm-mTpPQ', title: 'Trending Pahadi Song 2024', thumbnail: 'https://i.ytimg.com/vi/v3hNm-mTpPQ/hqdefault.jpg', channelTitle: 'Pahadi Hits', publishedAt: '2024-01-01', description: '' },
      { id: 'aE2j-FMQH5I', title: 'New Kumaoni Garhwali Song', thumbnail: 'https://i.ytimg.com/vi/aE2j-FMQH5I/hqdefault.jpg', channelTitle: 'UK Music', publishedAt: '2024-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 6,
  },
  comedy: {
    videos: [
      { id: 'pBOxTjb-sRA', title: 'Garhwali Comedy - Funny Pahadi', thumbnail: 'https://i.ytimg.com/vi/pBOxTjb-sRA/hqdefault.jpg', channelTitle: 'Pahadi Comedy', publishedAt: '2024-01-01', description: '' },
      { id: 'LiGEb-2K3iY', title: 'Best Uttarakhandi Comedy', thumbnail: 'https://i.ytimg.com/vi/LiGEb-2K3iY/hqdefault.jpg', channelTitle: 'UK Comedy', publishedAt: '2024-01-01', description: '' },
      { id: 'J9VBM4rZBWA', title: 'Garhwali Hasya - Village Comedy', thumbnail: 'https://i.ytimg.com/vi/J9VBM4rZBWA/hqdefault.jpg', channelTitle: 'Garhwali Fun', publishedAt: '2024-01-01', description: '' },
      { id: 'W6bDVDFpN24', title: 'Pahadi Comedy Show 2024', thumbnail: 'https://i.ytimg.com/vi/W6bDVDFpN24/hqdefault.jpg', channelTitle: 'Pahadi Laughs', publishedAt: '2024-01-01', description: '' },
      { id: 'TS-SIkFNuVA', title: 'Funny Garhwali Skit', thumbnail: 'https://i.ytimg.com/vi/TS-SIkFNuVA/hqdefault.jpg', channelTitle: 'UK Comedy', publishedAt: '2024-01-01', description: '' },
      { id: 'gh-S7F2bBOg', title: 'Hilarious Pahadi Video', thumbnail: 'https://i.ytimg.com/vi/gh-S7F2bBOg/hqdefault.jpg', channelTitle: 'Pahadi Fun', publishedAt: '2024-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 6,
  },
  devotional: {
    videos: [
      { id: '1x0-E2F8AnE', title: 'Garhwali Bhajan - Jai Badrinath', thumbnail: 'https://i.ytimg.com/vi/1x0-E2F8AnE/hqdefault.jpg', channelTitle: 'Pahadi Bhajan', publishedAt: '2024-01-01', description: '' },
      { id: 'q3DfWFkHJRk', title: 'Kedarnath Bhajan - Bhole Baba', thumbnail: 'https://i.ytimg.com/vi/q3DfWFkHJRk/hqdefault.jpg', channelTitle: 'Devotional UK', publishedAt: '2024-01-01', description: '' },
      { id: 'F-HE7VQk7eU', title: 'Nanda Devi Bhajan', thumbnail: 'https://i.ytimg.com/vi/F-HE7VQk7eU/hqdefault.jpg', channelTitle: 'Garhwali Bhajan', publishedAt: '2024-01-01', description: '' },
      { id: 'RYV-EN5cXU0', title: 'Uttarakhandi Devotional Song', thumbnail: 'https://i.ytimg.com/vi/RYV-EN5cXU0/hqdefault.jpg', channelTitle: 'UK Bhajan', publishedAt: '2024-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 4,
  },
  trending: {
    videos: [
      { id: 'eWL8gLW-6gE', title: 'Trending Garhwali Hit 2024', thumbnail: 'https://i.ytimg.com/vi/eWL8gLW-6gE/hqdefault.jpg', channelTitle: 'Pahadi Hits', publishedAt: '2024-01-01', description: '' },
      { id: 'pBOxTjb-sRA', title: 'Viral Pahadi Comedy', thumbnail: 'https://i.ytimg.com/vi/pBOxTjb-sRA/hqdefault.jpg', channelTitle: 'Pahadi Comedy', publishedAt: '2024-01-01', description: '' },
      { id: 'KfJd1T5SQhc', title: 'Garhwali DJ Song - Trending', thumbnail: 'https://i.ytimg.com/vi/KfJd1T5SQhc/hqdefault.jpg', channelTitle: 'Garhwali Hits', publishedAt: '2024-01-01', description: '' },
      { id: 'QY3LsR_B5rM', title: 'Most Watched Garhwali Movie', thumbnail: 'https://i.ytimg.com/vi/QY3LsR_B5rM/hqdefault.jpg', channelTitle: 'Garhwali Movies', publishedAt: '2024-01-01', description: '' },
      { id: 'ZzQx0k2jFCA', title: 'Hit Pahadi Love Song', thumbnail: 'https://i.ytimg.com/vi/ZzQx0k2jFCA/hqdefault.jpg', channelTitle: 'Pahadi Music', publishedAt: '2024-01-01', description: '' },
      { id: 'LiGEb-2K3iY', title: 'Trending Uttarakhandi Video', thumbnail: 'https://i.ytimg.com/vi/LiGEb-2K3iY/hqdefault.jpg', channelTitle: 'UK Trending', publishedAt: '2024-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 6,
  },
};

function getStaticFallback(category) {
  return STATIC_FALLBACK[category] || { videos: [], nextPageToken: null, prevPageToken: null, totalResults: 0 };
}

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
    // Return static fallback for songs-related search queries
    if (err.message === 'QUOTA_EXCEEDED') {
      console.log('Serving static fallback for search:', query);
      return getStaticFallback('songs');
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
    // Use static fallback data when quota is exceeded
    if (err.message === 'QUOTA_EXCEEDED') {
      console.log('Serving static fallback for category:', category);
      return getStaticFallback(category);
    }
    throw err;
  }
}

module.exports = { searchVideos, getVideosByCategory };
