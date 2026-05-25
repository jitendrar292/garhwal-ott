import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FEATURES = [
  { icon: '🏔️', title: 'पहाड़ी रिश्ते', desc: 'गढ़वाली, कुमाऊँनी, जौनसारी — अपनी संस्कृति में जीवनसाथी खोजें' },
  { icon: '🤝', title: 'विश्वसनीय प्रोफाइल', desc: 'सत्यापित प्रोफाइल — सुरक्षित और भरोसेमंद' },
  { icon: '💬', title: 'गोपनीय बातचीत', desc: 'Private messaging — आपकी प्राइवेसी सबसे पहले' },
  { icon: '🎯', title: 'स्मार्ट मैचिंग', desc: 'जाति, भाषा, क्षेत्र, शिक्षा — सभी प्राथमिकताओं के अनुसार' },
];

export default function PahadiByoPage() {
  const [formData, setFormData] = useState({ name: '', phone: '', region: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just show success — backend integration later
    setSubmitted(true);
  };

  return (
    <>
      <SEO
        title="पहाड़ी ब्यो — Pahadi Byo | Pahadi Matrimonial"
        description="उत्तराखंड का अपना मैट्रिमोनियल — गढ़वाली, कुमाऊँनी रिश्ते। Find your Pahadi life partner on PahadiTube Byo."
        keywords="pahadi matrimonial, garhwali marriage, kumaoni rishta, uttarakhand shaadi, pahadi byo, pahadi vivah"
      />
      <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 px-4 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <span className="text-5xl mb-4 block">💍</span>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 bg-clip-text text-transparent mb-3">
            पहाड़ी ब्यो
          </h1>
          <p className="text-lg text-white/70">
            उत्तराखंड का अपना मैट्रिमोनियल — अपनी संस्कृति, अपनी भाषा, अपना जीवनसाथी
          </p>
          <p className="text-sm text-white/40 mt-2">Pahadi Matrimonial by PahadiTube</p>
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
              <span className="text-4xl block mb-3">🎉</span>
              <h3 className="text-xl font-bold text-green-400">धन्यवाद!</h3>
              <p className="text-white/60 mt-2">जल्दी ही हम आपसे संपर्क करेंगे।</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white text-center mb-1">जल्द आ रहा है!</h2>
              <p className="text-sm text-white/50 text-center mb-5">Early access के लिए register करें</p>
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
                  type="tel"
                  required
                  placeholder="फोन नंबर"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-pink-500/50"
                />
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
                >
                  <option value="" className="bg-dark-900">क्षेत्र चुनें</option>
                  <option value="garhwal" className="bg-dark-900">गढ़वाल</option>
                  <option value="kumaon" className="bg-dark-900">कुमाऊँ</option>
                  <option value="jaunsaar" className="bg-dark-900">जौनसार</option>
                  <option value="other" className="bg-dark-900">अन्य</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 rounded-xl transition-all"
                >
                  Register करें 💍
                </button>
              </form>
            </>
          )}
        </motion.div>

        {/* Footer note */}
        <p className="text-center text-xs text-white/30 mt-10 max-w-md mx-auto">
          पहाड़ी ब्यो PahadiTube की एक पहल है — उत्तराखंडी परिवारों को जोड़ने के लिए। आपकी जानकारी पूरी तरह सुरक्षित रहेगी।
        </p>
      </div>
    </>
  );
}
