import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import SACRED_PLACES, { PLACE_TYPES } from '../data/sacredPlaces';

export default function SacredPlacesPage() {
  const [activeType, setActiveType] = useState('all');
  const [openId, setOpenId] = useState(null);

  const visible = useMemo(() => {
    if (activeType === 'all') return SACRED_PLACES;
    return SACRED_PLACES.filter((p) => p.type === activeType);
  }, [activeType]);

  const opened = SACRED_PLACES.find((p) => p.id === openId);

  return (
    <div className="w-full text-white">
      <SEO
        title="पवित्र एवं ऐतिहासिक स्थल – Sacred & Historical Places of Uttarakhand"
        description="केदारनाथ, बद्रीनाथ, तुंगनाथ, जागेश्वर, देवलगढ़ — उत्तराखंड के प्रमुख धार्मिक और ऐतिहासिक स्थलों की पौराणिक कथाएँ, इतिहास और सांस्कृतिक महत्व।"
        path="/sacred-places"
        keywords="uttarakhand temples, kedarnath history, badrinath legend, garhwal heritage sites, tungnath trek, jageshwar temples, sacred places uttarakhand, garhwal historical sites"
      />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-6 p-6"
          style={{
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            🏔️ पवित्र एवं ऐतिहासिक स्थल
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl">
            देवभूमि उत्तराखंड के प्रमुख मंदिर, किले और पवित्र स्थल — उनकी पौराणिक कथाएँ,
            स्थापत्य कला, और गढ़वाली संस्कृति से उनका गहरा सम्बन्ध।
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Explore the sacred temples, ancient forts, and heritage sites of Uttarakhand — complete with
            legends, architectural notes, and their deep connection to Garhwali identity.
          </p>
        </motion.div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {PLACE_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveType(t.id)}
              className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeType === t.id
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-surface-2 text-gray-300 hover:bg-surface-3'
              }`}
            >
              {t.label} <span className="text-gray-400 ml-1">({t.english})</span>
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-4">
          {visible.map((place, i) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => setOpenId(place.id)}
              className="bg-surface-1 rounded-xl p-5 border border-white/5 hover:border-teal-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{place.emoji}</span>
                <div>
                  <h3 className="font-bold text-base group-hover:text-teal-300 transition-colors">
                    {place.name}
                  </h3>
                  <p className="text-xs text-gray-400">{place.english}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-3 mb-3">{place.legend}</p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-500">
                <span className="px-2 py-0.5 rounded bg-surface-2 capitalize">{place.type}</span>
                <span>📍 {place.district}</span>
                <span>⛰️ {place.altitude}</span>
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
                    <span className="text-4xl">{opened.emoji}</span>
                    <div>
                      <h2 className="text-xl font-bold">{opened.name}</h2>
                      <p className="text-sm text-gray-400">
                        {opened.english} • {opened.district} • {opened.altitude}
                      </p>
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
                    <h3 className="text-sm font-semibold text-teal-300 mb-1">पौराणिक कथा (Legend)</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.legend}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-teal-300 mb-1">महत्व (Significance)</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.significance}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-teal-300 mb-1">स्थापत्य कला (Architecture)</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.architecture}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-semibold text-teal-300 mb-1">गढ़वाली सम्बन्ध (Garhwali Connection)</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">{opened.garhwaliConnection}</p>
                  </section>

                  <section className="pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-400">
                      <span className="text-teal-400">🕐 सबसे अच्छा समय:</span> {opened.bestTime}
                    </p>
                  </section>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Educational Section */}
        <div className="bg-surface-1 rounded-xl p-5 mb-8 border border-white/5">
          <h2 className="text-lg font-bold mb-2">देवभूमि — भूमि जहाँ देवता बसते हैं</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            उत्तराखंड को "देवभूमि" कहा जाता है — देवताओं की भूमि। यहाँ हर गाँव का अपना देवता है,
            हर डाँडी (चोटी) पर एक मंदिर है, हर गाडू (नदी) पवित्र है। गढ़वाल के लोगों के लिए
            ये स्थान केवल पर्यटन स्थल नहीं हैं — ये उनकी आस्था, उनकी पहचान, और उनकी संस्कृति का
            अटूट हिस्सा हैं।
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Uttarakhand is called "Devbhumi" — the land of gods. For Garhwali people, these sacred and
            historical sites are not merely tourist destinations but living connections to their ancestors,
            their faith, and their cultural identity. From the 1000-year-old Panwar dynasty capitals to the
            highest Shiva temples in the world, each site tells a story of devotion, art, and the unique
            relationship between mountain people and their landscape.
          </p>
        </div>
      </div>
    </div>
  );
}
