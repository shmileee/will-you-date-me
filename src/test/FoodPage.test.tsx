import { describe, it, expect } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Router } from 'wouter';
import { FoodPage } from '@/pages/FoodPage';
import { strings } from '@/content/strings';

function renderFood() {
  return render(
    <Router>
      <FoodPage />
    </Router>,
  );
}

describe('FoodPage', () => {
  it('renders all 6 food options', () => {
    renderFood();

    strings.food.options.forEach((opt) => {
      expect(screen.getByTestId(`food-${opt.key}`)).toBeInTheDocument();
    });
  });

  it('confirm button is hidden before any selection', () => {
    renderFood();

    expect(screen.queryByRole('button', { name: strings.food.confirm })).not.toBeInTheDocument();
  });

  it('selecting an option reveals the confirm button', () => {
    renderFood();

    act(() => {
      fireEvent.click(screen.getByTestId('food-pizza'));
    });

    expect(screen.getByRole('button', { name: strings.food.confirm })).toBeInTheDocument();
  });

  it('only one option selected at a time', () => {
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

  it('selected button has aria-pressed=true', () => {
    renderFood();

    act(() => {
      fireEvent.click(screen.getByTestId('food-ramen'));
    });

    expect(screen.getByTestId('food-ramen').getAttribute('aria-pressed')).toBe('true');
  });
});
