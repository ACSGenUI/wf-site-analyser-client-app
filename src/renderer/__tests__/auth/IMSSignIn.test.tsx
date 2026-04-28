/**
 * SA-1001: Adobe IMS Sign-In
 *
 * Tests the IMS sign-in button: OAuth flow trigger via IPC, loading state,
 * successful auth redirect, token storage, and failure/network error states.
 *
 * Test File: src/renderer/__tests__/auth/IMSSignIn.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IMSSignInButton } from '@/features/auth/IMSSignInButton';

function renderSignIn(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter initialEntries={['/sign-in']}>
      <Routes>
        <Route path="/sign-in" element={<IMSSignInButton onSuccess={onSuccess} />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SA-1001 – Adobe IMS Sign-In', () => {
  // TC-01: Sign-in button renders with Adobe icon
  it('TC-01: renders button with Adobe icon and "Sign in with Adobe IMS" text', () => {
    renderSignIn();
    const btn = screen.getByRole('button', { name: /sign in with adobe ims/i });
    expect(btn).toBeInTheDocument();
    expect(
      btn.querySelector('[data-icon="adobe"]') ??
      screen.getByTestId('adobe-icon'),
    ).toBeInTheDocument();
  });

  // TC-02: Click opens OAuth flow via IPC
  it('TC-02: clicking the button invokes auth:openOAuthWindow IPC', async () => {
    renderSignIn();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    expect(window.api['auth:openOAuthWindow']).toHaveBeenCalled();
  });

  // TC-03: Successful auth redirects to Dashboard
  it('TC-03: successful OAuth callback navigates to /dashboard', async () => {
    vi.mocked(window.api['auth:openOAuthWindow']).mockResolvedValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      userId: 'user-123',
    });
    renderSignIn();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  // TC-04: Tokens stored in OS keychain
  it('TC-04: successful auth calls safeStorage:encrypt to persist tokens', async () => {
    vi.mocked(window.api['auth:openOAuthWindow']).mockResolvedValue({
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      userId: 'user-123',
    });
    renderSignIn();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    await waitFor(() => {
      expect(window.api['safeStorage:encrypt']).toHaveBeenCalled();
    });
  });

  // TC-05: Failed auth shows inline error
  it('TC-05: OAuth failure shows a red inline error message below the button', async () => {
    vi.mocked(window.api['auth:openOAuthWindow']).mockRejectedValue(
      new Error('Authentication failed'),
    );
    renderSignIn();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/authentication failed|sign.in failed/i)).toBeInTheDocument();
    });
  });

  // TC-06: Network error shows retry option
  it('TC-06: network error displays an error message with a retry button', async () => {
    vi.mocked(window.api['auth:openOAuthWindow']).mockRejectedValue(
      new Error('Network error'),
    );
    renderSignIn();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  // TC-07: Loading state shows spinner
  it('TC-07: button shows spinner and "Signing in..." text during the auth flow', async () => {
    vi.mocked(window.api['auth:openOAuthWindow']).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ accessToken: 'tok' }), 2000)),
    );
    renderSignIn();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    // While pending
    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
