import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(() => {
  const isTest = !!process.env.VITEST;
  const plugins = [react()];
  if (!isTest) {
    plugins.push(
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["cftech.png", "favicon.ico"],
        manifest: {
          name: "CF TechLab",
          short_name: "CF TechLab",
          description: "Technology & innovation by Creativity Freaks",
          theme_color: "#0ea5e9",
          background_color: "#0b1120",
          display: "standalone",
          start_url: "/",
          icons: [
            { src: "/cftech.png", sizes: "192x192", type: "image/png" },
            { src: "/cftech.png", sizes: "512x512", type: "image/png" }
          ]
        }
      }),
      visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true, open: false })
    );
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
