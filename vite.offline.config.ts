import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const page = process.env.OFFLINE_PAGE || 'index.html';

// Builds one fully self-contained HTML page at a time. Running this config for
// every page produces an offline MPA that works from Android's file:// viewer.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: 'offline-dist',
    emptyOutDir: false,
    assetsInlineLimit: () => true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, page)
    }
  }
});
