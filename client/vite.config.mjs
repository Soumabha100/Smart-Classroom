import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    host: "0.0.0.0",
    https: false,

    proxy: {
      // Proxying API requests to the backend server
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
