import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { Router } from 'wouter';
import { DatePage } from '@/pages/DatePage';
import { strings } from '@/content/strings';

function renderDate() {
  return render(
    <Router>
      <DatePage />
    </Router>,
  );
}

describe('DatePage', () => {
  it('renders date and time fields', () => {
    renderDate();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(strings.date.heading);
    expect(screen.getByText(strings.date.dateLabel)).toBeInTheDocument();
    expect(screen.getByText(strings.date.timeLabel)).toBeInTheDocument();
  });

  it('shows error when both fields empty on submit', () => {
    renderDate();
    fireEvent.click(screen.getByRole('button', { name: strings.date.submit }));
    expect(screen.getByRole('alert')).toHaveTextContent(strings.date.errorMissing);
  });

  it('shows error when only date is provided', () => {
    renderDate();
    const dateInput = document.querySelector('input[type=date]') as HTMLInputElement;
    act(() => {
      fireEvent.change(dateInput, { target: { value: '2026-06-14' } });
    });
    fireEvent.click(screen.getByRole('button', { name: strings.date.submit }));
    expect(screen.getByRole('alert')).toHaveTextContent(strings.date.errorMissing);
  });

  it('shows error when only time is provided', () => {
    renderDate();
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    act(() => {
      fireEvent.change(select, { target: { value: strings.date.times[0].value } });
    });
    fireEvent.click(screen.getByRole('button', { name: strings.date.submit }));
    expect(screen.getByRole('alert')).toHaveTextContent(strings.date.errorMissing);
  });

  it('clears error and proceeds when both filled', () => {
    renderDate();
    const dateInput = document.querySelector('input[type=date]') as HTMLInputElement;
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    act(() => {
      fireEvent.change(dateInput, { target: { value: '2026-06-14' } });
      fireEvent.change(select, { target: { value: strings.date.times[1].value } });
    });
    fireEvent.click(screen.getByRole('button', { name: strings.date.submit }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
