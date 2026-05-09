import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@component': path.resolve(__dirname, 'src/components'),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
