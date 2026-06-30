import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '@/components/Badge';

const meta = {
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
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'Label', variant: 'default' } };
export const Success: Story = { args: { children: 'Complete', variant: 'success' } };
export const Warning: Story = { args: { children: 'In progress', variant: 'warning' } };
export const Error: Story = { args: { children: 'Failed', variant: 'error' } };
export const Info: Story = { args: { children: 'New', variant: 'info' } };

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

export const StatusBadges: Story = {
  args: { children: '' },
  render: () => (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant="success">● Active</Badge>
      <Badge variant="warning">● Pending</Badge>
      <Badge variant="error">● Failed</Badge>
      <Badge variant="default">● Idle</Badge>
    </div>
  ),
};
