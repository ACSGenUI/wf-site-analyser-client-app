import * as Switch from '@radix-ui/react-switch';
import React from 'react';

export interface ToggleProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function Toggle({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  id,
}: ToggleProps): React.ReactElement {
  const switchId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <label htmlFor={switchId} className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
      )}
      <Switch.Root
        id={switchId}
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className={[
          'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ].join(' ')}
      >
        <Switch.Thumb
          className={[
            'block h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
            'data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0.5',
          ].join(' ')}
        />
      </Switch.Root>
    </div>
  );
}
