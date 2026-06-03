import { useMemo } from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  driftAmp: number;
}

function generateHearts(count: number): Heart[] {
  const list: Heart[] = [];
  let seed = 4321;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    list.push({
      id: i,
      left: rand() * 100,
      size: 18 + rand() * 18,
      delay: rand() * 8,
      duration: 8 + rand() * 7,
      driftAmp: 30 + rand() * 50,
    });
  }

  return list;
}

const HEARTS = generateHearts(15);

export function FloatingHearts() {
  const reduce = usePrefersReducedMotion();
  const hearts = useMemo(() => HEARTS, []);

  if (reduce) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute select-none will-change-transform"
          style={{
            left: `${h.left}%`,
            bottom: '-10%',
            fontSize: `${h.size}px`,
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: '-130vh',
            x: [0, h.driftAmp, -h.driftAmp, 0],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            ease: 'easeOut',
            repeat: Infinity,
            x: { duration: h.duration, ease: 'easeInOut', repeat: Infinity },
            opacity: { duration: h.duration, times: [0, 0.1, 0.85, 1], repeat: Infinity },
          }}
        >
          💖
        </motion.span>
      ))}
    </div>
  );
}
