import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Design System/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: { label: 'Screenshot Capture', defaultChecked: false },
};

export const Checked: Story = {
  args: { label: 'Screenshot Capture', defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: 'JavaScript Execution', disabled: true, defaultChecked: false },
};

export const DisabledChecked: Story = {
  args: { label: 'Data Persistence', disabled: true, defaultChecked: true },
};

export const WithoutLabel: Story = {
  args: { defaultChecked: true },
};

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Toggle label="Screenshot Capture" />
      <Toggle label="Checked by default" defaultChecked />
      <Toggle label="Disabled off" disabled />
      <Toggle label="Disabled on" disabled defaultChecked />
    </div>
  ),
};
