import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { Input } from './Input';

describe('Input Component', () => {
  it('should render an input', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('should generate id from label', () => {
    render(<Input label="Email Address" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'email-address');
  });

  it('should use provided id instead of generating from label', () => {
    render(<Input label="Email" id="custom-id" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-id');
  });

  it('should render error message', () => {
    render(<Input error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('should apply error styles when error is present', () => {
    render(<Input error="Invalid" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveClass('focus:ring-red-500');
  });

  it('should not apply error styles when no error', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-gray-300');
    expect(input).toHaveClass('focus:ring-blue-500');
  });

  it('should be disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-50');
  });

  it('should apply custom className', () => {
    render(<Input className="custom" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom');
  });

  it('should handle value change', async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    await user.type(input, 'test value');
    expect(input.value).toBe('test value');
  });

  it('should have aria-invalid when error is present', () => {
    render(<Input error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not have aria-invalid when no error', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('should have aria-describedby pointing to error message', () => {
    render(<Input label="Email" error="Required" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  it('should set role="alert" on error message', () => {
    render(<Input error="Error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should apply focus styles', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:outline-none');
    expect(input).toHaveClass('focus:ring-2');
    expect(input).toHaveClass('focus:ring-offset-0');
  });

  it('should apply correct padding', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
  });

  it('should have type="text" by default', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should apply full width', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('w-full');
  });

  it('should apply cursor-not-allowed when disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('cursor-not-allowed');
  });

  it('should have bg-gray-50 when disabled', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-gray-50');
  });

  it('should have bg-white when enabled', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('bg-white');
  });

  it('should pass through other HTML attributes', () => {
    render(<Input placeholder="Enter email" required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveAttribute('required');
  });
});
