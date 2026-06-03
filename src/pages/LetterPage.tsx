import { Card } from '@/components/Card';
import { SwappableImage } from '@/components/SwappableImage';
import { strings } from '@/content/strings';

function readTime(): string {
  if (typeof window === 'undefined') return strings.letter.defaultTime;
  const fromUrl = new URLSearchParams(window.location.search).get('t');
  return fromUrl && fromUrl.trim() ? fromUrl : strings.letter.defaultTime;
}

export function LetterPage() {
  const time = readTime();
  const heading = strings.letter.heading.replace('{time}', time);

  return (
    <Card className="flex flex-col items-center text-center">
      <SwappableImage
        name="shrekGif"
        className="mb-6 h-[152px] w-[152px] rounded-full object-cover shadow-md sm:mb-8"
      />
      <h1 className="mb-6 font-display text-xl leading-snug text-foreground sm:text-2xl md:text-3xl">
        {heading}
      </h1>
      <p className="text-sm italic text-muted-foreground sm:text-base">{strings.letter.ps}</p>
    </Card>
  );
}
