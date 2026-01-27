import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ssl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ssl(), // Your original SSL plugin
  ],
  server: {
    // ✅ FIX: Use 'true' to automatically expose the network URL.
    // This is the modern equivalent of '0.0.0.0'.
    host: true,

    // Your https and proxy settings are correct and remain the same.
    https: true,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
  }
});

