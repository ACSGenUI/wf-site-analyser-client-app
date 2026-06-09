/**
 * SA-703: Artifacts Download Panel
 *
 * Tests the download panel listing all generated output artifacts (CSV, JSON,
 * MD), individual file download via IPC, and "Download All" zip export.
 *
 * Test File: src/renderer/__tests__/features/results/ArtifactsDownloadPanel.test.tsx
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { ArtifactsDownloadPanel } from '@/features/results/ArtifactsDownloadPanel';

const mockArtifacts = [
  {
    name: 'block-mapping.csv',
    type: 'csv',
    size: '12 KB',
    path: '/output/block-mapping.csv',
  },
  {
    name: 'template-mapping.md',
    type: 'md',
    size: '3 KB',
    path: '/output/template-mapping.md',
  },
  {
    name: 'integrations.json',
    type: 'json',
    size: '5 KB',
    path: '/output/integrations.json',
  },
  {
    name: 'consolidated-blocks.csv',
    type: 'csv',
    size: '18 KB',
    path: '/output/consolidated-blocks.csv',
  },
];

function renderPanel(artifacts = mockArtifacts) {
  return render(<ArtifactsDownloadPanel artifacts={artifacts} />);
}

describe('SA-703 – Artifacts Download Panel', () => {
  // TC-01: All artifact names listed
  it('TC-01: renders all artifact file names in the panel', () => {
    renderPanel();
    expect(screen.getByText('block-mapping.csv')).toBeInTheDocument();
    expect(screen.getByText('template-mapping.md')).toBeInTheDocument();
    expect(screen.getByText('integrations.json')).toBeInTheDocument();
  });

  // TC-02: File size shown
  it('TC-02: each artifact entry shows its file size', () => {
    renderPanel();
    expect(screen.getByText('12 KB')).toBeInTheDocument();
    expect(screen.getByText('3 KB')).toBeInTheDocument();
  });

  // TC-03: Individual download button per file
  it('TC-03: each artifact has a download button', () => {
    renderPanel();
    const downloadBtns = screen.getAllByRole('button', { name: /download/i });
    expect(downloadBtns.length).toBeGreaterThanOrEqual(mockArtifacts.length);
  });

  // TC-04: Download invokes IPC export
  it('TC-04: clicking a download button calls the fs:exportFile IPC handler', async () => {
    renderPanel();
    const [firstDownloadBtn] = screen.getAllByRole('button', { name: /download/i });
    await userEvent.click(firstDownloadBtn);
    expect(window.api['fs:exportFile']).toHaveBeenCalled();
  });

  // TC-05: "Download All" button present
  it('TC-05: renders a "Download All" or "Export All" button', () => {
    renderPanel();
    expect(screen.getByRole('button', { name: /download all|export all/i })).toBeInTheDocument();
  });

  // TC-06: File type icons render
  it('TC-06: CSV, JSON, and MD files have distinct type icon indicators', () => {
    renderPanel();
    expect(screen.getByTestId('icon-csv')).toBeInTheDocument();
    expect(screen.getByTestId('icon-json')).toBeInTheDocument();
    expect(screen.getByTestId('icon-md')).toBeInTheDocument();
  });

  // TC-07: Empty artifacts state
  it('TC-07: shows empty state message when no artifacts are available', () => {
    renderPanel([]);
    expect(screen.getByText(/no artifacts|not available/i)).toBeInTheDocument();
  });
});
