import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/Select';

const options = [
  { value: 'crawl', label: 'Web crawl' },
  { value: 'csv', label: 'CSV import' },
  { value: 'figma', label: 'Figma file' },
];

const meta = {
  title: 'Design System/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  args: { options },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Choose input source' },
};

export const WithLabel: Story = {
  args: { label: 'Input source', placeholder: 'Choose input source' },
};

export const WithPreselected: Story = {
  args: { label: 'Input source', defaultValue: 'crawl' },
};

export const WithError: Story = {
  args: {
    label: 'Input source',
    placeholder: 'Choose input source',
    error: 'Please select an option',
  },
};

export const Disabled: Story = {
  args: { label: 'Input source', placeholder: 'Not available', disabled: true },
};
