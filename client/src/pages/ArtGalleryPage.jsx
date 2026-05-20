import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FALLBACK_GALLERY = [
  { id: 1, src: '/art/khelo.png', label: 'खेलो पहाड़ी 🏃' },
  { id: 2, src: '/art/fun.png', label: 'हँसी-ठट्ठा 😄' },
  { id: 3, src: '/art/diwali.png', label: 'दिवाळी 🪔' },
  { id: 4, src: '/art/narendra-singh-negi.png', label: 'गढ़ गौरव — नरेन्द्र सिंह नेगी 🎶' },
  { id: 5, src: '/art/run-char.png', label: 'पहाड़ी दौड़ 🏔️' },
];

export default function ArtGalleryPage() {
  const [gallery, setGallery] = useState(FALLBACK_GALLERY);

  useEffect(() => {
    fetch('/api/art-gallery')
      .then((r) => r.json())
      .then((data) => {
        if (data.gallery && data.gallery.length > 0) setGallery(data.gallery);
      })
      .catch(() => {});
  }, []);
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-orange-400 mb-6">🎨 पहाड़ी कला Gallery</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {gallery.map((item, i) => (
          <motion.div
            key={item.src}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 w-full aspect-square flex items-center justify-center">
              <img
                src={item.src}
                alt={item.label}
                className="max-h-full max-w-full object-contain"
                draggable={false}
              />
            </div>
            <span className="text-sm text-center font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
