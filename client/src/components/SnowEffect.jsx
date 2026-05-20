import { useState, useEffect } from 'react';

export default function SnowEffect({ active }) {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    if (!active) {
      setFlakes([]);
      return;
    }
    const newFlakes = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
      size: 5 + Math.random() * 10,
      opacity: 0.6 + Math.random() * 0.4,
    }));
    setFlakes(newFlakes);
  }, [active]);

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
            animationDuration: `${f.duration}s`,
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
