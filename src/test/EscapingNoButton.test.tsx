import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { EscapingNoButton } from '@/components/EscapingNoButton';

function getPosFromAttr(): { x: number; y: number } {
  const btn = screen.getByTestId('no-button');
  const [x, y] = (btn.getAttribute('data-pos') ?? '0,0').split(',').map(Number);
  return { x, y };
}

describe('EscapingNoButton', () => {
  it('renders the provided label', () => {
    render(<EscapingNoButton label="ні… 🙈" />);
    expect(screen.getByRole('button', { name: 'ні… 🙈' })).toBeInTheDocument();
  });

  it('changes position on pointerEnter', () => {
    render(<EscapingNoButton label="ні… 🙈" />);
    const before = getPosFromAttr();
    act(() => {
      fireEvent.pointerEnter(screen.getByTestId('no-button'));
    });
    const after = getPosFromAttr();
    expect(after).not.toEqual(before);
  });

  it('changes position on touchStart', () => {
    render(<EscapingNoButton label="ні… 🙈" />);
    const before = getPosFromAttr();
    act(() => {
      fireEvent.touchStart(screen.getByTestId('no-button'));
    });
    const after = getPosFromAttr();
    expect(after).not.toEqual(before);
  });

  it('fires onClick when keyboard-activated (Enter)', () => {
    const onClick = vi.fn();
    render(<EscapingNoButton label="ні… 🙈" onClick={onClick} />);
    const btn = screen.getByTestId('no-button');
    btn.focus();
    fireEvent.keyDown(btn, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('fires onClick when keyboard-activated (Space)', () => {
    const onClick = vi.fn();
    render(<EscapingNoButton label="ні… 🙈" onClick={onClick} />);
    const btn = screen.getByTestId('no-button');
    btn.focus();
    fireEvent.keyDown(btn, { key: ' ' });
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does NOT dodge on keyboard focus alone', () => {
    render(<EscapingNoButton label="ні… 🙈" />);
    const before = getPosFromAttr();
    screen.getByTestId('no-button').focus();
    const after = getPosFromAttr();
    expect(after).toEqual(before);
  });

  it('also fires onClick on direct click (for keyboard "click via space" path)', () => {
    const onClick = vi.fn();
    render(<EscapingNoButton label="ні… 🙈" onClick={onClick} />);
    fireEvent.click(screen.getByTestId('no-button'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
