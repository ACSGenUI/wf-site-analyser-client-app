import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/Button';

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Save changes' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Learn more' },
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving…' },
};

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="primary" disabled>
        Disabled
      </Button>
      <Button variant="primary" loading>
        Loading
      </Button>
    </div>
  ),
};
