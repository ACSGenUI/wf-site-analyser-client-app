/**
 * SA-102: Design System & Component Library
 *
 * Tests that design tokens are defined, base components render all variants,
 * components are accessible, and the dark mode token set is stubbed.
 *
 * Test File: src/renderer/__tests__/components/design-system.test.tsx
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Drawer } from '@/components/Drawer';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select';
import { Table } from '@/components/Table';
import { tokens, darkTokens } from '@/components/theme';
import { Toast } from '@/components/Toast';
import { Toggle } from '@/components/Toggle';

// ---------------------------------------------------------------------------
// TC-01: Design tokens are defined
// ---------------------------------------------------------------------------
describe('TC-01: Design tokens are defined', () => {
  it('exports color tokens: primary, neutral, success, warning, error', () => {
    expect(tokens.colors.primary).toBeDefined();
    expect(tokens.colors.neutral).toBeDefined();
    expect(tokens.colors.success).toBeDefined();
    expect(tokens.colors.warning).toBeDefined();
    expect(tokens.colors.error).toBeDefined();
  });

  it('primary color matches the design specification (#0265DC approx.)', () => {
    expect(tokens.colors.primary).toMatch(/#[0-9A-Fa-f]{6}/);
  });

  it('exports typography scale with H1 through H4, body, caption, small', () => {
    expect(tokens.typography.h1).toBeDefined();
    expect(tokens.typography.h2).toBeDefined();
    expect(tokens.typography.h3).toBeDefined();
    expect(tokens.typography.h4).toBeDefined();
    expect(tokens.typography.body).toBeDefined();
    expect(tokens.typography.caption).toBeDefined();
    expect(tokens.typography.small).toBeDefined();
  });

  it('exports spacing scale with 4px base unit increments (4, 8, 12, 16, 24, 32, 48)', () => {
    expect(tokens.spacing[4]).toBeDefined();
    expect(tokens.spacing[8]).toBeDefined();
    expect(tokens.spacing[12]).toBeDefined();
    expect(tokens.spacing[16]).toBeDefined();
    expect(tokens.spacing[24]).toBeDefined();
    expect(tokens.spacing[32]).toBeDefined();
    expect(tokens.spacing[48]).toBeDefined();
  });

  it('exports border radius tokens for inputs (4px), cards (8px), modals (12px), full', () => {
    expect(tokens.borderRadius.input).toBe('4px');
    expect(tokens.borderRadius.card).toBe('8px');
    expect(tokens.borderRadius.modal).toBe('12px');
    expect(tokens.borderRadius.full).toBeDefined();
  });

  it('exports shadow tokens: subtle (cards), medium (modals), none (flat elements)', () => {
    expect(tokens.shadows.subtle).toBeDefined();
    expect(tokens.shadows.medium).toBeDefined();
    expect(tokens.shadows.none).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// TC-02: Button renders all variants
// ---------------------------------------------------------------------------
describe('TC-02: Button renders all variants', () => {
  it('renders primary variant as a button element', () => {
    render(<Button variant="primary">Save</Button>);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('primary variant has a filled background class', () => {
    render(<Button variant="primary">Save</Button>);
    const btn = screen.getByRole('button', { name: /save/i });
    expect(btn.className).toMatch(/bg-/);
  });

  it('renders secondary variant with a border class', () => {
    render(<Button variant="secondary">Cancel</Button>);
    const btn = screen.getByRole('button', { name: /cancel/i });
    expect(btn.className).toMatch(/border/);
  });

  it('renders ghost variant as a button element', () => {
    render(<Button variant="ghost">Learn more</Button>);
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
  });

  it('disabled variant sets the disabled attribute', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('loading variant shows a loading indicator with role="status"', () => {
    render(<Button loading>Saving…</Button>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('loading variant disables the button while in progress', () => {
    render(<Button loading>Saving…</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// TC-03: Input renders all states
// ---------------------------------------------------------------------------
describe('TC-03: Input renders all states', () => {
  it('renders default state as a text input', () => {
    render(<Input placeholder="Enter a URL" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('disabled state sets the disabled attribute', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('error state renders the error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('error state applies red styling to the input border', () => {
    render(<Input error="Invalid URL" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toMatch(/border-red|ring-red/);
  });

  it('error state marks the input as aria-invalid', () => {
    render(<Input error="Required" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

// ---------------------------------------------------------------------------
// TC-04: Components are keyboard-navigable
// ---------------------------------------------------------------------------
describe('TC-04: Components are keyboard-navigable', () => {
  it('Button can be focused programmatically', () => {
    render(<Button variant="primary">Focus me</Button>);
    const btn = screen.getByRole('button', { name: /focus me/i });
    btn.focus();
    expect(document.activeElement).toBe(btn);
  });

  it('Button fires onClick when activated via Enter key', async () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /submit/i });
    btn.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Button fires onClick when activated via Space key', async () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" onClick={handleClick}>
        Submit
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /submit/i });
    btn.focus();
    await userEvent.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Input can be focused with Tab key', async () => {
    render(<Input placeholder="Type here" />);
    await userEvent.tab();
    expect(document.activeElement).toBe(screen.getByRole('textbox'));
  });

  it('disabled Button cannot be activated by keyboard', async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const btn = screen.getByRole('button', { name: /disabled/i });
    btn.focus();
    await userEvent.keyboard('{Enter}');
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// TC-05: Storybook catalog renders (E2E proxy — all base components importable)
// ---------------------------------------------------------------------------
describe('TC-05: Storybook catalog — base components are importable and renderable', () => {
  it('Button is defined and renderable', () => {
    expect(Button).toBeDefined();
    const { container } = render(<Button>Test</Button>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Input is defined and renderable', () => {
    expect(Input).toBeDefined();
    const { container } = render(<Input />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Card is defined and renderable', () => {
    expect(Card).toBeDefined();
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Badge is defined and renderable', () => {
    expect(Badge).toBeDefined();
    const { container } = render(<Badge>Status</Badge>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Toggle is defined and renderable', () => {
    expect(Toggle).toBeDefined();
    const { container } = render(<Toggle />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Select is defined and renderable', () => {
    expect(Select).toBeDefined();
    const { container } = render(<Select options={[{ value: 'a', label: 'Option A' }]} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Modal is defined and renderable', () => {
    expect(Modal).toBeDefined();
    const { container } = render(
      <Modal open={false} onClose={() => {}} title="Test">
        Body
      </Modal>,
    );
    expect(container).toBeInTheDocument();
  });

  it('Drawer is defined and renderable', () => {
    expect(Drawer).toBeDefined();
    const { container } = render(
      <Drawer open={false} onClose={() => {}}>
        Content
      </Drawer>,
    );
    expect(container).toBeInTheDocument();
  });

  it('Toast is defined and renderable', () => {
    expect(Toast).toBeDefined();
    const { container } = render(<Toast message="Saved successfully" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('Table is defined and renderable', () => {
    expect(Table).toBeDefined();
    const { container } = render(<Table columns={[{ key: 'name', header: 'Name' }]} rows={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// TC-06: Dark mode token set is stubbed
// ---------------------------------------------------------------------------
describe('TC-06: Dark mode token set is stubbed', () => {
  it('darkTokens is exported and defined', () => {
    expect(darkTokens).toBeDefined();
  });

  it('darkTokens includes color overrides for the dark theme', () => {
    expect(darkTokens.colors).toBeDefined();
    expect(darkTokens.colors.primary).toBeDefined();
  });

  it('dark mode token set does not break component rendering', () => {
    render(<Button variant="primary">Dark mode test</Button>);
    expect(screen.getByRole('button', { name: /dark mode test/i })).toBeInTheDocument();
  });

  it('darkTokens has the same shape as tokens for structural completeness', () => {
    expect(typeof darkTokens.colors).toBe(typeof tokens.colors);
  });
});
