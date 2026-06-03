import { useMemo } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Petal {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  swayAmp: number;
  opacity: number;
}

function generatePetals(count: number): Petal[] {
  const list: Petal[] = [];
  let seed = 9876;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    list.push({
      id: i,
      left: rand() * 100,
      size: 18 + rand() * 22,
      delay: rand() * 12,
      duration: 12 + rand() * 10,
      swayAmp: 20 + rand() * 40,
      opacity: 0.35 + rand() * 0.4,
    });
  }

  return list;
}

const PETALS = generatePetals(20);

export function Petals() {
  const reduce = usePrefersReducedMotion();
  const petals = useMemo(() => PETALS, []);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {petals.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${p.left}%`,
            top: '-10%',
            fontSize: `${p.size}px`,
            opacity: p.opacity,
          }}
          initial={{ y: '-10vh', x: 0 }}
          animate={{
            y: '120vh',
            x: [0, p.swayAmp, -p.swayAmp, 0],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'linear',
            repeat: Infinity,
            x: { duration: p.duration, ease: 'easeInOut', repeat: Infinity },
            rotate: { duration: p.duration, ease: 'linear', repeat: Infinity },
          }}
        >
          🌸
        </motion.span>
      ))}
    </div>
  );
}
