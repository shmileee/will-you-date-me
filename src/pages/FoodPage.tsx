import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { strings, type FoodKey } from '@/content/strings';
import { cn } from '@/lib/cn';
import { sendDateProposal } from '@/lib/notify';

const SUBMIT_TIMEOUT_MS = 7000;
const ERROR_ID = 'food-form-error';

function readQuery() {
  if (typeof window === 'undefined') return { date: '', time: '' };
  const params = new URLSearchParams(window.location.search);
  return { date: params.get('d') ?? '', time: params.get('t') ?? '' };
}

export function FoodPage() {
  const [, setLocation] = useLocation();
  const [selected, setSelected] = useState<FoodKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const { date, time } = readQuery();
    if (!date || !time) {
      setLocation('/date');
    }
  }, [setLocation]);

  const handleConfirm = async () => {
    if (!selected || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    const { date, time } = readQuery();
    const food = strings.food.options.find((o) => o.key === selected);
    const timeSlot = strings.date.times.find((t) => t.value === time);

    if (!food || !date || !timeSlot) {
      setSubmitting(false);
      setLocation('/date');
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const result = await sendDateProposal(
        {
          date,
          timeValue: timeSlot.value,
          timeLabel: timeSlot.label,
          foodKey: food.key,
          foodEmoji: food.emoji,
          foodLabel: food.label,
        },
        controller.signal,
      );

      if (!mountedRef.current) return;
      if (!result.ok) {
        console.error('[notify] failed:', result.error);
        setSubmitError(strings.food.sendError);
        setSubmitting(false);
        return;
      }

      const letterParams = new URLSearchParams({ t: time });
      setLocation(`/letter?${letterParams.toString()}`);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error('[notify] threw:', err);
      setSubmitError(strings.food.sendError);
      setSubmitting(false);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  return (
    <Card className="text-center">
      <h1 className="mb-8 font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
        {strings.food.heading}
      </h1>

      <div
        role="radiogroup"
        aria-label={strings.food.optionsLabel}
        className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      >
        {strings.food.options.map((opt) => {
          const isSelected = selected === opt.key;

          return (
            <motion.button
              key={opt.key}
              type="button"
              role="radio"
              onClick={() => setSelected(opt.key)}
              aria-checked={isSelected}
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

      {submitError ? (
        <p
          id={ERROR_ID}
          role="alert"
          aria-live="assertive"
          className="mb-4 text-center font-display text-base text-[hsl(0_70%_45%)]"
        >
          {submitError}
        </p>
      ) : null}

      <AnimatePresence initial={false}>
        {selected ? (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="primary"
              size="full"
              onClick={handleConfirm}
              disabled={submitting}
              aria-busy={submitting}
              aria-describedby={submitError ? ERROR_ID : undefined}
            >
              {submitting
                ? strings.food.sending
                : submitError
                  ? strings.food.retry
                  : strings.food.confirm}
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Card>
  );
}
