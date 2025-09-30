import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [
    react({ jsxImportSource: 'react' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
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
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      tsconfig: false,
      tsconfigRaw: {
        compilerOptions: {
          target: 'ES2020',
          useDefineForClassFields: true,
          lib: ['ES2020', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: 'react-jsx',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      },
    },
  },
  esbuild: {
    target: 'es2020',
    tsconfig: false,
    tsconfigRaw: {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        paths: {
          '@/*': ['./src/*'],
        },
      },
    },
  },
});
