const express = require('express');
const crypto = require('crypto');
const { redisGetJSON, redisSetJSON, isRedisEnabled, redisSetAdd, redisSetMembers, redisSetCount } = require('../services/store');

const router = express.Router();

// Redis keys for auth data
const USERS_KEY = 'pahadi_users'; // Hash: email -> user JSON
const SESSIONS_PREFIX = 'pahadi_session:'; // session:<token> -> session JSON
const SIGNUPS_SET = 'pahadi_signups'; // Set of all registered user emails

// In-memory fallback (used when Redis is not configured)
const memUsers = new Map(); // email -> user
const memSessions = new Map(); // token -> session
const memSignups = new Set(); // set of registered emails

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

// Track a new signup in the signups set
async function trackSignup(email) {
  memSignups.add(email);
  if (isRedisEnabled()) {
    await redisSetAdd(SIGNUPS_SET, email);
  }
}

// Get all registered user emails
async function getAllSignups() {
  if (isRedisEnabled()) {
    return await redisSetMembers(SIGNUPS_SET);
  }
  return Array.from(memSignups);
}

// Get signup count
async function getSignupCount() {
  if (isRedisEnabled()) {
    return await redisSetCount(SIGNUPS_SET);
  }
  return memSignups.size;
}

// Get all users with full details (for admin)
async function getAllUsers() {
  const emails = await getAllSignups();
  const users = [];
  for (const email of emails) {
    const user = await getUser(email);
    if (user) {
      users.push({
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        createdAt: user.createdAt,
        authType: user.authType || 'google',
      });
    }
  }
  // Sort by signup date (newest first)
  return users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// =====================================================================
// Password hashing (using built-in crypto - no external dependencies)
// =====================================================================
const SALT_LENGTH = 16;
const HASH_ITERATIONS = 100000;
const HASH_KEYLEN = 64;
const HASH_DIGEST = 'sha512';

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString('hex');
  return hash === verifyHash;
}

// Email validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
      // Create new user (signup)
      user = {
        id: crypto.randomUUID(),
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        authType: 'google',
        createdAt: new Date().toISOString(),
      };
      await setUser(googleUser.email, user);
      await trackSignup(googleUser.email); // Track in signups set
      console.log(`[auth] new Google signup: ${user.email}` + (isRedisEnabled() ? ' (Redis)' : ' (memory)'));
    } else {
      // Update profile info on each login
      user.name = googleUser.name;
      user.picture = googleUser.picture;
      await setUser(googleUser.email, user);
      // Ensure user is in signups set (for users created before tracking was added)
      await trackSignup(googleUser.email);
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

// POST /api/auth/google/callback - Handle OAuth redirect flow (code exchange)
router.post('/google/callback', async (req, res) => {
  const { code, redirectUri } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }
  
  if (!GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'Google OAuth not configured' });
  }
  
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  if (!GOOGLE_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Google OAuth secret not configured' });
  }
  
  try {
    // Exchange code for tokens
    console.log('[auth] Exchanging Google auth code for tokens...');
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[auth] Token exchange failed:', errText);
      throw new Error('Failed to exchange authorization code');
    }
    
    const tokens = await tokenRes.json();
    console.log('[auth] Got tokens, verifying ID token...');
    
    // Verify ID token and get user info
    const googleUser = await verifyGoogleToken(tokens.id_token);
    
    if (!googleUser.emailVerified) {
      return res.status(400).json({ error: 'Email not verified with Google' });
    }
    
    // Find or create user (same logic as /google endpoint)
    let user = await getUser(googleUser.email);
    const isNewUser = !user;
    
    if (!user) {
      user = {
        id: crypto.randomUUID(),
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
        authType: 'google',
        createdAt: new Date().toISOString(),
      };
      await setUser(googleUser.email, user);
      await trackSignup(googleUser.email);
      console.log(`[auth] new Google signup (OAuth flow): ${user.email}`);
    } else {
      user.name = googleUser.name;
      user.picture = googleUser.picture;
      await setUser(googleUser.email, user);
      // Ensure user is in signups set (for users created before tracking was added)
      await trackSignup(googleUser.email);
    }
    
    // Create session
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
    console.error('[auth] Google OAuth callback error:', err.message);
    res.status(401).json({ error: err.message || 'Authentication failed' });
  }
});

// =====================================================================
// Email/Password Authentication
// =====================================================================

// POST /api/auth/signup - Create new account with email/password
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Validate input
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password, and name are required' });
  }
  
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  if (name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }
  
  try {
    // Check if user already exists
    const existingUser = await getUser(email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create new user
    const user = {
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      name: name.trim(),
      picture: null,
      passwordHash: hashPassword(password),
      authType: 'email',
      createdAt: new Date().toISOString(),
    };
    
    await setUser(user.email, user);
    await trackSignup(user.email);
    console.log(`[auth] new email signup: ${user.email}` + (isRedisEnabled() ? ' (Redis)' : ' (memory)'));
    
    // Create session
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
      isNewUser: true,
    });
  } catch (err) {
    console.error('[auth] signup error:', err.message);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// POST /api/auth/login - Login with email/password
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    const user = await getUser(email.toLowerCase());
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check if user signed up with Google (no password)
    if (!user.passwordHash) {
      return res.status(401).json({ 
        error: 'This email is registered with Google. Please use Google Sign-In.',
        authType: 'google'
      });
    }
    
    // Verify password
    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Create session
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
      isNewUser: false,
    });
  } catch (err) {
    console.error('[auth] login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
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

// =====================================================================
// Admin endpoints - view signups and user stats
// =====================================================================
const ADMIN_KEY = process.env.FEEDBACK_ADMIN_KEY || 'pahadi2026';

function requireAdminKey(req, res) {
  if (req.query.key !== ADMIN_KEY) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// GET /api/auth/admin/stats?key=xxx - Get signup statistics
router.get('/admin/stats', async (req, res) => {
  if (!requireAdminKey(req, res)) return;
  
  try {
    const count = await getSignupCount();
    res.json({
      totalSignups: count,
      storageType: isRedisEnabled() ? 'redis' : 'memory',
    });
  } catch (err) {
    console.error('[auth] admin stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/auth/admin/users?key=xxx - List all registered users
router.get('/admin/users', async (req, res) => {
  if (!requireAdminKey(req, res)) return;
  
  try {
    const users = await getAllUsers();
    res.json({
      count: users.length,
      users,
    });
  } catch (err) {
    console.error('[auth] admin users error:', err.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
module.exports.requireAuth = requireAuth;
