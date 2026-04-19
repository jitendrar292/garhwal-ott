const path = require('path');
// In production (Render/Railway), env vars are set via dashboard.
// Locally, load from .env file.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const youtubeRoutes = require('./routes/youtube');
const chatRoutes = require('./routes/chat');
const favoritesRoutes = require('./routes/favorites');
const newsRoutes = require('./routes/news');
const { getVisits, incrementVisits, isNewIp, logVisitor, getVisitors, seedAndDeduplicateVisitors, getFeedback, addFeedback, deleteFeedback } = require('./services/store');
const { startTrendingRefresh } = require('./services/youtubeService');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware - configure CSP to allow YouTube embeds
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://s.ytimg.com", "https://www.instagram.com", "https://platform.instagram.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://www.instagram.com", "https://platform.instagram.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://i.ytimg.com", "https://*.ytimg.com", "https://*.cdninstagram.com", "https://*.fbcdn.net", "https://www.instagram.com", "https://upload.wikimedia.org", "https://commons.wikimedia.org", "data:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com", "https://www.youtube-nocookie.com", "https://www.instagram.com"],
      connectSrc: ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://*.googlevideo.com", "https://ipapi.co", "https://www.instagram.com", "https://graph.instagram.com"],
      mediaSrc: ["'self'", "https://*.googlevideo.com", "https://www.youtube.com", "https://www.youtube-nocookie.com", "https://*.cdninstagram.com", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:4173', // Vite preview
  'https://garhwali-stream.onrender.com',
];
app.use(cors({
  origin(origin, callback) {
    // Allow same-origin requests (no origin header) or whitelisted origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Trust the first proxy (Render/Railway sets x-forwarded-for)
app.set('trust proxy', 1);

// Rate limiting — per real client IP, scoped by route
const youtubeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,                     // 200 YouTube API calls per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const visitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,                     // generous for visit counter & feedback
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

app.use('/api/youtube', youtubeLimiter);
app.use('/api/visits', visitLimiter);
app.use('/api/feedback', visitLimiter);
app.use('/api/favorites', visitLimiter);
app.use('/api/news', visitLimiter);

// Tighter limit for AI chat (paid upstream)
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,                      // 60 chat messages per IP per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many chat requests, please slow down.' },
});
app.use('/api/chat', chatLimiter);

app.use(express.json({ limit: '8mb' }));

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

// API routes
app.use('/api/youtube', youtubeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/news', newsRoutes);

// Captions endpoint — tries hi, a.hi (auto Hindi), en, a.en in order
app.get('/api/captions/:videoId', async (req, res) => {
  const { videoId } = req.params;
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ error: 'Invalid video ID' });
  }
  try {
    const { getSubtitles } = require('youtube-captions-scraper');
    const langs = ['hi', 'a.hi', 'en', 'a.en'];
    let captions = null;
    let usedLang = null;
    for (const lang of langs) {
      try {
        captions = await getSubtitles({ videoID: videoId, lang });
        usedLang = lang;
        break;
      } catch {
        // try next language
      }
    }
    if (!captions || captions.length === 0) {
      return res.status(404).json({ error: 'No captions available' });
    }
    res.json({ lang: usedLang, captions });
  } catch (err) {
    console.error('Captions error:', err.message);
    res.status(502).json({ error: 'Failed to fetch captions' });
  }
});

// Visit counter — unique IPs only
app.post('/api/visits', async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const userAgent = req.headers['user-agent'] || '';
  const fresh = await isNewIp(ip);
  const count = fresh ? await incrementVisits() : await getVisits();
  if (fresh) logVisitor(ip, userAgent).catch(() => {});
  res.json({ count });
});

app.get('/api/visits', async (_req, res) => {
  const count = await getVisits();
  res.json({ count });
});

// Feedback endpoints
app.post('/api/feedback', async (req, res) => {
  const { name, message, email } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Name is required' });
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }
  if (name.length > 100 || message.length > 2000 || (email && email.length > 200)) {
    return res.status(400).json({ error: 'Input too long' });
  }
  const feedback = await addFeedback({
    name: name.trim(),
    email: email ? email.trim() : '',
    message: message.trim(),
  });
  res.status(201).json({ success: true, total: feedback.length });
});

app.get('/api/feedback', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  const providedKey = req.query.key;
  if (providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ feedback: await getFeedback() });
});

app.delete('/api/feedback/:id', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  const providedKey = req.query.key;
  if (providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
  const feedback = await deleteFeedback(id);
  res.json({ success: true, total: feedback.length });
});

// Admin: visitor location tracking
app.get('/api/visitors', async (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  if (req.query.key !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const visitors = await getVisitors();
  res.json({ total: visitors.length, visitors });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
  });
}

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎬 PahadiTube server running on port ${PORT}`);
  // One-time startup: clean duplicate visitor records + seed seen-IPs set
  seedAndDeduplicateVisitors().catch(() => {});
  // Pre-warm music tabs + key categories now and every 6h
  startTrendingRefresh();
});
