import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

// Google Client ID - set via environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Detect if running as installed PWA (standalone mode)
const isStandalonePWA = typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true);

export default function LoginPage() {
  const { signInWithGoogle, signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [buttonMounted, setButtonMounted] = useState(false);
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/ghughuti-ai';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  // Load Google Sign-In script
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    if (window.google?.accounts?.id) {
      setGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize Google Sign-In button (skip in PWA mode - popups don't work)
  useEffect(() => {
    if (!gsiLoaded || !GOOGLE_CLIENT_ID || !googleButtonRef.current || !buttonMounted) return;
    // Skip Google Sign-In initialization in PWA standalone mode
    if (isStandalonePWA) return;

    console.log('[GoogleAuth] Initializing with client_id:', GOOGLE_CLIENT_ID?.slice(0, 20) + '...');
    console.log('[GoogleAuth] Current origin:', window.location.origin);

    const handleCredentialResponse = async (response) => {
      console.log('[GoogleAuth] Got credential response:', response?.credential ? 'token received' : 'no token');
      setLoading(true);
      setError('');

      try {
        await signInWithGoogle(response.credential);
        navigate(from, { replace: true });
      } catch (err) {
        console.error('[GoogleAuth] Sign-in error:', err);
        setError(err.message || 'Sign in failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      console.log('[GoogleAuth] Initialized successfully');

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 280,
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });
      console.log('[GoogleAuth] Button rendered');
    } catch (err) {
      console.error('Google Sign-In init error:', err);
      setError('Google Sign-In failed to initialize: ' + err.message);
    }
  }, [gsiLoaded, buttonMounted, signInWithGoogle, navigate, from]);

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

          {/* Divider - only show when Google Sign-In is available */}
          {!isStandalonePWA && (
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500">या</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
          )}

          {/* Google Sign-In - hidden in PWA mode due to popup restrictions */}
          {GOOGLE_CLIENT_ID && !isStandalonePWA ? (
            <div className="flex flex-col items-center gap-2">
              <div 
                ref={(el) => {
                  googleButtonRef.current = el;
                  if (el && !buttonMounted) setButtonMounted(true);
                }} 
                className="min-h-[44px]" 
              />
            </div>
          ) : !isStandalonePWA && (
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
