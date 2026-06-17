import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import FESTIVALS from '../data/festivals';

// Group festivals by season
const SEASONS = [
  { id: 'all', label: 'सभी', icon: '🗓️' },
  { id: 'spring', label: 'बसंत (Jan–Apr)', icon: '🌸' },
  { id: 'summer', label: 'ग्रीष्म (May–Aug)', icon: '🌞' },
  { id: 'autumn', label: 'शरद (Sep–Dec)', icon: '🍂' },
];

function getSeason(dateStr) {
  const month = new Date(dateStr).getMonth() + 1;
  if (month >= 1 && month <= 4) return 'spring';
  if (month >= 5 && month <= 8) return 'summer';
  return 'autumn';
}

// Sort all festivals by month (ignore year) for yearly calendar view
function sortByMonth(list) {
  return [...list].sort((a, b) => {
    const ma = new Date(a.date).getMonth() * 100 + new Date(a.date).getDate();
    const mb = new Date(b.date).getMonth() * 100 + new Date(b.date).getDate();
    return ma - mb;
  });
}

// Deduplicate by name (keep first occurrence)
function deduplicate(list) {
  const seen = new Set();
  return list.filter((f) => {
    if (seen.has(f.name)) return false;
    seen.add(f.name);
    return true;
  });
}

const MONTH_NAMES_HI = [
  'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
  'जुलाई', 'अगस्त', 'सितम्बर', 'अक्टूबर', 'नवम्बर', 'दिसम्बर',
];

const REGION_COLORS = {
  'All Uttarakhand': 'bg-emerald-600',
  'Garhwal': 'bg-blue-600',
  'Kumaon': 'bg-purple-600',
  'Jaunsar-Bawar': 'bg-orange-600',
  'Kedarnath · Jageshwar · All': 'bg-indigo-600',
  'Kumaon · Garhwal': 'bg-teal-600',
  'Almora · Nainital · Garhwal': 'bg-rose-600',
  'Garhwal · Kumaon': 'bg-teal-600',
  'Kumaon · Jaunsar': 'bg-amber-600',
};

export default function TyoharPage() {
  const [activeSeason, setActiveSeason] = useState('all');

  const allUnique = useMemo(() => deduplicate(sortByMonth(FESTIVALS)), []);

  const visible = useMemo(() => {
    if (activeSeason === 'all') return allUnique;
    return allUnique.filter((f) => getSeason(f.date) === activeSeason);
  }, [activeSeason, allUnique]);

  // Group by month for calendar display
  const byMonth = useMemo(() => {
    const map = {};
    visible.forEach((f) => {
      const m = new Date(f.date).getMonth();
      if (!map[m]) map[m] = [];
      map[m].push(f);
    });
    return map;
  }, [visible]);

  return (
    <div className="w-full text-white">
      <SEO
        title="उत्तराखंड के त्योहार — गढ़वाली-कुमाऊँनी पर्व, मेले और उत्सव"
        description="उत्तराखंड के सभी प्रमुख त्योहार — हरेला, इगास बग्वाल, फूल देई, घी संक्रांति, उत्तरायणी, नन्दा देवी मेला, बिखौती — सांस्कृतिक महत्व और परम्परा के साथ। गढ़वाली और कुमाऊँनी पर्वों की पूरी जानकारी।"
        path="/tyohar"
        keywords="uttarakhand festivals, harela festival, igas bagwal, phool dei, ghee sankranti, uttarayani mela, nanda devi mela, garhwali festivals, kumaoni festivals, pahadi tyohar, uttarakhand culture"
      />

      <div className="max-w-full mx-auto px-4 sm:px-6 pt-6 pb-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-8 p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, #2d1b00 0%, #5c3d11 40%, #3d2200 100%)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          }}
        >
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">
            उत्तराखंड के त्योहार
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mb-4">
            गढ़वाल, कुमाऊँ और जौनसार-बावर के पारम्परिक त्योहार — हर पर्व के पीछे एक अनूठी
            सांस्कृतिक परम्परा, लोक विश्वास और प्रकृति के साथ हमारा जुड़ाव।
          </p>
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <span className="bg-white/10 px-3 py-1 rounded-full">🌱 {allUnique.length}+ त्योहार</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">🏔️ तीनों क्षेत्र</span>
            <span className="bg-white/10 px-3 py-1 rounded-full">📖 सांस्कृतिक विवरण</span>
          </div>
        </motion.div>

        {/* Region Legend */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries({
            'All Uttarakhand': 'पूरा उत्तराखंड',
            'Garhwal': 'गढ़वाल',
            'Kumaon': 'कुमाऊँ',
            'Jaunsar-Bawar': 'जौनसार-बावर',
          }).map(([key, label]) => (
            <span key={key} className={`${REGION_COLORS[key] || 'bg-gray-600'} text-white text-xs px-2.5 py-1 rounded-full`}>
              {label}
            </span>
          ))}
        </div>

        {/* Season Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {SEASONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSeason(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeSeason === s.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'bg-surface-1 text-gray-300 hover:bg-surface-2'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Calendar / Month View */}
        {Object.keys(byMonth)
          .sort((a, b) => Number(a) - Number(b))
          .map((monthIdx) => (
            <div key={monthIdx} className="mb-8">
              <h2 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-amber-400 rounded"></span>
                {MONTH_NAMES_HI[Number(monthIdx)]}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {byMonth[monthIdx].map((fest, i) => (
                  <motion.div
                    key={fest.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`rounded-2xl overflow-hidden bg-gradient-to-br ${fest.bg} shadow-lg`}
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-4xl">{fest.emoji}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full bg-black/30 text-white/90`}>
                          {fest.region.split(' · ')[0].includes('All') ? 'पूरा UK' : fest.region.split(' · ')[0]}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-0.5">{fest.nameLocal}</h3>
                      <p className="text-xs text-white/60 mb-2">{fest.name}</p>
                      <p className="text-xs text-white/80 leading-relaxed">{fest.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

        {visible.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-4xl mb-2">🗓️</div>
            <p>इस मौसम में कोई त्योहार नहीं मिला।</p>
          </div>
        )}

        {/* Cultural Note */}
        <div className="mt-8 rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, #1a2e1a, #0d2010)' }}>
          <h3 className="font-bold text-lg text-green-300 mb-3">🌿 पहाड़ के त्योहारों की खासियत</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <strong className="text-white">प्रकृति से जुड़ाव:</strong> हर त्योहार ऋतु परिवर्तन,
              फसल चक्र या नदियों-पहाड़ों से जुड़ा है। हरेला (मानसून), घी संक्रांति (भाद्रपद),
              उत्तरायणी (मकर संक्रांति) — प्रकृति की लय के साथ।
            </div>
            <div>
              <strong className="text-white">लोक परम्परा:</strong> भैलो जलाना, फूल चढ़ाना, सात
              अनाज बोना, लोक नृत्य-गीत — पीढ़ी दर पीढ़ी मौखिक परम्परा से आगे बढ़ी।
            </div>
            <div>
              <strong className="text-white">सामाजिक मेळ:</strong> पहाड़ के त्योहार सिर्फ
              धार्मिक नहीं — ये समाज को जोड़ते हैं। मेले व्यापार, विवाह सम्बन्ध और सामूहिक
              उत्सव के मौके भी थे।
            </div>
            <div>
              <strong className="text-white">तीन संस्कृतियाँ:</strong> गढ़वाल, कुमाऊँ और
              जौनसार-बावर — तीनों के अपने अनूठे त्योहार और परम्पराएं। इगास बग्वाल (गढ़वाल),
              बिखौती (कुमाऊँ), मरोज (जौनसार)।
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
