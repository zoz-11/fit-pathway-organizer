import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react({
      jsxImportSource: 'react'
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Override build to avoid TypeScript config issues
  build: {
    target: 'es2020',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress specific TypeScript config warnings
        if (warning.code === 'PLUGIN_WARNING' || 
            warning.message?.includes('baseUrl') ||
            warning.message?.includes('tsconfig')) {
          return;
        }
        warn(warning);
      }
    }
  },
  esbuild: {
    // Completely override TypeScript config to avoid corrupted tsconfig.json
    target: 'es2020',
    tsconfigRaw: {
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: false,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: true,
        paths: {
          "@/*": ["./src/*"]
        }
      }
    }
  }
}));