/**
 * SA-705: Extracted UI Blocks Table
 *
 * Tests the structured block table: column headers, colored status dots,
 * column sorting, type filtering, empty state, and detail drawer on action click.
 *
 * Test File: src/renderer/__tests__/features/results/UiBlocksTable.test.tsx
 */

import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { UiBlocksTable } from '@/features/results/UiBlocksTable';

const mockBlocks = [
  {
    id: 'BLOCK_01',
    type: 'Hero Section',
    category: 'layout',
    attributes: ['H1', 'Button', 'Background Video'],
  },
  {
    id: 'BLOCK_02',
    type: 'Feature Grid',
    category: 'content',
    attributes: ['H2', 'Icon', 'Paragraph'],
  },
  {
    id: 'BLOCK_03',
    type: 'Pricing Table',
    category: 'conversion',
    attributes: ['Price', 'CTA', 'List'],
  },
];

function renderTable(blocks = mockBlocks) {
  return render(<UiBlocksTable blocks={blocks} />);
}

describe('SA-705 – Extracted UI Blocks Table', () => {
  // TC-01: Column headers render
  it('TC-01: renders ID, BLOCK TYPE, ATTRIBUTES, and ACTION column headers', () => {
    renderTable();
    expect(screen.getByRole('columnheader', { name: /id/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /block type/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /attributes/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /action/i })).toBeInTheDocument();
  });

  // TC-02: Block type has colored status dot
  it('TC-02: Hero Section row has a blue dot with bg-blue-500 class', () => {
    renderTable();
    const heroRow = screen.getByRole('row', { name: /BLOCK_01|Hero Section/ });
    const dot = heroRow.querySelector('[class*="bg-blue-500"]');
    expect(dot).not.toBeNull();
  });

  // TC-03: Sorting by TYPE column
  it('TC-03: clicking the BLOCK TYPE header sorts rows alphabetically', async () => {
    renderTable();
    const typeHeader = screen.getByRole('columnheader', { name: /block type/i });
    await userEvent.click(typeHeader);
    const rows = screen.getAllByRole('row').slice(1); // skip header
    const firstRowText = rows[0].textContent;
    expect(firstRowText).toMatch(/Feature Grid/);
  });

  // TC-04: Filtering by block type
  it('TC-04: selecting "Hero Section" filter shows only hero rows', async () => {
    renderTable();
    // Assuming there's a filter dropdown or select
    const filterSelect = screen.getByRole('combobox', { name: /filter|type/i });
    await userEvent.selectOptions(filterSelect, 'Hero Section');
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toMatch(/Hero Section/);
  });

  // TC-05: Empty table state
  it('TC-05: shows empty state message when blocks array is empty', () => {
    renderTable([]);
    expect(screen.getByText(/no blocks|empty/i)).toBeInTheDocument();
  });

  // TC-06: Action icon opens detail drawer
  it('TC-06: clicking the action icon opens the block detail drawer', async () => {
    renderTable();
    const actionIcons = screen.getAllByRole('button', { name: /inspect|view|detail/i });
    await userEvent.click(actionIcons[0]);
    expect(
      screen.getByRole('dialog') ?? screen.getByTestId('block-detail-drawer'),
    ).toBeInTheDocument();
  });

  // TC-07: Long attributes truncated with tooltip
  it('TC-07: attributes string exceeding column width is truncated with ellipsis class', () => {
    const longAttrBlock = [
      {
        id: 'BLOCK_04',
        type: 'Complex Section',
        category: 'layout',
        attributes: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
      },
    ];
    renderTable(longAttrBlock);
    const attrCell = screen.getByTestId('attr-cell-BLOCK_04');
    expect(attrCell.className).toMatch(/truncate|overflow-hidden|text-ellipsis/);
  });
});
