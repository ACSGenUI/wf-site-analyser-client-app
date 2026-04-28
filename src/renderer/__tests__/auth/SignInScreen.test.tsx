/**
 * SA-1002: Sign-In Screen UI
 *
 * Tests the standalone sign-in page: no app shell, centered card, guest bypass,
 * decorative panel, footer links, and session-skip behaviour.
 *
 * Test File: src/renderer/__tests__/auth/SignInScreen.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SignInScreen } from '@/features/auth/SignInScreen';

function renderSignInScreen(hasValidSession = false) {
  vi.mocked(window.api.storeGet).mockImplementation(async (key: string) => {
    if (key === 'accessToken') return hasValidSession ? 'valid-token' : null;
    return null;
  });
  return render(
    <MemoryRouter initialEntries={['/sign-in']}>
      <Routes>
        <Route path="/sign-in" element={<SignInScreen />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('SA-1002 – Sign-In Screen UI', () => {
  // TC-01: Renders without app shell (no sidebar or header)
  it('TC-01: sidebar and top header are NOT present on the sign-in screen', () => {
    renderSignInScreen();
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('banner')).toBeNull();
  });

  // TC-02: Centered card at 448px (max-w-md)
  it('TC-02: the sign-in card has max-w-md Tailwind class', () => {
    const { container } = renderSignInScreen();
    const card = container.querySelector('[class*="max-w-md"]');
    expect(card).not.toBeNull();
  });

  // TC-03: Adobe IMS button triggers OAuth flow
  it('TC-03: clicking "Sign in with Adobe IMS" initiates the OAuth flow', async () => {
    renderSignInScreen();
    await userEvent.click(screen.getByRole('button', { name: /sign in with adobe ims/i }));
    expect(window.api['auth:openOAuthWindow']).toHaveBeenCalled();
  });

  // TC-04: Continue as Guest navigates to Dashboard
  it('TC-04: clicking "Continue as Guest" navigates to /dashboard', async () => {
    renderSignInScreen();
    await userEvent.click(screen.getByRole('button', { name: /continue as guest/i }));
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  // TC-05: Guest info panel explains limitations
  it('TC-05: guest info panel shows explanation about local-only mode', () => {
    renderSignInScreen();
    expect(screen.getByText(/guest mode information/i)).toBeInTheDocument();
    expect(screen.getByText(/local only|no sync|no cloud/i)).toBeInTheDocument();
  });

  // TC-06: Decorative right panel renders
  it('TC-06: right decorative panel with tagline is visible', () => {
    renderSignInScreen();
    expect(screen.getByText(/precision architect|site analyzer/i)).toBeInTheDocument();
  });

  // TC-07: Footer links open in external browser
  it('TC-07: clicking "Terms of Service" calls shell:openExternal IPC', async () => {
    renderSignInScreen();
    await userEvent.click(screen.getByRole('link', { name: /terms of service/i }));
    expect(window.api['shell:openExternal']).toHaveBeenCalled();
  });

  // TC-08: Valid existing session skips sign-in screen
  it('TC-08: app redirects to /dashboard when a valid session token exists', async () => {
    renderSignInScreen(true); // hasValidSession = true
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
    expect(screen.queryByRole('button', { name: /sign in with adobe ims/i })).toBeNull();
  });
});
