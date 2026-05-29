import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toggle } from './Toggle';

describe('Toggle Component', () => {
  it('should render a toggle switch', () => {
    const { container } = render(<Toggle />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Toggle label="Enable notifications" />);
    expect(screen.getByText('Enable notifications')).toBeInTheDocument();
  });

  it('should generate id from label', () => {
    render(<Toggle label="Enable notifications" />);
    const label = screen.getByText('Enable notifications');
    expect(label).toHaveAttribute('for', 'enable-notifications');
  });

  it('should use provided id instead of generating from label', () => {
    render(<Toggle label="Enable" id="custom-id" />);
    const label = screen.getByText('Enable');
    expect(label).toHaveAttribute('for', 'custom-id');
  });

  it('should be disabled', () => {
    const { container } = render(<Toggle disabled />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toBeDisabled();
  });

  it('should apply opacity-50 when disabled', () => {
    const { container } = render(<Toggle disabled />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveClass('opacity-50');
  });

  it('should apply cursor-not-allowed when disabled', () => {
    const { container } = render(<Toggle disabled />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveClass('cursor-not-allowed');
  });

  it('should accept defaultChecked', () => {
    const { container } = render(<Toggle defaultChecked={true} />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('should accept checked prop', () => {
    const { container } = render(<Toggle checked={true} />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('should call onCheckedChange when toggled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { container } = render(<Toggle onCheckedChange={onCheckedChange} />);

    const switchElement = container.querySelector('button[role="switch"]');
    if (switchElement) {
      await user.click(switchElement);
      expect(onCheckedChange).toHaveBeenCalled();
    }
  });

  it('should have correct styling classes', () => {
    const { container } = render(<Toggle />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveClass('rounded-full');
    expect(switchElement).toHaveClass('inline-flex');
    expect(switchElement).toHaveClass('transition-colors');
  });

  it('should have focus ring styling', () => {
    const { container } = render(<Toggle />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveClass('focus:ring-2');
    expect(switchElement).toHaveClass('focus:ring-blue-500');
  });

  it('should render with label and switch together', () => {
    const { container } = render(<Toggle label="Dark mode" />);
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toBeInTheDocument();
  });

  it('should have cursor-pointer when enabled', () => {
    const { container } = render(<Toggle />);
    const switchElement = container.querySelector('button[role="switch"]');
    expect(switchElement).toHaveClass('cursor-pointer');
  });

  it('label should have cursor-pointer', () => {
    render(<Toggle label="Toggle label" />);
    const label = screen.getByText('Toggle label');
    expect(label).toHaveClass('cursor-pointer');
  });

  it('should have flex gap between label and switch', () => {
    const { container } = render(<Toggle label="Test" />);
    const wrapper = container.querySelector('[class*="gap-2"]');
    expect(wrapper).toHaveClass('gap-2');
  });
});
