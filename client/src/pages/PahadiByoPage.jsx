import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const VIBES = [
  { icon: '🏔️', text: 'mountains' },
  { icon: '🎶', text: 'folk songs' },
  { icon: '☕', text: 'chai in cold weather' },
  { icon: '🌲', text: 'village nostalgia' },
];

export default function PahadiByoPage() {
  const [instagram, setInstagram] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const base = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${base}/api/byo/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagram }),
      });
      const data = await res.json();
      if (res.ok || data.alreadyExists) {
        setSubmitted(true);
      } else {
        setError(data.error || 'कुछ गलत हो गया');
      }
    } catch {
      setError('Network error — कृपया फिर कोशिश करें');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Pahadi Byo ❤️ — Find Your Pahadi Vibe | PahadiTube"
        description="Not matrimony. Not dating. Just pahadi vibes. Find people who understand mountains, folk songs, chai in cold weather, and village nostalgia. Coming soon on PahadiTube."
        keywords="pahadi byo, pahadi vibe, garhwali connections, kumaoni people, uttarakhand social, pahadi community, pahadi vibes"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-16 flex flex-col items-center justify-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent mb-6">
            Pahadi Byo ❤️
          </h1>

          <div className="space-y-2 mb-10">
            <p className="text-lg text-white/70">Not matrimony.</p>
            <p className="text-lg text-white/70">Not dating.</p>
            <p className="text-xl text-white font-semibold">Just pahadi vibes.</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-10"
          >
            <p className="text-white/80 text-lg mb-6 font-medium">Find people who understand:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VIBES.map((v, i) => (
                <motion.div
                  key={v.text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/5 rounded-xl px-5 py-4"
                >
                  <span className="text-2xl">{v.icon}</span>
                  <span className="text-white/90 text-lg">{v.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="inline-block bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 rounded-full px-8 py-4 mb-10"
          >
            <p className="text-xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              Coming soon on PahadiTube.
            </p>
          </motion.div>

          {/* Early Access Registration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full max-w-sm mx-auto bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            {submitted ? (
              <div className="text-center py-4">
                <span className="text-3xl block mb-2">✨</span>
                <h3 className="text-lg font-bold text-green-400">You're on the list!</h3>
                <p className="text-white/60 text-sm mt-2">We'll DM you when Pahadi Byo launches 🏔️</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-white text-center mb-1">Get Early Access</h2>
                <p className="text-sm text-white/50 text-center mb-4">Drop your Instagram — we'll notify you first</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="@your_instagram"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? 'Joining...' : 'Join Waitlist 🚀'}
                  </button>
                  {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </form>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/30 mt-14 max-w-md mx-auto">
          Pahadi Byo by PahadiTube — connecting pahadi people through vibes, not bios.
        </p>
      </div>
    </>
  );
}
