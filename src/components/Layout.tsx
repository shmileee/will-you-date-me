import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface LayoutProps {
  children: ReactNode;
  /** Optional decorative background (Petals component) rendered below content */
  background?: ReactNode;
  /** Optional decorative foreground (FloatingHearts on /letter) rendered above content */
  foreground?: ReactNode;
  className?: string;
}

export function Layout({ children, background, foreground, className }: LayoutProps) {
  return (
    <main
      className={cn(
        'relative flex min-h-svh items-center justify-center overflow-hidden p-4 sm:p-6',
        className,
      )}
    >
      {background ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {background}
        </div>
      ) : null}
      <div className="relative z-10 w-full">{children}</div>
      {foreground ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
          {foreground}
        </div>
      ) : null}
    </main>
  );
}
