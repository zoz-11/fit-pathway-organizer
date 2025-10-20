import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "apps/web-app",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../apps/web-app/src"),
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
});
