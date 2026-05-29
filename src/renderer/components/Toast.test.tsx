import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from './Toast';

describe('Toast Component', () => {
  it('should render toast with message', () => {
    render(<Toast message="Hello World" />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should have role="status"', () => {
    render(<Toast message="Test" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have aria-live="polite"', () => {
    render(<Toast message="Test" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('should have aria-atomic="true"', () => {
    render(<Toast message="Test" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-atomic', 'true');
  });

  it('should apply default variant styles', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('bg-gray-800');
    expect(toast).toHaveClass('text-white');
  });

  it('should apply success variant', () => {
    render(<Toast message="Success" variant="success" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('bg-green-600');
    expect(toast).toHaveClass('text-white');
  });

  it('should apply warning variant', () => {
    render(<Toast message="Warning" variant="warning" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('bg-amber-500');
    expect(toast).toHaveClass('text-white');
  });

  it('should apply error variant', () => {
    render(<Toast message="Error" variant="error" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('bg-red-600');
    expect(toast).toHaveClass('text-white');
  });

  it('should render dismiss button when onDismiss is provided', () => {
    render(<Toast message="Test" onDismiss={vi.fn()} />);
    expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
  });

  it('should not render dismiss button when onDismiss is not provided', () => {
    render(<Toast message="Test" />);
    expect(screen.queryByLabelText('Dismiss notification')).not.toBeInTheDocument();
  });

  it('should call onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Toast message="Test" onDismiss={onDismiss} />);

    const dismissButton = screen.getByLabelText('Dismiss notification');
    await user.click(dismissButton);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(<Toast message="Test" className="custom-class" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('custom-class');
  });

  it('should have correct padding', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('px-4');
    expect(toast).toHaveClass('py-3');
  });

  it('should be rounded', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('rounded-lg');
  });

  it('should have shadow', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveClass('shadow-lg');
  });

  it('dismiss button should have correct accessibility label', () => {
    render(<Toast message="Test" onDismiss={vi.fn()} />);
    expect(screen.getByLabelText('Dismiss notification')).toBeInTheDocument();
  });

  it('dismiss button should have hover effect', () => {
    render(<Toast message="Test" onDismiss={vi.fn()} />);
    const button = screen.getByLabelText('Dismiss notification');
    expect(button).toHaveClass('hover:opacity-100');
  });
});
