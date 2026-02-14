import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This supports older browsers (like Safari on iOS 15/16)
    target: 'es2015', 
    outDir: 'dist',
  },
  // Ensure the app knows it's being served from the root
  base: '/', 
})