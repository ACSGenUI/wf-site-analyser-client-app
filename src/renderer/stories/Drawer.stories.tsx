import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Drawer } from '@/components/Drawer';
import { Button } from '@/components/Button';

const meta: Meta<typeof Drawer> = {
  title: 'Design System/Drawer',
  component: Drawer,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    side: { control: 'radio', options: ['left', 'right'] },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightOpen: Story = {
  args: {
    open: true,
    side: 'right',
    title: 'AI Assistant',
    onClose: () => {},
    children: (
      <div className="space-y-3">
        <p className="text-sm text-neutral-600">
          Query the site extraction using RAG context.
        </p>
        <div className="rounded-card border border-neutral-200 p-3 text-sm text-neutral-700">
          The layout utilizes a classic F-pattern. I've identified 12 distinct functional blocks.
        </div>
      </div>
    ),
  },
};

export const LeftOpen: Story = {
  args: {
    open: true,
    side: 'left',
    title: 'Navigation',
    onClose: () => {},
    children: (
      <nav className="flex flex-col gap-2">
        <a href="#" className="text-sm text-neutral-700 hover:text-primary px-2 py-1.5 rounded">
          Dashboard
        </a>
        <a href="#" className="text-sm text-neutral-700 hover:text-primary px-2 py-1.5 rounded">
          Projects
        </a>
        <a href="#" className="text-sm text-neutral-700 hover:text-primary px-2 py-1.5 rounded">
          Settings
        </a>
      </nav>
    ),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    side: 'right',
    title: 'Hidden Drawer',
    onClose: () => {},
    children: <p>Content not visible.</p>,
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div className="p-8">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Drawer
        </Button>
        <Drawer open={open} onClose={() => setOpen(false)} title="RAG Chat Panel" side="right">
          <p className="text-sm text-neutral-600">Ask a question about the site analysis.</p>
        </Drawer>
      </div>
    );
  },
};
