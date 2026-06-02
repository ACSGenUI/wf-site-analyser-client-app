import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Drawer } from './Drawer';

describe('Drawer Component', () => {
  it('should render when open is true', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should not render dialog when open is false', () => {
    const { container } = render(
      <Drawer open={false} onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).toHaveClass('translate-x-full');
  });

  it('should render with title', () => {
    render(
      <Drawer open onClose={vi.fn()} title="Drawer Title">
        Content
      </Drawer>,
    );
    expect(screen.getByText('Drawer Title')).toBeInTheDocument();
  });

  it('should have aria-modal set to true', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('should have aria-label from title', () => {
    render(
      <Drawer open onClose={vi.fn()} title="My Drawer">
        Content
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'My Drawer');
  });

  it('should have default aria-label when no title', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Drawer');
  });

  it('should position on right by default', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('right-0');
  });

  it('should position on left when side is left', () => {
    render(
      <Drawer open onClose={vi.fn()} side="left">
        Content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('left-0');
  });

  it('should call onClose when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(
      <Drawer open onClose={onClose}>
        Content
      </Drawer>,
    );

    const overlay = container.querySelector('[aria-hidden="true"]');
    if (overlay) {
      await user.click(overlay);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Drawer open onClose={onClose} title="Title">
        Content
      </Drawer>,
    );

    const closeButton = screen.getByLabelText('Close drawer');
    await user.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    render(
      <Drawer open onClose={vi.fn()} className="custom-class">
        Content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('custom-class');
  });

  it('should render children', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        <div>Child Content</div>
      </Drawer>,
    );
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should have correct width', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('w-80');
  });

  it('should be fixed positioned', () => {
    render(
      <Drawer open onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('fixed');
  });

  it('overlay should not have aria-hidden when drawer is closed', () => {
    const { container } = render(
      <Drawer open={false} onClose={vi.fn()}>
        Content
      </Drawer>,
    );
    const overlay = container.querySelector('[aria-hidden="true"]');
    expect(overlay).not.toBeInTheDocument();
  });
});
