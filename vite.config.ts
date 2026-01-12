import { defineConfig } from "vite";
import type { PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
// PWA disabled temporarily to avoid SW caching issues
// import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  const isTest = !!process.env.VITEST;
  const plugins: PluginOption[] = [react()];
  // PWA temporarily disabled; only visualizer remains
  if (isBuild && !isTest) {
    plugins.push(visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true, open: false }));
  }
  return ({
    server: {
      host: "::",
      port: 8080
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Slightly bump warning limit; we also manually chunk large vendor sets
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split core React/runtime
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            // UI / data layer libs
            "vendor-ui": ["@tanstack/react-query", "lucide-react", "recharts"],
          }
        }
      }
    }
  });
});
