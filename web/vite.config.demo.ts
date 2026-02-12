import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration for building the demo to be embedded in VitePress docs
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for embedding in docs
  build: {
    outDir: '../docs/public/demos/neural-network',
    emptyOutDir: true
  }
})
