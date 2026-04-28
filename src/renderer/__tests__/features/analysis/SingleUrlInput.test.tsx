/**
 * SA-502: Single URL Input Tab
 *
 * Tests the URL input field: placeholder text, live validation,
 * protocol auto-prepend, error states, and accessibility.
 *
 * Test File: src/renderer/__tests__/features/analysis/SingleUrlInput.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SingleUrlInput } from '@/features/analysis/tabs/SingleUrlInput';

function renderInput(onSubmit = vi.fn()) {
  return render(<SingleUrlInput onSubmit={onSubmit} />);
}

describe('SA-502 – Single URL Input Tab', () => {
  // TC-01: Input renders with placeholder
  it('TC-01: renders URL input with "https://" placeholder text', () => {
    renderInput();
    expect(screen.getByPlaceholderText(/https:\/\//i)).toBeInTheDocument();
  });

  // TC-02: Valid URL passes validation
  it('TC-02: valid URL shows no error state after blur', async () => {
    renderInput();
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'https://example.com');
    fireEvent.blur(input);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(input.className).not.toMatch(/border-red-500/);
  });

  // TC-03: Invalid URL shows error
  it('TC-03: entering an invalid URL shows a red border and error message', async () => {
    renderInput();
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'not-a-url');
    fireEvent.blur(input);
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(input.className).toMatch(/border-red-500/);
  });

  // TC-04: Protocol auto-prepended
  it('TC-04: typing "example.com" auto-prepends "https://"', async () => {
    renderInput();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.type(input, 'example.com');
    fireEvent.blur(input);
    await waitFor(() => {
      expect(input.value).toBe('https://example.com');
    });
  });

  // TC-05: Empty submission blocked
  it('TC-05: submitting an empty input shows a required field error', async () => {
    renderInput();
    fireEvent.submit(screen.getByRole('form') ?? screen.getByTestId('url-form'));
    await waitFor(() => {
      expect(screen.getByText(/required|enter a url/i)).toBeInTheDocument();
    });
  });

  // TC-06: Accessible label present
  it('TC-06: input has an accessible label', () => {
    renderInput();
    expect(screen.getByLabelText(/website url|url/i)).toBeInTheDocument();
  });
});
