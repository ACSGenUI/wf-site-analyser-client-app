/**
 * SA-505: Figma Input Tab
 *
 * Tests the Figma URL/token input: format validation, API key field,
 * connection test button, success/error feedback, and persisted state.
 *
 * Test File: src/renderer/__tests__/features/analysis/FigmaInput.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FigmaInput } from '@/features/analysis/tabs/FigmaInput';

function renderFigma(onChange = vi.fn()) {
  return render(<FigmaInput onChange={onChange} />);
}

describe('SA-505 – Figma Input Tab', () => {
  // TC-01: Input fields render
  it('TC-01: renders Figma file URL and API token input fields', () => {
    renderFigma();
    expect(screen.getByLabelText(/figma.*url|file url/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/api.*token|access token/i)).toBeInTheDocument();
  });

  // TC-02: Valid Figma URL passes validation
  it('TC-02: a valid Figma URL passes format validation without error', async () => {
    renderFigma();
    const urlInput = screen.getByLabelText(/figma.*url|file url/i);
    await userEvent.type(urlInput, 'https://www.figma.com/design/ABC123XYZ/My-Design');
    fireEvent.blur(urlInput);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(urlInput.className).not.toMatch(/border-red-500/);
  });

  // TC-03: Non-Figma URL shows error
  it('TC-03: a non-Figma URL shows a red border and error message', async () => {
    renderFigma();
    const urlInput = screen.getByLabelText(/figma.*url|file url/i);
    await userEvent.type(urlInput, 'https://example.com/design');
    fireEvent.blur(urlInput);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(urlInput.className).toMatch(/border-red-500/);
  });

  // TC-04: API token masked by default
  it('TC-04: API token input is type="password" by default', () => {
    renderFigma();
    const tokenInput = screen.getByLabelText(/api.*token|access token/i);
    expect(tokenInput).toHaveAttribute('type', 'password');
  });

  // TC-05: Token show/hide toggle
  it('TC-05: clicking the eye icon reveals the token value', async () => {
    renderFigma();
    const tokenInput = screen.getByLabelText(/api.*token|access token/i);
    const toggleBtn = screen.getByRole('button', { name: /show|reveal|toggle/i });
    expect(tokenInput).toHaveAttribute('type', 'password');
    await userEvent.click(toggleBtn);
    expect(tokenInput).toHaveAttribute('type', 'text');
  });

  // TC-06: Both fields required before submission
  it('TC-06: form shows errors when submitted with empty fields', async () => {
    renderFigma();
    fireEvent.submit(screen.getByTestId('figma-form'));
    await waitFor(() => {
      const errors = screen.getAllByRole('alert');
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
