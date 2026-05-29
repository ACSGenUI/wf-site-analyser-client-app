import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('should render a card with children', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  it('should have correct base classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('border-gray-200');
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('p-4');
    expect(card).toHaveClass('shadow-sm');
  });

  it('should apply custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('custom-class');
  });

  it('should combine base classes with custom className', () => {
    const { container } = render(<Card className="mt-4">Content</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('mt-4');
  });

  it('should render multiple children', () => {
    render(
      <Card>
        <h2>Title</h2>
        <p>Paragraph</p>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('should render complex content', () => {
    render(
      <Card>
        <div>
          <span>Complex</span>
          <span>Content</span>
        </div>
      </Card>,
    );
    expect(screen.getByText('Complex')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
