import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import GARHWALI_MUHAVARE, { CATEGORIES } from '../data/garhwaliMuhavare';

export default function MuhavarePage() {
  const [activeCat, setActiveCat] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  const visible = useMemo(() => {
    if (activeCat === 'all') return GARHWALI_MUHAVARE;
    return GARHWALI_MUHAVARE.filter((m) => m.category === activeCat);
  }, [activeCat]);

  return (
    <div className="w-full text-white">
      <SEO
        title="गढ़वाली मुहावरे – Garhwali Proverbs & Sayings"
        description="30+ पारंपरिक गढ़वाली कहावतें और मुहावरे — हिंदी अनुवाद, अर्थ एवं सांस्कृतिक संदर्भ के साथ। पहाड़ी बुद्धि, साहस, प्रकृति, जीवन दर्शन और हास्य की कहावतें।"
        path="/muhavare"
        keywords="garhwali proverbs, garhwali muhavare, pahadi kahawat, uttarakhand proverbs, garhwali sayings, garhwali wisdom, pahadi culture"
      />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-6 p-6"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            📜 गढ़वाली मुहावरे एवं कहावतें
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
            गढ़वाल की पहाड़ियों में सदियों से चली आ रही बुद्धि की बातें। ये मुहावरे पहाड़ी जीवन,
            प्रकृति, साहस और समाज से जुड़े अनुभवों को सुंदर शब्दों में व्यक्त करते हैं।
          </p>
          <p className="text-xs text-gray-400 mt-2">
            पहाड़ की बैठकों मा, चूल्हा का पास, बुजुर्गों की ज़बान से — ये कहावतें सुन-सुन कर
            बच्चे बड़े होन्दा। आज यो परम्परा लुप्त हो रई छ — इसलिए हमने इनको संरक्षित करी।
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeCat === cat.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-surface-2 text-gray-300 hover:bg-surface-3'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Proverbs Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-8">
          {visible.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.4 }}
              className="bg-surface-1 rounded-xl p-4 border border-white/5 hover:border-primary-500/30 transition-all cursor-pointer"
              onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}
            >
              <p className="text-base sm:text-lg font-semibold text-primary-300 mb-2 leading-relaxed">
                "{m.garhwali}"
              </p>
              <p className="text-sm text-gray-300 mb-1">
                <span className="text-gray-500">हिंदी:</span> {m.hindi}
              </p>

              {expandedId === m.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 pt-3 border-t border-white/10"
                >
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="text-primary-400 font-medium">अर्थ एवं संदर्भ: </span>
                    {m.meaning}
                  </p>
                </motion.div>
              )}

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-2 text-gray-400 capitalize">
                  {m.category}
                </span>
                <span className="text-[10px] text-gray-500">
                  {expandedId === m.id ? '▲ कम देखें' : '▼ और पढ़ें'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Educational Footer */}
        <div className="bg-surface-1 rounded-xl p-5 mb-8 border border-white/5">
          <h2 className="text-lg font-bold mb-2">मुहावरों का महत्व</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            गढ़वाली मुहावरे केवल कहावतें नहीं हैं — ये पीढ़ियों के अनुभव हैं जो संक्षिप्त, सुंदर शब्दों में
            व्यक्त किए गए हैं। हर मुहावरा पहाड़ी जीवन की एक सच्चाई बताता है — चाहे वो प्रकृति का पाठ हो,
            समाज का नियम हो, या जीवन दर्शन।
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            ये कहावतें पारंपरिक रूप से शाम की बैठकों में, चूल्हा के पास, खेतों में काम करते हुए
            सुनाई जाती थीं। आज शहरीकरण और पलायन के कारण नई पीढ़ी इन्हें भूल रही है।
            हमने ये मुहावरे यहाँ संकलित किए हैं ताकि ये बुद्धि की बातें जीवित रहें और
            आने वाली पीढ़ियों तक पहुँचें।
          </p>
        </div>
      </div>
    </div>
  );
}
