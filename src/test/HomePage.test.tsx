import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { Router } from 'wouter';
import { memoryLocation } from 'wouter/memory-location';
import { HomePage } from '@/pages/HomePage';
import { strings } from '@/content/strings';

function renderHome() {
  const { hook, navigate, history } = memoryLocation({ path: '/', record: true });
  const utils = render(
    <Router hook={hook}>
      <HomePage />
    </Router>,
  );
  return { ...utils, navigate, getPath: () => history.at(-1) ?? '/' };
}

function setButtonRowRect(button: HTMLElement) {
  Object.defineProperty(button.parentElement, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      width: 320,
      height: 96,
      top: 0,
      right: 320,
      bottom: 96,
      left: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }),
  });
}

describe('HomePage', () => {
  it('renders the home question heading', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(strings.home.question);
  });

  it('renders YES and No buttons', () => {
    renderHome();
    expect(screen.getByRole('button', { name: strings.home.yes })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: strings.home.no })).toBeInTheDocument();
  });

  it('No button dodges on pointer enter', () => {
    renderHome();
    const noBtn = screen.getByTestId('no-button');
    setButtonRowRect(noBtn);
    const before = noBtn.getAttribute('data-pos');
    act(() => {
      fireEvent.pointerEnter(noBtn);
    });
    expect(noBtn.getAttribute('data-pos')).not.toBe(before);
  });

  it('No button dodges on touch start', () => {
    renderHome();
    const noBtn = screen.getByTestId('no-button');
    setButtonRowRect(noBtn);
    const before = noBtn.getAttribute('data-pos');
    act(() => {
      fireEvent.touchStart(noBtn);
    });
    expect(noBtn.getAttribute('data-pos')).not.toBe(before);
  });
});
