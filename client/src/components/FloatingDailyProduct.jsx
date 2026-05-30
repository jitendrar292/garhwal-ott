import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Flat product list sourced from pahadiIngredients + pahadiPehnawa affiliate data
const PRODUCTS = [
  // Pahadi ingredients
  { name: 'गहत दाल', nameEn: 'Gehat Dal', emoji: '🫘', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=gehat+dal+uttarakhand&tag=pahadistore29-21' },
  { name: 'भट्ट दाल', nameEn: 'Bhatt Dal', emoji: '🖤', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/Bhuli-Store-Protein-Traditional-Himalayan/dp/B0D9CXWYDK/?tag=pahadistore29-21' },
  { name: 'मंडुवा आटा', nameEn: 'Mandua Flour', emoji: '🌾', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=mandua+flour+uttarakhand&tag=pahadistore29-21' },
  { name: 'जखिया मसाला', nameEn: 'Jakhiya Spice', emoji: '🌿', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=jakhiya+spice+uttarakhand&tag=pahadistore29-21' },
  { name: 'जम्बू जड़ी', nameEn: 'Jambu Herb', emoji: '🌱', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=jambu+herb+uttarakhand&tag=pahadistore29-21' },
  { name: 'पहाड़ी गरम मसाला', nameEn: 'Pahadi Masala', emoji: '🌶️', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=pahadi+garam+masala+uttarakhand&tag=pahadistore29-21' },
  { name: 'कच्ची घानी सरसों तेल', nameEn: 'Kachi Ghani Mustard Oil', emoji: '🫙', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=pahadi+kachi+ghani+mustard+oil&tag=pahadistore29-21' },
  { name: 'भांग के बीज', nameEn: 'Hemp Seeds', emoji: '🌿', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=hemp+seeds+uttarakhand&tag=pahadistore29-21' },
  { name: 'काला उड़द दाल', nameEn: 'Black Urad Dal', emoji: '🫘', category: 'पहाड़ी समागरी', url: 'https://www.amazon.in/s?k=black+urad+dal+whole&tag=pahadistore29-21' },
  // Pahadi pehnawa
  { name: 'घाघरा', nameEn: 'Pahadi Ghaghra', emoji: '👗', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=pahadi+ghaghra+skirt+traditional&tag=pahadistore29-21' },
  { name: 'आंगड़ा (अंगी)', nameEn: 'Pahadi Angra', emoji: '👚', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=pahadi+embroidered+blouse+kumaoni&tag=pahadistore29-21' },
  { name: 'पिछौड़ा दुपट्टा', nameEn: 'Pichhora Dupatta', emoji: '🧣', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=pichhora+pahadi+dupatta+uttarakhand&tag=pahadistore29-21' },
  { name: 'गुल्यबंद (गहना)', nameEn: 'Gulyaband Necklace', emoji: '📿', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=gulyaband+pahadi+necklace+silver&tag=pahadistore29-21' },
  { name: 'नथुली', nameEn: 'Pahadi Nathuli', emoji: '💎', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=pahadi+nath+nose+ring+traditional&tag=pahadistore29-21' },
  { name: 'पहाड़ी कुर्ता', nameEn: 'Pahadi Kurta', emoji: '👔', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=pahadi+kurta+men+cotton+white&tag=pahadistore29-21' },
  { name: 'मिरजई (सदरी)', nameEn: 'Pahadi Sadri Jacket', emoji: '🧥', category: 'पहाड़ी पहनावा', url: 'https://www.amazon.in/s?k=nehru+jacket+men+traditional+sadri&tag=pahadistore29-21' },
];

export default function FloatingDailyProduct() {
  // Same product all day, changes at midnight — deterministic across all users
  const product = useMemo(() => {
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return PRODUCTS[dayIndex % PRODUCTS.length];
  }, []);

  return (
    <motion.a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.8, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      className="fixed bottom-52 right-4 z-[60] sm:bottom-24 sm:right-6 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30 flex items-center justify-center border-2 border-white/20 group"
      aria-label={`Aaj ka Pahadi Product: ${product.nameEn}`}
    >
      <span className="text-2xl leading-none">{product.emoji}</span>

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full animate-ping bg-orange-400/20 pointer-events-none" />

      {/* Cart badge */}
      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none shadow-sm">
        🛒
      </span>

      {/* Tooltip — appears on hover */}
      <span className="absolute bottom-16 right-0 bg-dark-900/95 backdrop-blur-sm text-white px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10 shadow-xl pointer-events-none">
        <span className="block text-[10px] text-orange-400 font-semibold uppercase tracking-wide mb-0.5">
          Aaj ka Pahadi Product
        </span>
        <span className="block text-sm font-bold">{product.name}</span>
        <span className="block text-[10px] text-white/50 mt-0.5">{product.category} · Amazon pe dekhein →</span>
      </span>
    </motion.a>
  );
}
