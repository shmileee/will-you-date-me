import { useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { strings, type FoodKey } from '@/content/strings';
import { cn } from '@/lib/cn';

export function FoodPage() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<FoodKey | null>(null);

  return (
    <Card className="text-center">
      <h1 className="mb-8 font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
        {strings.food.heading}
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {strings.food.options.map((opt) => {
          const isSelected = selected === opt.key;

          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              aria-pressed={isSelected}
              data-testid={`food-${opt.key}`}
              data-selected={isSelected ? 'true' : 'false'}
              animate={{ scale: isSelected ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className={cn(
                'flex flex-col items-center justify-center rounded-3xl bg-secondary p-5 font-display font-bold text-secondary-foreground transition-shadow focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40',
                isSelected && 'shadow-[0_0_28px_hsl(var(--primary)/0.55)] ring-4 ring-primary/60',
              )}
            >
              <span aria-hidden className="mb-2 text-4xl sm:text-5xl">
                {opt.emoji}
              </span>
              <span className="text-base sm:text-lg">{opt.label}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <Button variant="primary" size="full" onClick={() => setLocation('/letter')}>
              {strings.food.confirm}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
