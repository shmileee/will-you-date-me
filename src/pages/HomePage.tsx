import { useRef } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EscapingNoButton } from '@/components/EscapingNoButton';
import { SwappableImage } from '@/components/SwappableImage';
import { strings } from '@/content/strings';

export function HomePage() {
  const [, setLocation] = useLocation();
  const buttonRowRef = useRef<HTMLDivElement>(null);

  const handleYes = () => setLocation('/yay');

  return (
    <Card className="flex flex-col items-center text-center">
      <SwappableImage
        name="catGif"
        className="mb-6 h-[184px] w-[184px] rounded-3xl object-cover shadow-md sm:mb-8"
      />
      <h1 className="mb-8 font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
        {strings.home.question}
      </h1>
      <div className="flex items-center justify-center gap-4">
        <Button variant="primary" onClick={handleYes} className="z-10">
          {strings.home.yes}
        </Button>
        <div ref={buttonRowRef} className="relative h-14 w-36 sm:h-16 sm:w-44">
          <EscapingNoButton label={strings.home.no} containerRef={buttonRowRef} />
        </div>
      </div>
    </Card>
  );
}
