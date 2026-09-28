import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Относительные пути, чтобы сборка работала на GitHub Pages (/Green-Api/)
export default defineConfig({
  plugins: [react()],
  base: './',
})
