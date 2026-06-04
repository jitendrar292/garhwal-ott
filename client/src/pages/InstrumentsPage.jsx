import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import GARHWALI_INSTRUMENTS, { INSTRUMENT_TYPES } from '../data/garhwaliInstruments';

export default function InstrumentsPage() {
  const [activeType, setActiveType] = useState('all');
  const [openId, setOpenId] = useState(null);

  const visible = useMemo(() => {
    if (activeType === 'all') return GARHWALI_INSTRUMENTS;
    return GARHWALI_INSTRUMENTS.filter((inst) => inst.type === activeType);
  }, [activeType]);

  const opened = GARHWALI_INSTRUMENTS.find((inst) => inst.id === openId);

  return (
    <div className="w-full text-white">
      <SEO
        title="गढ़वाली वाद्य यंत्र – Traditional Musical Instruments of Uttarakhand"
        description="ढोल, दमाऊ, रणसिंगा, हुड़का, मशकबीन, अलगोजा, बांसुरी — उत्तराखंड के पारंपरिक वाद्य यंत्रों का विस्तृत परिचय। वादन शैली, सांस्कृतिक महत्व, प्रसिद्ध कलाकार और गढ़वाली संगीत परम्परा।"
        path="/instruments"
        keywords="garhwali instruments, dhol damau, ransingha, hurka, mashakbeen, uttarakhand music, pahadi folk instruments, garhwali folk music"
      />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-6 p-6"
          style={{
            background: 'linear-gradient(135deg, #1a0f2e 0%, #2d1b4e 40%, #1f0f3a 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            🎵 गढ़वाली वाद्य यंत्र
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
            उत्तराखंड की लोक संगीत परम्परा — ढोल-दमाऊ से रणसिंगा तक, हर वाद्य का अपना इतिहास,
            अपनी आवाज, और अपनी कहानी। जानिए कैसे ये वाद्य गढ़वाली संस्कृति की आत्मा हैं।
          </p>
          <p className="text-xs text-gray-400 mt-2">
            औजी, बजगी, दास समुदाय — सदियों से ये परिवार हमारी संगीत परम्परा सम्भाला छन।
            आधुनिकता की चुनौती मा ये कला विलुप्त हो रई छ — इनकी जानकारी और सम्मान आज पहले से ज्यादा जरूरी छ।
          </p>
        </motion.div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {INSTRUMENT_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeType === t.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-surface-2 text-gray-300 hover:bg-surface-3'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Instruments Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
          {visible.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => setOpenId(inst.id)}
              className="bg-surface-1 rounded-xl p-5 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{inst.image}</span>
                <div>
                  <h3 className="font-bold text-base group-hover:text-purple-300 transition-colors">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-gray-400">{inst.region}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-3 mb-2">{inst.description}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="px-2 py-0.5 rounded bg-surface-2 capitalize">{inst.type}</span>
                <span>{inst.region}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpenId(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-surface-1 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{opened.image}</span>
                    <div>
                      <h2 className="text-xl font-bold">{opened.name}</h2>
                      <p className="text-sm text-gray-400">{opened.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpenId(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <section>
                    <h3 className="text-sm font-semibold text-purple-300 mb-1">विवरण</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.description}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-purple-300 mb-1">सांस्कृतिक महत्व</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.culturalSignificance}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-purple-300 mb-1">वादन शैली</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.playingStyle}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-purple-300 mb-1">प्रसिद्ध कलाकार</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.famousInfo}</p>
                  </section>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Section */}
        <div className="bg-surface-1 rounded-xl p-5 mb-8 border border-white/5">
          <h2 className="text-lg font-bold mb-2">गढ़वाली संगीत परम्परा</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            गढ़वाल का लोक संगीत पहाड़ी जीवन का अभिन्न अंग है। हर मौसम, हर त्यौहार, हर संस्कार का
            अपना संगीत है — और उस संगीत के लिए विशेष वाद्य यंत्र हैं। ढोल-दमाऊ शादी-त्यौहारों के लिए,
            रणसिंगा देवता की जात के लिए, हुड़का खेती-बाड़ी के गीतों के लिए — हर अवसर पर एक अलग ध्वनि गूँजती है।
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            इन वाद्य यंत्रों कू बजाणो वाला समुदाय — औजी, बजगी, दास — पीढ़ियों से यो कला सम्भाली छ।
            आधुनिकता की चुनौती मा यो परम्परा खतरा मा छ। इसलिए इनको दस्तावेजीकरण और सम्मान
            आज पहले से ज्यादा जरूरी छ। हमारा वाद्य यंत्र — हमारी आवाज छन, हमारी पहचान छन।
          </p>
        </div>
      </div>
    </div>
  );
}
