import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/Input';

const meta = {
  title: 'Design System/Input',
  component: Input,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter a URL' },
};

export const WithLabel: Story = {
  args: { label: 'Website URL', placeholder: 'https://example.com' },
};

export const WithError: Story = {
  args: {
    label: 'Website URL',
    placeholder: 'https://example.com',
    error: 'Please enter a valid URL',
  },
};

export const Disabled: Story = {
  args: { label: 'Website URL', placeholder: 'Not editable', disabled: true },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input placeholder="Default state" />
      <Input label="With label" placeholder="With label" />
      <Input label="Error state" error="This field is required" />
      <Input label="Disabled" placeholder="Disabled input" disabled />
    </div>
  ),
};
