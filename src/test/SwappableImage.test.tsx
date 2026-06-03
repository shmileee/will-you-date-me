import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { SwappableImage } from '@/components/SwappableImage';
import { images } from '@/content/images';

describe('SwappableImage', () => {
  it('uses remote src directly when local is empty (default config)', () => {
    render(<SwappableImage name="catGif" />);
    expect(screen.getByRole('img').getAttribute('src')).toBe(images.catGif.remote);
  });

  it('uses registry alt by default', () => {
    render(<SwappableImage name="catGif" />);
    expect(screen.getByRole('img').getAttribute('alt')).toBe(images.catGif.alt);
  });

  it('allows alt override', () => {
    render(<SwappableImage name="catGif" alt="custom alt" />);
    expect(screen.getByRole('img').getAttribute('alt')).toBe('custom alt');
  });

  it('does not swap on error when local is empty (no fallback chain needed)', () => {
    render(<SwappableImage name="catGif" />);
    const img = screen.getByRole('img');
    const before = img.getAttribute('src');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toBe(before);
  });

  it('forwards className', () => {
    render(<SwappableImage name="shrekGif" className="rounded-full" />);
    expect(screen.getByRole('img').className).toContain('rounded-full');
  });

  it('forwards arbitrary img props (loading)', () => {
    render(<SwappableImage name="shrekGif" loading="eager" />);
    expect(screen.getByRole('img').getAttribute('loading')).toBe('eager');
  });
});
