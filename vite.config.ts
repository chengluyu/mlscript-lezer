import react from '@vitejs/plugin-react';
import path from "node:path";
import url from "node:url";
import lezer from "unplugin-lezer/vite";
import { defineConfig } from 'vite';

const rootPath = path.dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), lezer()],
  resolve: {
    alias: {
      "@": path.resolve(rootPath, "./src"),
    },
  },
})
