import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  root: 'apps/web-app',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './apps/web-app/src'),
      '@components': path.resolve(__dirname, './packages/ui'),
      '@hooks': path.resolve(__dirname, './packages/hooks'),
      '@i18n': path.resolve(__dirname, './packages/i18n'),
      '@types': path.resolve(__dirname, './packages/types'),
    },
  },
  server: {
    port: 8080,
    host: true
  }
});
