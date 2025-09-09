import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ssl from "@vitejs/plugin-basic-ssl"; // ✅ IMPORT THE SSL PLUGIN

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ssl(), // ✅ ADD THE PLUGIN HERE
  ],
  server: {
    host: "0.0.0.0",
    https: true, // ✅ ENABLE HTTPS FOR CAMERA ACCESS
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
