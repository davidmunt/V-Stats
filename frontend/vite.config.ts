import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // 1. Importamos path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Definimos que @ apunte a la carpeta src
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
