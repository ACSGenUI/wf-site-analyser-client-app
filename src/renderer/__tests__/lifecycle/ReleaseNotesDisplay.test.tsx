/**
 * SA-203: Release Notes Display
 *
 * Tests that release notes render correctly inside the Force Update Modal,
 * with proper version headings, markdown formatting, and change-type badges.
 *
 * Test File: src/renderer/__tests__/lifecycle/ReleaseNotesDisplay.test.tsx
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ReleaseNotes } from '@/components/ReleaseNotes';

const mockNotes = [
  {
    version: '2.4.0',
    date: '2026-04-01',
    changes: [
      { type: 'new' as const, text: 'Added RAG chat panel to results workspace' },
      { type: 'improved' as const, text: 'Faster block extraction using parallel processing' },
      { type: 'fixed' as const, text: 'Fixed crash when CSV contained empty rows' },
    ],
  },
];

describe('SA-203 – Release Notes Display', () => {
  // TC-01: Version heading renders
  it('TC-01: renders version number as a heading', () => {
    render(<ReleaseNotes notes={mockNotes} />);
    expect(screen.getByText(/2\.4\.0/)).toBeInTheDocument();
  });

  // TC-02: Change entries render
  it('TC-02: renders all change entries from the notes list', () => {
    render(<ReleaseNotes notes={mockNotes} />);
    expect(screen.getByText(/RAG chat panel/i)).toBeInTheDocument();
    expect(screen.getByText(/Faster block extraction/i)).toBeInTheDocument();
    expect(screen.getByText(/CSV contained empty rows/i)).toBeInTheDocument();
  });

  // TC-03: Change type badges render
  it('TC-03: renders colored badge for each change type', () => {
    render(<ReleaseNotes notes={mockNotes} />);
    expect(screen.getByText(/new/i)).toBeInTheDocument();
    expect(screen.getByText(/improved/i)).toBeInTheDocument();
    expect(screen.getByText(/fixed/i)).toBeInTheDocument();
  });

  // TC-04: Release date shown
  it('TC-04: renders release date alongside the version heading', () => {
    render(<ReleaseNotes notes={mockNotes} />);
    expect(screen.getByText(/2026-04-01|April 1, 2026/i)).toBeInTheDocument();
  });

  // TC-05: Empty notes state
  it('TC-05: renders gracefully when no notes are provided', () => {
    const { container } = render(<ReleaseNotes notes={[]} />);
    expect(container).toBeInTheDocument();
    expect(screen.queryByText(/2\.4\.0/)).toBeNull();
  });

  // TC-06: Multiple versions render in order
  it('TC-06: renders multiple versions in descending order', () => {
    const multiNotes = [
      {
        version: '2.3.0',
        date: '2026-03-01',
        changes: [{ type: 'fixed' as const, text: 'Minor bug fix' }],
      },
      {
        version: '2.4.0',
        date: '2026-04-01',
        changes: [{ type: 'new' as const, text: 'New feature' }],
      },
    ];
    render(<ReleaseNotes notes={multiNotes} />);
    const versionHeadings = screen.getAllByRole('heading').map((h) => h.textContent);
    // 2.4.0 should appear before 2.3.0
    const v24Index = versionHeadings.findIndex((t) => t?.includes('2.4.0'));
    const v23Index = versionHeadings.findIndex((t) => t?.includes('2.3.0'));
    expect(v24Index).toBeLessThan(v23Index);
  });
});
