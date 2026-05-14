import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/Select';

const crawlDepthOptions = [
  { value: 'standard', label: 'Standard (3 Levels)' },
  { value: 'deep', label: 'Deep (5 Levels)' },
  { value: 'full', label: 'Full Site' },
];

const meta: Meta<typeof Select> = {
  title: 'Design System/Select',
  component: Select,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: 'Crawl Depth',
    options: crawlDepthOptions,
    placeholder: 'Select crawl depth',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Crawl Depth',
    options: crawlDepthOptions,
    value: 'standard',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: 'Crawl Depth',
    options: crawlDepthOptions,
    disabled: true,
    defaultValue: 'standard',
  },
};

export const WithError: Story = {
  args: {
    label: 'Crawl Depth',
    options: crawlDepthOptions,
    error: 'Please select a crawl depth',
  },
};
