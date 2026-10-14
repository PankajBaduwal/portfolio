import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // the WebGL stack is lazy-loaded (see Hero.jsx) and is expected to be large
    chunkSizeWarningLimit: 1100,
  },
});
