# 🎬 Garhwali Stream

A modern Netflix-style web application that aggregates latest Garhwali movies, songs, comedy, and devotional content using the YouTube Data API v3.

**No videos are downloaded or hosted** — all content is legally embedded from YouTube.

---

## 📁 Folder Structure

```
Garhwali-OTT/
├── client/                     # React frontend (Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── youtube.js      # API client
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── HeroBanner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   └── VideoGrid.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   ├── useFavorites.js
│   │   │   └── useYouTube.js
│   │   ├── pages/
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PlayerPage.jsx
│   │   │   └── SearchPage.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   └── youtube.js
│   │   ├── services/
│   │   │   └── youtubeService.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── .env.example
├── .gitignore
├── package.json                # Root (concurrently)
├── Procfile                    # Heroku / Railway
├── render.yaml                 # Render deployment
├── vercel.json                 # Vercel deployment
└── README.md
```

---

## ✨ Features

- **Home Page** — Latest Garhwali Movies + Trending Clips sections
- **Categories** — Movies, Songs, Comedy, Devotional
- **Search** — Dynamic search bar fetching from YouTube
- **Video Player** — Embedded YouTube iframe with autoplay
- **Favorites** — Save videos to localStorage
- **Dark Mode** — Toggle dark/light theme
- **Load More** — Pagination via "Load More" button
- **Responsive** — Mobile-first Netflix-style grid layout
- **Loading States** — Skeleton shimmer animations
- **Error Handling** — Graceful error messages
- **Server Caching** — 30-minute cache to conserve YouTube API quota
- **Security** — Helmet, CORS, rate limiting, input validation

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ installed
- A **YouTube Data API v3** key ([Get one here](https://console.cloud.google.com/apis/credentials))

### Step 1: Clone & Enter Project

```bash
cd Garhwali-OTT
```

### Step 2: Create Environment File

```bash
cp .env.example server/.env
```

Edit `server/.env` and paste your YouTube API key:

```
YOUTUBE_API_KEY=AIzaSy...your_key_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Step 3: Install Dependencies

```bash
# Install root + all deps at once
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
```

### Step 4: Run Development Server

```bash
# From project root — runs both server (port 5000) and client (port 5173)
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Step 5: Open in Browser

```
http://localhost:5173
```

---

## 🔑 Getting a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Go to **APIs & Services → Library**
4. Search for **YouTube Data API v3** → Enable it
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → API Key**
7. (Recommended) Restrict the key to **YouTube Data API v3** only
8. Copy the key into your `server/.env`

---

## 🌐 Deployment (Free Tier)

### Option A: Render (Recommended)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your repo
4. Render auto-detects `render.yaml`
5. Add environment variable: `YOUTUBE_API_KEY`
6. Deploy!

**Build command:**
```
cd client && npm install && npm run build && cd ../server && npm install
```

**Start command:**
```
cd server && NODE_ENV=production node src/index.js
```

### Option B: Railway

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from Repo
3. Set environment variables
4. Railway detects the `Procfile` automatically

### Option C: Vercel

1. Push to GitHub
2. Import in [vercel.com](https://vercel.com)
3. Add `YOUTUBE_API_KEY` to environment variables
4. Deploy

---

## 📦 Production Build

```bash
# Build the client
cd client && npm run build

# The server serves the built files in production
cd ../server
NODE_ENV=production node src/index.js
```

The Express server serves the React build from `client/dist/` when `NODE_ENV=production`.

---

## 🛡️ Security

- API key stored server-side only (never exposed to browser)
- Helmet.js for HTTP security headers
- CORS restricted to allowed origins
- Rate limiting (100 req/15min per IP)
- Input validation & sanitization
- YouTube embeds use `referrerPolicy="strict-origin-when-cross-origin"`

---

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/youtube/search?q=query` | Search videos |
| GET | `/api/youtube/category/:category` | Get videos by category |
| GET | `/api/health` | Health check |

Query params: `q`, `pageToken`, `maxResults`

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| API | YouTube Data API v3 |
| Caching | node-cache (in-memory) |
| State | React Hooks (no Redux) |

---

## License

MIT
