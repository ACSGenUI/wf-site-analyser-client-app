import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';

const meta = {
  title: 'Design System/Drawer',
  component: Drawer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Page details',
    children: (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-neutral-900">https://example.com/about</p>
        <p className="text-sm text-neutral-700">Score: 74 / 100</p>
        <p className="text-sm text-neutral-600">21 components detected</p>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Page details',
    children: <div />,
  },
};

export const LeftSide: Story = {
  args: {
    open: true,
    side: 'left',
    onClose: () => {},
    title: 'Navigation',
    children: (
      <nav className="flex flex-col gap-2">
        <a href="#" className="text-sm text-primary-600 hover:underline">
          Dashboard
        </a>
        <a href="#" className="text-sm text-primary-600 hover:underline">
          Results
        </a>
        <a href="#" className="text-sm text-primary-600 hover:underline">
          Settings
        </a>
      </nav>
    ),
  },
};

function DrawerInteractiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filters">
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-700">Filter results by status or score.</p>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export const Interactive: Story = {
  args: { open: false, onClose: () => {}, children: '' },
  render: () => <DrawerInteractiveDemo />,
};
