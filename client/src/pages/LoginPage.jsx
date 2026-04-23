import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

// Google Client ID - set via environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Detect if running as installed PWA (standalone mode)
// Only true when actually launched from home screen, not in regular mobile browser
const isStandalonePWA = typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches === true ||
    window.navigator.standalone === true);

// Debug: log PWA detection status
if (typeof window !== 'undefined') {
  console.log('[Login] isStandalonePWA:', isStandalonePWA);
  console.log('[Login] GOOGLE_CLIENT_ID set:', !!GOOGLE_CLIENT_ID);
}

export default function LoginPage() {
  const { signInWithGoogle, signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/ghughuti-ai';

  // Handle OAuth redirect callback (when Google redirects back with ?code=xxx)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (!code) return;
    
    const exchangeCode = async () => {
      setLoading(true);
      setError('');
      
      try {
        console.log('[GoogleAuth] Exchanging code for token...');
        const res = await fetch('/api/auth/google/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            code, 
            redirectUri: window.location.origin + '/login' 
          }),
        });
        
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || 'Authentication failed');
        }
        
        const { user, token } = await res.json();
        localStorage.setItem('pahaditube_auth_token', token);
        localStorage.setItem('pahaditube_user', JSON.stringify(user));
        
        // Clean URL and redirect
        const redirectTo = state || from;
        navigate(redirectTo, { replace: true });
        window.location.reload(); // Refresh to update auth state
      } catch (err) {
        console.error('[GoogleAuth] Code exchange error:', err);
        setError(err.message || 'Google sign-in failed');
        // Clean URL
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    
    exchangeCode();
  }, [location.search, navigate, from]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // Google OAuth redirect handler
  const handleGoogleSignIn = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In not configured');
      return;
    }
    
    setLoading(true);
    const redirectUri = encodeURIComponent(window.location.origin + '/login');
    const scope = encodeURIComponent('openid email profile');
    const state = encodeURIComponent(from);
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}&prompt=select_account`;
    window.location.href = url;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      if (err.authType === 'google') {
        setError('This email uses Google Sign-In. Please use the Google button below.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <SEO
        title={mode === 'signup' ? 'Sign Up - Ghughuti AI' : 'Login - Ghughuti AI'}
        description="Sign in to access Ghughuti AI, your Garhwali language assistant"
        path="/login"
      />

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <img
              src="/ghughuti-ai-logo.png"
              alt="Ghughuti AI"
              className="w-14 h-14 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-3xl">🐦</span>';
              }}
            />
          </div>
          <h1 className="text-xl font-bold text-white">घुघुती AI में स्वागत है</h1>
          <p className="text-gray-400 text-sm mt-1">तुम्हरो गढ़वाली भाषा सहायक</p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-white/5">
          {/* Mode Toggle */}
          <div className="flex bg-dark-700 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'signup'
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="तुम्हरो नाम"
                  className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                  required
                  minLength={2}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'कम से कम 6 अक्षर' : '••••••••'}
                className="w-full bg-dark-700 border border-dark-500 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  {mode === 'signup' ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                mode === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">या</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Sign-In - hidden in PWA mode */}
          {GOOGLE_CLIENT_ID && !isStandalonePWA ? (
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          ) : isStandalonePWA ? (
            <p className="text-xs text-amber-400/80 text-center">
              📱 PWA में Google Sign-In नहीं चलता। Email/Password से login करो।
            </p>
          ) : (
            <p className="text-xs text-gray-500 text-center">
              Google Sign-In not configured
            </p>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← घर वापस जाओ
          </Link>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          {mode === 'signup' ? 'खाता बनाकै' : 'साइन इन करकै'} तुम हमारी{' '}
          <a href="/privacy" className="text-primary-400 hover:underline">
            गोपनीयता नीति
          </a>{' '}
          स्वीकार करदे।
        </p>
      </div>
    </div>
  );
}
