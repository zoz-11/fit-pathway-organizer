import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { componentTagger } from 'lovable-tagger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Explicitly set root directory (best practice)
  root: './',
  
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    // Optimize chunk size and splitting
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      // Explicitly define entry point (prevents EISDIR errors)
      input: './index.html',
      output: {
        // Manual chunk splitting for better caching and performance
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
          ],
          'query-vendor': ['@tanstack/react-query'],
          'supabase-vendor': ['@supabase/supabase-js'],
        },
        // Optimize asset file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
      onwarn(warning, warn) {
        if (
          warning.code === 'PLUGIN_WARNING' ||
          warning.message?.includes('baseUrl') ||
          warning.message?.includes('tsconfig')
        ) {
          return;
        }
        warn(warning);
      },
    },
    // Enable minification for production
    minify: 'esbuild',
    // Generate source maps for debugging (but not inline)
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Report compressed size
    reportCompressedSize: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
  },
  esbuild: {
    target: 'es2020',
    // Drop console and debugger in production
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));