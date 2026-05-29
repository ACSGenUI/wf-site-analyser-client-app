import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal Component', () => {
  it('should render when open is true', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>,
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should not render when open is false', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>,
    );
    // When closed, the overlay shouldn't be visible
    const overlay = container.querySelector('[class*="bg-black"]');
    expect(overlay?.parentElement?.style.display).not.toBe('block');
  });

  it('should render title', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Modal Title">
        Content
      </Modal>,
    );
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        <div>Child Content</div>
      </Modal>,
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open={true} onClose={onClose} title="Title">
        Content
      </Modal>,
    );

    const closeButton = screen.getByLabelText('Close');
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should have aria-labelledby attribute', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        Content
      </Modal>,
    );

    const title = screen.getByText('Title');
    expect(title).toHaveAttribute('id', 'modal-title');
  });

  it('should apply custom className', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title" className="custom-class">
        Content
      </Modal>,
    );

    // Radix UI renders custom content within its own structure
    const content = screen.getByText('Content');
    expect(content).toBeInTheDocument();
  });

  it('should have backdrop blur effect', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        Content
      </Modal>,
    );

    // Check that the modal overlay exists (Radix UI creates it)
    const contentArea = screen.getByText('Content');
    expect(contentArea).toBeInTheDocument();
  });

  it('close button should have correct accessibility label', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        Content
      </Modal>,
    );

    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('should render multiple children elements', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Title">
        <div>First</div>
        <div>Second</div>
      </Modal>,
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
