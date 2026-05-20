import { useState, useEffect } from 'react';

export default function SnowEffect({ active }) {
  const [flakes] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
      size: 5 + Math.random() * 10,
      opacity: 0.7 + Math.random() * 0.3,
      stopAt: 95 + Math.random() * 5,
    }))
  );

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="absolute animate-snowfall text-white"
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}s`,
            '--snow-duration': `${f.duration}s`,
            '--snow-stop': `${f.stopAt}vh`,
            fontSize: `${f.size}px`,
            opacity: f.opacity,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}
