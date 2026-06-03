import { useMemo, useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { strings } from '@/content/strings';

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const ERROR_ID = 'date-form-error';

export function DatePage() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const minDate = useMemo(todayIso, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setError(strings.date.errorMissing);
      return;
    }
    setError('');
    const params = new URLSearchParams({ d: date, t: time });
    setLocation(`/food?${params.toString()}`);
  };

  const inputBase =
    'block w-full rounded-full border border-card-border bg-card px-5 py-3 text-base text-foreground transition-shadow focus:outline-none focus:ring-4 focus:ring-primary/40 sm:text-lg';

  const dateInvalid = !!error && !date;
  const timeInvalid = !!error && !time;

  return (
    <Card className="text-center">
      <div aria-hidden className="mb-4 text-5xl sm:text-6xl">
        {strings.date.emojiHeader}
      </div>
      <h1 className="mb-8 font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
        {strings.date.heading}
      </h1>
      <form className="flex flex-col gap-5 text-left" onSubmit={handleSubmit} noValidate>
        <label className="block">
          <span className="mb-2 block font-display font-bold text-foreground">
            {strings.date.dateLabel}
          </span>
          <input
            type="date"
            value={date}
            min={minDate}
            onChange={(e) => setDate(e.target.value)}
            className={inputBase}
            aria-invalid={dateInvalid}
            aria-describedby={error ? ERROR_ID : undefined}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-display font-bold text-foreground">
            {strings.date.timeLabel}
          </span>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={inputBase}
            aria-invalid={timeInvalid}
            aria-describedby={error ? ERROR_ID : undefined}
          >
            <option value="" disabled>
              {strings.date.timePlaceholder}
            </option>
            {strings.date.times.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        {error ? (
          <p
            id={ERROR_ID}
            role="alert"
            aria-live="polite"
            className="-mt-1 text-center font-display text-base text-[hsl(0_70%_45%)]"
          >
            {error}
          </p>
        ) : null}
        <Button variant="primary" size="full" type="submit" className="mt-2">
          {strings.date.submit}
        </Button>
      </form>
    </Card>
  );
}
