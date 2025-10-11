import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl' // 1. Import the tool

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() // 2. Use the tool
  ],
  server: {
    host: true // 3. Make it available on your network
  }
})