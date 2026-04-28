/**
 * SA-905: Account Settings
 *
 * Tests the account settings tab for both guest and authenticated states:
 * profile info display, sign-out flow, switch account, and cloud sync toggle.
 *
 * Test File: src/renderer/__tests__/features/settings/AccountSettings.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AccountSettings } from '@/features/settings/AccountSettings';
import { useSessionStore } from '@/store/sessionStore';

function renderAccount(authenticated = false) {
  if (authenticated) {
    useSessionStore.setState({
      mode: 'authenticated',
      userId: 'ims-user-001',
      createdAt: new Date(),
      profile: { name: 'Jane Doe', email: 'jane@example.com', org: 'Acme Corp' },
    });
  } else {
    useSessionStore.setState({ mode: 'guest', userId: 'guest-id', createdAt: new Date() });
  }
  return render(
    <MemoryRouter>
      <AccountSettings />
    </MemoryRouter>,
  );
}

describe('SA-905 – Account Settings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: Guest mode shows sign-in CTA
  it('TC-01: guest mode shows sign-in CTA with blue bg-blue-600 button', () => {
    renderAccount(false);
    const signInBtn = screen.getByRole('button', { name: /sign in with adobe|upgrade/i });
    expect(signInBtn).toBeInTheDocument();
    expect(signInBtn.className).toMatch(/bg-blue-600/);
  });

  // TC-02: Sign Out clears session and redirects
  it('TC-02: clicking Sign Out invokes auth:signOut IPC and redirects', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderAccount(true);
    await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
    // Confirmation dialog first
    await userEvent.click(screen.getByRole('button', { name: /confirm|yes/i }));
    expect(window.api['auth:signOut']).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/sign-in'));
  });

  // TC-03: Profile info shown when authenticated
  it('TC-03: authenticated user sees their name, email, and org', () => {
    renderAccount(true);
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  // TC-04: Switch Account triggers new OAuth flow
  it('TC-04: clicking Switch Account invokes auth:switchAccount IPC', async () => {
    renderAccount(true);
    await userEvent.click(screen.getByRole('button', { name: /switch account/i }));
    expect(window.api['auth:switchAccount']).toHaveBeenCalled();
  });

  // TC-05: Cloud sync toggle works
  it('TC-05: toggling cloud sync changes the switch aria-checked value', async () => {
    renderAccount(true);
    const syncToggle = screen.getByRole('switch', { name: /cloud sync/i });
    const initial = syncToggle.getAttribute('aria-checked');
    await userEvent.click(syncToggle);
    expect(syncToggle.getAttribute('aria-checked')).not.toBe(initial);
  });

  // TC-06: Confirmation required before sign out
  it('TC-06: Sign Out button shows a confirmation dialog before proceeding', async () => {
    renderAccount(true);
    await userEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(screen.getByRole('dialog') ?? screen.getByRole('alertdialog')).toBeInTheDocument();
  });
});
