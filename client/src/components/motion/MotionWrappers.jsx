import { motion } from 'framer-motion';

// ── Standardized motion tokens ──────────────────────
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.45, 0, 0.55, 1];
const DURATION_FAST = 0.2;
const DURATION_NORMAL = 0.35;
const DURATION_SLOW = 0.5;

// Stagger container — wraps children for staggered entrance
export function StaggerContainer({ children, className = '', staggerDelay = 0.05 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Fade in from bottom
export function FadeInUp({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: DURATION_NORMAL, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// Scale in card item — designed for stagger container children
export function ScaleInItem({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, scale: 0.92, y: 12 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
      transition={{ duration: DURATION_NORMAL, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// Hover lift card wrapper (standardized: y: -4, scale: 1.02)
export function HoverCard({ children, className = '' }) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

// Slide in from left
export function SlideInLeft({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: DURATION_NORMAL, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}

// Blur fade in — glassmorphism style entrance
export function BlurFadeIn({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: DURATION_SLOW, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
