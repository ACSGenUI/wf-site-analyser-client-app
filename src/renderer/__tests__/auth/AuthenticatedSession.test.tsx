/**
 * SA-1003: Authenticated Session & Cloud Sync
 *
 * Tests the authenticated header: profile avatar, sync status badge variants,
 * avatar dropdown, sign-out and switch-account flows, and hiding LOCAL SESSION badge.
 *
 * Test File: src/renderer/__tests__/auth/AuthenticatedSession.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { Header } from '@/components/Header';
import { useSessionStore } from '@/store/sessionStore';

function setAuthSession(syncStatus: 'syncing' | 'synced' | 'offline' | 'error' = 'synced') {
  useSessionStore.setState({
    mode: 'authenticated',
    userId: 'ims-user-001',
    createdAt: new Date(),
    syncStatus,
    profile: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      org: 'Acme Corp',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
  });
}

function renderAuthHeader(syncStatus: 'syncing' | 'synced' | 'offline' | 'error' = 'synced') {
  setAuthSession(syncStatus);
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('SA-1003 – Authenticated Session & Cloud Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: Profile avatar renders from IMS data
  it('TC-01: profile avatar img has the correct src from IMS profile', () => {
    renderAuthHeader();
    const avatar = screen.getByRole('img', { name: /jane doe|avatar/i });
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  // TC-02: Sync status shows Synced/Syncing/Offline
  it('TC-02a: "Synced" status renders with text-green-600 class', () => {
    renderAuthHeader('synced');
    const badge = screen.getByText(/synced/i);
    expect(badge.className).toMatch(/text-green-600/);
  });

  it('TC-02b: "Syncing" status renders with text-blue-600 class', () => {
    renderAuthHeader('syncing');
    const badge = screen.getByText(/syncing/i);
    expect(badge.className).toMatch(/text-blue-600/);
  });

  it('TC-02c: "Offline" status renders with text-gray-500 class', () => {
    renderAuthHeader('offline');
    const badge = screen.getByText(/offline/i);
    expect(badge.className).toMatch(/text-gray-500/);
  });

  // TC-03: Avatar dropdown shows name/email/org
  it('TC-03: clicking avatar opens dropdown with name, email, and organization', async () => {
    renderAuthHeader();
    await userEvent.click(screen.getByRole('img', { name: /jane doe|avatar/i }));
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  // TC-04: Sign Out clears tokens and redirects
  it('TC-04: clicking Sign Out calls auth:signOut IPC and redirects to /sign-in', async () => {
    const mockNavigate = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
      return { ...actual, useNavigate: () => mockNavigate };
    });
    renderAuthHeader();
    await userEvent.click(screen.getByRole('img', { name: /jane doe|avatar/i }));
    await userEvent.click(screen.getByRole('menuitem', { name: /sign out/i }));
    expect(window.api['auth:signOut']).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/sign-in'));
  });

  // TC-05: Switch Account triggers new OAuth
  it('TC-05: clicking Switch Account calls auth:switchAccount IPC', async () => {
    renderAuthHeader();
    await userEvent.click(screen.getByRole('img', { name: /jane doe|avatar/i }));
    await userEvent.click(screen.getByRole('menuitem', { name: /switch account/i }));
    expect(window.api['auth:switchAccount']).toHaveBeenCalled();
  });

  // TC-06: LOCAL SESSION badge not shown for authenticated user
  it('TC-06: "LOCAL SESSION" badge is absent when the user is authenticated', () => {
    renderAuthHeader();
    expect(screen.queryByText(/local session/i)).toBeNull();
  });
});
