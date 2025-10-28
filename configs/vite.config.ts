import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { componentTagger } from "lovable-tagger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
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
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === "PLUGIN_WARNING" ||
          warning.message?.includes("baseUrl") ||
          warning.message?.includes("tsconfig")
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  esbuild: {
    target: "es2020",
  },
}));
