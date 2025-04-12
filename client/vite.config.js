import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050', // Local backend API
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    },
    cssCodeSplit: false,
    sourcemap: true
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    postcss: './postcss.config.cjs'
  },
  base: '/',                 // Ensures correct routing in production
});
