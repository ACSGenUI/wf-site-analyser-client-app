import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Select } from './Select';

describe('Select Component', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('should render a select element', () => {
    render(<Select options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Select options={options} placeholder="Choose one" />);
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('should render options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should render with label', () => {
    render(<Select options={options} label="Select Item" />);
    expect(screen.getByLabelText('Select Item')).toBeInTheDocument();
  });

  it('should generate id from label', () => {
    render(<Select options={options} label="Select Item" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'select-item');
  });

  it('should use provided id instead of generating from label', () => {
    render(<Select options={options} label="Select" id="custom-id" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'custom-id');
  });

  it('should handle value change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select options={options} onChange={onChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'option1');

    expect(onChange).toHaveBeenCalledWith('option1');
  });

  it('should be disabled', () => {
    render(<Select options={options} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('should apply disabled styles', () => {
    render(<Select options={options} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('opacity-50');
    expect(select).toHaveClass('cursor-not-allowed');
  });

  it('should render error message', () => {
    render(<Select options={options} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should apply error styles', () => {
    render(<Select options={options} error="Error" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-red-500');
    expect(select).toHaveClass('focus:ring-red-500');
  });

  it('should have aria-invalid when error exists', () => {
    render(<Select options={options} error="Error" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('should apply custom className', () => {
    render(<Select options={options} className="custom-class" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('custom-class');
  });

  it('should have default placeholder', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should accept defaultValue', () => {
    render(<Select options={options} defaultValue="option2" />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('option2');
  });

  it('should be full width', () => {
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('w-full');
  });

  it('should have correct border classes', () => {
    render(<Select options={options} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border');
    expect(select).toHaveClass('border-gray-300');
  });
});
