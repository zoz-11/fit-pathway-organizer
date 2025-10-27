// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './src', // Updated root directory
  resolve: {
    alias: {
      '@': '/src', // Updated alias for modular structure
    },
  },
});