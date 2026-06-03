import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { SwappableImage } from '@/components/SwappableImage';
import { images } from '@/content/images';

describe('SwappableImage', () => {
  it('initially uses local src from the registry', () => {
    render(<SwappableImage name="catGif" data-testid="img" />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('src')).toBe(images.catGif.local);
  });

  it('uses registry alt by default', () => {
    render(<SwappableImage name="catGif" />);
    expect(screen.getByRole('img').getAttribute('alt')).toBe(images.catGif.alt);
  });

  it('allows alt override', () => {
    render(<SwappableImage name="catGif" alt="custom alt" />);
    expect(screen.getByRole('img').getAttribute('alt')).toBe('custom alt');
  });

  it('swaps to remote src on first error', () => {
    render(<SwappableImage name="catGif" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe(images.catGif.remote);
  });

  it('does not loop infinitely if remote also fails', () => {
    render(<SwappableImage name="spongebobGif" />);
    const img = screen.getByRole('img');
    fireEvent.error(img); // local -> remote
    const afterFirst = img.getAttribute('src');
    fireEvent.error(img); // would set state again if not guarded
    expect(img.getAttribute('src')).toBe(afterFirst);
  });

  it('forwards className', () => {
    render(<SwappableImage name="shrekGif" className="rounded-full" />);
    expect(screen.getByRole('img').className).toContain('rounded-full');
  });
});
