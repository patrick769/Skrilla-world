import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: './',
  server: {
    host: '0.0.0.0',
    allowedHosts: true
  },
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'index.html'),
        music: path.resolve(__dirname, 'music.html'),
        videos: path.resolve(__dirname, 'videos.html'),
        tour: path.resolve(__dirname, 'tour.html'),
        merch: path.resolve(__dirname, 'merch.html')
      }
    }
  }
});
