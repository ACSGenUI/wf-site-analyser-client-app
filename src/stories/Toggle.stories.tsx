import type { Meta, StoryObj } from '@storybook/react';
import { Toggle } from '@/components/Toggle';

const meta = {
  title: 'Design System/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
  args: { label: 'Enable feature', defaultChecked: false },
};

export const Checked: Story = {
  args: { label: 'Enable feature', defaultChecked: true },
};

export const Disabled: Story = {
  args: { label: 'Unavailable option', defaultChecked: false, disabled: true },
};

export const DisabledChecked: Story = {
  args: { label: 'Always on', defaultChecked: true, disabled: true },
};

export const WithoutLabel: Story = {
  args: { defaultChecked: false },
};

export const SettingsGroup: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <div className="flex items-center justify-between py-2 border-b border-neutral-200">
        <div>
          <p className="text-sm font-medium text-neutral-900">Auto-crawl</p>
          <p className="text-xs text-neutral-600">Automatically discover sub-pages</p>
        </div>
        <Toggle defaultChecked />
      </div>
      <div className="flex items-center justify-between py-2 border-b border-neutral-200">
        <div>
          <p className="text-sm font-medium text-neutral-900">Dark mode</p>
          <p className="text-xs text-neutral-600">Use dark colour theme</p>
        </div>
        <Toggle />
      </div>
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm font-medium text-neutral-900">Notifications</p>
          <p className="text-xs text-neutral-600">Send desktop alerts</p>
        </div>
        <Toggle disabled />
      </div>
    </div>
  ),
};
