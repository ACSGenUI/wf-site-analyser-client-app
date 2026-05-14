import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/Card';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['content', 'stat', 'info', 'action'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Content: Story = {
  args: {
    variant: 'content',
    children: (
      <div>
        <h3 className="font-semibold text-neutral-900">Page Summary</h3>
        <p className="text-sm text-neutral-600 mt-1">
          Automated structural analysis for marketing landing page.
        </p>
      </div>
    ),
  },
};

export const Stat: Story = {
  args: {
    variant: 'stat',
    children: (
      <div>
        <p className="text-xs uppercase tracking-wide text-neutral-500">DOM Depth</p>
        <p className="text-3xl font-bold text-neutral-900 mt-1">14</p>
        <p className="text-sm text-neutral-500">Levels</p>
      </div>
    ),
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: (
      <p className="text-sm text-primary-800">
        For authenticated pages, ensure your browser extension is active or provide session cookies
        in the Advanced Headers section.
      </p>
    ),
  },
};

export const Action: Story = {
  args: {
    variant: 'action',
    children: (
      <div>
        <h4 className="font-medium text-neutral-900">Website URL</h4>
        <p className="text-sm text-neutral-600 mt-1">
          Enter a live URL for a real-time crawl and accessibility scoring.
        </p>
      </div>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-72">
      <Card variant="content">
        <p className="font-medium">Content Card</p>
      </Card>
      <Card variant="stat">
        <p className="text-3xl font-bold">22</p>
        <p className="text-xs text-neutral-500">Interactive Elements</p>
      </Card>
      <Card variant="info">
        <p className="text-sm text-primary-800">Pro tip: Use the browser extension.</p>
      </Card>
      <Card variant="action">
        <p className="font-medium">Action Card (hover me)</p>
      </Card>
    </div>
  ),
};
