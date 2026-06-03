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
import { useViewportSize } from '@/hooks/useViewportSize';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { cn } from '@/lib/cn';

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

interface EscapingNoButtonProps {
  label: string;
  containerRef?: RefObject<HTMLElement | null>;
  onClick?: () => void;
  className?: string;
}

const PROXIMITY_THRESHOLD_PX = 160;
const DEFAULT_BUTTON_SIZE = { width: 120, height: 48 };

function rectToBounds(rect: DOMRect): Bounds {
  return { minX: 0, maxX: rect.width, minY: 0, maxY: rect.height };
}

function farthestCorner(
  cursorX: number,
  cursorY: number,
  bounds: Bounds,
  offset: { left: number; top: number },
  size: { width: number; height: number },
): { x: number; y: number } {
  const maxX = Math.max(bounds.minX, bounds.maxX - size.width);
  const maxY = Math.max(bounds.minY, bounds.maxY - size.height);
  const localCursorX = cursorX - offset.left;
  const localCursorY = cursorY - offset.top;
  const corners: { x: number; y: number }[] = [
    { x: bounds.minX, y: bounds.minY },
    { x: maxX, y: bounds.minY },
    { x: bounds.minX, y: maxY },
    { x: maxX, y: maxY },
  ];
  let best = corners[0];
  let bestDistSq = -Infinity;
  for (const corner of corners) {
    const centerX = corner.x + size.width / 2;
    const centerY = corner.y + size.height / 2;
    const distSq = (centerX - localCursorX) ** 2 + (centerY - localCursorY) ** 2;
    if (distSq > bestDistSq) {
      bestDistSq = distSq;
      best = corner;
    }
  }
  return best;
}

function reducedMotionNudge(
  prev: { x: number; y: number },
  cursorX: number,
  cursorY: number,
  bounds: Bounds,
  offset: { left: number; top: number },
  size: { width: number; height: number },
): { x: number; y: number } {
  const maxX = Math.max(bounds.minX, bounds.maxX - size.width);
  const maxY = Math.max(bounds.minY, bounds.maxY - size.height);
  const btnCenterX = offset.left + prev.x + size.width / 2;
  const btnCenterY = offset.top + prev.y + size.height / 2;
  const dx = btnCenterX - cursorX;
  const dy = btnCenterY - cursorY;
  const distance = Math.hypot(dx, dy);
  const stepX = distance < 1 ? 24 : (dx / distance) * 24;
  const stepY = distance < 1 ? 16 : (dy / distance) * 16;
  return {
    x: Math.max(bounds.minX, Math.min(maxX, prev.x + stepX)),
    y: Math.max(bounds.minY, Math.min(maxY, prev.y + stepY)),
  };
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

  const escapeFrom = useCallback(
    (cursorX: number, cursorY: number) => {
      const cx = Number.isFinite(cursorX) ? cursorX : 0;
      const cy = Number.isFinite(cursorY) ? cursorY : 0;
      setPos((prev) => {
        const btn = buttonRef.current;
        const size =
          btn && btn.offsetWidth > 0
            ? { width: btn.offsetWidth, height: btn.offsetHeight }
            : DEFAULT_BUTTON_SIZE;
        const containerEl = containerRef?.current;
        const containerRect = containerEl?.getBoundingClientRect();
        const bounds: Bounds = containerRect
          ? rectToBounds(containerRect)
          : { minX: 0, maxX: viewport.w, minY: 0, maxY: viewport.h };
        const offset = containerRect
          ? { left: containerRect.left, top: containerRect.top }
          : { left: 0, top: 0 };

        if (prefersReducedMotion) {
          return reducedMotionNudge(prev, cx, cy, bounds, offset, size);
        }
        return farthestCorner(cx, cy, bounds, offset, size);
      });
    },
    [containerRef, prefersReducedMotion, viewport.w, viewport.h],
  );

  const escapeFromRef = useRef(escapeFrom);
  useEffect(() => {
    escapeFromRef.current = escapeFrom;
  }, [escapeFrom]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onPointerMove = (event: globalThis.PointerEvent) => {
      const btn = buttonRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      if (distance < PROXIMITY_THRESHOLD_PX) {
        escapeFromRef.current(event.clientX, event.clientY);
      }
    };
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => document.removeEventListener('pointermove', onPointerMove);
  }, [prefersReducedMotion]);

  useEffect(() => {
    setPos((prev) => {
      const btn = buttonRef.current;
      const size =
        btn && btn.offsetWidth > 0
          ? { width: btn.offsetWidth, height: btn.offsetHeight }
          : DEFAULT_BUTTON_SIZE;
      const containerEl = containerRef?.current;
      const containerRect = containerEl?.getBoundingClientRect();
      const bounds: Bounds = containerRect
        ? rectToBounds(containerRect)
        : { minX: 0, maxX: viewport.w, minY: 0, maxY: viewport.h };
      const maxX = Math.max(bounds.minX, bounds.maxX - size.width);
      const maxY = Math.max(bounds.minY, bounds.maxY - size.height);
      return {
        x: Math.min(maxX, Math.max(bounds.minX, prev.x)),
        y: Math.min(maxY, Math.max(bounds.minY, prev.y)),
      };
    });
  }, [containerRef, viewport.w, viewport.h]);

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) =>
    escapeFrom(event.clientX, event.clientY);

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    const touch = event.touches[0];
    if (touch) escapeFrom(touch.clientX, touch.clientY);
    else escapeFrom(0, 0);
  };

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
        'absolute inline-flex select-none items-center justify-center rounded-full bg-secondary px-6 py-3 font-display text-base font-bold text-secondary-foreground transition-[filter] duration-150 hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:brightness-95 sm:text-lg',
        className,
      )}
      style={{ left: 0, top: 0, touchAction: 'manipulation' }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'tween', duration: 0.07, ease: 'easeOut' }}
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
