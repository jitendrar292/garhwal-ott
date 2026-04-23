const express = require('express');
const crypto = require('crypto');
const { redisGetJSON, redisSetJSON, isRedisEnabled } = require('../services/store');

const router = express.Router();

// Redis keys for auth data
const USERS_KEY = 'pahadi_users'; // Hash: email -> user JSON
const SESSIONS_PREFIX = 'pahadi_session:'; // session:<token> -> session JSON

// In-memory fallback (used when Redis is not configured)
const memUsers = new Map(); // email -> user
const memSessions = new Map(); // token -> session

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

// =====================================================================
// Redis-backed storage helpers with in-memory fallback
// =====================================================================

async function getUser(email) {
  if (isRedisEnabled()) {
    try {
      return await redisGetJSON(`${USERS_KEY}:${email}`);
    } catch (err) {
      console.error('[auth] Redis getUser error:', err.message);
    }
  }
  return memUsers.get(email) || null;
}

async function setUser(email, user) {
  memUsers.set(email, user); // Always keep in memory too
  if (isRedisEnabled()) {
    try {
      // Users don't expire - use 1 year TTL (effectively permanent)
      await redisSetJSON(`${USERS_KEY}:${email}`, user, 365 * 24 * 60 * 60);
    } catch (err) {
      console.error('[auth] Redis setUser error:', err.message);
    }
  }
}

async function getSession(token) {
  if (isRedisEnabled()) {
    try {
      return await redisGetJSON(`${SESSIONS_PREFIX}${token}`);
    } catch (err) {
      console.error('[auth] Redis getSession error:', err.message);
    }
  }
  return memSessions.get(token) || null;
}

async function setSession(token, session) {
  memSessions.set(token, session); // Always keep in memory too
  if (isRedisEnabled()) {
    try {
      await redisSetJSON(`${SESSIONS_PREFIX}${token}`, session, SESSION_TTL_SECONDS);
    } catch (err) {
      console.error('[auth] Redis setSession error:', err.message);
    }
  }
}

async function deleteSession(token) {
  memSessions.delete(token);
  if (isRedisEnabled()) {
    try {
      // Set empty value with 1 second TTL to effectively delete
      await redisSetJSON(`${SESSIONS_PREFIX}${token}`, null, 1);
    } catch (err) {
      console.error('[auth] Redis deleteSession error:', err.message);
    }
  }
}

// Verify Google ID token
async function verifyGoogleToken(idToken) {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID not configured');
  }
  
  // Use Google's tokeninfo endpoint for verification
  const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token verification failed: ${text}`);
  }
  
  const payload = await res.json();
  
  // Verify the token is for our app
  if (payload.aud !== GOOGLE_CLIENT_ID) {
    throw new Error('Token was not issued for this application');
  }
  
  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && parseInt(payload.exp, 10) < now) {
    throw new Error('Token has expired');
  }
  
  return {
    email: payload.email,
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null,
    emailVerified: payload.email_verified === 'true',
  };
}

// Generate secure session token
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// POST /api/auth/google - Sign in with Google
router.post('/google', async (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ error: 'Missing credential' });
  }
  
  try {
    const googleUser = await verifyGoogleToken(credential);
    
    if (!googleUser.emailVerified) {
      return res.status(400).json({ error: 'Email not verified with Google' });
    }
    
    // Find or create user (Redis-backed)
    let user = await getUser(googleUser.email);
    const isNewUser = !user;
    
    if (!user) {
      // Create new user
      user = {
        id: crypto.randomUUID(),
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        createdAt: new Date().toISOString(),
      };
      await setUser(googleUser.email, user);
      console.log(`[auth] new user registered: ${user.email}` + (isRedisEnabled() ? ' (Redis)' : ' (memory)'));
    } else {
      // Update profile info on each login
      user.name = googleUser.name;
      user.picture = googleUser.picture;
      await setUser(googleUser.email, user);
    }
    
    // Create session (Redis-backed)
    const sessionToken = generateSessionToken();
    const expiresAt = Date.now() + SESSION_TTL_MS;
    await setSession(sessionToken, { email: user.email, expiresAt });
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      token: sessionToken,
      isNewUser,
    });
  } catch (err) {
    console.error('[auth] Google sign-in error:', err.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// GET /api/auth/me - Get current user from session
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.slice(7);
  const session = await getSession(token);
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  if (session.expiresAt < Date.now()) {
    await deleteSession(token);
    return res.status(401).json({ error: 'Session expired' });
  }
  
  const user = await getUser(session.email);
  if (!user) {
    await deleteSession(token);
    return res.status(401).json({ error: 'User not found' });
  }
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      picture: user.picture,
    },
  });
});

// POST /api/auth/logout - End session
router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    await deleteSession(token);
  }
  res.json({ ok: true });
});

// Middleware to require authentication (async)
async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.slice(7);
  const session = await getSession(token);
  
  if (!session || session.expiresAt < Date.now()) {
    if (session) await deleteSession(token);
    return res.status(401).json({ error: 'Session expired' });
  }
  
  const user = await getUser(session.email);
  if (!user) {
    await deleteSession(token);
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
}

// Cleanup expired in-memory sessions (Redis sessions auto-expire via TTL)
let lastCleanup = 0;
function cleanupExpiredMemSessions() {
  const now = Date.now();
  if (now - lastCleanup < 60000) return; // Max once per minute
  lastCleanup = now;
  
  for (const [token, session] of memSessions.entries()) {
    if (session.expiresAt < now) {
      memSessions.delete(token);
    }
  }
}

module.exports = router;
module.exports.requireAuth = requireAuth;
