import { useCallback } from 'react';
import confetti from 'canvas-confetti';

// Saffron, rose, teal, gold, marigold — Pahadi festival palette
const PAHADI_COLORS = ['#f59e0b', '#f43f5e', '#06b6d4', '#fbbf24', '#fb923c', '#a78bfa'];

export function useConfetti() {
  /** Full-page celebration burst — for milestones */
  const fireConfetti = useCallback((opts = {}) => {
    confetti({
      particleCount: opts.particleCount ?? 90,
      spread: opts.spread ?? 75,
      origin: opts.origin ?? { y: 0.55 },
      colors: opts.colors ?? PAHADI_COLORS,
      startVelocity: opts.startVelocity ?? 32,
      gravity: opts.gravity ?? 0.9,
      scalar: opts.scalar ?? 0.9,
    });
  }, []);

  /** Small burst from a button — for heart/favorite actions.
   *  x and y are normalised (0–1) page coordinates. */
  const fireHeartBurst = useCallback((x, y) => {
    confetti({
      particleCount: 32,
      spread: 55,
      origin: { x, y },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fbbf24'],
      startVelocity: 22,
      gravity: 1.1,
      scalar: 0.75,
      shapes: ['circle'],
    });
  }, []);

  return { fireConfetti, fireHeartBurst };
}
