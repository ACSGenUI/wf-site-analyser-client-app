import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toast } from '@/components/Toast';
import { Button } from '@/components/Button';

const meta = {
  title: 'Design System/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error'] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { message: 'Analysis saved successfully.' },
};

export const Success: Story = {
  args: { variant: 'success', message: 'Analysis completed — 142 pages scanned.' },
};

export const Warning: Story = {
  args: { variant: 'warning', message: '3 pages returned errors during crawl.' },
};

export const Error: Story = {
  args: { variant: 'error', message: 'Connection failed. Please check the URL.' },
};

export const Dismissible: Story = {
  args: {
    variant: 'success',
    message: 'Report exported to Downloads.',
    onDismiss: () => {},
  },
};

export const AllVariants: Story = {
  args: { message: '' },
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Toast message="Default notification" />
      <Toast variant="success" message="Action completed" onDismiss={() => {}} />
      <Toast variant="warning" message="Partial results only" onDismiss={() => {}} />
      <Toast variant="error" message="Something went wrong" onDismiss={() => {}} />
    </div>
  ),
};

function ToastInteractiveDemo() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex flex-col gap-4 items-start w-80">
      <Button variant="primary" onClick={() => setVisible(true)}>
        Show toast
      </Button>
      {visible && (
        <Toast variant="success" message="Changes saved." onDismiss={() => setVisible(false)} />
      )}
    </div>
  );
}

export const Interactive: Story = {
  args: { message: '' },
  render: () => <ToastInteractiveDemo />,
};
