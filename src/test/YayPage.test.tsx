import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { YayPage } from '@/pages/YayPage';
import { strings } from '@/content/strings';

describe('YayPage', () => {
  it('renders the heading from strings', () => {
    render(
      <Router>
        <YayPage />
      </Router>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(strings.yay.heading);
  });

  it('renders the subtitle and CTA', () => {
    render(
      <Router>
        <YayPage />
      </Router>,
    );
    expect(screen.getByText(strings.yay.subtitle)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: strings.yay.button })).toBeInTheDocument();
  });
});
