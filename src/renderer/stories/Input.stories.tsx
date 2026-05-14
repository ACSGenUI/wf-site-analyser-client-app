import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@/components/Input';

const meta: Meta<typeof Input> = {
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
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'https://example.com/landing-page' },
};

export const WithLabel: Story = {
  args: { label: 'Primary Entry Point', placeholder: 'https://example.com/landing-page' },
};

export const Disabled: Story = {
  args: { label: 'API Key', placeholder: 'sk-proj-…', disabled: true },
};

export const WithError: Story = {
  args: {
    label: 'Website URL',
    placeholder: 'https://example.com',
    error: 'Invalid URL format. Please check your credentials.',
  },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <Input label="Default" placeholder="https://example.com" />
      <Input label="Disabled" placeholder="Read only" disabled />
      <Input label="Error" placeholder="Bad URL" error="This field is required" />
    </div>
  ),
};
