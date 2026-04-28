import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      // Source maps in dev, stripped in production (AC-6)
      sourcemap: process.env.NODE_ENV !== 'production',
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      sourcemap: process.env.NODE_ENV !== 'production',
    },
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/renderer'),
        '@main': path.resolve(__dirname, 'src/main'),
        '@shared': path.resolve(__dirname, 'src/shared'),
        '@preload': path.resolve(__dirname, 'src/preload'),
      },
    },
    build: {
      // Strip source maps from production renderer bundle (AC-6)
      sourcemap: false,
    },
  },
});
