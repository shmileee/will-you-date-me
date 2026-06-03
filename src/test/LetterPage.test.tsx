import { afterEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { LetterPage } from '@/pages/LetterPage';
import { strings } from '@/content/strings';

const ORIGINAL_HREF = window.location.href;

function visit(search: string) {
  window.history.replaceState({}, '', `/letter${search}`);
}

afterEach(() => {
  window.history.replaceState({}, '', ORIGINAL_HREF);
});

describe('LetterPage', () => {
  it('uses defaultTime in the heading when no ?t param is present', () => {
    visit('');
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    const expected = strings.letter.heading.replace('{time}', strings.letter.defaultTime);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(expected);
  });

  it('substitutes the chosen time from the ?t param', () => {
    visit('?t=20:00');
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    const expected = strings.letter.heading.replace('{time}', '20:00');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(expected);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('20:00');
  });

  it('falls back to defaultTime when ?t is an empty string', () => {
    visit('?t=');
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(strings.letter.defaultTime);
  });

  it('renders the P.S. paragraph', () => {
    visit('');
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    expect(screen.getByText(strings.letter.ps)).toBeInTheDocument();
  });

  it('renders an image with the registry alt', () => {
    visit('');
    render(
      <Router>
        <LetterPage />
      </Router>,
    );
    expect(screen.getByRole('img')).toHaveAttribute('alt', expect.stringMatching(/Шрек/));
  });
});
