import { describe, it, expect } from 'vitest';
import { randomPosition } from '@/lib/randomPosition';

const bounds = { minX: 0, maxX: 800, minY: 0, maxY: 600 };
const size = { width: 120, height: 60 };

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

describe('randomPosition', () => {
  it('returns coords strictly inside bounds (accounting for button size)', () => {
    const rng = seededRng(1);
    for (let i = 0; i < 50; i++) {
      const pos = randomPosition({
        prev: { x: 100, y: 100 },
        bounds,
        size,
        rng,
      });
      expect(pos.x).toBeGreaterThanOrEqual(bounds.minX);
      expect(pos.y).toBeGreaterThanOrEqual(bounds.minY);
      expect(pos.x).toBeLessThanOrEqual(bounds.maxX - size.width);
      expect(pos.y).toBeLessThanOrEqual(bounds.maxY - size.height);
    }
  });

  it('seeded rng produces deterministic output', () => {
    const a = randomPosition({
      prev: { x: 0, y: 0 },
      bounds,
      size,
      rng: seededRng(42),
    });
    const b = randomPosition({
      prev: { x: 0, y: 0 },
      bounds,
      size,
      rng: seededRng(42),
    });
    expect(a).toEqual(b);
  });

  it('returns positions that change between calls (no stagnation)', () => {
    const rng = seededRng(7);
    let prev = { x: 100, y: 100 };
    const seen = new Set<string>();
    for (let i = 0; i < 10; i++) {
      const next = randomPosition({ prev, bounds, size, rng });
      seen.add(`${Math.round(next.x)},${Math.round(next.y)}`);
      prev = next;
    }
    expect(seen.size).toBeGreaterThan(7);
  });

  it('handles degenerate bounds gracefully', () => {
    const degenerate = { minX: 0, maxX: 50, minY: 0, maxY: 30 };
    const pos = randomPosition({
      prev: { x: 0, y: 0 },
      bounds: degenerate,
      size,
      rng: () => 0.5,
    });
    expect(pos).toEqual({ x: 0, y: 0 });
  });

  it('reduced motion returns a small fixed nudge from prev', () => {
    const pos = randomPosition({
      prev: { x: 100, y: 100 },
      bounds,
      size,
      rng: () => 0.5,
      prefersReducedMotion: true,
    });
    expect(pos.x).toBe(124);
    expect(pos.y).toBe(116);
  });

  it('reduced motion still clamps to bounds', () => {
    const pos = randomPosition({
      prev: { x: bounds.maxX, y: bounds.maxY },
      bounds,
      size,
      rng: () => 0.5,
      prefersReducedMotion: true,
    });
    expect(pos.x).toBeLessThanOrEqual(bounds.maxX - size.width);
    expect(pos.y).toBeLessThanOrEqual(bounds.maxY - size.height);
  });
});
