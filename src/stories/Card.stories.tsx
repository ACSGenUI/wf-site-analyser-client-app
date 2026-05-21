import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Content: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-base font-semibold text-neutral-900 mb-2">Analysis Result</h3>
        <p className="text-sm text-neutral-700">
          Site score: 87 / 100 components matched the design system.
        </p>
      </div>
    ),
  },
};

export const Stat: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-1">
        <span className="text-sm text-neutral-600">Total pages</span>
        <span className="text-3xl font-bold text-primary-600">142</span>
        <span className="text-xs text-success-DEFAULT">+12 since last run</span>
      </div>
    ),
  },
};

export const Info: Story = {
  args: {
    children: (
      <div className="flex items-start gap-3">
        <Badge variant="info">Info</Badge>
        <p className="text-sm text-neutral-700">
          Crawl completed successfully. All pages were reachable.
        </p>
      </div>
    ),
  },
};

export const WithAction: Story = {
  args: {
    children: (
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Export report</h3>
          <p className="text-xs text-neutral-600 mt-0.5">Download the full analysis as CSV</p>
        </div>
        <Button variant="secondary">Download</Button>
      </div>
    ),
  },
};
