import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    // Auto-copy _redirects file to dist
    {
      name: 'copy-redirects',
      closeBundle() {
        fs.writeFileSync(
          resolve(__dirname, 'dist/_redirects'),
          '/* /index.html 200'
        );
      }
    }
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Ensure chunk sizes are optimized
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      }
    }
  },
  base: './', // Use relative paths for assets
});