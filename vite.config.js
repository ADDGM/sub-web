import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  base: '/sub-web/',
  resolve: {
    alias: {
      '@': srcDir
    }
  },
  server: {
    host: '0.0.0.0'
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    clearMocks: true
  }
})
