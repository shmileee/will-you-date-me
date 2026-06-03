import { useState, type FormEvent } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { strings } from '@/content/strings';

export function DatePage() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      setError(strings.date.errorMissing);
      return;
    }
    setError('');
    setLocation('/food');
  };

  const inputBase =
    'block w-full rounded-full border border-card-border bg-card px-5 py-3 text-base text-foreground transition-shadow focus:outline-none focus:ring-4 focus:ring-primary/40 sm:text-lg';

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
            onChange={(e) => setDate(e.target.value)}
            className={inputBase}
            aria-invalid={!!error && !date}
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
            aria-invalid={!!error && !time}
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
            role="alert"
            aria-live="polite"
            className="-mt-1 text-center font-display text-base text-foreground"
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
