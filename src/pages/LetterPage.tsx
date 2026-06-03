import { useSearch } from 'wouter';
import { Card } from '@/components/Card';
import { SwappableImage } from '@/components/SwappableImage';
import { strings } from '@/content/strings';

export function LetterPage() {
  const search = useSearch();
  const fromUrl = new URLSearchParams(search).get('t');
  const time = fromUrl && fromUrl.trim() ? fromUrl : strings.letter.defaultTime;
  const heading = strings.letter.heading.replace('{time}', time);

  return (
    <Card className="flex flex-col items-center text-center">
      <SwappableImage
        name="shrekGif"
        className="mb-6 h-[152px] w-[152px] rounded-full object-cover shadow-md sm:mb-8"
        loading="eager"
      />
      <h1 className="mb-6 font-display text-xl leading-snug text-foreground sm:text-2xl md:text-3xl">
        {heading}
      </h1>
      <p className="text-sm italic text-muted-foreground sm:text-base">{strings.letter.ps}</p>
    </Card>
  );
}
