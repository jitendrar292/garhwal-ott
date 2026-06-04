import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import VideoRow from './VideoRow';
import CHAR_DHAM from '../data/charDham';
import { searchVideos } from '../api/youtube';

export default function CharDhamRow() {
  const [yatraVideos, setYatraVideos] = useState({ videos: [], loading: true, error: null });

  useEffect(() => {
    searchVideos('char dham yatra 2026 kedarnath badrinath gangotri yamunotri uttarakhand', '', 10)
      .then((data) => setYatraVideos({ videos: data.videos, loading: false, error: null }))
      .catch((err) => setYatraVideos({ videos: [], loading: false, error: err.message }));
  }, []);

  return (
    <div className="space-y-0">
      {/* ── Guide Banner ── */}
      <div className="pl-3 mb-1">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-white">
            🛕 चार धाम यात्रा गाइड 2026
          </h2>
          <Link
            to="/chardham-yatra"
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            पूरी गाइड <span>→</span>
          </Link>
        </div>

        {/* 4 Dham cards — horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CHAR_DHAM.map((dham, i) => (
            <motion.div
              key={dham.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to="/chardham-yatra" className="block">
                <div
                  className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${dham.color} flex-shrink-0 w-44 sm:w-52 p-4 cursor-pointer hover:scale-[1.03] transition-transform`}
                >
                  <div className="text-3xl mb-2">{dham.emoji}</div>
                  <div className="font-bold text-sm sm:text-base leading-tight">{dham.name}</div>
                  <div className="text-xs text-white/70 mt-0.5">{dham.deity}</div>
                  <div className="text-xs text-white/60 mt-1">{dham.district} · {dham.altitude}</div>
                  <div className="mt-2 text-xs bg-black/25 rounded-full px-2 py-0.5 inline-block text-white/80">
                    🗓️ {dham.openMonth.split('(')[0].trim()}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
          >
            <Link to="/chardham-yatra">
              <div className="flex-shrink-0 w-44 sm:w-52 h-full min-h-[120px] rounded-xl border border-primary-500/40 bg-surface-1 hover:bg-surface-2 flex flex-col items-center justify-center gap-2 p-4 cursor-pointer transition-colors">
                <span className="text-2xl">📋</span>
                <span className="text-xs text-center text-gray-300 leading-tight">
                  रूट, खर्च, पंजीकरण<br />
                  <span className="text-primary-400 font-semibold">पूरी गाइड देखें →</span>
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Yatra Videos ── */}
      <VideoRow
        title="🎥 चार धाम यात्रा Videos"
        videos={yatraVideos.videos}
        loading={yatraVideos.loading}
        error={yatraVideos.error}
      />
    </div>
  );
}
