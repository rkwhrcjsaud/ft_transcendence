import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: true,
    hmr: {
      host: 'localhost',
    },
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
})
