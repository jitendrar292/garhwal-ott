const NodeCache = require('node-cache');
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('./store');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const API_KEY = process.env.YOUTUBE_API_KEY;

// Cache results for 24 hours to save API quota (free tier = 10,000 units/day)
const cache = new NodeCache({ stdTTL: 86400, checkperiod: 3600 });

// Fallback cache that never expires — stores last good response
const fallbackCache = new NodeCache({ stdTTL: 0 });

// Redis (Upstash) long-term cache: survives server restarts and cold starts
// on Render's free tier. TTL matches the 24h refresh cycle.
const REDIS_TTL_SECONDS = 24 * 60 * 60;

// Long-term Redis mirror — kept for 30 days so we always have *something*
// fresh-ish to serve even after quota exhaustion + Redis 24h TTL expiry +
// server cold-start (where in-memory fallbackCache is empty).
const REDIS_LONGTERM_TTL_SECONDS = 30 * 24 * 60 * 60;
const longtermKey = (k) => `yt:lt:${k}`;

// Quota circuit breaker — once YouTube returns 403 quotaExceeded, skip the API
// entirely until the configured cooldown elapses. YouTube quota resets daily
// at midnight Pacific Time. We use a simpler 1-hour cooldown so the breaker
// self-heals in case it was a transient 403.
const QUOTA_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
let quotaCooldownUntil = 0;
const isQuotaCoolingDown = () => Date.now() < quotaCooldownUntil;
const tripQuotaBreaker = () => {
  quotaCooldownUntil = Date.now() + QUOTA_COOLDOWN_MS;
  console.warn(
    `[youtube] quota breaker tripped — skipping API until ${new Date(quotaCooldownUntil).toISOString()}`
  );
};

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
  vlogs: {
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
  podcast: {
    videos: [
      { id: 'VLcUVlBlbAM', title: 'धारी देवी बैंड | Dhari Devi Band | Baramasa', thumbnail: 'https://i.ytimg.com/vi/VLcUVlBlbAM/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-04-11', description: '' },
      { id: 'm6SU7fnLD5A', title: 'Bindukhatta - Story of Invisible Village | बिंदुखत्ता | Baramasa Documentary', thumbnail: 'https://i.ytimg.com/vi/m6SU7fnLD5A/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-03-25', description: '' },
      { id: 'lwoFXlrMLv4', title: 'एक बजट, एक रपट, बाक़ी चपट | Uttarakhand | Extra Cover | Baramasa', thumbnail: 'https://i.ytimg.com/vi/lwoFXlrMLv4/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-03-18', description: '' },
      { id: '44ow04YavTU', title: 'कुमाऊँ के इतिहास में छिपे दिग्गजों की कहानी | Dr. Ajay Rawat | Baramasa Podcast', thumbnail: 'https://i.ytimg.com/vi/44ow04YavTU/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-03-15', description: '' },
      { id: 'fNcQxaGwGPE', title: 'Reels में दिखने वाले इस खेल में कितना पैसा और रिस्क? | Baramasa', thumbnail: 'https://i.ytimg.com/vi/fNcQxaGwGPE/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-03-10', description: '' },
      { id: '9luD5DYf5hY', title: 'गैस की कमी से जूझ रहे Hotel-Dhaba संचालक | Ground Report | Baramasa', thumbnail: 'https://i.ytimg.com/vi/9luD5DYf5hY/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-04-08', description: '' },
      { id: 'C_mDE3R4sj8', title: 'उत्तराखंड के इस हिल स्टेशन पर विदेशी एंट्री बैन क्यों – SFF Connection | Ghughuti', thumbnail: 'https://i.ytimg.com/vi/C_mDE3R4sj8/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2026-04-09', description: '' },
      { id: 'LplITEHOkp4', title: 'उत्तराखंड में एक सिक्के पर गीत क्यों बना? छेदु डबल की पूरी कहानी | Ghughuti', thumbnail: 'https://i.ytimg.com/vi/LplITEHOkp4/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2026-03-26', description: '' },
      { id: 'SU_Mad6KRTY', title: 'पहाड़ की सबसे भावुक परंपरा भिटौली | Uttarakhand Culture | Ghughuti', thumbnail: 'https://i.ytimg.com/vi/SU_Mad6KRTY/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2026-03-20', description: '' },
      { id: 'okuEX3xw0jc', title: 'पहाड़ का अनसंग हीरो - तिब्बत से हिमालय की नदियों तक | Ghughuti', thumbnail: 'https://i.ytimg.com/vi/okuEX3xw0jc/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2026-03-18', description: '' },
      { id: '-ohyILEyBn0', title: 'किसने बनाया हिमालय का सबसे खतरनाक रास्ता? | Gartang Gali Uttarakhand | Ghughuti', thumbnail: 'https://i.ytimg.com/vi/-ohyILEyBn0/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2026-03-12', description: '' },
      { id: 'rWXhAytVsDc', title: 'Nobel Puraskar, Gitanjali, Rabindranath Tagore और Uttarakhand | Ghughuti', thumbnail: 'https://i.ytimg.com/vi/rWXhAytVsDc/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2025-11-17', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  shorts: {
    videos: [
      { id: 'spsGFAdr194', title: 'Swami Pardesh - Suraj Tratak | Trending Pahadi Song', thumbnail: 'https://i.ytimg.com/vi/spsGFAdr194/hqdefault.jpg', channelTitle: 'Suraj Tratak', publishedAt: '2025-09-01', description: '' },
      { id: 'epnU1SVc1eI', title: 'Jiya Kori Kori Khando - Dance Short', thumbnail: 'https://i.ytimg.com/vi/epnU1SVc1eI/hqdefault.jpg', channelTitle: 'Yatika Thapa', publishedAt: '2025-12-01', description: '' },
      { id: 'ZBgtkOPZ6Aw', title: 'Garhwali Song 2026 - DJ Mervin Rajan', thumbnail: 'https://i.ytimg.com/vi/ZBgtkOPZ6Aw/hqdefault.jpg', channelTitle: 'Mervin Rajan', publishedAt: '2026-03-01', description: '' },
      { id: 'DyLPbQTXqrg', title: 'Haye Heel - New Garhwali DJ Song 2026', thumbnail: 'https://i.ytimg.com/vi/DyLPbQTXqrg/hqdefault.jpg', channelTitle: 'Suryapal Shriwan', publishedAt: '2026-03-01', description: '' },
      { id: '41e1LWcx05Q', title: 'Byau Hamru Hoonu Ni - Garhwali 2026', thumbnail: 'https://i.ytimg.com/vi/41e1LWcx05Q/hqdefault.jpg', channelTitle: 'Unique Pahadi Official', publishedAt: '2025-12-01', description: '' },
      { id: 'oByLfo2eK_E', title: 'Pahadi Culture Short - Viral', thumbnail: 'https://i.ytimg.com/vi/oByLfo2eK_E/hqdefault.jpg', channelTitle: 'Rajat Kaprawan Official', publishedAt: '2024-01-01', description: '' },
      { id: '_VP56PvlX5A', title: 'Pahadi Dhol Short - Viral', thumbnail: 'https://i.ytimg.com/vi/_VP56PvlX5A/hqdefault.jpg', channelTitle: 'Oshin Bhandari Vlogs', publishedAt: '2023-01-01', description: '' },
      { id: 'BIV8BTgmVuc', title: 'Reel VS Real Life Pahadi - Neha Bisht', thumbnail: 'https://i.ytimg.com/vi/BIV8BTgmVuc/hqdefault.jpg', channelTitle: 'Neha Bisht', publishedAt: '2024-01-01', description: '' },
      { id: '0gtZkyEt-XA', title: 'Raadhaa - Pandavaas | Dance Performance', thumbnail: 'https://i.ytimg.com/vi/0gtZkyEt-XA/hqdefault.jpg', channelTitle: 'Himanshu Bahuguna', publishedAt: '2024-01-01', description: '' },
      { id: 'oECLUxQK-C0', title: 'Shokyani Kumaoni Dance Cover 2026', thumbnail: 'https://i.ytimg.com/vi/oECLUxQK-C0/hqdefault.jpg', channelTitle: 'Ashish Bora Pahadi Dance', publishedAt: '2026-03-01', description: '' },
      { id: 'GRdwrfJQ9wQ', title: 'Hariya Ghas Katli Kumaoni Song 2026', thumbnail: 'https://i.ytimg.com/vi/GRdwrfJQ9wQ/hqdefault.jpg', channelTitle: 'Prakash Kumar PK', publishedAt: '2026-03-01', description: '' },
      { id: 'xTJ5QCHC5sM', title: 'Surma Ki Dabbi - Arvind Raj Sunwal', thumbnail: 'https://i.ytimg.com/vi/xTJ5QCHC5sM/hqdefault.jpg', channelTitle: 'Pahadi Music Junction', publishedAt: '2026-04-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  reels: {
    videos: [
      { id: 'BIV8BTgmVuc', title: 'Reel VS Real Life Pahadi - Neha Bisht', thumbnail: 'https://i.ytimg.com/vi/BIV8BTgmVuc/hqdefault.jpg', channelTitle: 'Neha Bisht', publishedAt: '2024-01-01', description: '' },
      { id: 'oByLfo2eK_E', title: 'Pahadi Culture Reel - Viral 2026', thumbnail: 'https://i.ytimg.com/vi/oByLfo2eK_E/hqdefault.jpg', channelTitle: 'Rajat Kaprawan Official', publishedAt: '2024-01-01', description: '' },
      { id: 'spsGFAdr194', title: 'Swami Pardesh Reel - Suraj Tratak', thumbnail: 'https://i.ytimg.com/vi/spsGFAdr194/hqdefault.jpg', channelTitle: 'Suraj Tratak', publishedAt: '2025-09-01', description: '' },
      { id: 'epnU1SVc1eI', title: 'Jiya Kori Kori Khando - Trending Reel', thumbnail: 'https://i.ytimg.com/vi/epnU1SVc1eI/hqdefault.jpg', channelTitle: 'Yatika Thapa', publishedAt: '2025-12-01', description: '' },
      { id: 'oECLUxQK-C0', title: 'Shokyani Dance Reel - Trending', thumbnail: 'https://i.ytimg.com/vi/oECLUxQK-C0/hqdefault.jpg', channelTitle: 'Ashish Bora Pahadi Dance', publishedAt: '2026-03-01', description: '' },
      { id: 'GRdwrfJQ9wQ', title: 'Hariya Ghas Katli - Kumaoni Reel 2026', thumbnail: 'https://i.ytimg.com/vi/GRdwrfJQ9wQ/hqdefault.jpg', channelTitle: 'Prakash Kumar PK', publishedAt: '2026-03-01', description: '' },
      { id: 'DyLPbQTXqrg', title: 'Haye Heel - Garhwali DJ Reel 2026', thumbnail: 'https://i.ytimg.com/vi/DyLPbQTXqrg/hqdefault.jpg', channelTitle: 'Suryapal Shriwan', publishedAt: '2026-03-01', description: '' },
      { id: 'ZBgtkOPZ6Aw', title: 'DJ Mervin Rajan - Garhwali Reel 2026', thumbnail: 'https://i.ytimg.com/vi/ZBgtkOPZ6Aw/hqdefault.jpg', channelTitle: 'Mervin Rajan', publishedAt: '2026-03-01', description: '' },
      { id: '41e1LWcx05Q', title: 'Byau Hamru Hoonu Ni - Trending Reel', thumbnail: 'https://i.ytimg.com/vi/41e1LWcx05Q/hqdefault.jpg', channelTitle: 'Unique Pahadi Official', publishedAt: '2025-12-01', description: '' },
      { id: '_VP56PvlX5A', title: 'Pahadi Dhol Reel - Viral', thumbnail: 'https://i.ytimg.com/vi/_VP56PvlX5A/hqdefault.jpg', channelTitle: 'Oshin Bhandari Vlogs', publishedAt: '2023-01-01', description: '' },
      { id: 'xTJ5QCHC5sM', title: 'Surma Ki Dabbi - Reel Edit', thumbnail: 'https://i.ytimg.com/vi/xTJ5QCHC5sM/hqdefault.jpg', channelTitle: 'Pahadi Music Junction', publishedAt: '2026-04-01', description: '' },
      { id: '0gtZkyEt-XA', title: 'Raadhaa Pandavaas - Dance Reel', thumbnail: 'https://i.ytimg.com/vi/0gtZkyEt-XA/hqdefault.jpg', channelTitle: 'Himanshu Bahuguna', publishedAt: '2024-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 12,
  },
  folkdance: {
    videos: [
      { id: '0gtZkyEt-XA', title: 'Raadhaa - Pandavaas Folk Dance', thumbnail: 'https://i.ytimg.com/vi/0gtZkyEt-XA/hqdefault.jpg', channelTitle: 'Himanshu Bahuguna', publishedAt: '2024-01-01', description: '' },
      { id: 'oECLUxQK-C0', title: 'Shokyani Kumaoni Dance Cover', thumbnail: 'https://i.ytimg.com/vi/oECLUxQK-C0/hqdefault.jpg', channelTitle: 'Ashish Bora Pahadi Dance', publishedAt: '2026-03-01', description: '' },
      { id: '_VP56PvlX5A', title: 'Pahadi Dhol Tandi Dance', thumbnail: 'https://i.ytimg.com/vi/_VP56PvlX5A/hqdefault.jpg', channelTitle: 'Oshin Bhandari Vlogs', publishedAt: '2023-01-01', description: '' },
      { id: 'WFBhML-rb3o', title: 'Pahadi Shadi Mein Dance - Chholiya', thumbnail: 'https://i.ytimg.com/vi/WFBhML-rb3o/hqdefault.jpg', channelTitle: 'Sourav Joshi Vlogs', publishedAt: '2022-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 4,
  },
  jaagar: {
    videos: [
      { id: 'IqxxQTrOX34', title: 'Nonstop Garhwali Bhajan Jagar Stuti', thumbnail: 'https://i.ytimg.com/vi/IqxxQTrOX34/hqdefault.jpg', channelTitle: 'Music On Beats', publishedAt: '2020-01-01', description: '' },
      { id: 'YKAMHc98SEg', title: 'Hey Mohana - Krishna Jagar', thumbnail: 'https://i.ytimg.com/vi/YKAMHc98SEg/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2025-08-01', description: '' },
      { id: 'TK8uvD-MDkE', title: 'Hey Nanda - Darshan Farswan Jagar', thumbnail: 'https://i.ytimg.com/vi/TK8uvD-MDkE/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2022-01-01', description: '' },
      { id: 'bvAde-FeS-I', title: 'Nanda Bhawani - Jagar', thumbnail: 'https://i.ytimg.com/vi/bvAde-FeS-I/hqdefault.jpg', channelTitle: 'Darshan Farswan Official', publishedAt: '2025-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 4,
  },
  mela: {
    videos: [
      { id: 'SU_Mad6KRTY', title: 'पहाड़ की सबसे भावुक परंपरा भिटौली | Uttarakhand Culture', thumbnail: 'https://i.ytimg.com/vi/SU_Mad6KRTY/hqdefault.jpg', channelTitle: 'Ghughuti', publishedAt: '2026-03-20', description: '' },
      { id: 'VLcUVlBlbAM', title: 'धारी देवी बैंड | Dhari Devi Band', thumbnail: 'https://i.ytimg.com/vi/VLcUVlBlbAM/hqdefault.jpg', channelTitle: 'Baramasa', publishedAt: '2026-04-11', description: '' },
      { id: 'nIhzDJGUL1o', title: 'Trijugi Narayan - Festival Celebration', thumbnail: 'https://i.ytimg.com/vi/nIhzDJGUL1o/hqdefault.jpg', channelTitle: 'Himalayan Films', publishedAt: '2017-01-01', description: '' },
      { id: 'gZwu3Bt1qcw', title: 'Hey Bhagwati Nanda - Nanda Devi Mela', thumbnail: 'https://i.ytimg.com/vi/gZwu3Bt1qcw/hqdefault.jpg', channelTitle: 'T-Series Bhakti Sagar', publishedAt: '2018-01-01', description: '' },
    ],
    nextPageToken: null, prevPageToken: null, totalResults: 4,
  },
};

function getStaticFallback(category) {
  return STATIC_FALLBACK[category] || { videos: [], nextPageToken: null, prevPageToken: null, totalResults: 0 };
}

// Deterministic shuffle: same seed string → same order. Keeps cache stable
// while making different tabs/queries yield visibly different orderings.
function seededShuffle(arr, seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    const j = h % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Map a free-text query to the most relevant fallback bucket so each music
// tab (DJ, Bhajan, Kumaoni, etc.) shows different content when API quota is
// exhausted instead of all returning the same "songs" list.
function pickFallbackForQuery(query) {
  const q = String(query || '').toLowerCase();
  let bucket = 'songs';
  if (/bhajan|devotional|jagar|jaagar|bhakti|stuti|aarti|mandir|temple/.test(q)) bucket = 'devotional';
  else if (/comedy|funny|hasi|hasna|kajyaan|polya|ghanna/.test(q)) bucket = 'comedy';
  else if (/movie|film|chakrachal|gharjawain/.test(q)) bucket = 'movies';
  else if (/vlog|village|gaon|life|lifestyle|tour|trek/.test(q)) bucket = 'vlogs';
  else if (/podcast|baramasa|ghughuti|interview|documentary/.test(q)) bucket = 'podcast';
  else if (/jaagar|folk dance|chholiya|tandi|pandav/.test(q)) bucket = 'folkdance';
  else if (/mela|fair|festival|harela|igas|phool dei|bikhoti/.test(q)) bucket = 'mela';
  else if (/trend|trending|hit|popular|viral|top/.test(q)) bucket = 'trending';
  // Music sub-genres all draw from the songs pool but get a query-seeded
  // shuffle so each tab's order is unique.
  const base = getStaticFallback(bucket);
  if (!base.videos || base.videos.length === 0) return base;
  return {
    ...base,
    videos: seededShuffle(base.videos, q),
  };
}

const CATEGORY_QUERIES = {
  movies: 'Garhwali full movie',
  songs: 'Garhwali latest songs',
  comedy: 'Garhwali comedy',
  devotional: 'Garhwali devotional bhajan',
  trending: 'Garhwali trending songs OR comedy',
  vlogs: 'Pahadi vlogger uttarakhand village life OR pahadi lifestyle vlog',
  shorts: 'Pahadi garhwali shorts trending #shorts',
  reels: 'Garhwali pahadi trending reels uttarakhand viral pahadi reels kumaoni',
  podcast: 'Baramasa podcast Uttarakhand OR Ghughuti Uttarakhand documentary pahadi',
  folkdance: 'Garhwali folk dance tandi chholiya langvir nritya pandav nritya uttarakhand',
  jaagar: 'Garhwali jaagar jagar uttarakhand devbhoomi ritual',
  mela: 'Uttarakhand mela fair festival garhwali kumaoni',
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

    // If quota exceeded (403), trip the breaker and return fallback data
    if (response.status === 403) {
      tripQuotaBreaker();
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

  // Redis (Upstash) — survives restarts. Hydrate the in-memory cache on hit.
  const fromRedis = await redisGetJSON(`yt:${cacheKey}`);
  if (fromRedis) {
    cache.set(cacheKey, fromRedis);
    fallbackCache.set(cacheKey, fromRedis);
    return fromRedis;
  }

  // If quota breaker is tripped, skip the API call entirely.
  if (isQuotaCoolingDown()) {
    const lt = await redisGetJSON(longtermKey(cacheKey));
    if (lt) return lt;
    const fb = fallbackCache.get(cacheKey);
    if (fb) return fb;
    return pickFallbackForQuery(query);
  }

  try {
    const result = await fetchFromYouTube(query, pageToken, maxResults);
    cache.set(cacheKey, result);
    fallbackCache.set(cacheKey, result);
    redisSetJSON(`yt:${cacheKey}`, result, REDIS_TTL_SECONDS).catch(() => {});
    redisSetJSON(longtermKey(cacheKey), result, REDIS_LONGTERM_TTL_SECONDS).catch(() => {});
    return result;
  } catch (err) {
    // Long-term Redis mirror first (survives cold starts).
    const lt = await redisGetJSON(longtermKey(cacheKey));
    if (lt) {
      console.log('Serving long-term Redis fallback for:', cacheKey);
      return lt;
    }
    const fallback = fallbackCache.get(cacheKey);
    if (fallback) {
      console.log('Serving in-memory fallback for:', cacheKey);
      return fallback;
    }
    if (err.message === 'QUOTA_EXCEEDED') {
      console.log('Serving keyword-matched static fallback for search:', query);
      return pickFallbackForQuery(query);
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

  // Redis layer
  const fromRedis = await redisGetJSON(`yt:${cacheKey}`);
  if (fromRedis) {
    cache.set(cacheKey, fromRedis);
    fallbackCache.set(cacheKey, fromRedis);
    return fromRedis;
  }

  // Quota breaker: skip API; serve any older copy we have.
  if (isQuotaCoolingDown()) {
    const lt = await redisGetJSON(longtermKey(cacheKey));
    if (lt) return lt;
    const fb = fallbackCache.get(cacheKey);
    if (fb) return fb;
    return getStaticFallback(category);
  }

  try {
    const result = await fetchFromYouTube(query, pageToken, maxResults);
    cache.set(cacheKey, result);
    fallbackCache.set(cacheKey, result);
    redisSetJSON(`yt:${cacheKey}`, result, REDIS_TTL_SECONDS).catch(() => {});
    redisSetJSON(longtermKey(cacheKey), result, REDIS_LONGTERM_TTL_SECONDS).catch(() => {});
    return result;
  } catch (err) {
    const lt = await redisGetJSON(longtermKey(cacheKey));
    if (lt) {
      console.log('Serving long-term Redis fallback for:', cacheKey);
      return lt;
    }
    const fallback = fallbackCache.get(cacheKey);
    if (fallback) {
      console.log('Serving in-memory fallback for:', cacheKey);
      return fallback;
    }
    if (err.message === 'QUOTA_EXCEEDED') {
      console.log('Serving static fallback for category:', category);
      return getStaticFallback(category);
    }
    throw err;
  }
}

// =====================================================================
// Trending refresh job
// =====================================================================
// Pre-warms the most-visited surfaces (music tabs + key categories) every 24h
// so users always hit the in-memory cache and we burn the daily YouTube quota
// once instead of per-request. Safe to run when Redis is missing — just
// populates the in-memory cache.

const TRENDING_REFRESH_MS = 24 * 60 * 60 * 1000; // 24 hours

// Mirrors the music tabs in client/src/pages/MusicPage.jsx
const TRENDING_SEARCH_QUERIES = [
  'garhwali trending hit songs 2026',
  'old garhwali evergreen songs Narendra Singh Negi',
  'kumaoni hit songs uttarakhand',
  'garhwali DJ remix nonstop dance',
  'garhwali bhajan devotional aarti',
  'garhwali jaagar Pritam Bhartwan ritual',
  'garhwali folk dance chaunphula thadya',
  'garhwali female singer Meena Rana Priyanka Meher',
];

const TRENDING_CATEGORIES = ['trending', 'songs', 'movies', 'comedy', 'devotional', 'shorts'];

async function refreshTrending() {
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    console.log('[trending] skipping refresh — YOUTUBE_API_KEY not configured');
    return;
  }
  if (isQuotaCoolingDown()) {
    console.log('[trending] skipping refresh — quota breaker active until', new Date(quotaCooldownUntil).toISOString());
    return;
  }
  const started = Date.now();
  let okCount = 0;
  let skipCount = 0;

  // Run sequentially to avoid blowing through quota in a burst.
  for (const q of TRENDING_SEARCH_QUERIES) {
    const cacheKey = `search:${q}::20`;
    try {
      const result = await fetchFromYouTube(q, '', 20);
      cache.set(cacheKey, result);
      fallbackCache.set(cacheKey, result);
      await redisSetJSON(`yt:${cacheKey}`, result, REDIS_TTL_SECONDS);
      await redisSetJSON(longtermKey(cacheKey), result, REDIS_LONGTERM_TTL_SECONDS);
      okCount++;
    } catch (err) {
      skipCount++;
      if (err.message === 'QUOTA_EXCEEDED') {
        console.log('[trending] quota exceeded — stopping refresh early');
        break;
      }
      console.error('[trending] search refresh failed:', q, err.message);
    }
  }

  for (const cat of TRENDING_CATEGORIES) {
    const cacheKey = `category:${cat}::12`;
    try {
      const query = CATEGORY_QUERIES[cat];
      if (!query) continue;
      const result = await fetchFromYouTube(query, '', 12);
      cache.set(cacheKey, result);
      fallbackCache.set(cacheKey, result);
      await redisSetJSON(`yt:${cacheKey}`, result, REDIS_TTL_SECONDS);
      await redisSetJSON(longtermKey(cacheKey), result, REDIS_LONGTERM_TTL_SECONDS);
      okCount++;
    } catch (err) {
      skipCount++;
      if (err.message === 'QUOTA_EXCEEDED') {
        console.log('[trending] quota exceeded — stopping refresh early');
        break;
      }
      console.error('[trending] category refresh failed:', cat, err.message);
    }
  }

  const dur = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `[trending] refresh done in ${dur}s — ${okCount} ok, ${skipCount} skipped` +
      (isRedisEnabled() ? ' (persisted to Redis)' : ' (in-memory only — Redis disabled)')
  );
}

let refreshTimer = null;
function startTrendingRefresh() {
  // Run once on boot (small delay so it doesn't compete with server startup),
  // then every 6 hours.
  setTimeout(() => {
    refreshTrending().catch((e) => console.error('[trending] initial refresh error:', e.message));
  }, 5000);
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    refreshTrending().catch((e) => console.error('[trending] refresh error:', e.message));
  }, TRENDING_REFRESH_MS);
}

// =====================================================================
// Admin: manual refresh helpers
// =====================================================================
// Force-refetch a single category from the YouTube API and overwrite all
// cache layers (in-memory short-TTL cache, in-memory fallback, Redis short
// + long-term mirrors). Use from the admin UI when a new release should
// surface immediately instead of waiting for the 24h cycle.
async function refreshCategory(category) {
  const query = CATEGORY_QUERIES[category];
  if (!query) {
    const err = new Error('Unknown category');
    err.code = 'UNKNOWN_CATEGORY';
    throw err;
  }
  if (!API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE') {
    const err = new Error('YOUTUBE_API_KEY not configured');
    err.code = 'NO_API_KEY';
    throw err;
  }

  const cacheKey = `category:${category}::12`;
  // Bypass quota breaker on manual refresh — admin explicitly asked for it.
  const result = await fetchFromYouTube(query, '', 12);
  cache.set(cacheKey, result);
  fallbackCache.set(cacheKey, result);
  redisSetJSON(`yt:${cacheKey}`, result, REDIS_TTL_SECONDS).catch(() => {});
  redisSetJSON(longtermKey(cacheKey), result, REDIS_LONGTERM_TTL_SECONDS).catch(() => {});
  console.log(`[admin] refreshed category ${category} — ${result.videos?.length || 0} videos`);
  return result;
}

// List categories the admin UI can refresh.
function listRefreshableCategories() {
  return Object.keys(CATEGORY_QUERIES);
}

module.exports = {
  searchVideos,
  getVideosByCategory,
  refreshTrending,
  startTrendingRefresh,
  isQuotaCoolingDown,
  refreshCategory,
  listRefreshableCategories,
};
