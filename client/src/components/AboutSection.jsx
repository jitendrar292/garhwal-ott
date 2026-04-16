export default function AboutSection() {
  return (
    <section className="mb-10">
      <div className="bg-gradient-to-br from-dark-800 via-dark-700 to-dark-800 rounded-2xl border border-white/5 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-700/30 to-emerald-700/20 px-6 py-5 sm:px-8 sm:py-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            PahadiTube — सब पहाड़ी मनोरंजन एकठ्या <span className="inline-block">📺🏔️</span>
          </h2>
          <p className="text-gray-300 mt-2 text-sm sm:text-base leading-relaxed">
            अब देखो अपने पसंदीदा Garhwali, Kumaoni और Pahadi वीडियो एक ही ऐप में!
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* What you get */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">🎬</span> क्या मिलेगा आपको?
            </h3>
            <ul className="space-y-2.5">
              {[
                'नई और पुरानी पहाड़ी फिल्में',
                'Trending Garhwali & Kumaoni songs',
                'Comedy videos (हँसते रहो 😄)',
                'Bhakti & devotional content',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-gray-300 text-sm">
                  <span className="text-primary-400 mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-xl">🔥</span> Features
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '⚡', label: 'Fast video streaming' },
                { icon: '🆕', label: 'Daily new content' },
                { icon: '🔍', label: 'Easy search & categories' },
                { icon: '💨', label: 'Lightweight & smooth' },
                { icon: '🚫', label: 'बिल्कुल Ad-Free अनुभव', highlight: true },
                { icon: '📱', label: 'Mobile friendly' },
              ].map((feat, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm
                    ${feat.highlight
                      ? 'bg-green-500/10 border border-green-500/20 text-green-300 font-semibold'
                      : 'bg-dark-600/50 text-gray-300'
                    }`}
                >
                  <span className="text-base shrink-0">{feat.icon}</span>
                  {feat.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <div className="bg-gradient-to-r from-primary-700/20 to-rose-700/10 rounded-xl p-5 border border-primary-500/10">
            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
              <span className="text-lg">❤️</span> क्यों चुनें PahadiTube?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              अगर आप पहाड़ से जुड़े हैं या अपनी भाषा और संस्कृति से प्यार करते हैं,
              तो PahadiTube आपके लिए है।
            </p>
            <p className="text-primary-300 font-semibold mt-3 text-sm">
              👉 Apni bhasha, apna entertainment!
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Enjoy the best of Pahadi content — बिना किसी रुकावट के।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
