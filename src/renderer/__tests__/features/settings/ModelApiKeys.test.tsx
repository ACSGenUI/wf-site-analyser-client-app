/**
 * SA-902: Model API Keys Configuration
 *
 * Tests masked API key inputs, show/hide toggle, format validation (sk- prefix),
 * encrypted storage via IPC, and helper text.
 *
 * Test File: src/renderer/__tests__/features/settings/ModelApiKeys.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModelApiKeys } from '@/features/settings/ModelApiKeys';

function renderApiKeys() {
  return render(<ModelApiKeys />);
}

describe('SA-902 – Model API Keys Configuration', () => {
  // TC-01: API key inputs masked by default
  it('TC-01: OpenAI and Anthropic key inputs are type="password" by default', () => {
    renderApiKeys();
    const inputs = screen.getAllByLabelText(/openai api key|anthropic api key/i);
    inputs.forEach((input) => expect(input).toHaveAttribute('type', 'password'));
  });

  // TC-02: Show/hide toggle reveals key
  it('TC-02: clicking the eye icon changes input type from "password" to "text"', async () => {
    renderApiKeys();
    const openaiInput = screen.getByLabelText(/openai api key/i);
    expect(openaiInput).toHaveAttribute('type', 'password');
    const toggleBtn = screen.getAllByRole('button', { name: /show|reveal|toggle/i })[0];
    await userEvent.click(toggleBtn);
    expect(openaiInput).toHaveAttribute('type', 'text');
  });

  // TC-03: Invalid key format shows error
  it('TC-03: entering an invalid key shows red border and error message', async () => {
    renderApiKeys();
    const openaiInput = screen.getByLabelText(/openai api key/i);
    await userEvent.type(openaiInput, 'invalid-key-format');
    fireEvent.blur(openaiInput);
    await waitFor(() => {
      expect(openaiInput.className).toMatch(/border-red-500/);
      expect(screen.getByText(/invalid key format/i)).toBeInTheDocument();
    });
  });

  // TC-04: Valid OpenAI key shows green check
  it('TC-04: a valid "sk-" prefixed key shows border-green-500 and a check icon', async () => {
    renderApiKeys();
    const openaiInput = screen.getByLabelText(/openai api key/i);
    await userEvent.type(openaiInput, 'sk-proj-validkeyABC123xyz');
    fireEvent.blur(openaiInput);
    await waitFor(() => {
      expect(openaiInput.className).toMatch(/border-green-500/);
      expect(screen.getByTestId('valid-check-openai')).toBeInTheDocument();
    });
  });

  // TC-05: Keys saved encrypted via IPC
  it('TC-05: saving a valid key calls safeStorage:encrypt via IPC', async () => {
    renderApiKeys();
    const openaiInput = screen.getByLabelText(/openai api key/i);
    await userEvent.type(openaiInput, 'sk-validkey12345');
    await userEvent.click(screen.getByRole('button', { name: /save|apply/i }));
    expect(window.api['safeStorage:encrypt']).toHaveBeenCalled();
  });

  // TC-06: Clearing a key invokes delete via IPC
  it('TC-06: clearing the input field and saving calls safeStorage:delete', async () => {
    vi.mocked(window.api['safeStorage:decrypt']).mockResolvedValue('sk-existingkey123');
    renderApiKeys();
    const openaiInput = screen.getByLabelText(/openai api key/i);
    await userEvent.clear(openaiInput);
    await userEvent.click(screen.getByRole('button', { name: /save|apply/i }));
    expect(window.api['safeStorage:delete']).toHaveBeenCalled();
  });

  // TC-07: Helper text about encryption shown
  it('TC-07: "Keys are encrypted at rest and never shared." text is visible', () => {
    renderApiKeys();
    expect(
      screen.getByText(/keys are encrypted at rest and never shared/i),
    ).toBeInTheDocument();
  });

  // TC-08: Anthropic key requires sk-ant- prefix
  it('TC-08: Anthropic key without "sk-ant-" prefix shows format error', async () => {
    renderApiKeys();
    const anthropicInput = screen.getByLabelText(/anthropic api key/i);
    await userEvent.type(anthropicInput, 'sk-wrong-prefix-123');
    fireEvent.blur(anthropicInput);
    await waitFor(() => {
      expect(anthropicInput.className).toMatch(/border-red-500/);
    });
  });
});
