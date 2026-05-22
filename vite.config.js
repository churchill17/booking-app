import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/booking_api": {
        target: "https://ibooknova.com.ng",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
