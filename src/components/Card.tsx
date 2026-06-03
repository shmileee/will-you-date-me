import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        'mx-auto w-full max-w-[min(664px,calc(100vw-2rem))] rounded-3xl border border-card-border bg-card p-6 text-card-foreground shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] sm:p-10',
        className,
      )}
    >
      {children}
    </section>
  );
}
