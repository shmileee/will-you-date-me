import { useLocation } from 'wouter';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SwappableImage } from '@/components/SwappableImage';
import { strings } from '@/content/strings';

export function YayPage() {
  const [, setLocation] = useLocation();

  return (
    <Card className="flex flex-col items-center text-center">
      <SwappableImage
        name="spongebobGif"
        className="mb-6 h-[155px] w-[200px] rounded-3xl object-cover shadow-md sm:mb-8"
      />
      <h1 className="mb-4 font-display text-2xl leading-tight text-foreground sm:text-3xl md:text-4xl">
        {strings.yay.heading}
      </h1>
      <p className="mb-8 text-muted-foreground sm:text-lg">{strings.yay.subtitle}</p>
      <Button variant="primary" size="full" onClick={() => setLocation('/date')}>
        {strings.yay.button}
      </Button>
    </Card>
  );
}
