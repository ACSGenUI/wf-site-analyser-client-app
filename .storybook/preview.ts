import type { Preview } from '@storybook/react';
import '../src/renderer/styles/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F8F9FA' },
        { name: 'white', value: '#FFFFFF' },
        { name: 'dark', value: '#0F172A' },
      ],
    },
  },
};

export default preview;
