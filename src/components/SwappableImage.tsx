import { useState, type ImgHTMLAttributes } from 'react';
import { images, type ImageName } from '@/content/images';
import { cn } from '@/lib/cn';

interface SwappableImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  name: ImageName;
  /** Override the default alt text from the registry. */
  alt?: string;
}

export function SwappableImage({ name, alt, className, ...rest }: SwappableImageProps) {
  const entry = images[name];
  const [src, setSrc] = useState<string>(entry.local);
  const [failed, setFailed] = useState(false);

  return (
    <img
      src={src}
      alt={alt ?? entry.alt}
      className={cn(className)}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (failed) return;
        setFailed(true);
        setSrc(entry.remote);
      }}
      {...rest}
    />
  );
}
