import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy API calls in dev to backend (Node server on port 4000)
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      // Proxy uploaded images to backend so <img src="/uploads/..."> works in dev
      '/uploads': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    }
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
