// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['firebase-admin', 'fs', 'path'] // Add likely Node modules just in case
    }
  }
})
