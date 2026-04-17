const path = require('path');
// In production (Render/Railway), env vars are set via dashboard.
// Locally, load from .env file.
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const youtubeRoutes = require('./routes/youtube');
const { getVisits, incrementVisits, getFeedback, addFeedback, deleteFeedback } = require('./services/store');

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware - configure CSP to allow YouTube embeds
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.youtube.com", "https://s.ytimg.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https://i.ytimg.com", "https://*.ytimg.com", "data:"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://youtube.com"],
      connectSrc: ["'self'", "https://www.youtube.com"],
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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/dist')));
}

// API routes
app.use('/api/youtube', youtubeRoutes);

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

// Visit counter (Upstash Redis or in-memory fallback)
app.post('/api/visits', async (_req, res) => {
  const count = await incrementVisits();
  res.json({ count });
});

app.get('/api/visits', async (_req, res) => {
  const count = await getVisits();
  res.json({ count });
});

// Feedback endpoints
app.post('/api/feedback', (req, res) => {
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
  const feedback = addFeedback({
    name: name.trim(),
    email: email ? email.trim() : '',
    message: message.trim(),
  });
  res.status(201).json({ success: true, total: feedback.length });
});

app.get('/api/feedback', (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  const providedKey = req.query.key;
  if (providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  res.json({ feedback: getFeedback() });
});

app.delete('/api/feedback/:id', (req, res) => {
  const adminKey = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';
  const providedKey = req.query.key;
  if (providedKey !== adminKey) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
  const feedback = deleteFeedback(id);
  res.json({ success: true, total: feedback.length });
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
});
