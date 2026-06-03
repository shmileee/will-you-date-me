import { afterEach, describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Router } from 'wouter';
import { FoodPage } from '@/pages/FoodPage';
import { strings } from '@/content/strings';

const ORIGINAL_HREF = window.location.href;

function visit(search: string) {
  window.history.replaceState({}, '', `/food${search}`);
}

function renderFood() {
  return render(
    <Router>
      <FoodPage />
    </Router>,
  );
}

afterEach(() => {
  window.history.replaceState({}, '', ORIGINAL_HREF);
});

describe('FoodPage', () => {
  it('renders all 6 food options when ?d and ?t are present', () => {
    visit('?d=2099-12-31&t=18:00');
    renderFood();
    strings.food.options.forEach((opt) => {
      expect(screen.getByTestId(`food-${opt.key}`)).toBeInTheDocument();
    });
  });

  it('exposes the grid as a radiogroup (a11y)', () => {
    visit('?d=2099-12-31&t=18:00');
    renderFood();
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('confirm button is hidden before any selection', () => {
    visit('?d=2099-12-31&t=18:00');
    renderFood();
    expect(screen.queryByRole('button', { name: strings.food.confirm })).not.toBeInTheDocument();
  });

  it('selecting an option reveals the confirm button', () => {
    visit('?d=2099-12-31&t=18:00');
    renderFood();
    act(() => {
      fireEvent.click(screen.getByTestId('food-pizza'));
    });
    expect(screen.getByRole('button', { name: strings.food.confirm })).toBeInTheDocument();
  });

  it('enforces single-select across clicks', () => {
    visit('?d=2099-12-31&t=18:00');
    renderFood();
    act(() => {
      fireEvent.click(screen.getByTestId('food-pizza'));
    });
    expect(screen.getByTestId('food-pizza').getAttribute('data-selected')).toBe('true');

    act(() => {
      fireEvent.click(screen.getByTestId('food-sushi'));
    });
    expect(screen.getByTestId('food-pizza').getAttribute('data-selected')).toBe('false');
    expect(screen.getByTestId('food-sushi').getAttribute('data-selected')).toBe('true');
  });

  it('selected option has aria-checked=true', () => {
    visit('?d=2099-12-31&t=18:00');
    renderFood();
    act(() => {
      fireEvent.click(screen.getByTestId('food-ramen'));
    });
    expect(screen.getByTestId('food-ramen').getAttribute('aria-checked')).toBe('true');
  });

  it('redirects to /date when ?d or ?t query params are missing', async () => {
    visit('');
    renderFood();
    await waitFor(() => {
      expect(window.location.pathname).toBe('/date');
    });
  });

  it('redirects to /date when only ?d is present (time missing)', async () => {
    visit('?d=2099-12-31');
    renderFood();
    await waitFor(() => {
      expect(window.location.pathname).toBe('/date');
    });
  });
});
