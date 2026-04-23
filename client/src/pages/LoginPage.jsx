import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

// Google Client ID - set via environment variable
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginPage() {
  const { signInWithGoogle, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Sign-In is not configured. Please contact the administrator.');
      return;
    }

    // Check if already loaded
    if (window.google?.accounts?.id) {
      setGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    script.onerror = () => setError('Failed to load Google Sign-In');
    document.head.appendChild(script);

    return () => {
      // Cleanup not needed - script stays loaded
    };
  }, []);

  // Initialize Google Sign-In button
  useEffect(() => {
    if (!gsiLoaded || !GOOGLE_CLIENT_ID || !googleButtonRef.current) return;

    const handleCredentialResponse = async (response) => {
      setLoading(true);
      setError('');

      try {
        await signInWithGoogle(response.credential);
        navigate(from, { replace: true });
      } catch (err) {
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

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 300,
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      });

      // Also show One Tap prompt
      window.google.accounts.id.prompt();
    } catch (err) {
      console.error('Google Sign-In init error:', err);
      setError('Failed to initialize Google Sign-In');
    }
  }, [gsiLoaded, signInWithGoogle, navigate, from]);

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <SEO
        title="Login - Ghughuti AI"
        description="Sign in to access Ghughuti AI, your Garhwali language assistant"
        path="/login"
      />

      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
            <img
              src="/ghughuti-ai-logo.png"
              alt="Ghughuti AI"
              className="w-16 h-16 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-4xl">🐦</span>';
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">घुघुती AI में स्वागत है</h1>
          <p className="text-gray-400">
            Ghughuti AI - तुम्हरो गढ़वाली भाषा सहायक
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-dark-800 rounded-2xl p-6 sm:p-8 border border-white/5">
          <h2 className="text-lg font-semibold text-white mb-2 text-center">
            साइन इन करो
          </h2>
          <p className="text-sm text-gray-400 mb-6 text-center">
            Ghughuti AI का उपयोग करण खातिर Google सी साइन इन करो
          </p>

          {/* Google Sign-In Button */}
          <div className="flex justify-center mb-4">
            {loading ? (
              <div className="flex items-center gap-3 px-6 py-3 bg-dark-700 rounded-lg">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                <span className="text-gray-300">Signing in...</span>
              </div>
            ) : (
              <div ref={googleButtonRef} className="min-h-[44px]" />
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Features */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-xs text-gray-500 text-center mb-4">
              साइन इन करकै तुम पाओगे:
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-primary-400">✓</span>
                गढ़वाली भाषा मा बात करो
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-400">✓</span>
                संस्कृति अर इतिहास जानो
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-400">✓</span>
                नया गढ़वाली शब्द सिखो
              </li>
            </ul>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← घर वापस जाओ
          </Link>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-gray-500 text-center mt-4">
          साइन इन करकै तुम हमारी{' '}
          <a href="/privacy" className="text-primary-400 hover:underline">
            गोपनीयता नीति
          </a>{' '}
          स्वीकार करदे।
        </p>
      </div>
    </div>
  );
}
