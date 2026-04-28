/**
 * SA-302: Session State Display
 *
 * Tests that the header correctly reflects the guest session state —
 * showing the "LOCAL SESSION" badge, user ID snippet, and session age —
 * and updates immediately when the session transitions.
 *
 * Test File: src/renderer/__tests__/auth/SessionStateDisplay.test.tsx
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '@/components/Header';
import { useSessionStore } from '@/store/sessionStore';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setGuestSession(userId = 'abc12345-def6-7890-ghij-klmnopqrstuv') {
  useSessionStore.setState({
    mode: 'guest',
    userId,
    createdAt: new Date('2026-04-10T08:00:00Z'),
  });
}

function setAuthSession() {
  useSessionStore.setState({
    mode: 'authenticated',
    userId: 'ims-user-001',
    createdAt: new Date('2026-04-10T08:00:00Z'),
    profile: { name: 'Jane Doe', email: 'jane@example.com', org: 'Acme Corp' },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('SA-302 – Session State Display', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TC-01: LOCAL SESSION badge has green styling
  it('TC-01: "LOCAL SESSION" badge renders with green color class', () => {
    setGuestSession();
    render(<Header />);
    const badge = screen.getByText(/local session/i);
    expect(badge).toBeInTheDocument();
    // Badge should use Tailwind green classes
    expect(badge.className).toMatch(/green/i);
  });

  // TC-02: User ID snippet shows truncated UUID
  it('TC-02: truncated user ID is shown below the session badge', () => {
    const userId = 'abc12345-def6-7890-ghij-klmnopqrstuv';
    setGuestSession(userId);
    render(<Header />);
    // Should show first 8 chars of UUID
    expect(screen.getByText(/abc12345/i)).toBeInTheDocument();
  });

  // TC-03: Session age displayed
  it('TC-03: session age or creation timestamp is visible in the header', () => {
    setGuestSession();
    render(<Header />);
    // Should show some kind of "session started" or elapsed time text
    expect(
      screen.getByText(/session|started|today/i),
    ).toBeInTheDocument();
  });

  // TC-04: Badge hidden when authenticated
  it('TC-04: "LOCAL SESSION" badge is not shown when user is authenticated', () => {
    setAuthSession();
    render(<Header />);
    expect(screen.queryByText(/local session/i)).toBeNull();
  });

  // TC-05: Profile avatar shown for authenticated user
  it('TC-05: profile avatar renders when the user is authenticated', () => {
    setAuthSession();
    render(<Header />);
    // Avatar img or initials element
    expect(
      screen.getByRole('img', { name: /avatar|jane doe/i }) ??
      screen.getByText('JD'),
    ).toBeInTheDocument();
  });
});
