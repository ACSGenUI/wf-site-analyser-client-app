import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

const meta = {
  title: 'Design System/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Confirm action',
    children: (
      <p className="text-sm text-neutral-700">
        Are you sure you want to delete this analysis? This action cannot be undone.
      </p>
    ),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    onClose: () => {},
    title: 'Confirm action',
    children: <p>Dialog body</p>,
  },
};

export const WithActions: Story = {
  args: {
    open: true,
    onClose: () => {},
    title: 'Export analysis',
    children: (
      <div>
        <p className="text-sm text-neutral-700 mb-4">
          Choose a format to export your analysis results.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Export as CSV</Button>
        </div>
      </div>
    ),
  },
};

function ModalInteractiveDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Analysis settings">
        <p className="text-sm text-neutral-700 mb-4">Configure your analysis run.</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
}

export const Interactive: Story = {
  args: { open: false, onClose: () => {}, title: '', children: '' },
  render: () => <ModalInteractiveDemo />,
};
