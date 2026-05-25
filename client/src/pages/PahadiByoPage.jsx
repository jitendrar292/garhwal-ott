import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FEATURES = [
  { icon: '🏔️', title: 'Pahadi Vibes', desc: 'Instagram से आपकी vibe निकालें — AI-powered matching' },
  { icon: '🤝', title: 'Real Connections', desc: 'Anonymous intro → mutual accept → Instagram reveal' },
  { icon: '🎶', title: 'Cultural Discovery', desc: 'अपने पहाड़ के लोगों से जुड़ें — creators, friends, community' },
  { icon: '✨', title: 'Vibe Matching', desc: 'भाषा, क्षेत्र, interests के आधार पर smart match' },
];

export default function PahadiByoPage() {
  const [formData, setFormData] = useState({ name: '', instagram: '', gender: '', region: '' });
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
        body: JSON.stringify(formData),
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
        title="Pahadi Byo — Find Your Pahadi Vibe | PahadiTube"
        description="Apna pahad, apne log. Connect with pahadi people through vibe matching — Instagram-powered social discovery for Uttarakhand & Himachal diaspora."
        keywords="pahadi byo, pahadi vibe, garhwali connections, kumaoni people, uttarakhand social, pahadi community, pahadi creators"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="text-5xl mb-4 block">🏔️</span>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent mb-3">
            Pahadi Byo
          </h1>
          <p className="text-xl text-white/80 font-medium">
            Find your pahadi vibe.
          </p>
          <p className="text-sm text-white/40 mt-2">Apna pahad, apne log. — by PahadiTube</p>
        </motion.div>

        {/* Features */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-pink-500/30 transition-colors"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold text-white mt-2">{f.title}</h3>
              <p className="text-sm text-white/60 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Early Access Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto bg-white/5 border border-white/10 rounded-2xl p-6"
        >
          {submitted ? (
            <div className="text-center py-6">
              <span className="text-4xl block mb-3">✨</span>
              <h3 className="text-xl font-bold text-green-400">You're in!</h3>
              <p className="text-white/60 mt-2">We'll match your vibe soon. Check Instagram for updates 🏔️</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white text-center mb-1">Join the Vibe 🚀</h2>
              <p className="text-sm text-white/50 text-center mb-5">Enter your Instagram — we'll match your pahadi energy</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="आपका नाम"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <input
                  type="text"
                  required
                  placeholder="Instagram username (e.g. @yourhandle)"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <select
                  value={formData.gender}
                  required
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                >
                  <option value="" className="bg-dark-900">Gender चुनें</option>
                  <option value="male" className="bg-dark-900">Male (पुरुष)</option>
                  <option value="female" className="bg-dark-900">Female (महिला)</option>
                  <option value="other" className="bg-dark-900">Other (अन्य)</option>
                </select>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                >
                  <option value="" className="bg-dark-900">क्षेत्र चुनें</option>
                  <option value="garhwal" className="bg-dark-900">गढ़वाल</option>
                  <option value="kumaon" className="bg-dark-900">कुमाऊँ</option>
                  <option value="jaunsaar" className="bg-dark-900">जौनसार</option>
                  <option value="jalam_patri_banai_dyula" className="bg-dark-900">जलम पत्री बणै द्युला।</option>
                  <option value="other" className="bg-dark-900">अन्य</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register करें 💍'}
                </button>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              </form>
            </>
          )}
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/30 mt-10 max-w-md mx-auto">
          Pahadi Byo by PahadiTube — connecting pahadi people through vibes, not bios. Your data stays safe 🔒
        </p>
      </div>
    </>
  );
}
