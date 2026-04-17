const NodeCache = require('node-cache');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Cache results for 6 hours to save API quota (free tier = 10,000 units/day)
const cache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 });

// Fallback cache that never expires — stores last good response
const fallbackCache = new NodeCache({ stdTTL: 0 });

// Static fallback data when API quota is exhausted and no cache exists (real YouTube video IDs)
const STATIC_FALLBACK = {
  movies: {
    videos: [
      { id: 'C9nIvvYgAzM', title: 'Kaara Ek Pratha - Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/C9nIvvYgAzM/hqdefault.jpg', channelTitle: 'Maa Shakti Pictures', publishedAt: '2025-11-01', description: '' },
      { id: 'NnwxXCvUXvc', title: 'KHIDKI - New Garhwali Film 2025', thumbnail: 'https://i.ytimg.com/vi/NnwxXCvUXvc/hqdefault.jpg', channelTitle: 'DHOL DAMAU PRODUCTION', publishedAt: '2025-11-01', description: '' },
      { id: 'Llq2DMjt4F8', title: 'Dagdiya - Full Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/Llq2DMjt4F8/hqdefault.jpg', channelTitle: 'T-Series Regional', publishedAt: '2018-01-01', description: '' },
      { id: 'USCMiLfED74', title: 'Garh-Kumau - Sanju Silodi Full Movie', thumbnail: 'https://i.ytimg.com/vi/USCMiLfED74/hqdefault.jpg', channelTitle: 'Mashakbeen', publishedAt: '2025-07-01', description: '' },
      { id: 'LUJQEFCFREc', title: 'CHAKRACHAAL - Full Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/LUJQEFCFREc/hqdefault.jpg', channelTitle: 'T-Series Regional', publishedAt: '2024-01-01', description: '' },
      { id: 'tRmYwuNYuqc', title: 'Mansa - Full Garhwali Movie', thumbnail: 'https://i.ytimg.com/vi/tRmYwuNYuqc/hqdefault.jpg', channelTitle: 'Anil Bisht Entertainment', publishedAt: '2023-01-01', description: '' },
      { id: 'td1dcJ4sHj0', title: 'Khairi Ka Din - Garhwali Movie', thumbnail: 'https://i.ytimg.com/vi/td1dcJ4sHj0/hqdefault.jpg', channelTitle: 'Hardik Films', publishedAt: '2023-01-01', description: '' },
      { id: 'yKKqzbgC6ig', title: 'Padhani Ji - Ghanna Bhai Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/yKKqzbgC6ig/hqdefault.jpg', channelTitle: 'Hardik Films', publishedAt: '2025-01-01', description: '' },
      { id: 'dZqeBpm1mvo', title: 'Meru Gaon - Garhwali Movie 2024', thumbnail: 'https://i.ytimg.com/vi/dZqeBpm1mvo/hqdefault.jpg', channelTitle: 'PR Films Production', publishedAt: '2025-01-01', description: '' },
      { id: 'VomJCXGB6FQ', title: 'Kamli - Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/VomJCXGB6FQ/hqdefault.jpg', channelTitle: 'Garhwal-Kumaon Films', publishedAt: '2025-01-01', description: '' },
      { id: 'akHxHJ70fIo', title: 'Anjwaal - Garhwali Film HD', thumbnail: 'https://i.ytimg.com/vi/akHxHJ70fIo/hqdefault.jpg', channelTitle: 'Venus Movies Regional', publishedAt: '2020-01-01', description: '' },
      { id: 'unLGJY3SNC8', title: 'GHARJAWAIN - Comedy Garhwali Movie', thumbnail: 'https://i.ytimg.com/vi/unLGJY3SNC8/hqdefault.jpg', channelTitle: 'Saroj Rawat', publishedAt: '2023-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  songs: {
    videos: [
      { id: 'Sfd5X--L9Zc', title: 'Jiya Kori Kori Khando - Kishan Mahipal', thumbnail: 'https://i.ytimg.com/vi/Sfd5X--L9Zc/hqdefault.jpg', channelTitle: 'Mashakbeen', publishedAt: '2025-11-01', description: '' },
      { id: 'sjiphyYu07k', title: 'Pahadon Ko Raibasi - Saurav Maithani', thumbnail: 'https://i.ytimg.com/vi/sjiphyYu07k/hqdefault.jpg', channelTitle: 'U K Films Studio', publishedAt: '2024-01-01', description: '' },
      { id: 'QcCbvhyLO5s', title: 'Aachhri - Darshan Farswan', thumbnail: 'https://i.ytimg.com/vi/QcCbvhyLO5s/hqdefault.jpg', channelTitle: 'Ularya Lok Dhun', publishedAt: '2025-01-01', description: '' },
      { id: 'GmJqs8hKl_0', title: 'Otuwa Belena - Vivek Nautiyal', thumbnail: 'https://i.ytimg.com/vi/GmJqs8hKl_0/hqdefault.jpg', channelTitle: 'Ularya Lok Dhun', publishedAt: '2024-01-01', description: '' },
      { id: '5_sKFz9rVBw', title: 'Aankhyon Ka Baan Na Chalo - Meena Rana', thumbnail: 'https://i.ytimg.com/vi/5_sKFz9rVBw/hqdefault.jpg', channelTitle: 'VNV Records', publishedAt: '2025-01-01', description: '' },
      { id: '0SSQTx3CDng', title: 'Nug Badiya - New Kumaoni Song 2025', thumbnail: 'https://i.ytimg.com/vi/0SSQTx3CDng/hqdefault.jpg', channelTitle: 'Dhun Pahadi Production', publishedAt: '2025-07-01', description: '' },
      { id: '9nXkXT-LUIM', title: 'Sachhi Bonu Choo - Saurav Maithani', thumbnail: 'https://i.ytimg.com/vi/9nXkXT-LUIM/hqdefault.jpg', channelTitle: 'Himalayan Pulse', publishedAt: '2025-11-01', description: '' },
      { id: 'buwwqUUcmSg', title: 'Surma Pyari - New Garhwali Song', thumbnail: 'https://i.ytimg.com/vi/buwwqUUcmSg/hqdefault.jpg', channelTitle: 'Himalayan Films', publishedAt: '2025-01-01', description: '' },
      { id: 'm87rbITU1No', title: 'Ghas Kati - Priyanka Meher', thumbnail: 'https://i.ytimg.com/vi/m87rbITU1No/hqdefault.jpg', channelTitle: 'Priyanka Meher', publishedAt: '2026-03-01', description: '' },
      { id: 'vuPPC-MRLjM', title: 'Kan Bhalo Kumoun Gadwal - N S Negi', thumbnail: 'https://i.ytimg.com/vi/vuPPC-MRLjM/hqdefault.jpg', channelTitle: 'Himadri Films', publishedAt: '2026-01-01', description: '' },
      { id: 'A1HSWP_Q0sM', title: 'Hamara Bara Ma - Vivek Nautiyal', thumbnail: 'https://i.ytimg.com/vi/A1HSWP_Q0sM/hqdefault.jpg', channelTitle: 'Himalayan Music Company', publishedAt: '2026-03-01', description: '' },
      { id: 'P77HXhI2gI8', title: 'Takk Lage Ki - Shweta Mahara', thumbnail: 'https://i.ytimg.com/vi/P77HXhI2gI8/hqdefault.jpg', channelTitle: 'Mashakbeen', publishedAt: '2026-03-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  comedy: {
    videos: [
      { id: 'uQiN-ADzRk0', title: 'Polya Tea Stall - Ghananand Comedy', thumbnail: 'https://i.ytimg.com/vi/uQiN-ADzRk0/hqdefault.jpg', channelTitle: 'Chanda Pahadi', publishedAt: '2021-01-01', description: '' },
      { id: 'pAnIA_Vfp-E', title: 'Kajyaan - Garhwali Comedy Film', thumbnail: 'https://i.ytimg.com/vi/pAnIA_Vfp-E/hqdefault.jpg', channelTitle: 'Uttarakhandi Kalakaar UK13', publishedAt: '2022-01-01', description: '' },
      { id: 'Izdxaz5CSgA', title: 'Aadmi Ki Jubaan - Garhwali Comedy', thumbnail: 'https://i.ytimg.com/vi/Izdxaz5CSgA/hqdefault.jpg', channelTitle: 'Uttarakhand Bati Rant-Raibaar', publishedAt: '2022-01-01', description: '' },
      { id: 'qb9TQE4aojI', title: 'Honest Pahadi - Garhwali Comedy', thumbnail: 'https://i.ytimg.com/vi/qb9TQE4aojI/hqdefault.jpg', channelTitle: 'Uttarakhand Bati Rant-Raibaar', publishedAt: '2022-01-01', description: '' },
      { id: 'dS68b3VmEBo', title: 'Polya Ki Shop - Ghanna Bhai Comedy', thumbnail: 'https://i.ytimg.com/vi/dS68b3VmEBo/hqdefault.jpg', channelTitle: 'Pahadi Sonotek', publishedAt: '2026-01-01', description: '' },
      { id: 'unLGJY3SNC8', title: 'GHARJAWAIN - Comedy Garhwali Movie', thumbnail: 'https://i.ytimg.com/vi/unLGJY3SNC8/hqdefault.jpg', channelTitle: 'Saroj Rawat', publishedAt: '2023-01-01', description: '' },
      { id: '5_7DCeaTjlc', title: 'Educated Officer - Garhwali Comedy', thumbnail: 'https://i.ytimg.com/vi/5_7DCeaTjlc/hqdefault.jpg', channelTitle: 'Uttarakhand Bati Rant-Raibaar', publishedAt: '2022-01-01', description: '' },
      { id: 'kLjGQQX7V1M', title: 'Boda Ji Ne Toh Had Kar Di - Comedy', thumbnail: 'https://i.ytimg.com/vi/kLjGQQX7V1M/hqdefault.jpg', channelTitle: 'Uttarakhand Bati Rant-Raibaar', publishedAt: '2022-01-01', description: '' },
      { id: 'mxC1lw5yJZI', title: 'Boda Ji Aur Bahadur - Comedy', thumbnail: 'https://i.ytimg.com/vi/mxC1lw5yJZI/hqdefault.jpg', channelTitle: 'Kathait Production', publishedAt: '2024-01-01', description: '' },
      { id: 'Xrm8M5NNnUY', title: 'Boda Bodi Se Pareshan - Comedy Film', thumbnail: 'https://i.ytimg.com/vi/Xrm8M5NNnUY/hqdefault.jpg', channelTitle: 'Official Soni', publishedAt: '2024-01-01', description: '' },
      { id: 'rK3U_z8BmWc', title: 'Galdaar - Husband Wife Comedy', thumbnail: 'https://i.ytimg.com/vi/rK3U_z8BmWc/hqdefault.jpg', channelTitle: 'Rajeev vlog', publishedAt: '2025-01-01', description: '' },
      { id: '4tsOHNHSRlY', title: 'Nachad Buari Nakhra - Garhwali Comedy', thumbnail: 'https://i.ytimg.com/vi/4tsOHNHSRlY/hqdefault.jpg', channelTitle: 'Uttarakhand Bati Rant-Raibaar', publishedAt: '2025-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  devotional: {
    videos: [
      { id: 'yru_nPYlKzc', title: 'Jai Bhole - Garhwali Bhajan', thumbnail: 'https://i.ytimg.com/vi/yru_nPYlKzc/hqdefault.jpg', channelTitle: 'Hema Negi Karasi Official', publishedAt: '2021-01-01', description: '' },
      { id: 'TK8uvD-MDkE', title: 'Hey Nanda - Darshan Farswan Bhajan', thumbnail: 'https://i.ytimg.com/vi/TK8uvD-MDkE/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2022-01-01', description: '' },
      { id: 'nIhzDJGUL1o', title: 'Trijugi Narayan - N S Negi Bhakti Song', thumbnail: 'https://i.ytimg.com/vi/nIhzDJGUL1o/hqdefault.jpg', channelTitle: 'Himalayan Films', publishedAt: '2017-01-01', description: '' },
      { id: 'fWN62nVqA84', title: 'Jai Badri Vishal - Kishan Mahipal', thumbnail: 'https://i.ytimg.com/vi/fWN62nVqA84/hqdefault.jpg', channelTitle: 'Kishan Mahipal', publishedAt: '2021-01-01', description: '' },
      { id: 'TY-Z0z8BByU', title: 'Maa Uncha Pahado Ma Tu Rehndi', thumbnail: 'https://i.ytimg.com/vi/TY-Z0z8BByU/hqdefault.jpg', channelTitle: 'Poonam Nautiyal', publishedAt: '2021-01-01', description: '' },
      { id: 'IqxxQTrOX34', title: 'Nonstop Garhwali Bhajan Jagar Stuti', thumbnail: 'https://i.ytimg.com/vi/IqxxQTrOX34/hqdefault.jpg', channelTitle: 'Music On Beats', publishedAt: '2020-01-01', description: '' },
      { id: 'gZwu3Bt1qcw', title: 'Hey Bhagwati Nanda - Meena Rana', thumbnail: 'https://i.ytimg.com/vi/gZwu3Bt1qcw/hqdefault.jpg', channelTitle: 'T-Series Bhakti Sagar', publishedAt: '2018-01-01', description: '' },
      { id: 'rI-Brj8MNlY', title: 'Hanumant Balbeera - Anil Bisht Bhajan', thumbnail: 'https://i.ytimg.com/vi/rI-Brj8MNlY/hqdefault.jpg', channelTitle: 'Anil Bisht Entertainment', publishedAt: '2018-01-01', description: '' },
      { id: 'bvAde-FeS-I', title: 'Nanda Bhawani - Darshan Farswan', thumbnail: 'https://i.ytimg.com/vi/bvAde-FeS-I/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2025-01-01', description: '' },
      { id: 'LfDf36A5nqU', title: 'Maa Ka Mandir - Garhwali Bhajan 2025', thumbnail: 'https://i.ytimg.com/vi/LfDf36A5nqU/hqdefault.jpg', channelTitle: 'Bhagirathi Films', publishedAt: '2025-10-01', description: '' },
      { id: 'KfFr57C5zMs', title: 'Meri Mathiyana Ma - Saurav Maithani', thumbnail: 'https://i.ytimg.com/vi/KfFr57C5zMs/hqdefault.jpg', channelTitle: 'Pahadi Dagdya Productions', publishedAt: '2018-01-01', description: '' },
      { id: 'YKAMHc98SEg', title: 'Hey Mohana - Krishna Jagar', thumbnail: 'https://i.ytimg.com/vi/YKAMHc98SEg/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2025-08-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  trending: {
    videos: [
      { id: 'Sfd5X--L9Zc', title: 'Jiya Kori Kori Khando - 20M Views', thumbnail: 'https://i.ytimg.com/vi/Sfd5X--L9Zc/hqdefault.jpg', channelTitle: 'Mashakbeen', publishedAt: '2025-11-01', description: '' },
      { id: 'sjiphyYu07k', title: 'Pahadon Ko Raibasi - 21M Views', thumbnail: 'https://i.ytimg.com/vi/sjiphyYu07k/hqdefault.jpg', channelTitle: 'U K Films Studio', publishedAt: '2024-01-01', description: '' },
      { id: 'C9nIvvYgAzM', title: 'Kaara Ek Pratha - Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/C9nIvvYgAzM/hqdefault.jpg', channelTitle: 'Maa Shakti Pictures', publishedAt: '2025-11-01', description: '' },
      { id: 'uQiN-ADzRk0', title: 'Polya Tea Stall - 1.7M Views', thumbnail: 'https://i.ytimg.com/vi/uQiN-ADzRk0/hqdefault.jpg', channelTitle: 'Chanda Pahadi', publishedAt: '2021-01-01', description: '' },
      { id: 'yru_nPYlKzc', title: 'Jai Bhole Bhajan - 33M Views', thumbnail: 'https://i.ytimg.com/vi/yru_nPYlKzc/hqdefault.jpg', channelTitle: 'Hema Negi Karasi', publishedAt: '2021-01-01', description: '' },
      { id: 'm87rbITU1No', title: 'Ghas Kati - Priyanka Meher', thumbnail: 'https://i.ytimg.com/vi/m87rbITU1No/hqdefault.jpg', channelTitle: 'Priyanka Meher', publishedAt: '2026-03-01', description: '' },
      { id: 'dS68b3VmEBo', title: 'Polya Ki Shop - Ghanna Bhai Comedy', thumbnail: 'https://i.ytimg.com/vi/dS68b3VmEBo/hqdefault.jpg', channelTitle: 'Pahadi Sonotek', publishedAt: '2026-01-01', description: '' },
      { id: 'A1HSWP_Q0sM', title: 'Hamara Bara Ma - Garhwali Song 2026', thumbnail: 'https://i.ytimg.com/vi/A1HSWP_Q0sM/hqdefault.jpg', channelTitle: 'Himalayan Music Company', publishedAt: '2026-03-01', description: '' },
      { id: 'TK8uvD-MDkE', title: 'Hey Nanda Devi Bhajan - 21M Views', thumbnail: 'https://i.ytimg.com/vi/TK8uvD-MDkE/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2022-01-01', description: '' },
      { id: '0SSQTx3CDng', title: 'Nug Badiya - 16M Views', thumbnail: 'https://i.ytimg.com/vi/0SSQTx3CDng/hqdefault.jpg', channelTitle: 'Dhun Pahadi Production', publishedAt: '2025-07-01', description: '' },
      { id: 'GmJqs8hKl_0', title: 'Otuwa Belena - 12M Views', thumbnail: 'https://i.ytimg.com/vi/GmJqs8hKl_0/hqdefault.jpg', channelTitle: 'Ularya Lok Dhun', publishedAt: '2024-01-01', description: '' },
      { id: 'VomJCXGB6FQ', title: 'Kamli - Garhwali Film', thumbnail: 'https://i.ytimg.com/vi/VomJCXGB6FQ/hqdefault.jpg', channelTitle: 'Garhwal-Kumaon Films', publishedAt: '2025-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  blogs: {
    videos: [
      { id: 'qzN7UY4D8VQ', title: 'Most Beautiful Villages of Uttarakhand - Harsil Valley', thumbnail: 'https://i.ytimg.com/vi/qzN7UY4D8VQ/hqdefault.jpg', channelTitle: 'Kanishk Gupta', publishedAt: '2024-01-01', description: '' },
      { id: 'WFBhML-rb3o', title: 'Pahadi Shadi Mein Dance - Sourav Joshi', thumbnail: 'https://i.ytimg.com/vi/WFBhML-rb3o/hqdefault.jpg', channelTitle: 'Sourav Joshi Vlogs', publishedAt: '2022-01-01', description: '' },
      { id: 'sGGp-wsrCcs', title: 'Swala Village - No Entry After Sunset', thumbnail: 'https://i.ytimg.com/vi/sGGp-wsrCcs/hqdefault.jpg', channelTitle: 'Avin Yaduvanshi', publishedAt: '2022-01-01', description: '' },
      { id: 'nxqQQna7vC4', title: 'Last Village of Kedarghati - Toshi Village', thumbnail: 'https://i.ytimg.com/vi/nxqQQna7vC4/hqdefault.jpg', channelTitle: 'Priyanka Yogi Tiwari', publishedAt: '2023-01-01', description: '' },
      { id: 'Ngl-mSXCTEA', title: 'Pahadi Special Lunch - Chaunsa Bhat', thumbnail: 'https://i.ytimg.com/vi/Ngl-mSXCTEA/hqdefault.jpg', channelTitle: 'Priyanka Yogi Tiwari', publishedAt: '2023-01-01', description: '' },
      { id: '_vTqm43jS50', title: 'Pahadi Khane Ke Maze - Village Food', thumbnail: 'https://i.ytimg.com/vi/_vTqm43jS50/hqdefault.jpg', channelTitle: 'Sourav Joshi Vlogs', publishedAt: '2021-01-01', description: '' },
      { id: 'cCZqFAU9wDc', title: 'Uttarakhand Forest Village Life Vlog', thumbnail: 'https://i.ytimg.com/vi/cCZqFAU9wDc/hqdefault.jpg', channelTitle: 'Vipin Gusain Vlogs', publishedAt: '2022-01-01', description: '' },
      { id: '-tENpE6BRZo', title: 'Pahadi Hara Saag - Village Food Recipe', thumbnail: 'https://i.ytimg.com/vi/-tENpE6BRZo/hqdefault.jpg', channelTitle: 'R.T.K Vlogs', publishedAt: '2025-01-01', description: '' },
      { id: '8IXXmrkNLbQ', title: 'Snowfall In My Village - Cool Pahadi', thumbnail: 'https://i.ytimg.com/vi/8IXXmrkNLbQ/hqdefault.jpg', channelTitle: 'Cool Pahadi', publishedAt: '2022-01-01', description: '' },
      { id: 'aZniIqvpGPs', title: 'Rainy Season Life In Pahad - Cool Pahadi', thumbnail: 'https://i.ytimg.com/vi/aZniIqvpGPs/hqdefault.jpg', channelTitle: 'Cool Pahadi', publishedAt: '2025-07-01', description: '' },
      { id: 'D_unLfP2tkQ', title: 'Harsil Valley Bagori Village Tour', thumbnail: 'https://i.ytimg.com/vi/D_unLfP2tkQ/hqdefault.jpg', channelTitle: 'Nomadic Bird Uk07', publishedAt: '2025-08-01', description: '' },
      { id: 'KWULnIPM5XM', title: 'New Hotel Yogi Kitchen & Dining Tour', thumbnail: 'https://i.ytimg.com/vi/KWULnIPM5XM/hqdefault.jpg', channelTitle: 'Priyanka Yogi Tiwari', publishedAt: '2025-10-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
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
  blogs: 'Pahadi vlogger uttarakhand village life OR pahadi lifestyle vlog',
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
