import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Table } from './Table';

describe('Table Component', () => {
  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status' },
  ];

  const rows = [
    { name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ];

  it('should render table with headers', () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('should render table rows', () => {
    render(<Table columns={columns} rows={rows} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render empty message when no rows', () => {
    render(<Table columns={columns} rows={[]} />);
    expect(screen.getByText('No data available.')).toBeInTheDocument();
  });

  it('should render custom empty message', () => {
    render(<Table columns={columns} rows={[]} emptyMessage="No records found" />);
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('should have table structure', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    expect(container.querySelector('table')).toBeInTheDocument();
    expect(container.querySelector('thead')).toBeInTheDocument();
    expect(container.querySelector('tbody')).toBeInTheDocument();
  });

  it('should have correct header attributes', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    const headers = container.querySelectorAll('th');
    expect(headers).toHaveLength(3);
    headers.forEach((header) => {
      expect(header).toHaveAttribute('scope', 'col');
    });
  });

  it('should apply custom className', () => {
    const { container } = render(<Table columns={columns} rows={rows} className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('should render column with width', () => {
    const columnsWithWidth = [
      { key: 'name', header: 'Name', width: '200px' },
      { key: 'email', header: 'Email' },
    ];
    const { container } = render(<Table columns={columnsWithWidth} rows={rows} />);
    const firstHeader = container.querySelector('th');
    expect(firstHeader).toHaveStyle({ width: '200px' });
  });

  it('should render all columns for each row', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    const tbody = container.querySelector('tbody');
    const tableRows = tbody?.querySelectorAll('tr') || [];
    // Filter out the empty state row if there is one
    const dataRows = Array.from(tableRows).filter((row) => !row.querySelector('[colSpan]'));
    dataRows.forEach((row) => {
      expect(row.querySelectorAll('td')).toHaveLength(3);
    });
  });

  it('should have correct table structure classes', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    const wrapper = container.querySelector('[class*="overflow-x-auto"]');
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('rounded-lg');
    expect(wrapper).toHaveClass('border');
  });

  it('should render multiple rows correctly', () => {
    const manyRows = [
      { name: 'User 1', email: 'user1@example.com', status: 'Active' },
      { name: 'User 2', email: 'user2@example.com', status: 'Inactive' },
      { name: 'User 3', email: 'user3@example.com', status: 'Active' },
    ];
    render(<Table columns={columns} rows={manyRows} />);
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('User 3')).toBeInTheDocument();
  });

  it('should render complex content in cells', () => {
    const complexRows = [
      {
        name: 'John',
        email: <a href="mailto:john@example.com">john@example.com</a>,
        status: 'Active',
      },
    ];
    render(<Table columns={columns} rows={complexRows} />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('empty state should span all columns', () => {
    const { container } = render(<Table columns={columns} rows={[]} />);
    const emptyCell = container.querySelector('td[colSpan]');
    expect(emptyCell).toHaveAttribute('colSpan', '3');
  });

  it('should have text alignment styles', () => {
    const { container } = render(<Table columns={columns} rows={rows} />);
    const headers = container.querySelectorAll('th');
    headers.forEach((header) => {
      expect(header).toHaveClass('text-left');
    });
  });
});
