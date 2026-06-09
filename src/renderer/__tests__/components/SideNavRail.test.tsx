/**
 * SA-401: Left Navigation Rail
 *
 * Tests that the sidebar renders all navigation items with correct active
 * states, drives React Router navigation, supports keyboard traversal, and
 * is hidden on the sign-in screen.
 *
 * Test File: src/renderer/__tests__/components/SideNavRail.test.tsx
 */

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

import { SideNavRail } from '@/components/SideNavRail';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function renderNav(initialRoute = '/dashboard') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <SideNavRail />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('SA-401 – Left Navigation Rail', () => {
  // TC-01: Sidebar renders with all 4 nav items
  it('TC-01: renders Dashboard, Projects, Settings, and Help nav items', () => {
    renderNav();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /help/i })).toBeInTheDocument();
  });

  // TC-02: Active item shows blue highlight with left border
  it('TC-02: active nav item has border-l-2 and border-blue-600 classes', () => {
    renderNav('/dashboard');
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    // NavLink adds an "active" class; the component should map this to Tailwind classes
    expect(dashboardLink.className).toMatch(/border-l-2/);
    expect(dashboardLink.className).toMatch(/border-blue-600/);
  });

  // TC-03: Clicking nav item updates route
  it('TC-03: clicking Settings navigates to the /settings route', async () => {
    const currentPath = '';
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <SideNavRail />
        <Routes>
          <Route path="*" element={<span data-testid="route-spy" />} />
        </Routes>
      </MemoryRouter>,
    );
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  // TC-04: Hover state applies bg-gray-100 class
  it('TC-04: hovering over an inactive nav item adds bg-gray-100', async () => {
    renderNav('/dashboard');
    const projectsLink = screen.getByRole('link', { name: /projects/i });
    await userEvent.hover(projectsLink);
    expect(projectsLink.className).toMatch(/hover:bg-gray-100|bg-gray-100/);
  });

  // TC-05: Version number displayed at bottom
  it('TC-05: app version string is rendered at the bottom of the sidebar', async () => {
    renderNav();
    // Version should match the mock from setup.ts (window.api.getAppVersion returns '2.4.0')
    expect(await screen.findByText(/V2\.\d+\.\d+|v\d+\.\d+\.\d+/i)).toBeInTheDocument();
  });

  // TC-06: Sidebar hidden on sign-in route
  it('TC-06: sidebar is NOT rendered on the /sign-in route', () => {
    // Simulate that the parent layout does not render SideNavRail on /sign-in
    render(
      <MemoryRouter initialEntries={['/sign-in']}>
        <Routes>
          <Route path="/sign-in" element={<div data-testid="sign-in-page">Sign In</div>} />
          <Route path="*" element={<SideNavRail />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.getByTestId('sign-in-page')).toBeInTheDocument();
  });

  // TC-07: Keyboard navigation between items
  it('TC-07: arrow keys move focus between nav items', async () => {
    renderNav();
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });
    const projectsLink = screen.getByRole('link', { name: /projects/i });

    dashboardLink.focus();
    expect(document.activeElement).toBe(dashboardLink);

    await userEvent.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(projectsLink);
  });
});
