import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const FALLBACK_GALLERY = [
  { id: 1, src: '/art/khelo.png', label: 'खेलो पहाड़ी 🏃' },
  { id: 2, src: '/art/fun.png', label: 'हँसी-ठट्ठा 😄' },
  { id: 3, src: '/art/diwali.png', label: 'दिवाळी 🪔' },
  { id: 4, src: '/art/narendra-singh-negi.png', label: 'गढ़ गौरव — नरेन्द्र सिंह नेगी 🎶' },
  { id: 5, src: '/art/run-char.png', label: 'पहाड़ी दौड़ 🏔️' },
];

// Brief original explainers about the major Pahadi visual-art traditions —
// shown alongside the gallery so the page carries meaningful editorial text
// instead of being a bare image grid.
const ART_TRADITIONS = [
  {
    name: 'Aipan',
    region: 'Kumaon',
    body: 'Aipan is the ritual floor and wall art of Kumaon, drawn with rice-flour paste (biswar) on a red-ochre (geru) background. Geometric grids, lotus motifs and Lakshmi-foot patterns are made for festivals, weddings, and household pujas — each design has a specific occasion and meaning.',
  },
  {
    name: 'Likhai (Wood Carving)',
    region: 'Garhwal & Kumaon',
    body: 'Likhai is the centuries-old craft of carving deodar and walnut wood doors, window frames, ceilings and temple panels. Old Pahadi houses still show intricate floral, peacock and deity motifs — a skill traditionally passed down within carpenter families.',
  },
  {
    name: 'Pichhauda Embroidery',
    region: 'Kumaon',
    body: 'The bright-red Pichhauda dupatta with yellow border is worn by Kumaoni women at festivals, weddings and pujas. Each motif — swastik, sun, conch — is stitched by hand and considered auspicious. It is one of the most recognisable visual markers of Pahadi identity.',
  },
  {
    name: 'Thulma & Pankhi Weaving',
    region: 'Bhotiya belts',
    body: 'Coarse sheep-wool blankets (Thulma) and finer Pankhi shawls are handwoven by Bhotiya communities in upper Kumaon and Garhwal. Natural dyes and traditional pit-loom weaving keep an ancient mountain craft alive.',
  },
  {
    name: 'Ringaal Bamboo Craft',
    region: 'Garhwal',
    body: 'Ringaal — a thin highland bamboo — is split and woven into baskets (kandi), fish-traps, mats and storage containers. The craft sustains many artisans across Tehri, Chamoli and Rudraprayag.',
  },
  {
    name: 'Copper Work (Tamta)',
    region: 'Almora',
    body: 'The Tamta community of Almora has been beating copper into utensils, ritual lamps (kalash, panchpatra) and bells for centuries. Almora copperware is GI-tagged and remains an important Kumaoni craft tradition.',
  },
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
      <SEO
        title="Pahadi Art Gallery — Aipan, Likhai, Pichhauda & Folk Art of Uttarakhand"
        description="Explore the visual art traditions of Uttarakhand — Kumaoni Aipan floor art, Garhwali wood Likhai, Pichhauda embroidery, Ringaal bamboo craft, Almora copperware and more."
        path="/art-gallery"
        keywords="Pahadi art, Aipan, Kumaoni art, Likhai wood carving, Pichhauda, Ringaal craft, Almora copper, Uttarakhand folk art"
      />
      <h1 className="text-2xl font-bold text-orange-400 mb-3">🎨 पहाड़ी कला — Pahadi Art Gallery</h1>
      <p className="text-sm text-gray-300 dark:text-gray-300 leading-relaxed mb-6">
        Uttarakhand's visual-art heritage spans floor paintings, wood carving, embroidery, weaving and metal craft. The pieces below are community-contributed illustrations celebrating Pahadi life; the explainers further down describe the major living art traditions of Garhwal and Kumaon.
      </p>

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
                loading="lazy"
              />
            </div>
            <span className="text-sm text-center font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Editorial section — major art traditions of Uttarakhand */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-white mb-2">Living Art Traditions of Uttarakhand</h2>
        <p className="text-xs text-gray-400 mb-6">
          A short guide to the visual-art forms that still shape festivals, weddings, and everyday life in Garhwal and Kumaon.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ART_TRADITIONS.map((art) => (
            <article
              key={art.name}
              className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4"
            >
              <header className="mb-2">
                <h3 className="text-base font-semibold text-orange-300">{art.name}</h3>
                <p className="text-[11px] uppercase tracking-widest text-white/40">{art.region}</p>
              </header>
              <p className="text-sm text-gray-300 leading-relaxed">{art.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
