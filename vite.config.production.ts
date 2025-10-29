import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Production build configuration - no TypeScript checking
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/web-app/src"),
      "@components": path.resolve(__dirname, "./packages/ui"),
      "@hooks": path.resolve(__dirname, "./packages/hooks"),
      "@i18n": path.resolve(__dirname, "./packages/i18n"),
      "@types": path.resolve(__dirname, "./packages/types"),
    },
  },
  build: {
    target: "es2020",
    minify: 'esbuild',
    rollupOptions: {
      onwarn: () => {}, // Suppress all warnings
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
    esbuildOptions: {
      target: "es2020",
    }
  },
  esbuild: {
    target: "es2020",
    logLevel: 'silent',
  },
  define: {
    'import.meta.env.VITE_SKIP_TS_CHECK': '"true"',
  },
  logLevel: 'error',
});
