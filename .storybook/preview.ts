import type { Preview } from '@storybook/react';
import '../src/renderer/styles/index.css';

// Mock the Electron contextBridge API for Storybook's browser environment
if (typeof window !== 'undefined' && !window.api) {
  (window as unknown as Record<string, unknown>).api = {
    getAppVersion: () => Promise.resolve('2.4.0'),
    checkForUpdates: () => Promise.resolve({ updateAvailable: false }),
    storeGet: () => Promise.resolve(null),
    storeSet: () => Promise.resolve(undefined),
  };
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8F9FA' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'dark', value: '#191C1D' },
      ],
    },
  },
};

export default preview;
