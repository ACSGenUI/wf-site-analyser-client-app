/**
 * SA-504: CSV Upload Tab
 *
 * Tests the CSV file upload input: drag-and-drop zone, file picker, validation
 * of CSV structure, preview of parsed URLs, and error states for malformed files.
 *
 * Test File: src/renderer/__tests__/features/analysis/CsvUpload.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CsvUpload } from '@/features/analysis/tabs/CsvUpload';

const VALID_CSV_CONTENT = 'url\nhttps://example.com\nhttps://example.com/about';
const INVALID_CSV_CONTENT = 'name,age\nAlice,30\nBob,25';

function makeFile(content: string, name = 'urls.csv', type = 'text/csv') {
  return new File([content], name, { type });
}

function renderCsv(onChange = vi.fn()) {
  return render(<CsvUpload onChange={onChange} />);
}

describe('SA-504 – CSV Upload Tab', () => {
  // TC-01: Drop zone renders
  it('TC-01: file drop zone renders with instructional text', () => {
    renderCsv();
    expect(screen.getByText(/drag.*drop|upload.*csv/i)).toBeInTheDocument();
  });

  // TC-02: File picker via IPC
  it('TC-02: clicking "Browse" opens the file picker via IPC', async () => {
    renderCsv();
    await userEvent.click(screen.getByRole('button', { name: /browse|choose file/i }));
    expect(window.api['fs:openDialog']).toHaveBeenCalled();
  });

  // TC-03: Valid CSV parsed and previewed
  it('TC-03: uploading a valid CSV shows parsed URL count in the preview', async () => {
    vi.mocked(window.api['fs:openDialog']).mockResolvedValue({
      filePath: '/tmp/urls.csv',
      content: VALID_CSV_CONTENT,
    });
    renderCsv();
    await userEvent.click(screen.getByRole('button', { name: /browse|choose file/i }));
    await waitFor(() => {
      expect(screen.getByText(/2 url/i)).toBeInTheDocument();
    });
  });

  // TC-04: Missing URL column shows error
  it('TC-04: CSV without a "url" column shows a descriptive error', async () => {
    vi.mocked(window.api['fs:openDialog']).mockResolvedValue({
      filePath: '/tmp/invalid.csv',
      content: INVALID_CSV_CONTENT,
    });
    renderCsv();
    await userEvent.click(screen.getByRole('button', { name: /browse|choose file/i }));
    await waitFor(() => {
      expect(screen.getByText(/url column|missing column/i)).toBeInTheDocument();
    });
  });

  // TC-05: Wrong file type rejected
  it('TC-05: uploading a non-CSV file shows a type error', async () => {
    const file = makeFile('not csv content', 'data.txt', 'text/plain');
    renderCsv();
    const dropzone = screen.getByTestId('csv-dropzone');
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [file], types: ['Files'] },
    });
    await waitFor(() => {
      expect(screen.getByText(/csv only|invalid file type/i)).toBeInTheDocument();
    });
  });

  // TC-06: Drag-over styles apply
  it('TC-06: dragging a file over the drop zone applies active styling', () => {
    renderCsv();
    const dropzone = screen.getByTestId('csv-dropzone');
    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toMatch(/border-blue-600|drag-active/);
  });

  // TC-07: Remove file clears the selection
  it('TC-07: clicking Remove clears the selected file', async () => {
    vi.mocked(window.api['fs:openDialog']).mockResolvedValue({
      filePath: '/tmp/urls.csv',
      content: VALID_CSV_CONTENT,
    });
    renderCsv();
    await userEvent.click(screen.getByRole('button', { name: /browse|choose file/i }));
    await waitFor(() => expect(screen.getByText(/2 url/i)).toBeInTheDocument());
    await userEvent.click(screen.getByRole('button', { name: /remove|clear/i }));
    expect(screen.queryByText(/2 url/i)).toBeNull();
  });
});
