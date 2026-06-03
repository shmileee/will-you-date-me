import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { LetterPage } from '@/pages/LetterPage';
import { strings } from '@/content/strings';

describe('LetterPage', () => {
  it('renders the love letter heading', () => {
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(strings.letter.heading);
  });

  it('renders the P.S. paragraph', () => {
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    expect(screen.getByText(strings.letter.ps)).toBeInTheDocument();
  });

  it('renders an image with the registry alt', () => {
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringMatching(/Шрек/));
  });
});
