import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8080,
    proxy: {
      '/ac': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/login': {
        target: 'http://127.0.0.1:8267',
        changeOrigin: true
      },
      '/behavior_file': {
        target: 'http://127.0.0.1:8426',
        changeOrigin: true
      },
      '/snapshot': {
        target: 'http://127.0.0.1:8426',
        changeOrigin: true
      },
      '/behavior': {
        target: 'http://127.0.0.1:8426',
        changeOrigin: true
      },
      '/behavior_tree': {
        target: 'http://127.0.0.1:8426',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static'
  }
})
