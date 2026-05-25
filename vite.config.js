import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config — minimal, Vercel-friendly.
// `base: './'` keeps asset paths relative so the SPA works under any subpath.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
