import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

const meta: Meta<typeof Modal> = {
  title: 'Design System/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Update Required',
    children: (
      <div className="space-y-3">
        <p className="text-sm text-neutral-600">
          A critical system update is mandatory to continue using the Site Analyzer environment.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary">Remind me later</Button>
          <Button variant="primary">Restart and Update Now</Button>
        </div>
      </div>
    ),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Hidden Modal',
    children: <p>This modal is closed.</p>,
  },
};

export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open Modal
        </Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Confirm Action">
          <div className="space-y-3">
            <p className="text-sm text-neutral-600">
              Are you sure you want to discard all guest session data? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  },
};
