export interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface RandomPositionArgs {
  /** Current position (used to ensure we move "far enough" from previous) */
  prev: { x: number; y: number };
  /** Bounds of the area the button can occupy */
  bounds: Bounds;
  /** Size of the button so it stays fully visible */
  size: { width: number; height: number };
  /** Seedable randomness (defaults to Math.random) */
  rng?: () => number;
  /** Respect reduced motion: small fixed nudge instead of teleport */
  prefersReducedMotion?: boolean;
}

/**
 * Compute the next position for the escaping button.
 * - Clamps result strictly inside `bounds` (accounting for button size).
 * - Won't return prev (ensures movement).
 * - Under reduced motion: returns a small fixed offset from prev, clamped to bounds.
 * - With degenerate bounds (maxX < minX or maxY < minY): returns clamped { bounds.minX, bounds.minY }.
 */
export function randomPosition(args: RandomPositionArgs): {
  x: number;
  y: number;
} {
  const { prev, bounds, size, rng = Math.random, prefersReducedMotion = false } = args;

  const maxX = Math.max(bounds.minX, bounds.maxX - size.width);
  const maxY = Math.max(bounds.minY, bounds.maxY - size.height);

  // Degenerate bounds: just sit at the min corner
  if (maxX <= bounds.minX || maxY <= bounds.minY) {
    return { x: bounds.minX, y: bounds.minY };
  }

  if (prefersReducedMotion) {
    // Small fixed nudge — 24px right + 16px down — clamped
    const nudgedX = Math.min(maxX, Math.max(bounds.minX, prev.x + 24));
    const nudgedY = Math.min(maxY, Math.max(bounds.minY, prev.y + 16));
    return { x: nudgedX, y: nudgedY };
  }

  // Try up to a few times to get a position different from prev
  for (let i = 0; i < 8; i++) {
    const x = bounds.minX + rng() * (maxX - bounds.minX);
    const y = bounds.minY + rng() * (maxY - bounds.minY);
    if (Math.hypot(x - prev.x, y - prev.y) > Math.min(size.width, size.height) * 0.5) {
      return { x, y };
    }
  }
  // Fallback: deterministic far corner
  return { x: maxX, y: maxY };
}
