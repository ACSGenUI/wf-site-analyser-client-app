import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('should render a badge with children', () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should apply default variant by default', () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-gray-100');
    expect(badge).toHaveClass('text-gray-700');
  });

  it('should apply success variant', () => {
    render(<Badge variant="success">Success</Badge>);
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100');
    expect(badge).toHaveClass('text-green-700');
  });

  it('should apply warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>);
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-amber-100');
    expect(badge).toHaveClass('text-amber-700');
  });

  it('should apply error variant', () => {
    render(<Badge variant="error">Error</Badge>);
    const badge = screen.getByText('Error');
    expect(badge).toHaveClass('bg-red-100');
    expect(badge).toHaveClass('text-red-700');
  });

  it('should apply info variant', () => {
    render(<Badge variant="info">Info</Badge>);
    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-100');
    expect(badge).toHaveClass('text-blue-700');
  });

  it('should apply custom className', () => {
    render(<Badge className="custom">Custom</Badge>);
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom');
  });

  it('should have rounded-full class', () => {
    render(<Badge>Rounded</Badge>);
    const badge = screen.getByText('Rounded');
    expect(badge).toHaveClass('rounded-full');
  });

  it('should be inline-flex', () => {
    render(<Badge>Flex</Badge>);
    const badge = screen.getByText('Flex');
    expect(badge).toHaveClass('inline-flex');
  });

  it('should have correct padding', () => {
    render(<Badge>Padding</Badge>);
    const badge = screen.getByText('Padding');
    expect(badge).toHaveClass('px-2.5');
    expect(badge).toHaveClass('py-0.5');
  });

  it('should have small text size', () => {
    render(<Badge>Small</Badge>);
    const badge = screen.getByText('Small');
    expect(badge).toHaveClass('text-xs');
    expect(badge).toHaveClass('font-medium');
  });

  it('should render with multiple children', () => {
    render(
      <Badge>
        <span>Icon</span>
        <span>Text</span>
      </Badge>,
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });
});
