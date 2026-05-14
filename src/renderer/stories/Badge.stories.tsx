import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/Badge';

const meta: Meta<typeof Badge> = {
  title: 'Design System/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { variant: 'default', children: 'Local Session' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Scanned' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Processing' },
};

export const Error: Story = {
  args: { variant: 'error', children: 'Failed' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'Precision Analysis' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Local Session</Badge>
      <Badge variant="success">Scanned</Badge>
      <Badge variant="warning">Processing</Badge>
      <Badge variant="error">Failed</Badge>
      <Badge variant="info">Enterprise Ready</Badge>
    </div>
  ),
};
