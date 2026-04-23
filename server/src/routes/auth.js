const express = require('express');
const crypto = require('crypto');

const router = express.Router();

// In-memory user store (Redis-backed in production)
// For MVP, we store users in memory. Extend to Redis for persistence.
const users = new Map(); // email -> { id, email, name, picture, createdAt }
const sessions = new Map(); // sessionToken -> { email, expiresAt }

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

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
    
    // Find or create user
    let user = users.get(googleUser.email);
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
      users.set(googleUser.email, user);
      console.log(`[auth] new user registered: ${user.email}`);
    } else {
      // Update profile info on each login
      user.name = googleUser.name;
      user.picture = googleUser.picture;
      users.set(googleUser.email, user);
    }
    
    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = Date.now() + SESSION_TTL_MS;
    sessions.set(sessionToken, { email: user.email, expiresAt });
    
    // Cleanup expired sessions periodically
    cleanupExpiredSessions();
    
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
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.slice(7);
  const session = sessions.get(token);
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid session' });
  }
  
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }
  
  const user = users.get(session.email);
  if (!user) {
    sessions.delete(token);
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
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    sessions.delete(token);
  }
  res.json({ ok: true });
});

// Middleware to require authentication
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const token = authHeader.slice(7);
  const session = sessions.get(token);
  
  if (!session || session.expiresAt < Date.now()) {
    if (session) sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }
  
  const user = users.get(session.email);
  if (!user) {
    sessions.delete(token);
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
}

// Cleanup expired sessions (run periodically)
let lastCleanup = 0;
function cleanupExpiredSessions() {
  const now = Date.now();
  if (now - lastCleanup < 60000) return; // Max once per minute
  lastCleanup = now;
  
  for (const [token, session] of sessions.entries()) {
    if (session.expiresAt < now) {
      sessions.delete(token);
    }
  }
}

module.exports = router;
module.exports.requireAuth = requireAuth;
