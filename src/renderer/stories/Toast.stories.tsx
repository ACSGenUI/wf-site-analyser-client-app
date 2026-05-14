import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toast } from '@/components/Toast';
import { Button } from '@/components/Button';

const meta: Meta<typeof Toast> = {
  title: 'Design System/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toast>;

export const Default: Story = {
  args: { message: 'Analysis saved successfully.', variant: 'default' },
};

export const Success: Story = {
  args: { message: 'Analysis complete. 98.2% confidence.', variant: 'success' },
};

export const Warning: Story = {
  args: { message: 'Rate limit approaching. 3 credits remaining.', variant: 'warning' },
};

export const Error: Story = {
  args: { message: 'Invalid key format. Please check your credentials.', variant: 'error' },
};

export const Dismissible: Story = {
  args: {
    message: 'Cloud sync complete.',
    variant: 'success',
    onDismiss: () => alert('Dismissed'),
  },
};

export const Interactive: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    return (
      <div className="flex flex-col gap-3 items-center w-96">
        <Button variant="primary" onClick={() => setVisible(true)}>
          Show Toast
        </Button>
        {visible && (
          <Toast
            message="Settings saved successfully."
            variant="success"
            onDismiss={() => setVisible(false)}
          />
        )}
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-96">
      <Toast message="Neutral notification message." variant="default" />
      <Toast message="Operation completed successfully." variant="success" />
      <Toast message="Action may affect performance." variant="warning" />
      <Toast message="Authentication failed. Try again." variant="error" />
    </div>
  ),
};
