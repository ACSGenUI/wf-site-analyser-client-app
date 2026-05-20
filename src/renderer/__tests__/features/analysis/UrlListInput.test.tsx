/**
 * SA-503: URL List / Batch Input Tab
 *
 * Tests the multi-URL textarea: bulk paste, per-line validation, deduplication,
 * URL count display, and clearing the list.
 *
 * Test File: src/renderer/__tests__/features/analysis/UrlListInput.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { UrlListInput } from '@/features/analysis/tabs/UrlListInput';

const VALID_URLS = 'https://example.com\nhttps://example.com/about\nhttps://example.com/contact';
const MIXED_URLS = 'https://valid.com\nnot-a-url\nhttps://also-valid.com';
const DUPLICATE_URLS = 'https://example.com\nhttps://example.com\nhttps://example.com';

function renderList(onChange = vi.fn()) {
  return render(<UrlListInput onChange={onChange} />);
}

describe('SA-503 – URL List Batch Input Tab', () => {
  // TC-01: Textarea renders with placeholder
  it('TC-01: textarea renders with instructional placeholder text', () => {
    renderList();
    expect(screen.getByPlaceholderText(/one url per line|paste urls/i)).toBeInTheDocument();
  });

  // TC-02: Valid URLs accepted
  it('TC-02: pasting 3 valid URLs shows a count of 3 URLs', async () => {
    renderList();
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, VALID_URLS);
    await waitFor(() => {
      expect(screen.getByText(/3 url/i)).toBeInTheDocument();
    });
  });

  // TC-03: Invalid lines flagged
  it('TC-03: invalid URL lines are highlighted or shown with an error badge', async () => {
    renderList();
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, MIXED_URLS);
    await waitFor(() => {
      expect(screen.getByText(/1 invalid/i)).toBeInTheDocument();
    });
  });

  // TC-04: Duplicates removed
  it('TC-04: pasting duplicate URLs results in a deduplicated list', async () => {
    renderList();
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, DUPLICATE_URLS);
    await waitFor(() => {
      expect(screen.getByText(/1 url/i)).toBeInTheDocument();
    });
  });

  // TC-05: Clear button empties the list
  it('TC-05: clicking Clear removes all URLs from the list', async () => {
    renderList();
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, VALID_URLS);
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect((textarea as HTMLTextAreaElement).value).toBe('');
  });

  // TC-06: onChange callback fires with valid URLs
  it('TC-06: onChange is called with the array of valid URLs after input', async () => {
    const onChange = vi.fn();
    renderList(onChange);
    const textarea = screen.getByRole('textbox');
    await userEvent.type(textarea, VALID_URLS);
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining(['https://example.com', 'https://example.com/about']),
      );
    });
  });
});
