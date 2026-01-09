import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true, open: false })
  ],
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
}));
