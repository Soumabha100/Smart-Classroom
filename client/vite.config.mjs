import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: {
    host: "192.168.1.7",
    https: true,

    proxy: {
      // Proxying API requests to the backend server
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
