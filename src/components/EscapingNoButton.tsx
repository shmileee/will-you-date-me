import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type RefObject,
  type TouchEvent,
} from 'react';
import { motion } from 'motion/react';
import { randomPosition, type Bounds } from '@/lib/randomPosition';
import { useViewportSize } from '@/hooks/useViewportSize';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface EscapingNoButtonProps {
  label: string;
  /**
   * Container element whose bounding rect defines the area inside which the button may move.
   * If omitted, falls back to the viewport.
   */
  containerRef?: RefObject<HTMLElement | null>;
  onClick?: () => void;
  className?: string;
}

function rectToBounds(rect: DOMRect): Bounds {
  return { minX: 0, maxX: rect.width, minY: 0, maxY: rect.height };
}

export function EscapingNoButton({
  label,
  containerRef,
  onClick,
  className,
}: EscapingNoButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const viewport = useViewportSize();

  const computeBounds = useCallback((): Bounds => {
    const container = containerRef?.current;
    if (container) {
      return rectToBounds(container.getBoundingClientRect());
    }
    return { minX: 0, maxX: viewport.w, minY: 0, maxY: viewport.h };
  }, [containerRef, viewport.w, viewport.h]);

  const dodge = useCallback(() => {
    setPos((prev) => {
      const btn = buttonRef.current;
      const size = btn
        ? { width: btn.offsetWidth, height: btn.offsetHeight }
        : { width: 120, height: 48 };
      const bounds = computeBounds();
      return randomPosition({ prev, bounds, size, prefersReducedMotion });
    });
  }, [computeBounds, prefersReducedMotion]);

  useEffect(() => {
    setPos((prev) => {
      const btn = buttonRef.current;
      const size = btn
        ? { width: btn.offsetWidth, height: btn.offsetHeight }
        : { width: 120, height: 48 };
      const bounds = computeBounds();
      const maxX = Math.max(bounds.minX, bounds.maxX - size.width);
      const maxY = Math.max(bounds.minY, bounds.maxY - size.height);
      return {
        x: Math.min(maxX, Math.max(bounds.minX, prev.x)),
        y: Math.min(maxY, Math.max(bounds.minY, prev.y)),
      };
    });
  }, [viewport.w, viewport.h, computeBounds]);

  const handlePointerEnter = (_event: PointerEvent<HTMLButtonElement>) => dodge();
  const handleTouchStart = (_event: TouchEvent<HTMLButtonElement>) => dodge();
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={cn(
        'absolute inline-flex select-none items-center justify-center rounded-full bg-secondary px-6 py-3 font-display text-base font-bold text-secondary-foreground transition-[filter,transform] duration-150 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:brightness-95 sm:text-lg',
        className,
      )}
      style={{ left: 0, top: 0, touchAction: 'manipulation' }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      onPointerEnter={handlePointerEnter}
      onTouchStart={handleTouchStart}
      onKeyDown={handleKeyDown}
      onClick={onClick}
      data-testid="no-button"
      data-pos={`${Math.round(pos.x)},${Math.round(pos.y)}`}
    >
      {label}
    </motion.button>
  );
}
